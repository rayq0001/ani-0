package ai

import (
	"time"

	"github.com/google/uuid"
)

// SubscriptionTier represents the user's subscription level
type SubscriptionTier string

const (
	TierStandard SubscriptionTier = "standard" // Free
	TierPro      SubscriptionTier = "pro"      // $9.99/mo
	TierElite    SubscriptionTier = "elite"    // $29.99/mo
)

// Subscription represents a user's subscription
type Subscription struct {
	ID             string           `json:"id"`
	UserID         string           `json:"userId"`
	Tier           SubscriptionTier `json:"tier"`
	AnyCoinBalance int              `json:"anyCoinBalance"`
	Features       []string         `json:"features"`
	CreatedAt      time.Time        `json:"createdAt"`
	UpdatedAt      time.Time        `json:"updatedAt"`
	ExpiresAt      time.Time        `json:"expiresAt"`
}

// FeatureMatrix defines which features are available at each tier
var FeatureMatrix = map[string][]SubscriptionTier{
	"basic_reading":    {TierStandard, TierPro, TierElite},
	"ocr_translation":  {TierStandard, TierPro, TierElite},
	"ads":              {TierStandard},
	"no_ads":           {TierPro, TierElite},
	"ai_concierge":     {TierPro, TierElite},
	"voice_dubbing":    {TierPro, TierElite},
	"dynamic_ost":      {TierPro, TierElite},
	"ai_director":      {TierElite},
	"digital_twin":     {TierElite},
	"unlimited_whatif": {TierElite},
	"character_chat":   {TierElite},
	"priority_support": {TierPro, TierElite},
}

// AnyCoinPackage represents a coin package for purchase
type AnyCoinPackage struct {
	ID         string  `json:"id"`
	Name       string  `json:"name"`
	Coins      int     `json:"coins"`
	BonusCoins int     `json:"bonusCoins"`
	PriceUSD   float64 `json:"priceUsd"`
}

// AvailableCoinPackages returns the available coin packages
func AvailableCoinPackages() []AnyCoinPackage {
	return []AnyCoinPackage{
		{
			ID:         "coin_pack_100",
			Name:       "Starter Pack",
			Coins:      100,
			BonusCoins: 10,
			PriceUSD:   0.99,
		},
		{
			ID:         "coin_pack_500",
			Name:       "Value Pack",
			Coins:      500,
			BonusCoins: 75,
			PriceUSD:   4.99,
		},
		{
			ID:         "coin_pack_1000",
			Name:       "Pro Pack",
			Coins:      1000,
			BonusCoins: 200,
			PriceUSD:   9.99,
		},
		{
			ID:         "coin_pack_5000",
			Name:       "Elite Pack",
			Coins:      5000,
			BonusCoins: 1500,
			PriceUSD:   49.99,
		},
	}
}

// SubscriptionPrices returns the subscription prices
func SubscriptionPrices() map[SubscriptionTier]float64 {
	return map[SubscriptionTier]float64{
		TierStandard: 0,
		TierPro:      9.99,
		TierElite:    29.99,
	}
}

// FeatureCosts defines the cost of features in AnyCoins
var FeatureCosts = map[string]int{
	"ai_chat_message":       1,
	"image_generation":      50,
	"voice_dubbing_chapter": 100,
	"custom_ost":            75,
	"whatif_chapter":        25,
	"character_chat":        2,
}

// NewSubscription creates a new subscription
func NewSubscription(userID string, tier SubscriptionTier) *Subscription {
	now := time.Now()
	expiresAt := now.AddDate(0, 1, 0) // 1 month default

	if tier == TierStandard {
		expiresAt = now.AddDate(10, 0, 0) // 10 years for free tier
	}

	return &Subscription{
		ID:             uuid.New().String(),
		UserID:         userID,
		Tier:           tier,
		AnyCoinBalance: 0,
		Features:       getFeaturesForTier(tier),
		CreatedAt:      now,
		UpdatedAt:      now,
		ExpiresAt:      expiresAt,
	}
}

// getFeaturesForTier returns the features available for a tier
func getFeaturesForTier(tier SubscriptionTier) []string {
	var features []string
	for feature, tiers := range FeatureMatrix {
		for _, t := range tiers {
			if t == tier {
				features = append(features, feature)
				break
			}
		}
	}
	return features
}

// HasFeature checks if the subscription has a specific feature
func (s *Subscription) HasFeature(feature string) bool {
	for _, f := range s.Features {
		if f == feature {
			return true
		}
	}
	return false
}

// CanUseFeature checks if the user can use a feature (considering AnyCoins)
func (s *Subscription) CanUseFeature(feature string) bool {
	// Check if feature is in tier
	if s.HasFeature(feature) {
		return true
	}

	// Check if feature can be purchased with AnyCoins
	cost, exists := FeatureCosts[feature]
	if !exists {
		return false
	}

	// Check if user has enough coins
	return s.AnyCoinBalance >= cost
}

// UseFeature uses a feature that costs AnyCoins
func (s *Subscription) UseFeature(feature string) bool {
	cost, exists := FeatureCosts[feature]
	if !exists {
		return false
	}

	if s.AnyCoinBalance < cost {
		return false
	}

	s.AnyCoinBalance -= cost
	s.UpdatedAt = time.Now()
	return true
}

// AddCoins adds AnyCoins to the subscription
func (s *Subscription) AddCoins(coins int) {
	s.AnyCoinBalance += coins
	s.UpdatedAt = time.Now()
}

// UpgradeTier upgrades the subscription tier
func (s *Subscription) UpgradeTier(newTier SubscriptionTier) {
	s.Tier = newTier
	s.Features = getFeaturesForTier(newTier)
	s.UpdatedAt = time.Now()
	s.ExpiresAt = time.Now().AddDate(0, 1, 0)
}

// IsExpired checks if the subscription is expired
func (s *Subscription) IsExpired() bool {
	return time.Now().After(s.ExpiresAt)
}

// DaysRemaining returns the days remaining in the subscription
func (s *Subscription) DaysRemaining() int {
	if s.IsExpired() {
		return 0
	}
	return int(s.ExpiresAt.Sub(time.Now()).Hours() / 24)
}

// MicroTransaction represents a micro-transaction
type MicroTransaction struct {
	ID          string    `json:"id"`
	UserID      string    `json:"userId"`
	Amount      int       `json:"amount"`
	Feature     string    `json:"feature"`
	Description string    `json:"description"`
	Timestamp   time.Time `json:"timestamp"`
}

// NewMicroTransaction creates a new micro-transaction
func NewMicroTransaction(userID string, amount int, feature string, description string) *MicroTransaction {
	return &MicroTransaction{
		ID:          uuid.New().String(),
		UserID:      userID,
		Amount:      amount,
		Feature:     feature,
		Description: description,
		Timestamp:   time.Now(),
	}
}
