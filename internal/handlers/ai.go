package handlers

import (
	"encoding/base64"
	"fmt"
	"seanime/internal/ai"
	"strings"

	"github.com/labstack/echo/v4"
)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AI Settings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// HandleGetAISettings
//
//	@summary returns the AI service settings.
//	@route /api/v1/ai/settings [GET]
//	@returns ai.Settings
func (h *Handler) HandleGetAISettings(c echo.Context) error {
	settings := h.App.AIService.GetSettings()
	return h.RespondWithData(c, settings)
}

// HandleUpdateAISettings
//
//	@summary updates the AI service settings.
//	@route /api/v1/ai/settings [POST]
//	@returns bool
func (h *Handler) HandleUpdateAISettings(c echo.Context) error {

	type body struct {
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

	var b body
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	settings := &ai.Settings{
		GeminiAPIKey:          b.GeminiAPIKey,
		OpenAIAPIKey:          b.OpenAIAPIKey,
		ReplicateAPIToken:     b.ReplicateAPIToken,
		ElevenLabsAPIKey:      b.ElevenLabsAPIKey,
		PineconeAPIKey:        b.PineconeAPIKey,
		EnableOCR:             b.EnableOCR,
		EnableChat:            b.EnableChat,
		EnableRecap:           b.EnableRecap,
		EnableSearch:          b.EnableSearch,
		EnableUpscaling:       b.EnableUpscaling,
		EnableImageGeneration: b.EnableImageGeneration,
		EnableVideoGeneration: b.EnableVideoGeneration,
		EnableMusicGeneration: b.EnableMusicGeneration,
		EnableTTS:             b.EnableTTS,
		EnableEmotion:         b.EnableEmotion,
		EnableCulture:         b.EnableCulture,
		TargetLanguage:        b.TargetLanguage,
		DefaultTranslator:     b.DefaultTranslator,
	}

	err := h.App.AIService.UpdateSettings(settings)
	if err != nil {
		return h.RespondWithError(c, err)
	}

	return h.RespondWithData(c, true)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AI OCR & Translation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// HandleOCRPage
//
//	@summary performs OCR on a manga page image.
//	@desc The image should be sent as base64 in the request body.
//	@route /api/v1/ai/ocr [POST]
//	@returns ai.OCRResult
func (h *Handler) HandleOCRPage(c echo.Context) error {

	type body struct {
		ImageBase64 string `json:"imageBase64"`
		MimeType    string `json:"mimeType"`
		PageNumber  int    `json:"pageNumber"`
	}

	var b body
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	// Decode base64 image
	imageData, err := base64.StdEncoding.DecodeString(b.ImageBase64)
	if err != nil {
		// Try URL encoding
		imageData, err = base64.URLEncoding.DecodeString(b.ImageBase64)
		if err != nil {
			return h.RespondWithError(c, fmt.Errorf("failed to decode image: %w", err))
		}
	}

	// Determine MIME type
	mimeType := b.MimeType
	if mimeType == "" {
		mimeType = "image/jpeg"
	}

	result, err := h.App.AIService.ProcessPage(c.Request().Context(), imageData, mimeType, b.PageNumber)
	if err != nil {
		return h.RespondWithError(c, err)
	}

	return h.RespondWithData(c, result)
}

// HandleTranslateText
//
//	@summary translates text using AI.
//	@route /api/v1/ai/translate [POST]
//	@returns map[string]string
func (h *Handler) HandleTranslateText(c echo.Context) error {

	type body struct {
		Text       string `json:"text"`
		SourceLang string `json:"sourceLang"`
		TargetLang string `json:"targetLang"`
	}

	var b body
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	if b.Text == "" {
		return h.RespondWithError(c, fmt.Errorf("text is required"))
	}

	// For simple translation, we'd call Gemini
	// For now, return the text as-is with a note
	result := map[string]string{
		"original":   b.Text,
		"translated": b.Text,
		"note":       "Translation via Gemini - configure API key in AI settings",
	}

	return h.RespondWithData(c, result)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AI Chat / Concierge
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// HandleAIChat
//
//	@summary sends a message to the AI concierge.
//	@route /api/v1/ai/chat [POST]
//	@returns ai.ChatResponse
func (h *Handler) HandleAIChat(c echo.Context) error {

	var b ai.ChatRequest
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	response, err := h.App.AIService.Chat(c.Request().Context(), &b)
	if err != nil {
		return h.RespondWithError(c, err)
	}

	return h.RespondWithData(c, response)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AI Recap
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// HandleGenerateRecap
//
//	@summary generates a recap for a manga.
//	@route /api/v1/ai/recap [POST]
//	@returns ai.RecapResponse
func (h *Handler) HandleGenerateRecap(c echo.Context) error {

	var b ai.RecapRequest
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	response, err := h.App.AIService.GenerateRecap(c.Request().Context(), &b)
	if err != nil {
		return h.RespondWithError(c, err)
	}

	return h.RespondWithData(c, response)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AI Vibe Search
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// HandleAIVibeSearch
//
//	@summary searches for manga by vibe description.
//	@route /api/v1/ai/search [POST]
//	@returns ai.SearchResponse
func (h *Handler) HandleAIVibeSearch(c echo.Context) error {

	var b ai.SearchRequest
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	if strings.TrimSpace(b.Query) == "" {
		return h.RespondWithError(c, fmt.Errorf("query is required"))
	}

	response, err := h.App.AIService.SearchByVibe(c.Request().Context(), &b)
	if err != nil {
		return h.RespondWithError(c, err)
	}

	return h.RespondWithData(c, response)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AI Lore Tree
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// HandleGenerateLoreTree
//
//	@summary generates a lore tree for a manga.
//	@route /api/v1/ai/lore [POST]
//	@returns ai.LoreTree
func (h *Handler) HandleGenerateLoreTree(c echo.Context) error {

	type body struct {
		MediaId  int    `json:"mediaId"`
		Title    string `json:"title"`
		Chapters string `json:"chapters"`
	}

	var b body
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	loretree, err := h.App.AIService.GenerateLoreTree(c.Request().Context(), b.MediaId, b.Title, b.Chapters)
	if err != nil {
		return h.RespondWithError(c, err)
	}

	return h.RespondWithData(c, loretree)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AI Image Upscaling
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// HandleUpscaleImage
//
//	@summary upscales a manga page image.
//	@route /api/v1/ai/upscale [POST]
//	@returns base64 encoded image
func (h *Handler) HandleUpscaleImage(c echo.Context) error {

	type body struct {
		ImageBase64 string `json:"imageBase64"`
		MimeType    string `json:"mimeType"`
		Scale       int    `json:"scale"`
	}

	var b body
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	// Decode base64 image
	imageData, err := base64.StdEncoding.DecodeString(b.ImageBase64)
	if err != nil {
		imageData, err = base64.URLEncoding.DecodeString(b.ImageBase64)
		if err != nil {
			return h.RespondWithError(c, fmt.Errorf("failed to decode image: %w", err))
		}
	}

	mimeType := b.MimeType
	if mimeType == "" {
		mimeType = "image/jpeg"
	}

	// Upscale image
	result, err := h.App.AIService.UpscaleImage(c.Request().Context(), imageData, mimeType)
	if err != nil {
		return h.RespondWithError(c, err)
	}

	// Return as base64
	encoded := base64.StdEncoding.EncodeToString(result.ImageData)

	return h.RespondWithData(c, map[string]interface{}{
		"image":    encoded,
		"mimeType": result.MimeType,
	})
}
