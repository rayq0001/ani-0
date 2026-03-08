package processors

import (
	"context"
	"fmt"
)

// CultureEngine handles cultural localization and dialect transformation
type CultureEngine struct {
	geminiProvider *GeminiProvider
	logger         Logger
}

// Supported dialects
type Dialect string

const (
	DialectEgyptian  Dialect = "egyptian"  // المصري
	DialectGulf      Dialect = "gulf"      // الخليجي
	DialectLevantine Dialect = "levantine" // الشامي
	DialectIraqi     Dialect = "iraqi"     // العراقي
	DialectSaudi     Dialect = "saudi"     // السعودي
	DialectEmirati   Dialect = "emirati"   // الإماراتي
	DialectStandard  Dialect = "standard"  // العربية الفصحى
	DialectManga     Dialect = "manga"     // أسلوب المانجا
)

// DialectInfo contains dialect-specific transformation rules
type DialectInfo struct {
	Name           string
	Examples       map[string]string // original -> localized
	Honorifics     []string
	Expressions    []string
	MoodIndicators map[string]string
}

// CulturalTerm represents a culturally adapted term
type CulturalTerm struct {
	Original  string  `json:"original"`
	Localized string  `json:"localized"`
	Dialect   Dialect `json:"dialect"`
	Context   string  `json:"context"`
	Notes     string  `json:"notes"`
}

// LocalizationRequest represents a localization request
type LocalizationRequest struct {
	Text          string
	SourceLang    string
	TargetDialect Dialect
	Context       string   // "formal", "casual", "comedy", "action", "romance"
	PreserveTerms []string // Terms to keep in original form
}

// LocalizationResult represents the result of localization
type LocalizationResult struct {
	OriginalText    string         `json:"originalText"`
	LocalizedText   string         `json:"localizedText"`
	Dialect         Dialect        `json:"dialect"`
	Terms           []CulturalTerm `json:"terms"`
	ContextUsed     string         `json:"contextUsed"`
	ConfidenceScore float64        `json:"confidenceScore"`
}

// NewCultureEngine creates a new culture engine
func NewCultureEngine(geminiProvider *GeminiProvider) *CultureEngine {
	return &CultureEngine{
		geminiProvider: geminiProvider,
	}
}

// DialectDatabase contains transformation rules for all dialects
var DialectDatabase = map[Dialect]DialectInfo{
	DialectEgyptian: {
		Name: "المصري",
		Examples: map[string]string{
			"أهلا":    "أهلا",
			"من فضلك": "لو سمحت",
			"شكرا":    "شكرا",
			"ممتاز":   "حلو قوي",
			"أنتظر":   "هر وقفة",
			"أفهم":    "أاخد بالي",
			"مثير":    "ممتع",
			"مغادرة":  "خروج",
		},
		Honorifics:  []string{"يا باشا", "يا أفندم", "يا عم"},
		Expressions: []string{"باللهجة", "يا سيدي", "يا مدام"},
		MoodIndicators: map[string]string{
			"happy":   "الحمد لله",
			"excited": "والله العظيم",
			"sad":     "ياك",
		},
	},
	DialectGulf: {
		Name: "الخليجي",
		Examples: map[string]string{
			"أهلا":    "هلا",
			"من فضلك": "إذا ما عليك أمر",
			"شكرا":    "تسلم",
			"ممتاز":   "عندك حق",
			"أنتظر":   "أستنى",
			"أفهم":    "فاهم",
			"مثير":    "روعه",
			"مغادرة":  "أذ/",
		},
		Honorifics:  []string{"يا بو", "يا عمي", "يا خوي"},
		Expressions: []string{"الله يسعدك", "ما شاء الله", "حياك"},
		MoodIndicators: map[string]string{
			"happy":   "الله يسعدك",
			"excited": "والله",
			"sad":     "ما قصرت",
		},
	},
	DialectSaudi: {
		Name: "السعودي",
		Examples: map[string]string{
			"أهلا":    "أهلاً",
			"من فضلك": "إذا ما عليك كلافة",
			"شكرا":    "الله يسعدك",
			"ممتاز":   "خطه",
			"أنتظر":   "إنتظر",
			"أفهم":    "ألفهم",
			"مثير":    "رهيب",
			"مغادرة":  "برا",
		},
		Honorifics:  []string{"يا بو", "يا شيخ", "يا فلان"},
		Expressions: []string{"الله يسعدك", "ما شاء الله", "حبيب قلبي"},
		MoodIndicators: map[string]string{
			"happy":   "الله يسعدك",
			"excited": "والله",
			"sad":     "الله معك",
		},
	},
	DialectManga: {
		Name: "أسلوب المانجا",
		Examples: map[string]string{
			"أهلا":    "أو!",
			"من فضلك": "أعتذر...",
			"شكرا":    "شكراً جزيلاً!",
			"ممتاز":   "مذهل!",
			"أنتظر":   "انتظر!",
			"أفهم":    "أفهم!",
			"مثير":    "مثير للاهتمام!",
			"مغادرة":  "سأغادر...",
		},
		Honorifics:  []string{"-سان", "-ساما", "-نيزوق", "-أوني"},
		Expressions: []string{"نا!?", "اوه!", "هاي!", "إيكو!"},
		MoodIndicators: map[string]string{
			"happy":   "يو!",
			"excited": "ووو!",
			"sad":     "نا...",
		},
	},
}

