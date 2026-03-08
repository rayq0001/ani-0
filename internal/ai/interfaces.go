package ai

import (
	"context"
)

// ImageGenerator defines the interface for image generation services
type ImageGenerator interface {
	Generate(ctx context.Context, prompt string, options *ImageOptions) (*ImageResponse, error)
	Upscale(ctx context.Context, imageData []byte, scale int) (*ImageResponse, error)
	ControlNet(ctx context.Context, prompt string, controlImage []byte, model string) (*ImageResponse, error)
}

// ImageOptions holds options for image generation
type ImageOptions struct {
	Width           int     `json:"width"`
	Height          int     `json:"height"`
	NumImages       int     `json:"numImages"`
	Seed            int64   `json:"seed"`
	PromptStrength  float64 `json:"promptStrength"`
	ControlNetModel string  `json:"controlNetModel"`
}

// ImageResponse holds the response from image generation
type ImageResponse struct {
	ImageData []byte `json:"imageData"`
	MimeType  string `json:"mimeType"`
	Seed      int64  `json:"seed"`
}

// VideoGenerator defines the interface for video generation services
type VideoGenerator interface {
	Generate(ctx context.Context, prompt string, options *VideoOptions) (*VideoResponse, error)
	GenerateFromImage(ctx context.Context, imageData []byte, prompt string, options *VideoOptions) (*VideoResponse, error)
}

// VideoOptions holds options for video generation
type VideoOptions struct {
	Duration int    `json:"duration"`
	FPS      int    `json:"fps"`
	Model    string `json:"model"`
}

// VideoResponse holds the response from video generation
type VideoResponse struct {
	VideoData []byte `json:"videoData"`
	MimeType  string `json:"mimeType"`
	Duration  int    `json:"duration"`
}

// MusicGenerator defines the interface for music generation services
type MusicGenerator interface {
	Generate(ctx context.Context, prompt string, duration int, style string) (*MusicResponse, error)
	GenerateFromSentiment(ctx context.Context, sentiment string, keywords []string, duration int) (*MusicResponse, error)
}

// MusicResponse holds the response from music generation
type MusicResponse struct {
	AudioData    []byte `json:"audioData"`
	WaveformData []byte `json:"waveformData"`
	Duration     int    `json:"duration"`
	BPM          int    `json:"bpm"`
	Key          string `json:"key"`
	Mood         string `json:"mood"`
}

// TTSClient defines the interface for text-to-speech services
type TTSClient interface {
	Generate(ctx context.Context, text string, voiceID string, options *TTSOptions) (*TTSResponse, error)
	ListVoices(ctx context.Context) ([]Voice, error)
	CloneVoice(ctx context.Context, audioSample []byte, name string) (string, error)
}

// TTSOptions holds options for TTS generation
type TTSOptions struct {
	Stability       float64 `json:"stability"`
	SimilarityBoost float64 `json:"similarityBoost"`
	Style           float64 `json:"style"`
	Speed           float64 `json:"speed"`
}

// TTSResponse holds the response from TTS generation
type TTSResponse struct {
	AudioData []byte `json:"audioData"`
	MimeType  string `json:"mimeType"`
	Duration  int    `json:"duration"`
}

// Voice represents a TTS voice
type Voice struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Language   string `json:"language"`
	Gender     string `json:"gender"`
	PreviewURL string `json:"previewUrl"`
}

// EmotionDetector defines the interface for emotion detection services
type EmotionDetector interface {
	DetectFromText(ctx context.Context, text string) (*EmotionResult, error)
	DetectFromImage(ctx context.Context, imageData []byte) (*EmotionResult, error)
	DetectFromAudio(ctx context.Context, audioData []byte) (*EmotionResult, error)
}

// EmotionResult holds the result of emotion detection
type EmotionResult struct {
	Emotion    string             `json:"emotion"`
	Confidence float64            `json:"confidence"`
	Emotions   map[string]float64 `json:"emotions"`
	Sentiment  string             `json:"sentiment"`
	Keywords   []string           `json:"keywords"`
}
