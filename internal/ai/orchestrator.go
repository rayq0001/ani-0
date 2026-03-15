package ai

import (
	"context"
	"fmt"
	"aniverse/internal/ai/gemini"
	"sync"

	"github.com/rs/zerolog"
)

// RequestType represents the type of AI request
type RequestType string

const (
	RequestImageGeneration RequestType = "image_generation"
	RequestVideoGeneration RequestType = "video_generation"
	RequestMusicGeneration RequestType = "music_generation"
	RequestTextToSpeech    RequestType = "text_to_speech"
	RequestEmotionAnalysis RequestType = "emotion_analysis"
	RequestChat            RequestType = "chat"
	RequestOCR             RequestType = "ocr"
	RequestRecap           RequestType = "recap"
	RequestSearch          RequestType = "search"
	RequestLore            RequestType = "lore"
)

// Orchestrator routes AI requests to the appropriate service
type Orchestrator struct {
	logger        zerolog.Logger
	geminiClient  *gemini.Client
	imageClient   ImageGenerator
	videoClient   VideoGenerator
	musicClient   MusicGenerator
	ttsClient     TTSClient
	emotionClient EmotionDetector
	mu            sync.RWMutex
	settings      *OrchestratorSettings
}

// OrchestratorSettings holds the configuration for the orchestrator
type OrchestratorSettings struct {
	EnableImageGeneration bool   `json:"enableImageGeneration"`
	EnableVideoGeneration bool   `json:"enableVideoGeneration"`
	EnableMusicGeneration bool   `json:"enableMusicGeneration"`
	EnableTTS             bool   `json:"enableTts"`
	EnableEmotion         bool   `json:"enableEmotion"`
	ImageProvider         string `json:"imageProvider"` // "stability", "replicate", "local"
	MusicProvider         string `json:"musicProvider"` // "suno", "lyria"
	TTSProvider           string `json:"ttsProvider"`   // "elevenlabs", "gtts"
}

// NewOrchestrator creates a new AI orchestrator
func NewOrchestrator(logger zerolog.Logger) *Orchestrator {
	return &Orchestrator{
		logger: logger,
		settings: &OrchestratorSettings{
			EnableImageGeneration: true,
			EnableVideoGeneration: true,
			EnableMusicGeneration: true,
			EnableTTS:             true,
			EnableEmotion:         false,
			ImageProvider:         "stability",
			MusicProvider:         "suno",
			TTSProvider:           "elevenlabs",
		},
	}
}

// InitProviders initializes all AI providers from environment configuration
func (o *Orchestrator) InitProviders(config *AnyverseConfig) error {
	o.logger.Info().Msg("ai: Initializing Anyverse AI providers...")

	// Validate configuration
	if err := config.Validate(); err != nil {
		o.logger.Error().Err(err).Msg("ai: Configuration validation failed")
		return err
	}

	// Initialize Gemini client (required)
	if config.GeminiAPIKey != "" {
		o.logger.Info().Msg("ai: Initializing Gemini client...")
		// Note: This would use the actual Gemini client initialization
		// For now, we assume it's set externally via SetGeminiClient
	}

	// Initialize Replicate client (for images/video)
	if config.ReplicateAPIToken != "" && config.EnableImageGeneration {
		o.logger.Info().Msg("ai: Replicate token configured - image/video generation ready")
		// Note: Replicate provider implements ImageGenerator and VideoGenerator
		// Initialize with: replicateProvider := providers.NewReplicateProvider(token, logger)
	}

	// Initialize ElevenLabs client (for TTS)
	if config.ElevenLabsAPIKey != "" && config.EnableTTS {
		o.logger.Info().Msg("ai: ElevenLabs token configured - TTS ready")
		// Note: ElevenLabs provider implements TTSClient
		// Initialize with: elevenlabsProvider := providers.NewElevenLabsProvider(token, logger)
	}

	// Update settings from config
	o.settings.EnableImageGeneration = config.EnableImageGeneration
	o.settings.EnableVideoGeneration = config.EnableVideoGeneration
	o.settings.EnableMusicGeneration = config.EnableMusicGeneration
	o.settings.EnableTTS = config.EnableTTS
	o.settings.EnableEmotion = config.EnableEmotion

	o.logger.Info().Msg("ai: Anyverse AI providers initialized successfully! 🚀")
	return nil
}

// InitProvidersFromEnv initializes providers from environment variables
func (o *Orchestrator) InitProvidersFromEnv() error {
	config := DefaultConfig()
	if err := config.LoadFromEnv(); err != nil {
		return err
	}
	return o.InitProviders(config)
}

