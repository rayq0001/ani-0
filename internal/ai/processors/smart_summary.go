package processors

import (
	"context"
	"fmt"
	"aniverse/internal/ai/gemini"
	"strings"
	"time"
)

// SmartSummary represents an AI-generated summary of previously read content
type SmartSummary struct {
	ID            string    `json:"id"`
	MediaID       int       `json:"mediaId"`
	MangaTitle    string    `json:"mangaTitle"`
	ChapterRange  string    `json:"chapterRange"`
	Summary       string    `json:"summary"`
	ArabicSummary string    `json:"arabicSummary"`
	KeyEvents     []string  `json:"keyEvents"`
	Characters    []string  `json:"characters"`
	LastReadAt    time.Time `json:"lastReadAt"`
	GeneratedAt   time.Time `json:"generatedAt"`
}

// SummaryRequest represents a request to generate a summary
type SummaryRequest struct {
	MediaID         int       `json:"mediaId"`
	MangaTitle      string    `json:"mangaTitle"`
	ChaptersRead    []int     `json:"chaptersRead"`
	LastChapter     int       `json:"lastChapter"`
	LastReadAt      time.Time `json:"lastReadAt"`
	Language        string    `json:"language"` // "en" or "ar"
	IncludeSpoilers bool      `json:"includeSpoilers"`
}

// SummaryGenerator handles AI-powered summary generation
type SummaryGenerator struct {
	geminiClient *gemini.Client
}

// NewSummaryGenerator creates a new summary generator
func NewSummaryGenerator(geminiClient *gemini.Client) *SummaryGenerator {
	return &SummaryGenerator{
		geminiClient: geminiClient,
	}
}

// Generate creates a smart summary for previously read chapters
func (sg *SummaryGenerator) Generate(ctx context.Context, req *SummaryRequest) (*SmartSummary, error) {
	if sg.geminiClient == nil {
		return nil, fmt.Errorf("gemini client not initialized")
	}

	// Build chapter range string
	chapterRange := formatChapterRange(req.ChaptersRead)

	// Create prompt based on language
	var prompt string
	if req.Language == "ar" {
		prompt = sg.buildArabicPrompt(req)
	} else {
		prompt = sg.buildEnglishPrompt(req)
	}

	// Generate summary using Gemini
	response, err := sg.geminiClient.GenerateText(ctx, prompt)
	if err != nil {
		return nil, fmt.Errorf("failed to generate summary: %w", err)
	}

	if len(response.Candidates) == 0 {
		return nil, fmt.Errorf("no response from AI")
	}

	// Parse the response
	summaryText := response.Candidates[0].Content.Parts[0].Text

	// Extract structured data
	summary := &SmartSummary{
		ID:           generateSummaryID(req.MediaID),
		MediaID:      req.MediaID,
		MangaTitle:   req.MangaTitle,
		ChapterRange: chapterRange,
		Summary:      summaryText,
		LastReadAt:   req.LastReadAt,
		GeneratedAt:  time.Now(),
	}

	// If Arabic, also generate English version
	if req.Language == "ar" {
		summary.ArabicSummary = summaryText
		englishPrompt := sg.buildEnglishPrompt(req)
		englishResponse, err := sg.geminiClient.GenerateText(ctx, englishPrompt)
		if err == nil && len(englishResponse.Candidates) > 0 {
			summary.Summary = englishResponse.Candidates[0].Content.Parts[0].Text
		}
	} else {
		// Generate Arabic version
		arabicPrompt := sg.buildArabicPrompt(req)
		arabicResponse, err := sg.geminiClient.GenerateText(ctx, arabicPrompt)
		if err == nil && len(arabicResponse.Candidates) > 0 {
			summary.ArabicSummary = arabicResponse.Candidates[0].Content.Parts[0].Text
		}
	}

	// Extract key events and characters
	summary.KeyEvents = sg.extractKeyEvents(summaryText)
	summary.Characters = sg.extractCharacters(summaryText)

	return summary, nil
}

// buildEnglishPrompt creates an English prompt for summary generation
func (sg *SummaryGenerator) buildEnglishPrompt(req *SummaryRequest) string {
	return fmt.Sprintf(`Create a compelling "Previously on..." summary for the manga "%s".

Chapters covered: %s
Last read: %s

Requirements:
1. Write in an engaging, dramatic narrative style like a TV show recap
2. Focus on major plot developments and character moments
3. Highlight emotional beats and cliffhangers
4. Keep it under 150 words
5. Make the reader excited to continue
6. Do NOT include spoilers beyond chapter %d

Format: Write as a continuous narrative paragraph that flows naturally.

Example tone: "When we last left our hero..."`,
		req.MangaTitle,
		formatChapterRange(req.ChaptersRead),
		formatTimeAgo(req.LastReadAt),
		req.LastChapter,
	)
}

