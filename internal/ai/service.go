package ai

import (
	"context"
	"encoding/json"
	"fmt"
	"seanime/internal/ai/gemini"
	"seanime/internal/api/anilist"
	"seanime/internal/database/db"
	"strings"
	"sync"
	"time"

	"github.com/rs/zerolog"
)

// Service represents the AI service
type Service struct {
	logger       zerolog.Logger
	db           *db.Database
	geminiClient *gemini.Client
	settings     *Settings
	mu           sync.RWMutex
}

// NewService creates a new AI service
func NewService(logger zerolog.Logger, database *db.Database) *Service {
	return &Service{
		logger: logger,
		db:     database,
		settings: &Settings{
			GeminiAPIKey:      "",
			EnableOCR:         true,
			EnableChat:        true,
			EnableRecap:       true,
			EnableSearch:      true,
			EnableUpscaling:   false,
			TargetLanguage:    "Arabic",
			DefaultTranslator: "gemini",
		},
	}
}

// Settings represents AI service settings
type Settings struct {
	GeminiAPIKey          string `json:"geminiApiKey"`
	OpenAIAPIKey          string `json:"openaiApiKey"`
	ReplicateAPIToken     string `json:"replicateApiToken"`
	ElevenLabsAPIKey      string `json:"elevenlabsApiKey"`
	PineconeAPIKey        string `json:"pineconeApiKey"`
	EnableOCR             bool   `json:"enableOcr"`
	EnableChat            bool   `json:"enableChat"`
	EnableRecap           bool   `json:"enableRecap"`
	EnableSearch          bool   `json:"enableSearch"`
	EnableUpscaling       bool   `json:"enableUpscaling"`
	EnableImageGeneration bool   `json:"enableImageGeneration"`
	EnableVideoGeneration bool   `json:"enableVideoGeneration"`
	EnableMusicGeneration bool   `json:"enableMusicGeneration"`
	EnableTTS             bool   `json:"enableTts"`
	EnableEmotion         bool   `json:"enableEmotion"`
	EnableCulture         bool   `json:"enableCulture"`
	TargetLanguage        string `json:"targetLanguage"`
	DefaultTranslator     string `json:"defaultTranslator"`
}

// GetSettings returns the current settings
func (s *Service) GetSettings() *Settings {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.settings
}

// UpdateSettings updates the AI service settings
func (s *Service) UpdateSettings(settings *Settings) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Validate API key
	if settings.GeminiAPIKey == "" {
		return fmt.Errorf("Gemini API key is required")
	}

	// Update client if API key changed
	if settings.GeminiAPIKey != s.settings.GeminiAPIKey {
		s.geminiClient = gemini.NewClient(settings.GeminiAPIKey)
		s.logger.Info().Msg("ai: Gemini client initialized")
	}

	*s.settings = *settings

	// Save to database
	if err := s.saveSettings(); err != nil {
		s.logger.Error().Err(err).Msg("ai: Failed to save settings")
	}

	return nil
}

// saveSettings saves settings to database
func (s *Service) saveSettings() error {
	data, err := json.Marshal(s.settings)
	if err != nil {
		return err
	}

	// Use the key-value store or create a new table
	// For now, we'll just log it
	s.logger.Debug().Str("settings", string(data)).Msg("ai: Settings")

	return nil
}

// Init initializes the AI service
func (s *Service) Init() error {
	s.logger.Info().Msg("ai: Initializing AI service")

	// Load settings from database if available
	// For now, we'll use defaults

	if s.settings.GeminiAPIKey != "" {
		s.geminiClient = gemini.NewClient(s.settings.GeminiAPIKey)
		s.logger.Info().Msg("ai: Gemini client ready")
	}

	return nil
}

// OCRResult represents the result of OCR processing
type OCRResult struct {
	OriginalText   string              `json:"originalText"`
	TranslatedText string              `json:"translatedText"`
	TextBlocks     []*gemini.TextBlock `json:"textBlocks"`
	PageNumber     int                 `json:"pageNumber"`
}

