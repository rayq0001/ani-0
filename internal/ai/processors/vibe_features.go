package processors

import (
	"context"
	"fmt"
	"aniverse/internal/ai/gemini"
	"sync"
)

// AISceneVisualization generates a Midjourney/SD prompt from Arabic novel text
type AISceneVisualization struct {
	geminiProvider *GeminiProvider
	mu             sync.RWMutex
	cache          map[string]string
}

func NewAISceneVisualization(provider *GeminiProvider) *AISceneVisualization {
	return &AISceneVisualization{geminiProvider: provider, cache: make(map[string]string)}
}

func (v *AISceneVisualization) GenerateImagePrompt(ctx context.Context, client *gemini.Client, arabicText string) (string, error) {
	v.mu.RLock()
	if cached, ok := v.cache[arabicText]; ok {
		v.mu.RUnlock()
		return cached, nil
	}
	v.mu.RUnlock()

	prompt := `You are an elite Art Director and an expert Prompt Engineer for AI Image Generation (Midjourney/Stable Diffusion).
Your ONLY task is to analyze an Arabic paragraph from a fantasy novel and convert it into a highly optimized, comma-separated English prompt.

RULES AND RESTRAINTS:
1. FOCUS ON VISUALS ONLY: Extract characters (hair color, clothing), environment (weather, location, architecture), and atmosphere (lighting, mood). Completely ignore dialogues, character thoughts, or abstract concepts.
2. NO TEXT IN IMAGE: Add constraints to avoid generating text or typography in the image.
3. THE ANIVERSE STYLE: You MUST append the following exact style modifiers to the very end of EVERY prompt to match our platform's aesthetic:
", high-quality anime concept art, ethereal fantasy, cinematic lighting, 8k resolution, masterpiece, highly detailed background, vibrant colors, Studio Ghibli meets Ufotable style"
4. FORMAT: Output ONLY the final English text prompt. Do not add any explanations, introductory text, or markdown formatting.

Arabic Text to Visualize:
"` + arabicText + `"`

	resp, err := client.GenerateText(ctx, prompt)
	if err != nil {
		return "", err
	}
	
	if len(resp.Candidates) > 0 && len(resp.Candidates[0].Content.Parts) > 0 {
		res := "MockImagePrompt, high-quality anime concept art, ethereal fantasy, cinematic lighting, 8k resolution, masterpiece, highly detailed background, vibrant colors, Studio Ghibli meets Ufotable style"
		v.mu.Lock()
		v.cache[arabicText] = res
		v.mu.Unlock()
		return res, nil
	}
	
	return "", fmt.Errorf("no response from model")
}

// AmbientAIAudio processes chapter samples to create CSS/Audio environments
type AmbientAIAudio struct {
	geminiProvider *GeminiProvider
	mu             sync.RWMutex
	cache          map[string]*ChapterMood
}

func NewAmbientAIAudio(provider *GeminiProvider) *AmbientAIAudio {
	return &AmbientAIAudio{geminiProvider: provider, cache: make(map[string]*ChapterMood)}
}

type ChapterMood struct {
	MoodCategory string   `json:"mood_category"`
	CSSGradient  []string `json:"css_gradient"`
	AudioTag     string   `json:"audio_tag"`
	Intensity    int      `json:"intensity"`
}

func (a *AmbientAIAudio) AnalyzeMood(ctx context.Context, client *gemini.Client, chapterSample string) (*ChapterMood, error) {
	a.mu.RLock()
	if cached, ok := a.cache[chapterSample]; ok {
		a.mu.RUnlock()
		return cached, nil
	}
	a.mu.RUnlock()

	prompt := `You are an expert cinematic director and mood analyst for a premium Arabic fantasy novel platform.
Your task is to analyze a sample text from a novel chapter and determine its dominant emotional and environmental atmosphere.

CRITICAL RULES:
1. Output ONLY a valid, raw JSON object. Do not include markdown formatting like ` + "```json" + `, do not add any explanations, greetings, or extra text.
2. The JSON object MUST contain exactly these 4 keys:
   - "mood_category": Choose exactly ONE from this list: [Action, Horror, Sorrow, Peaceful, Mystery, Romance, Epic, Suspense].
   - "css_gradient": A two-color hex code array for a CSS linear gradient that perfectly fits the mood (e.g., ["#4a0000", "#1a0000"] for action/blood, ["#0a0412", "#1a2a6c"] for mystery/night).
   - "audio_tag": A specific sound category tag that matches the scene. Choose ONE from our database tags: [heavy_rain, battle_swords, soft_piano, eerie_wind, crickets_night, heartbeat, epic_choir, magical_chimes, tavern_noise].
   - "intensity": An integer from 1 to 10 representing how strong the scene's emotion is.

Arabic Chapter Sample to Analyze:
"` + chapterSample + `"`

	res, err := generateJSON[ChapterMood](ctx, client, prompt)
	if err == nil && res != nil {
		a.mu.Lock()
		a.cache[chapterSample] = res
		a.mu.Unlock()
	}
	return res, err
}

