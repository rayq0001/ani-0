package ai

import (
	"context"
	"seanime/internal/ai/gemini"
	"seanime/internal/ai/processors"
	"sync"
	"time"
)

// GetGeminiClient returns the Gemini client
func (s *Service) GetGeminiClient() *gemini.Client {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.geminiClient
}

// offlineManager is the singleton offline manager instance
var offlineManager *processors.OfflineManager
var offlineManagerOnce sync.Once

// GetOfflineManager returns the offline manager instance
func (s *Service) GetOfflineManager() *processors.OfflineManager {
	offlineManagerOnce.Do(func() {
		offlineManager = processors.NewOfflineManager(3)
		offlineManager.SetDownloadFunc(func(ctx context.Context, item *processors.DownloadItem) error {
			// This would perform the actual download
			s.logger.Info().Str("item", item.ID).Msg("Downloading chapter")
			return nil
		})
		offlineManager.StartDownloads(context.Background())
	})
	return offlineManager
}

// cultureEngine is the singleton culture engine instance
var cultureEngine *processors.CultureEngine
var cultureEngineOnce sync.Once

// GetCultureEngine returns the culture engine instance
func (s *Service) GetCultureEngine() *processors.CultureEngine {
	cultureEngineOnce.Do(func() {
		// Create a simple Gemini provider wrapper
		provider := &processors.GeminiProvider{}
		cultureEngine = processors.NewCultureEngine(provider)
	})
	return cultureEngine
}

// subscriptions stores user subscriptions (in production, use database)
var subscriptions = make(map[string]*Subscription)
var subscriptionsMu sync.RWMutex

// GetSubscription returns a user's subscription
func (s *Service) GetSubscription(userID string) *Subscription {
	subscriptionsMu.RLock()
	defer subscriptionsMu.RUnlock()

	if sub, exists := subscriptions[userID]; exists {
		return sub
	}

	// Return default subscription
	return &Subscription{
		UserID:         userID,
		Tier:           TierStandard,
		AnyCoinBalance: 0,
		Features:       GetFeaturesForTier(TierStandard),
	}
}

// UpdateSubscription updates a user's subscription
func (s *Service) UpdateSubscription(userID string, tier SubscriptionTier) *Subscription {
	subscriptionsMu.Lock()
	defer subscriptionsMu.Unlock()

	sub := &Subscription{
		UserID:         userID,
		Tier:           tier,
		AnyCoinBalance: subscriptions[userID].AnyCoinBalance,
		Features:       GetFeaturesForTier(tier),
		ExpiresAt:      time.Now().Add(30 * 24 * time.Hour), // 30 days
	}

	subscriptions[userID] = sub
	return sub
}

// GetHealthStatus returns the health status of AI services
func (s *Service) GetHealthStatus() *HealthStatus {
	s.mu.RLock()
	client := s.geminiClient
	s.mu.RUnlock()

	status := &HealthStatus{
		Status: "healthy",
		Services: map[string]bool{
			"gemini":     client != nil,
			"replicate":  false, // Would check actual service
			"suno":       false,
			"elevenlabs": false,
		},
		Latency: map[string]int{
			"gemini":     0,
			"replicate":  0,
			"suno":       0,
			"elevenlabs": 0,
		},
	}

	// Check if any service is down
	for _, healthy := range status.Services {
		if !healthy {
			status.Status = "degraded"
			break
		}
	}

	return status
}

// HealthStatus represents the health status of AI services
type HealthStatus struct {
	Status   string          `json:"status"`
	Services map[string]bool `json:"services"`
	Latency  map[string]int  `json:"latency"`
}
