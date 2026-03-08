package handlers

import (
	"net/http"
	"seanime/internal/ai"
	"seanime/internal/ai/processors"
	"time"

	"github.com/labstack/echo/v4"
)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Smart Summary
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// HandleGenerateSmartSummary generates a "Previously on..." summary
//
//	@summary generates a smart summary of previously read chapters
//	@route /api/v1/anyverse/summary [POST]
//	@returns processors.SmartSummary
func (h *Handler) HandleGenerateSmartSummary(c echo.Context) error {
	type body struct {
		MediaID         int       `json:"mediaId"`
		MangaTitle      string    `json:"mangaTitle"`
		ChaptersRead    []int     `json:"chaptersRead"`
		LastChapter     int       `json:"lastChapter"`
		LastReadAt      time.Time `json:"lastReadAt"`
		Language        string    `json:"language"`
		IncludeSpoilers bool      `json:"includeSpoilers"`
	}

	var b body
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	// Create summary generator
	summaryGen := processors.NewSummaryGenerator(h.App.AIService.GetGeminiClient())

	req := &processors.SummaryRequest{
		MediaID:         b.MediaID,
		MangaTitle:      b.MangaTitle,
		ChaptersRead:    b.ChaptersRead,
		LastChapter:     b.LastChapter,
		LastReadAt:      b.LastReadAt,
		Language:        b.Language,
		IncludeSpoilers: b.IncludeSpoilers,
	}

	summary, err := summaryGen.Generate(c.Request().Context(), req)
	if err != nil {
		return h.RespondWithError(c, err)
	}

	return h.RespondWithData(c, summary)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Offline Downloads
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// HandleQueueDownload adds a chapter to the download queue
//
//	@summary queues a chapter for offline download
//	@route /api/v1/anyverse/offline/queue [POST]
//	@returns processors.DownloadItem
func (h *Handler) HandleQueueDownload(c echo.Context) error {
	type body struct {
		MediaID    int    `json:"mediaId"`
		MangaTitle string `json:"mangaTitle"`
		Chapter    int    `json:"chapter"`
		PageCount  int    `json:"pageCount"`
		Priority   int    `json:"priority"`
	}

	var b body
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	// Get or create offline manager
	offlineMgr := h.App.AIService.GetOfflineManager()
	if offlineMgr == nil {
		return h.RespondWithError(c, echo.NewHTTPError(http.StatusServiceUnavailable, "Offline manager not available"))
	}

	item := offlineMgr.QueueDownload(b.MediaID, b.MangaTitle, b.Chapter, b.PageCount, b.Priority)

	return h.RespondWithData(c, item)
}

// HandleQueueNextChapters automatically queues upcoming chapters
//
//	@summary queues next chapters for offline reading
//	@route /api/v1/anyverse/offline/queue-next [POST]
//	@returns []processors.DownloadItem
func (h *Handler) HandleQueueNextChapters(c echo.Context) error {
	type body struct {
		MediaID        int    `json:"mediaId"`
		MangaTitle     string `json:"mangaTitle"`
		CurrentChapter int    `json:"currentChapter"`
		Count          int    `json:"count"`
	}

	var b body
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	offlineMgr := h.App.AIService.GetOfflineManager()
	if offlineMgr == nil {
		return h.RespondWithError(c, echo.NewHTTPError(http.StatusServiceUnavailable, "Offline manager not available"))
	}

	items := offlineMgr.QueueNextChapters(b.MediaID, b.MangaTitle, b.CurrentChapter, b.Count)

	return h.RespondWithData(c, items)
}

// HandleGetDownloadQueue returns the current download queue
//
//	@summary gets the download queue
//	@route /api/v1/anyverse/offline/queue [GET]
//	@returns []processors.DownloadItem
func (h *Handler) HandleGetDownloadQueue(c echo.Context) error {
	offlineMgr := h.App.AIService.GetOfflineManager()
	if offlineMgr == nil {
		return h.RespondWithData(c, []processors.DownloadItem{})
	}

	queue := offlineMgr.GetQueue()
	return h.RespondWithData(c, queue)
}

// HandleGetActiveDownloads returns active downloads
//
//	@summary gets active downloads
//	@route /api/v1/anyverse/offline/active [GET]
//	@returns []processors.DownloadItem
func (h *Handler) HandleGetActiveDownloads(c echo.Context) error {
	offlineMgr := h.App.AIService.GetOfflineManager()
	if offlineMgr == nil {
		return h.RespondWithData(c, []processors.DownloadItem{})
	}

	active := offlineMgr.GetActiveDownloads()
	return h.RespondWithData(c, active)
}

// HandleGetCompletedDownloads returns completed downloads
//
//	@summary gets completed downloads
//	@route /api/v1/anyverse/offline/completed [GET]
//	@returns []processors.DownloadItem
func (h *Handler) HandleGetCompletedDownloads(c echo.Context) error {
	offlineMgr := h.App.AIService.GetOfflineManager()
	if offlineMgr == nil {
		return h.RespondWithData(c, []processors.DownloadItem{})
	}

	completed := offlineMgr.GetCompletedDownloads()
	return h.RespondWithData(c, completed)
}

// HandlePauseDownload pauses an active download
//
//	@summary pauses a download
//	@route /api/v1/anyverse/offline/pause [POST]
//	@returns bool
func (h *Handler) HandlePauseDownload(c echo.Context) error {
	type body struct {
		DownloadID string `json:"downloadId"`
	}

	var b body
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	offlineMgr := h.App.AIService.GetOfflineManager()
	if offlineMgr == nil {
		return h.RespondWithError(c, echo.NewHTTPError(http.StatusServiceUnavailable, "Offline manager not available"))
	}

	if err := offlineMgr.PauseDownload(b.DownloadID); err != nil {
		return h.RespondWithError(c, err)
	}

	return h.RespondWithData(c, true)
}

// HandleResumeDownload resumes a paused download
//
//	@summary resumes a download
//	@route /api/v1/anyverse/offline/resume [POST]
//	@returns bool
func (h *Handler) HandleResumeDownload(c echo.Context) error {
	type body struct {
		DownloadID string `json:"downloadId"`
	}

	var b body
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	offlineMgr := h.App.AIService.GetOfflineManager()
	if offlineMgr == nil {
		return h.RespondWithError(c, echo.NewHTTPError(http.StatusServiceUnavailable, "Offline manager not available"))
	}

	if err := offlineMgr.ResumeDownload(b.DownloadID); err != nil {
		return h.RespondWithError(c, err)
	}

	return h.RespondWithData(c, true)
}

// HandleCancelDownload cancels a download
//
//	@summary cancels a download
//	@route /api/v1/anyverse/offline/cancel [POST]
//	@returns bool
func (h *Handler) HandleCancelDownload(c echo.Context) error {
	type body struct {
		DownloadID string `json:"downloadId"`
	}

	var b body
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	offlineMgr := h.App.AIService.GetOfflineManager()
	if offlineMgr == nil {
		return h.RespondWithError(c, echo.NewHTTPError(http.StatusServiceUnavailable, "Offline manager not available"))
	}

	if err := offlineMgr.CancelDownload(b.DownloadID); err != nil {
		return h.RespondWithError(c, err)
	}

	return h.RespondWithData(c, true)
}

// HandleClearCompletedDownloads clears completed downloads
//
//	@summary clears completed download history
//	@route /api/v1/anyverse/offline/clear-completed [POST]
//	@returns bool
func (h *Handler) HandleClearCompletedDownloads(c echo.Context) error {
	offlineMgr := h.App.AIService.GetOfflineManager()
	if offlineMgr == nil {
		return h.RespondWithError(c, echo.NewHTTPError(http.StatusServiceUnavailable, "Offline manager not available"))
	}

	offlineMgr.ClearCompleted()

	return h.RespondWithData(c, true)
}

// HandleGetDownloadStats returns download statistics
//
//	@summary gets download statistics
//	@route /api/v1/anyverse/offline/stats [GET]
//	@returns map[string]interface{}
func (h *Handler) HandleGetDownloadStats(c echo.Context) error {
	offlineMgr := h.App.AIService.GetOfflineManager()
	if offlineMgr == nil {
		return h.RespondWithData(c, map[string]interface{}{
			"pending":     0,
			"downloading": 0,
			"completed":   0,
			"error":       0,
			"total":       0,
		})
	}

	stats := offlineMgr.GetStats()
	return h.RespondWithData(c, stats)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Cultural Localization
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// HandleCulturalLocalization localizes text to specific Arabic dialects
//
//	@summary localizes text to Arabic dialect
//	@route /api/v1/anyverse/culture/localize [POST]
//	@returns processors.LocalizationResult
func (h *Handler) HandleCulturalLocalization(c echo.Context) error {
	type body struct {
		Text            string `json:"text"`
		TargetDialect   string `json:"targetDialect"`
		PreserveContext bool   `json:"preserveContext"`
	}

	var b body
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	cultureEngine := h.App.AIService.GetCultureEngine()
	if cultureEngine == nil {
		return h.RespondWithError(c, echo.NewHTTPError(http.StatusServiceUnavailable, "Culture engine not available"))
	}

	req := &processors.LocalizationRequest{
		Text:          b.Text,
		TargetDialect: processors.Dialect(b.TargetDialect),
		Context:       "general",
	}

	result, err := cultureEngine.Localize(c.Request().Context(), req)
	if err != nil {
		return h.RespondWithError(c, err)
	}

	return h.RespondWithData(c, result)
}

// HandleVoiceCustomization generates customized voice audio
//
//	@summary generates customized voice
//	@route /api/v1/anyverse/culture/voice [POST]
//	@returns map[string]interface{}
func (h *Handler) HandleVoiceCustomization(c echo.Context) error {
	type body struct {
		Text      string  `json:"text"`
		VoiceType string  `json:"voiceType"`
		Emotion   string  `json:"emotion"`
		Speed     float64 `json:"speed"`
	}

	var b body
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	// This would integrate with ElevenLabs or similar TTS service
	// For now, return a placeholder response
	return h.RespondWithData(c, map[string]interface{}{
		"audioUrl": "", // Would be generated
		"duration": 0,
		"voiceId":  b.VoiceType,
		"message":  "Voice customization - integrate with ElevenLabs API",
	})
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AI Director
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// HandleAIDirector generates alternative perspectives of manga panels
//
//	@summary generates AI-directed perspective
//	@route /api/v1/anyverse/director/generate [POST]
//	@returns map[string]interface{}
func (h *Handler) HandleAIDirector(c echo.Context) error {
	type body struct {
		ImageBase64        string `json:"imageBase64"`
		CurrentPerspective string `json:"currentPerspective"`
		TargetPerspective  string `json:"targetPerspective"`
		CharacterName      string `json:"characterName"`
		SceneDescription   string `json:"sceneDescription"`
	}

	var b body
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	// This would integrate with Replicate/Stable Diffusion
	// For now, return a placeholder response
	return h.RespondWithData(c, map[string]interface{}{
		"generatedImage":    "", // Would be generated
		"perspective":       b.TargetPerspective,
		"processingTime":    0,
		"alternativeAngles": []string{},
		"message":           "AI Director - integrate with Replicate API",
	})
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Emotional OST
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// HandleGenerateOST generates dynamic soundtrack
//
//	@summary generates emotional OST
//	@route /api/v1/anyverse/ost/generate [POST]
//	@returns map[string]interface{}
func (h *Handler) HandleGenerateOST(c echo.Context) error {
	type body struct {
		Mood        string   `json:"mood"`
		Keywords    []string `json:"keywords"`
		Duration    int      `json:"duration"`
		Tempo       string   `json:"tempo"`
		ScrollSpeed float64  `json:"scrollSpeed"`
	}

	var b body
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	// This would integrate with Suno/Lyria
	// For now, return a placeholder response
	return h.RespondWithData(c, map[string]interface{}{
		"audioUrl":     "", // Would be generated
		"waveformData": []float64{},
		"duration":     b.Duration,
		"bpm":          120,
		"key":          "C major",
		"mood":         b.Mood,
		"message":      "OST Generation - integrate with Suno API",
	})
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Subscription & Wallet
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// HandleGetSubscription returns user's subscription info
//
//	@summary gets subscription information
//	@route /api/v1/anyverse/subscription [GET]
//	@returns ai.Subscription
func (h *Handler) HandleGetSubscription(c echo.Context) error {
	sub := h.App.AIService.GetSubscription("user_id") // Get from context

	return h.RespondWithData(c, sub)
}

// HandleUpgradeSubscription upgrades user's subscription
//
//	@summary upgrades subscription
//	@route /api/v1/anyverse/subscription/upgrade [POST]
//	@returns ai.Subscription
func (h *Handler) HandleUpgradeSubscription(c echo.Context) error {
	type body struct {
		Tier          string `json:"tier"`
		PaymentMethod string `json:"paymentMethod"`
	}

	var b body
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	// Get subscription prices
	prices := ai.SubscriptionPrices()
	_ = prices[ai.SubscriptionTier(b.Tier)] // Price would be used for Stripe/PayPal integration

	// This would integrate with Stripe/PayPal
	// For now, return a placeholder response
	return h.RespondWithData(c, &ai.Subscription{
		UserID:         "user_id",
		Tier:           ai.SubscriptionTier(b.Tier),
		Features:       ai.GetFeaturesForTier(ai.SubscriptionTier(b.Tier)),
		AnyCoinBalance: 0,
	})
}

// HandleGetWalletBalance returns AnyCoin balance
//
//	@summary gets wallet balance
//	@route /api/v1/anyverse/wallet/balance [GET]
//	@returns map[string]interface{}
func (h *Handler) HandleGetWalletBalance(c echo.Context) error {
	// This would integrate with Web3 wallet
	// For now, return a placeholder response
	return h.RespondWithData(c, map[string]interface{}{
		"anyCoins":      0,
		"usdEquivalent": 0.0,
	})
}

// HandlePurchaseCoins purchases AnyCoins
//
//	@summary purchases AnyCoins
//	@route /api/v1/anyverse/wallet/purchase [POST]
//	@returns map[string]interface{}
func (h *Handler) HandlePurchaseCoins(c echo.Context) error {
	type body struct {
		PackageID     string `json:"packageId"`
		PaymentMethod string `json:"paymentMethod"`
	}

	var b body
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	// This would integrate with Stripe/PayPal
	// For now, return a placeholder response
	return h.RespondWithData(c, map[string]interface{}{
		"anyCoins":   0,
		"bonusCoins": 0,
		"totalCoins": 0,
		"message":    "Purchase AnyCoins - integrate with payment provider",
	})
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Health Check
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// HandleGetHealthStatus returns health status of AI services
//
//	@summary gets AI services health status
//	@route /api/v1/anyverse/health [GET]
//	@returns ai.HealthStatus
func (h *Handler) HandleGetHealthStatus(c echo.Context) error {
	health := h.App.AIService.GetHealthStatus()
	return h.RespondWithData(c, health)
}
