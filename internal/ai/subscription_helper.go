package ai

// GetFeaturesForTier returns the features available for a tier (exported version)
func GetFeaturesForTier(tier SubscriptionTier) []string {
	return getFeaturesForTier(tier)
}
