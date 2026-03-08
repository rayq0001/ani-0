package providers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/rs/zerolog"
)

// ReplicateProvider handles image generation via Replicate API
// Supports Stable Diffusion, ControlNet, and other models
type ReplicateProvider struct {
	apiToken   string
	httpClient *http.Client
	logger     zerolog.Logger
	baseURL    string
}

// NewReplicateProvider creates a new Replicate provider
func NewReplicateProvider(apiToken string, logger zerolog.Logger) *ReplicateProvider {
	return &ReplicateProvider{
		apiToken: apiToken,
		logger:   logger,
		baseURL:  "https://api.replicate.com/v1",
		httpClient: &http.Client{
			Timeout: 300 * time.Second, // Long timeout for image generation
		},
	}
}

// ReplicateRequest represents a request to Replicate
type ReplicateRequest struct {
	Version string                 `json:"version"`
	Input   map[string]interface{} `json:"input"`
}

// ReplicateResponse represents a response from Replicate
type ReplicateResponse struct {
	ID          string     `json:"id"`
	Status      string     `json:"status"`
	Output      []string   `json:"output,omitempty"`
	Logs        string     `json:"logs,omitempty"`
	Error       string     `json:"error,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
	CompletedAt *time.Time `json:"completed_at,omitempty"`
}

// =============================================================================
// Stable Diffusion XL Generation
// =============================================================================

// GenerateSDXL generates an image using Stable Diffusion XL
func (r *ReplicateProvider) GenerateSDXL(ctx context.Context, prompt string, options *SDXLOptions) (*ReplicateResponse, error) {
	input := map[string]interface{}{
		"prompt":              prompt,
		"negative_prompt":     options.NegativePrompt,
		"width":               options.Width,
		"height":              options.Height,
		"num_outputs":         options.NumOutputs,
		"guidance_scale":      options.GuidanceScale,
		"num_inference_steps": options.Steps,
	}

	if options.Seed > 0 {
		input["seed"] = options.Seed
	}

	return r.createPrediction(ctx, "stability-ai/stable-diffusion-xl-base-1.0", input)
}

// SDXLOptions for Stable Diffusion XL
type SDXLOptions struct {
	NegativePrompt string
	Width          int
	Height         int
	NumOutputs     int
	GuidanceScale  float64
	Steps          int
	Seed           int64
}

// =============================================================================
// ControlNet Generation
// =============================================================================

// GenerateControlNet generates an image using ControlNet
// This maintains the original manga structure while applying effects
func (r *ReplicateProvider) GenerateControlNet(ctx context.Context, prompt string, controlImage string, model string, options *ControlNetOptions) (*ReplicateResponse, error) {
	input := map[string]interface{}{
		"prompt":              prompt,
		"image":               controlImage, // Base64 encoded
		"controlnet_model":    model,
		"controlnet_scale":    options.ControlNetScale,
		"guess_mode":          options.GuessMode,
		"negative_prompt":     options.NegativePrompt,
		"width":               options.Width,
		"height":              options.Height,
		"num_outputs":         options.NumOutputs,
		"guidance_scale":      options.GuidanceScale,
		"num_inference_steps": options.Steps,
	}

	// Model mapping
	modelMap := map[string]string{
		"canny":    "lllyasviel/control_v11p_sd15_canny",
		"depth":    "lllyasviel/control_v11f1e_sd21_tile_diffusion",
		"pose":     "lllyasviel/control_v11p_sd15_openpose",
		"scribble": "lllyasviel/control_v11p_sd15_scribble",
		"seg":      "lllyasviel/control_v11p_sd15_seg",
	}

	if mappedModel, ok := modelMap[model]; ok {
		input["controlnet_model"] = mappedModel
	}

	return r.createPrediction(ctx, "multimodalart/controlnet", input)
}

// ControlNetOptions for ControlNet generation
type ControlNetOptions struct {
	ControlNetScale float64
	GuessMode       bool
	NegativePrompt  string
	Width           int
	Height          int
	NumOutputs      int
	GuidanceScale   float64
	Steps           int
}

// =============================================================================
// Image-to-Image (Colorization)
// =============================================================================

// ColorizeManga colorizes a black and white manga page
func (r *ReplicateProvider) ColorizeManga(ctx context.Context, prompt string, imageBase64 string, options *Img2ImgOptions) (*ReplicateResponse, error) {
	input := map[string]interface{}{
		"prompt":              prompt,
		"image":               imageBase64,
		"prompt_strength":     0.8,
		"negative_prompt":     options.NegativePrompt,
		"width":               options.Width,
		"height":              options.Height,
		"num_outputs":         options.NumOutputs,
		"guidance_scale":      options.GuidanceScale,
		"num_inference_steps": options.Steps,
		"denoising_strength":  options.DenoisingStrength,
	}

	return r.createPrediction(ctx, "stability-ai/stable-diffusion-xl-base-1.0", input)
}

// Img2ImgOptions for image-to-image generation
type Img2ImgOptions struct {
	NegativePrompt    string
	Width             int
	Height            int
	NumOutputs        int
	GuidanceScale     float64
	Steps             int
	DenoisingStrength float64
}

// =============================================================================
// Upscaling (RealESRGAN)
// =============================================================================

// UpscaleImage upscales an image using RealESRGAN
func (r *ReplicateProvider) UpscaleImage(ctx context.Context, imageBase64 string, scale int) (*ReplicateResponse, error) {
	input := map[string]interface{}{
		"image": imageBase64,
		"scale": scale,
	}

	return r.createPrediction(ctx, "nightmareai/real-esgan", input)
}

// =============================================================================
// Internal Helpers
// =============================================================================

// createPrediction creates a new prediction on Replicate
func (r *ReplicateProvider) createPrediction(ctx context.Context, model string, input map[string]interface{}) (*ReplicateResponse, error) {
	reqBody, err := json.Marshal(ReplicateRequest{
		Version: model,
		Input:   input,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", r.baseURL+"/predictions", bytes.NewReader(reqBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Token "+r.apiToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := r.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API returned status %d: %s", resp.StatusCode, string(body))
	}

	var result ReplicateResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	return &result, nil
}

// GetPrediction gets the status of a prediction
func (r *ReplicateProvider) GetPrediction(ctx context.Context, predictionID string) (*ReplicateResponse, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", r.baseURL+"/predictions/"+predictionID, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Token "+r.apiToken)

	resp, err := r.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	var result ReplicateResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	return &result, nil
}

// WaitForCompletion waits for a prediction to complete
func (r *ReplicateProvider) WaitForCompletion(ctx context.Context, predictionID string, pollInterval time.Duration) (*ReplicateResponse, error) {
	ticker := time.NewTicker(pollInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		case <-ticker.C:
			pred, err := r.GetPrediction(ctx, predictionID)
			if err != nil {
				return nil, err
			}

			switch pred.Status {
			case "succeeded":
				return pred, nil
			case "failed":
				return pred, fmt.Errorf("prediction failed: %s", pred.Error)
			case "canceled":
				return pred, fmt.Errorf("prediction was canceled")
			default:
				r.logger.Debug().Str("status", pred.Status).Msg("Waiting for prediction...")
			}
		}
	}
}