// buildArabicPrompt creates an Arabic prompt for summary generation
func (sg *SummaryGenerator) buildArabicPrompt(req *SummaryRequest) string {
	return fmt.Sprintf(`اكتب ملخصاً درامياً م compelling للفصول السابقة من مانجا "%s".

الفصول المشمولة: %s
آخر قراءة: %s

المتطلبات:
1. اكتب بأسلوب سردي مشوق مثل ملخصات المسلسلات
2. ركز على التطورات الرئيسية في القصة وشخصياتها
3. أبرز اللحظات العاطفية والمشاهد المثيرة
4. اجعله أقل من 150 كلمة
5. اجعل القارئ متحمساً للاستمرار
6. لا تشمل حرقاً للأحداث بعد الفصل %d

التنسيق: اكتب فقرة سردية متصلة تتدفق بشكل طبيعي.

نبرة المثال: "عندما تركنا بطلنا آخر مرة..."`,
		req.MangaTitle,
		formatChapterRange(req.ChaptersRead),
		formatTimeAgoArabic(req.LastReadAt),
		req.LastChapter,
	)
}

// extractKeyEvents extracts key events from the summary
func (sg *SummaryGenerator) extractKeyEvents(summary string) []string {
	// Simple extraction based on sentence structure
	sentences := strings.Split(summary, ".")
	var events []string

	for _, sentence := range sentences {
		sentence = strings.TrimSpace(sentence)
		if len(sentence) > 20 && (strings.Contains(sentence, "fight") ||
			strings.Contains(sentence, "battle") ||
			strings.Contains(sentence, "discovered") ||
			strings.Contains(sentence, "revealed") ||
			strings.Contains(sentence, "attack") ||
			strings.Contains(sentence, "escape")) {
			events = append(events, sentence)
		}
	}

	return events
}

// extractCharacters extracts character names from the summary
func (sg *SummaryGenerator) extractCharacters(summary string) []string {
	// This is a simplified version - in production, use NER
	// For now, return empty and let the client handle it
	return []string{}
}

// Helper functions

func formatChapterRange(chapters []int) string {
	if len(chapters) == 0 {
		return "Unknown"
	}

	if len(chapters) == 1 {
		return fmt.Sprintf("Chapter %d", chapters[0])
	}

	// Find ranges
	var ranges []string
	start := chapters[0]
	prev := chapters[0]

	for i := 1; i < len(chapters); i++ {
		if chapters[i] != prev+1 {
			// End of range
			if start == prev {
				ranges = append(ranges, fmt.Sprintf("%d", start))
			} else {
				ranges = append(ranges, fmt.Sprintf("%d-%d", start, prev))
			}
			start = chapters[i]
		}
		prev = chapters[i]
	}

	// Add last range
	if start == prev {
		ranges = append(ranges, fmt.Sprintf("%d", start))
	} else {
		ranges = append(ranges, fmt.Sprintf("%d-%d", start, prev))
	}

	return "Chapters " + strings.Join(ranges, ", ")
}

func formatTimeAgo(t time.Time) string {
	duration := time.Since(t)

	if duration < time.Hour {
		return "just now"
	} else if duration < 24*time.Hour {
		hours := int(duration.Hours())
		if hours == 1 {
			return "1 hour ago"
		}
		return fmt.Sprintf("%d hours ago", hours)
	} else if duration < 7*24*time.Hour {
		days := int(duration.Hours() / 24)
		if days == 1 {
			return "yesterday"
		}
		return fmt.Sprintf("%d days ago", days)
	} else if duration < 30*24*time.Hour {
		weeks := int(duration.Hours() / 24 / 7)
		if weeks == 1 {
			return "last week"
		}
		return fmt.Sprintf("%d weeks ago", weeks)
	} else {
		return t.Format("Jan 2, 2006")
	}
}

func formatTimeAgoArabic(t time.Time) string {
	duration := time.Since(t)

	if duration < time.Hour {
		return "الآن"
	} else if duration < 24*time.Hour {
		hours := int(duration.Hours())
		if hours == 1 {
			return "منذ ساعة"
		}
		return fmt.Sprintf("منذ %d ساعات", hours)
	} else if duration < 7*24*time.Hour {
		days := int(duration.Hours() / 24)
		if days == 1 {
			return "الأمس"
		}
		return fmt.Sprintf("منذ %d أيام", days)
	} else if duration < 30*24*time.Hour {
		weeks := int(duration.Hours() / 24 / 7)
		if weeks == 1 {
			return "منذ أسبوع"
		}
		return fmt.Sprintf("منذ %d أسابيع", weeks)
	} else {
		return t.Format("2 يناير 2006")
	}
}

func generateSummaryID(mediaID int) string {
	return fmt.Sprintf("summary_%d_%d", mediaID, time.Now().Unix())
}
