package gemini

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"seanime/internal/util/result"
	"strings"
	"sync"
	"time"
)

const (
	apiURL            = "https://generativelanguage.googleapis.com/v1beta"
	defaultModel      = "gemini-2.0-flash"
	defaultMaxTokens  = 2048
	defaultTemperature = 0.7
)

// Client represents a Gemini API client
type Client struct {
	apiKey        string
	httpClient    *http.Client
	model         string
	maxTokens     int
	temperature   float64
	cache         *result.Cache[string, *Response]
	mu            sync.RWMutex
}

// NewClient creates a new Gemini client
func NewClient(apiKey string) *Client {
	return &Client{
		apiKey:      apiKey,
		httpClient:  &http.Client{Timeout: 120 * time.Second},
		model:       defaultModel,
		maxTokens:   defaultMaxTokens,
		temperature: defaultTemperature,
		cache:       result.NewCache[string, *Response](),

	}
}

// SetModel sets the model to use
func (c *Client) SetModel(model string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.model = model
}

// SetMaxTokens sets the max tokens
func (c *Client) SetMaxTokens(maxTokens int) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.maxTokens = maxTokens
}

// SetTemperature sets the temperature
func (c *Client) SetTemperature(temperature float64) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.temperature = temperature
}

type Part struct {
	Text string `json:"text,omitempty"`
	// For image analysis
	InlineData *InlineData `json:"inlineData,omitempty"`
}

type InlineData struct {
	MimeType string `json:"mimeType"`
	Data     string `json:"data"`
}

type Content struct {
	Parts []Part `json:"parts"`
	Role  string `json:"role,omitempty"`
}

type GenerationConfig struct {
	Temperature     float64  `json:"temperature"`
	TopP            float64  `json:"topP,omitempty"`
	TopK            int      `json:"topK,omitempty"`
	MaxOutputTokens int      `json:"maxOutputTokens"`
	StopSequences   []string `json:"stopSequences,omitempty"`
}

type SafetySetting struct {
	Category  string `json:"category"`
	Threshold string `json:"threshold"`
}

type Request struct {
	Contents         []Content         `json:"contents"`
	GenerationConfig *GenerationConfig `json:"generationConfig,omitempty"`
	SafetySettings   []SafetySetting   `json:"safetySettings,omitempty"`
	SystemInstruction *Content         `json:"systemInstruction,omitempty"`
}

type Candidate struct {
	Content      Content  `json:"content"`
	FinishReason string   `json:"finishReason"`
	Index        int      `json:"index"`
}

type PromptFeedback struct {
	BlockReason string `json:"blockReason"`
}

type Response struct {
	Candidates     []Candidate    `json:"candidates"`
	PromptFeedback PromptFeedback `json:"promptFeedback"`
}

// GenerateText generates text from a prompt
func (c *Client) GenerateText(ctx context.Context, prompt string) (*Response, error) {
	return c.GenerateTextWithContext(ctx, "", prompt, nil)
}

// GenerateTextWithContext generates text with system context
func (c *Client) GenerateTextWithContext(ctx context.Context, systemContext string, userPrompt string, history []Message) (*Response, error) {
	c.mu.RLock()
	model := c.model
	maxTokens := c.maxTokens
	temperature := c.temperature
	c.mu.RUnlock()

	contents := make([]Content, 0, len(history)+1)

	// Add system instruction
	if systemContext != "" {
		contents = append(contents, Content{
			Role: "user",
			Parts: []Part{{Text: systemContext}},
		})
	}

	// Add conversation history
	for _, msg := range history {
		role := "user"
		if msg.IsAI {
			role = "model"
		}
		contents = append(contents, Content{
			Role:  role,
			Parts: []Part{{Text: msg.Content}},
		})
	}

	// Add current prompt
	contents = append(contents, Content{
		Role:  "user",
		Parts: []Part{{Text: userPrompt}},
	})

	req := Request{
		Contents: contents,
		GenerationConfig: &GenerationConfig{
			Temperature:     temperature,
			MaxOutputTokens: maxTokens,
		},
	}

	return c.sendRequest(ctx, model, req)
}