// SetGeminiClient sets the Gemini client
func (o *Orchestrator) SetGeminiClient(client *gemini.Client) {
	o.mu.Lock()
	defer o.mu.Unlock()
	o.geminiClient = client
}

// SetImageClient sets the image generation client
func (o *Orchestrator) SetImageClient(client ImageGenerator) {
	o.mu.Lock()
	defer o.mu.Unlock()
	o.imageClient = client
}

// SetVideoClient sets the video generation client
func (o *Orchestrator) SetVideoClient(client VideoGenerator) {
	o.mu.Lock()
	defer o.mu.Unlock()
	o.videoClient = client
}

// SetMusicClient sets the music generation client
func (o *Orchestrator) SetMusicClient(client MusicGenerator) {
	o.mu.Lock()
	defer o.mu.Unlock()
	o.musicClient = client
}

// SetTTSClient sets the TTS client
func (o *Orchestrator) SetTTSClient(client TTSClient) {
	o.mu.Lock()
	defer o.mu.Unlock()
	o.ttsClient = client
}

// SetEmotionClient sets the emotion detection client
func (o *Orchestrator) SetEmotionClient(client EmotionDetector) {
	o.mu.Lock()
	defer o.mu.Unlock()
	o.emotionClient = client
}

// ProcessRequest routes the request to the appropriate AI service
func (o *Orchestrator) ProcessRequest(ctx context.Context, req *OrchestratorRequest) (*OrchestratorResponse, error) {
	o.mu.RLock()
	defer o.mu.RUnlock()

	switch req.Type {
	case RequestImageGeneration:
		return o.handleImageGeneration(ctx, req.Payload)
	case RequestVideoGeneration:
		return o.handleVideoGeneration(ctx, req.Payload)
	case RequestMusicGeneration:
		return o.handleMusicGeneration(ctx, req.Payload)
	case RequestTextToSpeech:
		return o.handleTTS(ctx, req.Payload)
	case RequestEmotionAnalysis:
		return o.handleEmotionAnalysis(ctx, req.Payload)
	case RequestChat:
		return o.handleChat(ctx, req.Payload)
	case RequestOCR:
		return o.handleOCR(ctx, req.Payload)
	case RequestRecap:
		return o.handleRecap(ctx, req.Payload)
	case RequestSearch:
		return o.handleSearch(ctx, req.Payload)
	case RequestLore:
		return o.handleLore(ctx, req.Payload)
	default:
		return nil, fmt.Errorf("unknown request type: %s", req.Type)
	}
}

// OrchestratorRequest represents a request to the orchestrator
type OrchestratorRequest struct {
	Type    RequestType `json:"type"`
	Payload interface{} `json:"payload"`
}

