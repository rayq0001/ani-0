package ai

import (
	"fmt"
	"os"
)

// AnyverseConfig holds all API configuration for Anyverse
type AnyverseConfig struct {
	// AI Providers
	GeminiAPIKey        string
	OpenAIAPIKey        string
	ReplicateAPIToken   string
	ElevenLabsAPIKey    string
	PineconeAPIKey      string
	PineconeEnvironment string

	// Feature Flags
	EnableImageGeneration bool
	EnableVideoGeneration bool
	EnableMusicGeneration bool
	EnableTTS             bool
	EnableEmotion         bool
	EnableCulture         bool

	// Rate Limits (per hour)
	FreeTierLimit  int
	ProTierLimit   int
	EliteTierLimit int

	// Cache Settings
	CacheEnabled  bool
	CacheTTLHours int
}

// DefaultConfig returns default configuration
func DefaultConfig() *AnyverseConfig {
	return &AnyverseConfig{
		// Default to empty - must be set via environment
		EnableImageGeneration: true,
		EnableVideoGeneration: true,
		EnableMusicGeneration: true,
		EnableTTS:             true,
		EnableEmotion:         false,
		EnableCulture:         true,

		// Rate limits per tier
		FreeTierLimit:  10,
		ProTierLimit:   100,
		EliteTierLimit: 500,

		// Cache settings
		CacheEnabled:  true,
		CacheTTLHours: 24,
	}
}

// LoadFromEnv loads configuration from environment variables
func (c *AnyverseConfig) LoadFromEnv() error {
	// Required keys
	c.GeminiAPIKey = os.Getenv("GEMINI_API_KEY")
	c.OpenAIAPIKey = os.Getenv("OPENAI_API_KEY")
	c.ReplicateAPIToken = os.Getenv("REPLICATE_API_TOKEN")
	c.ElevenLabsAPIKey = os.Getenv("ELEVENLABS_API_KEY")
	c.PineconeAPIKey = os.Getenv("PINECONE_API_KEY")
	c.PineconeEnvironment = getEnvOrDefault("PINECONE_ENVIRONMENT", "us-east-1")

	// Optional feature flags
	c.EnableImageGeneration = getEnvBool("ENABLE_IMAGE_GENERATION", true)
	c.EnableVideoGeneration = getEnvBool("ENABLE_VIDEO_GENERATION", true)
	c.EnableMusicGeneration = getEnvBool("ENABLE_MUSIC_GENERATION", true)
	c.EnableTTS = getEnvBool("ENABLE_TTS", true)
	c.EnableEmotion = getEnvBool("ENABLE_EMOTION", false)
	c.EnableCulture = getEnvBool("ENABLE_CULTURE", true)

	// Rate limits
	c.FreeTierLimit = getEnvInt("FREE_TIER_LIMIT", 10)
	c.ProTierLimit = getEnvInt("PRO_TIER_LIMIT", 100)
	c.EliteTierLimit = getEnvInt("ELITE_TIER_LIMIT", 500)

	// Cache
	c.CacheEnabled = getEnvBool("CACHE_ENABLED", true)
	c.CacheTTLHours = getEnvInt("CACHE_TTL_HOURS", 24)

	return nil
}

// Validate checks if required configuration is present
func (c *AnyverseConfig) Validate() error {
	if c.GeminiAPIKey == "" {
		return fmt.Errorf("GEMINI_API_KEY is required")
	}
	// Other keys are optional but warn if missing
	if c.ReplicateAPIToken == "" {
		fmt.Println("⚠️  Warning: REPLICATE_API_TOKEN not set - image features will be limited")
	}
	if c.ElevenLabsAPIKey == "" {
		fmt.Println("⚠️  Warning: ELEVENLABS_API_KEY not set - voice features will be limited")
	}
	return nil
}

// GetProviderConfig returns a map of provider to key
func (c *AnyverseConfig) GetProviderConfig() map[string]string {
	return map[string]string{
		"gemini":     c.GeminiAPIKey,
		"openai":     c.OpenAIAPIKey,
		"replicate":  c.ReplicateAPIToken,
		"elevenlabs": c.ElevenLabsAPIKey,
		"pinecone":   c.PineconeAPIKey,
	}
}

// Helper functions
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		return value == "true" || value == "1"
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		var intValue int
		fmt.Sscanf(value, "%d", &intValue)
		if intValue > 0 {
			return intValue
		}
	}
	return defaultValue
}

// PrintStatus prints the status of all API keys
func (c *AnyverseConfig) PrintStatus() {
	fmt.Println("╔══════════════════════════════════════════════════════╗")
	fmt.Println("║          Anyverse API Configuration Status            ║")
	fmt.Println("╠══════════════════════════════════════════════════════╣")

	providers := []struct {
		Name   string
		Key    string
		Status string
	}{
		{"Google Gemini", c.GeminiAPIKey, "✅"},
		{"OpenAI", c.OpenAIAPIKey, "✅"},
		{"Replicate", c.ReplicateAPIToken, "⚠️ "},
		{"ElevenLabs", c.ElevenLabsAPIKey, "⚠️ "},
		{"Pinecone", c.PineconeAPIKey, "⚠️ "},
	}

	for _, p := range providers {
		status := p.Status
		if p.Key == "" {
			status = "❌"
		}
		fmt.Printf("║ %s %-15s %s\n", status, p.Name+":", "")
	}

	fmt.Println("╠══════════════════════════════════════════════════════╣")
	fmt.Printf("║ Rate Limits: Free=%d | Pro=%d | Elite=%d          ║\n",
		c.FreeTierLimit, c.ProTierLimit, c.EliteTierLimit)
	fmt.Println("╚══════════════════════════════════════════════════════╝")
}