// ProcessPage performs OCR on a manga page
func (s *Service) ProcessPage(ctx context.Context, imageData []byte, mimeType string, pageNumber int) (*OCRResult, error) {
	s.mu.RLock()
	enabled := s.settings.EnableOCR
	client := s.geminiClient
	targetLang := s.settings.TargetLanguage
	s.mu.RUnlock()

	if !enabled {
		return nil, fmt.Errorf("OCR is disabled")
	}

	if client == nil {
		return nil, fmt.Errorf("Gemini client not initialized")
	}

	// Extract and translate text
	blocks, err := client.ExtractTextFromImage(ctx, imageData, mimeType, targetLang)
	if err != nil {
		return nil, fmt.Errorf("failed to extract text: %w", err)
	}

	// Build result
	result := &OCRResult{
		PageNumber: pageNumber,
		TextBlocks: blocks,
	}

	// Combine translated text
	var translatedTexts []string
	var originalTexts []string
	for _, block := range blocks {
		originalTexts = append(originalTexts, block.Original)
		translatedTexts = append(translatedTexts, block.Translated)
	}

	result.OriginalText = joinText(originalTexts)
	result.TranslatedText = joinText(translatedTexts)

	return result, nil
}

// joinText joins text blocks with newlines
func joinText(texts []string) string {
	var result []string
	for _, t := range texts {
		if t != "" {
			result = append(result, t)
		}
	}
	return joinLines(result)
}

func joinLines(lines []string) string {
	result := ""
	for i, line := range lines {
		if i > 0 {
			result += "\n"
		}
		result += line
	}
	return result
}

// ChatContext represents the context for AI chat
type ChatContext struct {
	MangaTitle     string `json:"mangaTitle"`
	CurrentChapter int    `json:"currentChapter"`
	TotalChapters  int    `json:"totalChapters"`
	Provider       string `json:"provider"`
	MediaId        int    `json:"mediaId"`
}

// ChatMessage represents a chat message
type ChatMessage struct {
	Role    string `json:"role"` // "user" or "assistant"
	Content string `json:"content"`
}

// ChatRequest represents a chat request
type ChatRequest struct {
	Message string        `json:"message"`
	Context *ChatContext  `json:"context"`
	History []ChatMessage `json:"history"`
}