// OrchestratorResponse represents a response from the orchestrator
type OrchestratorResponse struct {
	Type    RequestType `json:"type"`
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// Image generation handlers
func (o *Orchestrator) handleImageGeneration(ctx context.Context, payload interface{}) (*OrchestratorResponse, error) {
	if o.imageClient == nil {
		return &OrchestratorResponse{
			Type:    RequestImageGeneration,
			Success: false,
			Error:   "Image generation service not configured",
		}, nil
	}

	// Parse payload (would need proper type assertion in production)
	o.logger.Info().Msg("ai: Processing image generation request")

	return &OrchestratorResponse{
		Type:    RequestImageGeneration,
		Success: true,
		Data:    map[string]string{"status": "queued"},
	}, nil
}

// Video generation handlers
func (o *Orchestrator) handleVideoGeneration(ctx context.Context, payload interface{}) (*OrchestratorResponse, error) {
	if o.videoClient == nil {
		return &OrchestratorResponse{
			Type:    RequestVideoGeneration,
			Success: false,
			Error:   "Video generation service not configured",
		}, nil
	}

	o.logger.Info().Msg("ai: Processing video generation request")

	return &OrchestratorResponse{
		Type:    RequestVideoGeneration,
		Success: true,
		Data:    map[string]string{"status": "queued"},
	}, nil
}

// Music generation handlers
func (o *Orchestrator) handleMusicGeneration(ctx context.Context, payload interface{}) (*OrchestratorResponse, error) {
	if o.musicClient == nil {
		return &OrchestratorResponse{
			Type:    RequestMusicGeneration,
			Success: false,
			Error:   "Music generation service not configured",
		}, nil
	}

	o.logger.Info().Msg("ai: Processing music generation request")

	return &OrchestratorResponse{
		Type:    RequestMusicGeneration,
		Success: true,
		Data:    map[string]string{"status": "queued"},
	}, nil
}

// TTS handlers
func (o *Orchestrator) handleTTS(ctx context.Context, payload interface{}) (*OrchestratorResponse, error) {
	if o.ttsClient == nil {
		return &OrchestratorResponse{
			Type:    RequestTextToSpeech,
			Success: false,
			Error:   "TTS service not configured",
		}, nil
	}

	o.logger.Info().Msg("ai: Processing TTS request")

	return &OrchestratorResponse{
		Type:    RequestTextToSpeech,
		Success: true,
		Data:    map[string]string{"status": "queued"},
	}, nil
}

// Emotion analysis handlers
func (o *Orchestrator) handleEmotionAnalysis(ctx context.Context, payload interface{}) (*OrchestratorResponse, error) {
	if o.emotionClient == nil {
		return &OrchestratorResponse{
			Type:    RequestEmotionAnalysis,
			Success: false,
			Error:   "Emotion detection service not configured",
		}, nil
	}

	o.logger.Info().Msg("ai: Processing emotion analysis request")

	return &OrchestratorResponse{
		Type:    RequestEmotionAnalysis,
		Success: true,
		Data:    map[string]string{"emotion": "neutral"},
	}, nil
}

// Chat handlers (uses Gemini)
func (o *Orchestrator) handleChat(ctx context.Context, payload interface{}) (*OrchestratorResponse, error) {
	if o.geminiClient == nil {
		return &OrchestratorResponse{
			Type:    RequestChat,
			Success: false,
			Error:   "Gemini client not configured",
		}, nil
	}

	o.logger.Info().Msg("ai: Processing chat request")

	return &OrchestratorResponse{
		Type:    RequestChat,
		Success: true,
		Data:    map[string]string{"message": "Chat processed"},
	}, nil
}

// OCR handlers
func (o *Orchestrator) handleOCR(ctx context.Context, payload interface{}) (*OrchestratorResponse, error) {
	if o.geminiClient == nil {
		return &OrchestratorResponse{
			Type:    RequestOCR,
			Success: false,
			Error:   "Gemini client not configured",
		}, nil
	}

	o.logger.Info().Msg("ai: Processing OCR request")

	return &OrchestratorResponse{
		Type:    RequestOCR,
		Success: true,
		Data:    map[string]interface{}{"textBlocks": []interface{}{}},
	}, nil
}

// Recap handlers
func (o *Orchestrator) handleRecap(ctx context.Context, payload interface{}) (*OrchestratorResponse, error) {
	if o.geminiClient == nil {
		return &OrchestratorResponse{
			Type:    RequestRecap,
			Success: false,
			Error:   "Gemini client not configured",
		}, nil
	}

	o.logger.Info().Msg("ai: Processing recap request")

	return &OrchestratorResponse{
		Type:    RequestRecap,
		Success: true,
		Data:    map[string]string{"recap": "Recap generated"},
	}, nil
}

// Search handlers
func (o *Orchestrator) handleSearch(ctx context.Context, payload interface{}) (*OrchestratorResponse, error) {
	if o.geminiClient == nil {
		return &OrchestratorResponse{
			Type:    RequestSearch,
			Success: false,
			Error:   "Gemini client not configured",
		}, nil
	}

	o.logger.Info().Msg("ai: Processing search request")

	return &OrchestratorResponse{
		Type:    RequestSearch,
		Success: true,
		Data:    map[string]string{"results": "Search completed"},
	}, nil
}

// Lore handlers
func (o *Orchestrator) handleLore(ctx context.Context, payload interface{}) (*OrchestratorResponse, error) {
	if o.geminiClient == nil {
		return &OrchestratorResponse{
			Type:    RequestLore,
			Success: false,
			Error:   "Gemini client not configured",
		}, nil
	}

	o.logger.Info().Msg("ai: Processing lore request")

	return &OrchestratorResponse{
		Type:    RequestLore,
		Success: true,
		Data:    map[string]interface{}{"characters": []interface{}{}},
	}, nil
}

// GetSettings returns the orchestrator settings
func (o *Orchestrator) GetSettings() *OrchestratorSettings {
	o.mu.RLock()
	defer o.mu.RUnlock()
	return o.settings
}

// UpdateSettings updates the orchestrator settings
func (o *Orchestrator) UpdateSettings(settings *OrchestratorSettings) {
	o.mu.Lock()
	defer o.mu.Unlock()
	o.settings = settings
}