// AnalyzeImage analyzes an image and returns text description
func (c *Client) AnalyzeImage(ctx context.Context, imageData []byte, mimeType string, prompt string) (*Response, error) {
	c.mu.RLock()
	model := c.model
	maxTokens := c.maxTokens
	temperature := c.temperature
	c.mu.RUnlock()

	// Convert image to base64
	imageBase64 := base64.StdEncoding.EncodeToString(imageData)

	req := Request{
		Contents: []Content{
			{
				Role: "user",
				Parts: []Part{
					{Text: prompt},
					{
						InlineData: &InlineData{
							MimeType: mimeType,
							Data:     imageBase64,
						},
					},
				},
			},
		},
		GenerationConfig: &GenerationConfig{
			Temperature:     temperature,
			MaxOutputTokens: maxTokens,
		},
	}

	return c.sendRequest(ctx, model, req)
}

// ExtractTextFromImage extracts and translates text from an image
func (c *Client) ExtractTextFromImage(ctx context.Context, imageData []byte, mimeType string, targetLang string) ([]*TextBlock, error) {
	prompt := fmt.Sprintf(`Analyze this manga/comic image and extract ALL text visible in speech bubbles, onomatopoeia, signs, and any other text elements. 
For each text block, provide:
1. The original text as it appears
2. The translated text in %s
3. The approximate position (top/center/bottom, left/center/right)
4. Whether it's speech, sound effect, or narration

Format your response as a JSON array with this structure:
[{"original": "...", "translated": "...", "position": "top-center", "type": "speech"}, ...]

If no text is found, return an empty array [].`, targetLang)

	resp, err := c.AnalyzeImage(ctx, imageData, mimeType, prompt)
	if err != nil {
		return nil, err
	}

	if len(resp.Candidates) == 0 {
		return nil, fmt.Errorf("no response from Gemini")
	}

	// Extract text from response
	text := resp.Candidates[0].Content.Parts[0].Text

	// Parse JSON response
	text = strings.TrimSpace(text)
	// Remove markdown code blocks if present
	if strings.HasPrefix(text, "```") {
		lines := strings.Split(text, "\n")
		text = strings.Join(lines[1:len(lines)-1], "\n")
	}
	if strings.HasPrefix(text, "```json") {
		lines := strings.Split(text, "\n")
		text = strings.Join(lines[1:len(lines)-1], "\n")
	}

	var blocks []*TextBlock
	if err := json.Unmarshal([]byte(text), &blocks); err != nil {
		// If JSON parsing fails, return the raw text as a single block
		return []*TextBlock{
			{
				Original:   text,
				Translated: text,
				Position:   "center",
				Type:       "unknown",
			},
		}, nil
	}

	return blocks, nil
}

// TextBlock represents a text block extracted from an image
type TextBlock struct {
	Original   string `json:"original"`
	Translated string `json:"translated"`
	Position   string `json:"position"`
	Type       string `json:"type"`
}

// ChatMessage represents a chat message
type Message struct {
	Content string
	IsAI    bool
}

// Chat sends a chat message and gets a response
func (c *Client) Chat(ctx context.Context, systemContext string, history []Message, message string) (string, error) {
	resp, err := c.GenerateTextWithContext(ctx, systemContext, message, history)
	if err != nil {
		return "", err
	}

	if len(resp.Candidates) == 0 {
		return "", fmt.Errorf("no response from Gemini")
	}

	return resp.Candidates[0].Content.Parts[0].Text, nil
}

