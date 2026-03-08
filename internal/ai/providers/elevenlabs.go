package providers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/rs/zerolog"
)

// ElevenLabsProvider implements TTSClient for ElevenLabs API
type ElevenLabsProvider struct {
	apiKey string
	logger zerolog.Logger
	client *http.Client
}

// NewElevenLabsProvider creates a new ElevenLabs provider
func NewElevenLabsProvider(apiKey string, logger zerolog.Logger) *ElevenLabsProvider {
	return &ElevenLabsProvider{
		apiKey: apiKey,
		logger: logger,
		client: &http.Client{
			Timeout: 60 * time.Second,
		},
	}
}

// Voice represents an ElevenLabs voice
type Voice struct {
	VoiceID    string            `json:"voice_id"`
	Name       string            `json:"name"`
	Category   string            `json:"category"`
	Labels     map[string]string `json:"labels"`
	PreviewURL string            `json:"preview_url"`
}

// Generate creates text-to-speech audio
func (e *ElevenLabsProvider) Generate(ctx context.Context, text string, voiceID string, options interface{}) ([]byte, error) {
	e.logger.Info().Str("voice", voiceID).Int("textLength", len(text)).Msg("elevenlabs: Generating TTS")

	url := fmt.Sprintf("https://api.elevenlabs.io/v1/text-to-speech/%s", voiceID)

	payload := map[string]interface{}{
		"text":     text,
		"model_id": "eleven_multilingual_v2",
		"voice_settings": map[string]interface{}{
			"stability":         0.5,
			"similarity_boost":  0.75,
			"style":             0.0,
			"use_speaker_boost": true,
		},
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("xi-api-key", e.apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "audio/mpeg")

	resp, err := e.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("elevenlabs API error %d: %s", resp.StatusCode, string(body))
	}

	return io.ReadAll(resp.Body)
}

// ListVoices returns available voices
func (e *ElevenLabsProvider) ListVoices(ctx context.Context) ([]Voice, error) {
	e.logger.Info().Msg("elevenlabs: Listing voices")

	url := "https://api.elevenlabs.io/v1/voices"

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("xi-api-key", e.apiKey)

	resp, err := e.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("elevenlabs API error %d: %s", resp.StatusCode, string(body))
	}

	var result struct {
		Voices []Voice `json:"voices"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return result.Voices, nil
}

// CloneVoice clones a voice from audio samples
func (e *ElevenLabsProvider) CloneVoice(ctx context.Context, name string, description string, audioFiles [][]byte) (string, error) {
	e.logger.Info().Str("name", name).Msg("elevenlabs: Cloning voice")

	url := "https://api.elevenlabs.io/v1/voices/add"

	// Build multipart form
	var body bytes.Buffer
	writer := multipart.NewWriter(&body)

	// Add name
	_ = writer.WriteField("name", name)

	// Add description
	_ = writer.WriteField("description", description)

	// Add audio files
	for i, audio := range audioFiles {
		part, _ := writer.CreateFormFile("files", fmt.Sprintf("sample_%d.mp3", i))
		part.Write(audio)
	}

	writer.Close()

	req, err := http.NewRequestWithContext(ctx, "POST", url, &body)
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("xi-api-key", e.apiKey)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, err := e.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("elevenlabs API error %d: %s", resp.StatusCode, string(body))
	}

	var result struct {
		VoiceID string `json:"voice_id"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	return result.VoiceID, nil
}