// Localize transforms text to target dialect while preserving meaning
func (e *CultureEngine) Localize(ctx context.Context, req *LocalizationRequest) (*LocalizationResult, error) {
	// Get dialect-specific rules
	dialectInfo, exists := DialectDatabase[req.TargetDialect]
	if !exists {
		return nil, fmt.Errorf("unsupported dialect: %s", req.TargetDialect)
	}

	// Build the prompt for Gemini
	prompt := e.buildLocalizationPrompt(req, dialectInfo)

	// Call Gemini for intelligent localization
	translatedText, err := e.geminiProvider.LocalizeText(ctx, prompt, req.Text)
	if err != nil {
		// Fallback to rule-based localization
		translatedText = e.ruleBasedLocalize(req.Text, dialectInfo)
	}

	// Extract and adapt terms
	terms := e.extractTerms(req.Text, translatedText, req.TargetDialect)

	return &LocalizationResult{
		OriginalText:    req.Text,
		LocalizedText:   translatedText,
		Dialect:         req.TargetDialect,
		Terms:           terms,
		ContextUsed:     req.Context,
		ConfidenceScore: 0.85,
	}, nil
}

// buildLocalizationPrompt builds a prompt for Gemini
func (e *CultureEngine) buildLocalizationPrompt(req *LocalizationRequest, dialectInfo DialectInfo) string {
	contextInstructions := map[string]string{
		"formal":  "Use formal, respectful language appropriate for classic literature",
		"casual":  "Use casual, everyday language that feels natural",
		"comedy":  "Use humorous expressions, exaggerations, and comedic timing",
		"action":  "Use intense, dramatic language with impact",
		"romance": "Use emotional, poetic language with feelings",
	}

	context := contextInstructions[req.Context]
	if context == "" {
		context = "Use natural, conversational language"
	}

	return fmt.Sprintf(`
You are a cultural localization expert specializing in Arabic dialects and anime/manga localization.

Task: Transform the following text to %s dialect (%s)

Context: %s

Guidelines:
1. Transform the text to match the target dialect naturally
2. Keep honorifics and titles appropriate for the dialect
3. Use expressions common in %s
4. Maintain the original tone and emotion
5. Adapt cultural references to be relatable
6. Use appropriate punctuation for the dialect

Examples for reference:
%s

Original Text: %s

Provide the localized text only, without explanations.
`,
		req.TargetDialect,
		dialectInfo.Name,
		context,
		dialectInfo.Name,
		e.formatExamples(dialectInfo.Examples),
		req.Text,
	)
}

// ruleBasedLocalize provides fallback localization using rules
func (e *CultureEngine) ruleBasedLocalize(text string, dialectInfo DialectInfo) string {
	result := text

	for original, localized := range dialectInfo.Examples {
		// Simple word replacement
		result = replaceWord(result, original, localized)
	}

	return result
}

// extractTerms extracts culturally adapted terms
func (e *CultureEngine) extractTerms(original, localized string, dialect Dialect) []CulturalTerm {
	var terms []CulturalTerm

	// Simple extraction - in production would use NLP
	dialectInfo := DialectDatabase[dialect]

	for original, localized := range dialectInfo.Examples {
		if containsWord(localized, original) == false {
			terms = append(terms, CulturalTerm{
				Original:  original,
				Localized: localized,
				Dialect:   dialect,
				Context:   "general",
			})
		}
	}

	return terms
}

// formatExamples formats examples for the prompt
func (e *CultureEngine) formatExamples(examples map[string]string) string {
	result := ""
	for original, localized := range examples {
		result += fmt.Sprintf("- '%s' -> '%s'\n", original, localized)
	}
	return result
}

// Helper functions
func replaceWord(text, original, replacement string) string {
	// Simple replacement - in production would use proper tokenization
	result := text
	for i := 0; i < len(result); i++ {
		if i+len(original) <= len(result) && result[i:i+len(original)] == original {
			result = result[:i] + replacement + result[i+len(original):]
		}
	}
	return result
}

func containsWord(text, word string) bool {
	for i := 0; i < len(text); i++ {
		if i+len(word) <= len(text) && text[i:i+len(word)] == word {
			return true
		}
	}
	return false
}

// Logger interface (simplified)
type Logger interface {
	Error() *Entry
	Warn() *Entry
	Info() *Entry
	Debug() *Entry
}

type Entry struct{}

func (e *Entry) Msg(_ string)    {}
func (e *Entry) Err(_ error)     {}
func (e *Entry) Str(_, _ string) {}
func (e *Entry) Int(_, _ int)    {}

// GeminiProvider interface (simplified)
type GeminiProvider struct{}

func (g *GeminiProvider) LocalizeText(ctx context.Context, prompt, text string) (string, error) {
	// Would call actual Gemini API
	return text, nil
}