// ChatResponse represents a chat response
type ChatResponse struct {
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

// Chat processes a chat message
func (s *Service) Chat(ctx context.Context, req *ChatRequest) (*ChatResponse, error) {
	s.mu.RLock()
	enabled := s.settings.EnableChat
	client := s.geminiClient
	s.mu.RUnlock()

	if !enabled {
		return &ChatResponse{Error: "Chat is disabled"}, nil
	}

	if client == nil {
		return &ChatResponse{Error: "AI service not initialized"}, nil
	}

	// Build system context
	systemContext := buildChatSystemContext(req.Context)

	// Convert history to Gemini format
	history := make([]gemini.Message, len(req.History))
	for i, msg := range req.History {
		history[i] = gemini.Message{
			Content: msg.Content,
			IsAI:    msg.Role == "assistant",
		}
	}

	// Get response
	response, err := client.Chat(ctx, systemContext, history, req.Message)
	if err != nil {
		return &ChatResponse{Error: err.Error()}, nil
	}

	return &ChatResponse{Message: response}, nil
}

// buildChatSystemContext builds the system context for chat
func buildChatSystemContext(ctx *ChatContext) string {
	if ctx == nil {
		return `You are an AI assistant for a manga/manhwa reader called Seanime.
You help users understand the story, characters, and events in the manga they are reading.
Be helpful, concise, and avoid spoilers for chapters the user hasn't read yet.`
	}

	return fmt.Sprintf(`You are an AI assistant for a manga/manhwa reader called Seanime.
The user is currently reading "%s" (Chapter %d of %d).
You are connected to the provider: %s

Your role:
- Help users understand characters, plot, and events
- Answer questions about the current chapter
- Provide context about previous events
- NEVER spoil events that happen after chapter %d
- Be helpful, friendly, and concise

When asked about characters, refer to your knowledge and the context provided.`,
		ctx.MangaTitle, ctx.CurrentChapter, ctx.TotalChapters, ctx.Provider, ctx.CurrentChapter)
}

// RecapRequest represents a recap request
type RecapRequest struct {
	MangaTitle     string `json:"mangaTitle"`
	MediaId        int    `json:"mediaId"`
	ChaptersRead   int    `json:"chaptersRead"`
	CurrentChapter int    `json:"currentChapter"`
}

// RecapResponse represents a recap response
type RecapResponse struct {
	Recap string `json:"recap"`
	Error string `json:"error,omitempty"`
}

// GenerateRecap generates a recap for a manga
func (s *Service) GenerateRecap(ctx context.Context, req *RecapRequest) (*RecapResponse, error) {
	s.mu.RLock()
	enabled := s.settings.EnableRecap
	client := s.geminiClient
	s.mu.RUnlock()

	if !enabled {
		return &RecapResponse{Error: "Recap generation is disabled"}, nil
	}

	if client == nil {
		return &RecapResponse{Error: "AI service not initialized"}, nil
	}

	// Get chapter summaries from AniList or local storage
	chapterSummaries := []string{}

	// For now, generate a recap without detailed chapter summaries
	// In production, we'd fetch actual chapter summaries
	recap, err := client.GenerateRecap(ctx, req.MangaTitle, req.ChaptersRead, chapterSummaries, req.CurrentChapter)
	if err != nil {
		return &RecapResponse{Error: err.Error()}, nil
	}

	return &RecapResponse{Recap: recap}, nil
}

// SearchRequest represents a search request
type SearchRequest struct {
	Query string `json:"query"`
}

// SearchResponse represents a search response
type SearchResponse struct {
	Results string `json:"results"`
	Error   string `json:"error,omitempty"`
}

// SearchByVibe searches for manga by vibe description
func (s *Service) SearchByVibe(ctx context.Context, req *SearchRequest) (*SearchResponse, error) {
	s.mu.RLock()
	enabled := s.settings.EnableSearch
	client := s.geminiClient
	s.mu.RUnlock()

	if !enabled {
		return &SearchResponse{Error: "Vibe search is disabled"}, nil
	}

	if client == nil {
		return &SearchResponse{Error: "AI service not initialized"}, nil
	}

	results, err := client.SearchByVibe(ctx, req.Query)
	if err != nil {
		return &SearchResponse{Error: err.Error()}, nil
	}

	return &SearchResponse{Results: results}, nil
}

// LoreEntry represents a lore/character entry
type LoreEntry struct {
	ID          string         `json:"id"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	FirstSeen   string         `json:"firstSeen"` // Chapter number
	ImageURL    string         `json:"imageUrl"`
	Relations   []string       `json:"relations"`
	Abilities   []string       `json:"abilities"`
	ChapterData map[int]string `json:"chapterData"` // chapter -> description
}

// LoreTree represents the lore for a manga
type LoreTree struct {
	MangaID       int          `json:"mangaId"`
	MangaTitle    string       `json:"mangaTitle"`
	Characters    []*LoreEntry `json:"characters"`
	Locations     []*LoreEntry `json:"locations"`
	Organizations []*LoreEntry `json:"organizations"`
	UpdatedAt     string       `json:"updatedAt"`
	Error         string       `json:"error,omitempty"`
}

// GenerateLoreTree generates a lore tree for a manga
func (s *Service) GenerateLoreTree(ctx context.Context, mediaId int, title string, chapters string) (*LoreTree, error) {
	s.mu.RLock()
	client := s.geminiClient
	s.mu.RUnlock()

	if client == nil {
		return &LoreTree{
			MangaID:       mediaId,
			MangaTitle:    title,
			Characters:    []*LoreEntry{},
			Locations:     []*LoreEntry{},
			Organizations: []*LoreEntry{},
			UpdatedAt:     time.Now().Format(time.RFC3339),
			Error:         "AI service not initialized",
		}, nil
	}

	prompt := fmt.Sprintf(`Create a comprehensive lore tree for the manga "%s".
Based on the chapter information provided, extract and organize:
1. Characters - main and supporting characters with descriptions
2. Organizations/Groups - guilds, clans, factions
3. Locations - important places in the story
4. Abilities/Powers - magical systems, techniques

For each entry, provide:
- Name
- Brief description (no spoilers beyond chapter %s)
- First appearance (chapter)
- Relations to other entries

Format as JSON with this structure:
{
  "characters": [...],
  "locations": [...],
  "organizations": [...]
}`, title, chapters)

	resp, err := client.GenerateText(ctx, prompt)
	if err != nil {
		return &LoreTree{
			MangaID:       mediaId,
			MangaTitle:    title,
			Characters:    []*LoreEntry{},
			Locations:     []*LoreEntry{},
			Organizations: []*LoreEntry{},
			UpdatedAt:     time.Now().Format(time.RFC3339),
			Error:         err.Error(),
		}, nil
	}

	if len(resp.Candidates) == 0 {
		return &LoreTree{
			MangaID:       mediaId,
			MangaTitle:    title,
			Characters:    []*LoreEntry{},
			Locations:     []*LoreEntry{},
			Organizations: []*LoreEntry{},
			UpdatedAt:     time.Now().Format(time.RFC3339),
			Error:         "No response from Gemini",
		}, nil
	}

	// Extract text from response
	text := resp.Candidates[0].Content.Parts[0].Text

	// Parse JSON response
	text = strings.TrimSpace(text)
	// Remove markdown code blocks if present
	if strings.HasPrefix(text, "```") {
		lines := strings.Split(text, "\n")
		if len(lines) > 2 {
			text = strings.Join(lines[1:len(lines)-1], "\n")
		}
	}
	if strings.HasPrefix(text, "```json") {
		lines := strings.Split(text, "\n")
		if len(lines) > 2 {
			text = strings.Join(lines[1:len(lines)-1], "\n")
		}
	}

	var parsedData struct {
		Characters    []*LoreEntry `json:"characters"`
		Locations     []*LoreEntry `json:"locations"`
		Organizations []*LoreEntry `json:"organizations"`
	}

	if err := json.Unmarshal([]byte(text), &parsedData); err != nil {
		// Return empty lore tree with error if parsing fails
		return &LoreTree{
			MangaID:       mediaId,
			MangaTitle:    title,
			Characters:    []*LoreEntry{},
			Locations:     []*LoreEntry{},
			Organizations: []*LoreEntry{},
			UpdatedAt:     time.Now().Format(time.RFC3339),
			Error:         "Failed to parse lore tree: " + err.Error(),
		}, nil
	}

	return &LoreTree{
		MangaID:       mediaId,
		MangaTitle:    title,
		Characters:    parsedData.Characters,
		Locations:     parsedData.Locations,
		Organizations: parsedData.Organizations,
		UpdatedAt:     time.Now().Format(time.RFC3339),
	}, nil
}

// GetAnilistClient returns an AniList client for fetching manga data
func (s *Service) GetAnilistClient() *anilist.Client {
	// This would be injected or retrieved from the app
	return nil
}

// SetAnilistClient sets the AniList client
func (s *Service) SetAnilistClient(client *anilist.Client) {
	// Would store reference if needed
	s.logger.Info().Msg("ai: AniList client set")
}

// UpscaleImage upscales a manga page image
func (s *Service) UpscaleImage(ctx context.Context, imageData []byte, mimeType string) (*gemini.ImageUpscaleResponse, error) {
	s.mu.RLock()
	client := s.geminiClient
	s.mu.RUnlock()

	if client == nil {
		return nil, fmt.Errorf("AI service not initialized")
	}

	return client.UpscaleImage(ctx, imageData, mimeType)
}