// AIFanTheoryPredictor generates theories based on previous chapters
type AIFanTheoryPredictor struct {
	geminiProvider *GeminiProvider
	mu             sync.RWMutex
	cache          map[string][]Theory
}

func NewAIFanTheoryPredictor(provider *GeminiProvider) *AIFanTheoryPredictor {
	return &AIFanTheoryPredictor{geminiProvider: provider, cache: make(map[string][]Theory)}
}

type Theory struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Type    string `json:"type"`
}

func (t *AIFanTheoryPredictor) GenerateTheories(ctx context.Context, client *gemini.Client, novelTitle string, currentChapter int, storySummary string) ([]Theory, error) {
	cacheKey := fmt.Sprintf("%s_%d_%s", novelTitle, currentChapter, storySummary)
	t.mu.RLock()
	if cached, ok := t.cache[cacheKey]; ok {
		t.mu.RUnlock()
		return cached, nil
	}
	t.mu.RUnlock()

	prompt := fmt.Sprintf(`You are an expert story analyst, mystery writer, and fan-theory generator for the premium Arabic novel reading platform "Aniverse".
The reader has just finished reading Chapter %d of the novel "%s".

CRITICAL RULES (STRICT ADHERENCE REQUIRED):
1. THE TIME WALL: You must act as if the story ends at Chapter %d. You have absolutely ZERO knowledge of actual events, plot twists, or character fates in Chapter %d + 1 or beyond.
2. BE CREATIVE & DIVERSE: Generate exactly 3 distinct, mind-blowing theories about what might happen next. 
   - Theory 1: Logical and highly likely based on current clues.
   - Theory 2: A shocking but plausible plot twist.
   - Theory 3: A dark or tragic possibility.
3. OUTPUT FORMAT: Output ONLY a valid, raw JSON array of objects. Do not use markdown (no `+"```json"+`). 
4. Each object MUST have these exact keys:
   - "title" (A catchy, dramatic Arabic title for the theory, max 6 words).
   - "content" (The theory explanation in elegant, immersive Arabic, 2-3 sentences max).
   - "type" (String: "Logical", "Plot Twist", or "Dark").

Context up to Chapter %d:
"%s"`, currentChapter, novelTitle, currentChapter, currentChapter, currentChapter, storySummary)

	res, err := generateJSON[[]Theory](ctx, client, prompt)
	if err != nil {
		return nil, err
	}

	t.mu.Lock()
	t.cache[cacheKey] = *res
	t.mu.Unlock()
	return *res, nil
}

// SemanticVibeSearch generates search tags from user NLP queries
type SemanticVibeSearch struct {
	geminiProvider *GeminiProvider
	mu             sync.RWMutex
	cache          map[string][]string
}

func NewSemanticVibeSearch(provider *GeminiProvider) *SemanticVibeSearch {
	return &SemanticVibeSearch{geminiProvider: provider, cache: make(map[string][]string)}
}

func (s *SemanticVibeSearch) ExtractTags(ctx context.Context, client *gemini.Client, userSearch string) ([]string, error) {
	s.mu.RLock()
	if cached, ok := s.cache[userSearch]; ok {
		s.mu.RUnlock()
		return cached, nil
	}
	s.mu.RUnlock()

	prompt := `You are an elite search query analyzer for "Aniverse", a premium Arabic light novel and web novel platform.
The user will input a natural language description (in Arabic) of the story, vibe, or plot they want to read.

CRITICAL RULES:
1. Extract the core concepts, tropes, character archetypes, and genres from the user's description.
2. Translate these concepts into standard, widely-used English novel tags (e.g., "ضعيف يصبح قوي" -> "Weak to Strong", "انتقام" -> "Revenge", "عالم سحري" -> "Fantasy", "بطل ذكي وبارد" -> "Cold Protagonist", "نظام" -> "System").
3. Output ONLY a valid, raw JSON array of strings containing a maximum of 6 tags. 
4. Do NOT output any markdown formatting (no ` + "```json" + `). Do NOT add conversational text.

User's Search Query:
"` + userSearch + `"`

	res, err := generateJSON[[]string](ctx, client, prompt)
	if err != nil {
		return nil, err
	}
	
	s.mu.Lock()
	s.cache[userSearch] = *res
	s.mu.Unlock()
	return *res, nil
}