// GenerateRecap generates a recap for a manga series
func (c *Client) GenerateRecap(ctx context.Context, mangaTitle string, chaptersRead int, chapterSummaries []string, currentChapter int) (string, error) {
	prompt := fmt.Sprintf(`You are creating a recap for someone who has been reading "%s" and just finished chapter %d.
They have read %d chapters total.

Previous chapter summaries:
%s

Create a concise, exciting recap (2-3 paragraphs) that summarizes the key events up to chapter %d. 
Use a dramatic style that gets the reader excited to continue. 
Include character names and important plot points.
DO NOT include any events that happen after chapter %d (no spoilers).`, 
		mangaTitle, currentChapter, chaptersRead, 
		strings.Join(chapterSummaries, "\n"), 
		currentChapter, currentChapter)

	resp, err := c.GenerateText(ctx, prompt)
	if err != nil {
		return "", err
	}

	if len(resp.Candidates) == 0 {
		return "", fmt.Errorf("no response from Gemini")
	}

	return resp.Candidates[0].Content.Parts[0].Text, nil
}

// SearchByVibe searches for manga based on a vibe description
func (c *Client) SearchByVibe(ctx context.Context, vibeDescription string) (string, error) {
	prompt := fmt.Sprintf(`Based on this description: "%s"

Analyze what the user is looking for and extract:
1. Main genre (action, romance, fantasy, etc.)
2. Protagonist type (weak to strong, reincarnated, chosen one, etc.)
3. Setting/world type
4. Key themes or tropes
5. Tone (dark, comedic, serious, etc.)

Then search for manga/manhwa that match this description using AniList or other manga databases.
Return a JSON array with up to 5 recommendations in this format:
[{"title": "...", "reason": "...", "matchScore": 95}, ...]

Include a brief reason why each recommendation matches the vibe.`, vibeDescription)

	resp, err := c.GenerateText(ctx, prompt)
	if err != nil {
		return "", err
	}

	if len(resp.Candidates) == 0 {
		return "", fmt.Errorf("no response from Gemini")
	}

	return resp.Candidates[0].Content.Parts[0].Text, nil
}

// sendRequest sends a request to the Gemini API
func (c *Client) sendRequest(ctx context.Context, model string, req Request) (*Response, error) {
	if c.apiKey == "" {
		return nil, fmt.Errorf("Gemini API key not set")
	}

	// Check cache
	cacheKey := fmt.Sprintf("%s:%d:%v", model, c.temperature, req.Contents)
	if cached, ok := c.cache.Get(cacheKey); ok {
		return cached, nil
	}

	URL, err := url.Parse(fmt.Sprintf("%s/models/%s:generateContent?key=%s", apiURL, model, c.apiKey))
	if err != nil {
		return nil, err
	}

	reqBody, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, URL.String(), bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Gemini API error: %s", string(body))
	}

	var response Response
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, err
	}

	// Cache the response
	c.cache.SetT(cacheKey, &response, 5*time.Minute)

	return &response, nil
}

// ImageUpscaleRequest represents a request to upscale an image
type ImageUpscaleRequest struct {
	ImageData []byte
	MimeType  string
	Scale     int // 2 or 4
}

// ImageUpscaleResponse represents the response from upscaling
type ImageUpscaleResponse struct {
	ImageData []byte
	MimeType  string
}

// UpscaleImage upscales an image using Gemini's image generation/editing capabilities
// Note: Gemini 2.0 doesn't directly support image upscaling, so we use it to enhance descriptions
// For actual upscaling, we'd need a dedicated service like Real-ESRGAN
func (c *Client) UpscaleImage(ctx context.Context, imageData []byte, mimeType string) (*ImageUpscaleResponse, error) {
	// First, analyze the image to understand its content
	prompt := "Describe this manga page in detail for upscaling purposes. Focus on: character details, background elements, text bubbles, panel composition, and any special effects."

	resp, err := c.AnalyzeImage(ctx, imageData, mimeType, prompt)
	if err != nil {
		return nil, err
	}

	if len(resp.Candidates) == 0 {
		return nil, fmt.Errorf("no response from Gemini")
	}

	description := resp.Candidates[0].Content.Parts[0].Text

	// For now, return original image with description
	// Real upscaling would require a separate service
	_ = description // Description would be used for actual upscaling

	return &ImageUpscaleResponse{
		ImageData: imageData,
		MimeType:  mimeType,
	}, nil
}

