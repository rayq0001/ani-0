package ai

import (
	"context"
	"fmt"
	"net/http"
	"time"
)

// ProviderHealth represents the health status of an AI provider
type ProviderHealth struct {
	Name      string        `json:"name"`
	Status    string        `json:"status"` // "healthy", "unhealthy", "unknown"
	Latency   time.Duration `json:"latency"`
	Error     string        `json:"error,omitempty"`
	LastCheck time.Time     `json:"lastCheck"`
}

// HealthChecker validates all AI provider connections
type HealthChecker struct {
	config *AnyverseConfig
}

// NewHealthChecker creates a new health checker
func NewHealthChecker(config *AnyverseConfig) *HealthChecker {
	return &HealthChecker{config: config}
}

// CheckAll validates all configured providers
func (h *HealthChecker) CheckAll(ctx context.Context) []ProviderHealth {
	results := make([]ProviderHealth, 0)

	// Check Gemini
	results = append(results, h.checkGemini(ctx))

	// Check OpenAI
	if h.config.OpenAIAPIKey != "" {
		results = append(results, h.checkOpenAI(ctx))
	}

	// Check Replicate
	if h.config.ReplicateAPIToken != "" {
		results = append(results, h.checkReplicate(ctx))
	}

	// Check ElevenLabs
	if h.config.ElevenLabsAPIKey != "" {
		results = append(results, h.checkElevenLabs(ctx))
	}

	// Check Pinecone
	if h.config.PineconeAPIKey != "" {
		results = append(results, h.checkPinecone(ctx))
	}

	return results
}

func (h *HealthChecker) checkGemini(ctx context.Context) ProviderHealth {
	start := time.Now()
	health := ProviderHealth{
		Name:      "Google Gemini",
		LastCheck: time.Now(),
	}

	if h.config.GeminiAPIKey == "" {
		health.Status = "unhealthy"
		health.Error = "API key not configured"
		return health
	}

	// Simple HTTP check to Gemini API
	client := &http.Client{Timeout: 5 * time.Second}
	req, _ := http.NewRequestWithContext(ctx, "GET",
		"https://generativelanguage.googleapis.com/v1beta/models?key="+h.config.GeminiAPIKey, nil)

	resp, err := client.Do(req)
	health.Latency = time.Since(start)

	if err != nil {
		health.Status = "unhealthy"
		health.Error = err.Error()
		return health
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		health.Status = "healthy"
	} else {
		health.Status = "unhealthy"
		health.Error = fmt.Sprintf("HTTP %d", resp.StatusCode)
	}

	return health
}

func (h *HealthChecker) checkOpenAI(ctx context.Context) ProviderHealth {
	start := time.Now()
	health := ProviderHealth{
		Name:      "OpenAI",
		LastCheck: time.Now(),
	}

	client := &http.Client{Timeout: 5 * time.Second}
	req, _ := http.NewRequestWithContext(ctx, "GET",
		"https://api.openai.com/v1/models", nil)
	req.Header.Set("Authorization", "Bearer "+h.config.OpenAIAPIKey)

	resp, err := client.Do(req)
	health.Latency = time.Since(start)

	if err != nil {
		health.Status = "unhealthy"
		health.Error = err.Error()
		return health
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		health.Status = "healthy"
	} else {
		health.Status = "unhealthy"
		health.Error = fmt.Sprintf("HTTP %d", resp.StatusCode)
	}

	return health
}

func (h *HealthChecker) checkReplicate(ctx context.Context) ProviderHealth {
	start := time.Now()
	health := ProviderHealth{
		Name:      "Replicate",
		LastCheck: time.Now(),
	}

	client := &http.Client{Timeout: 5 * time.Second}
	req, _ := http.NewRequestWithContext(ctx, "GET",
		"https://api.replicate.com/v1/models", nil)
	req.Header.Set("Authorization", "Token "+h.config.ReplicateAPIToken)

	resp, err := client.Do(req)
	health.Latency = time.Since(start)

	if err != nil {
		health.Status = "unhealthy"
		health.Error = err.Error()
		return health
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		health.Status = "healthy"
	} else {
		health.Status = "unhealthy"
		health.Error = fmt.Sprintf("HTTP %d", resp.StatusCode)
	}

	return health
}

func (h *HealthChecker) checkElevenLabs(ctx context.Context) ProviderHealth {
	start := time.Now()
	health := ProviderHealth{
		Name:      "ElevenLabs",
		LastCheck: time.Now(),
	}

	client := &http.Client{Timeout: 5 * time.Second}
	req, _ := http.NewRequestWithContext(ctx, "GET",
		"https://api.elevenlabs.io/v1/voices", nil)
	req.Header.Set("xi-api-key", h.config.ElevenLabsAPIKey)

	resp, err := client.Do(req)
	health.Latency = time.Since(start)

	if err != nil {
		health.Status = "unhealthy"
		health.Error = err.Error()
		return health
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		health.Status = "healthy"
	} else {
		health.Status = "unhealthy"
		health.Error = fmt.Sprintf("HTTP %d", resp.StatusCode)
	}

	return health
}

func (h *HealthChecker) checkPinecone(ctx context.Context) ProviderHealth {
	start := time.Now()
	health := ProviderHealth{
		Name:      "Pinecone",
		LastCheck: time.Now(),
	}

	// Pinecone health check via index list
	client := &http.Client{Timeout: 5 * time.Second}
	req, _ := http.NewRequestWithContext(ctx, "GET",
		fmt.Sprintf("https://controller.%s.pinecone.io/databases", h.config.PineconeEnvironment), nil)
	req.Header.Set("Api-Key", h.config.PineconeAPIKey)

	resp, err := client.Do(req)
	health.Latency = time.Since(start)

	if err != nil {
		health.Status = "unhealthy"
		health.Error = err.Error()
		return health
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		health.Status = "healthy"
	} else {
		health.Status = "unhealthy"
		health.Error = fmt.Sprintf("HTTP %d", resp.StatusCode)
	}

	return health
}

// PrintHealthReport prints a formatted health report
func PrintHealthReport(results []ProviderHealth) {
	fmt.Println("\n╔════════════════════════════════════════════════════════╗")
	fmt.Println("║           Anyverse AI Providers Health Check            ║")
	fmt.Println("╠════════════════════════════════════════════════════════╣")

	for _, r := range results {
		statusIcon := "❌"
		if r.Status == "healthy" {
			statusIcon = "✅"
		}

		fmt.Printf("║ %s %-15s %6s %10s\n",
			statusIcon, r.Name+":", r.Status, r.Latency.Round(time.Millisecond))

		if r.Error != "" {
			fmt.Printf("║   ⚠️  %s\n", r.Error)
		}
	}

	fmt.Println("╚════════════════════════════════════════════════════════╝")
}
