package processors

import (
	"context"
	"fmt"
	"math"
	"aniverse/internal/ai/gemini"
	"sort"
)

// StoryDNA represents the genetic makeup of a story
type StoryDNA struct {
	// Core Elements (0-100 scale)
	HeroArchetype int `json:"heroArchetype"` // 0=Underdog, 50=Anti-hero, 100=Chosen One
	WorldSetting  int `json:"worldSetting"`  // 0=Real World, 50=Urban Fantasy, 100=Otherworld
	PowerSystem   int `json:"powerSystem"`   // 0=None, 50=Magic, 100=Technology
	ConflictType  int `json:"conflictType"`  // 0=Internal, 50=Personal, 100=Cosmic
	RomanceLevel  int `json:"romanceLevel"`  // 0=None, 50=Subplot, 100=Central
	ComedyLevel   int `json:"comedyLevel"`   // 0=Serious, 50=Balanced, 100=Comedy
	DarknessLevel int `json:"darknessLevel"` // 0=Light, 50=Mature, 100=Grimdark
	MysteryLevel  int `json:"mysteryLevel"`  // 0=Straightforward, 50=Twists, 100=Complex

	// Emotional Signature
	Emotions []EmotionTag `json:"emotions"`

	// Story Genes (specific tropes/elements)
	Genes []string `json:"genes"`
}

type EmotionTag struct {
	Type      string  `json:"type"`      // excitement, sadness, anger, fear, joy, surprise
	Intensity float64 `json:"intensity"` // 0.0 to 1.0
}

// StarNode represents a work in the cosmic space
type StarNode struct {
	ID              string                 `json:"id"`
	MediaID         int                    `json:"mediaId"`
	Title           string                 `json:"title"`
	Type            string                 `json:"type"` // manga, manhwa, manhua, anime, novel
	CoverImage      string                 `json:"coverImage"`
	DNA             StoryDNA               `json:"dna"`
	Coordinates     SpaceCoordinates       `json:"coordinates"` // X, Y, Z in 3D space
	Connections     []string               `json:"connections"` // IDs of connected works
	Dimensions      []DimensionLink        `json:"dimensions"`  // Cross-dimension links
	SimilarityScore float64                `json:"similarityScore"`
	Year            int                    `json:"year"`
	Genres          []string               `json:"genres"`
	Metadata        map[string]interface{} `json:"metadata"`
}

type SpaceCoordinates struct {
	X float64 `json:"x"` // Hero Archetype axis
	Y float64 `json:"y"` // World Setting axis
	Z float64 `json:"z"` // Emotional intensity
}

type DimensionLink struct {
	Type     string `json:"type"` // novel, anime, game, drama
	MediaID  int    `json:"mediaId"`
	Title    string `json:"title"`
	Chapter  int    `json:"chapter"`  // Corresponding chapter
	Relation string `json:"relation"` // adaptation, spinoff, prequel
	Year     int    `json:"year"`
}

// CosmicSearchRequest represents a search in unlimited space
type CosmicSearchRequest struct {
	Query          string       `json:"query"`
	DNAFilters     StoryDNA     `json:"dnaFilters"`
	EmotionalState []EmotionTag `json:"emotionalState"`
	YearRange      struct {
		From int `json:"from"`
		To   int `json:"to"`
	} `json:"yearRange"`
	IncludeDimensions []string `json:"includeDimensions"` // novel, anime, game
	ExcludeGenres     []string `json:"excludeGenres"`
	MinSimilarity     float64  `json:"minSimilarity"` // 0.0 to 1.0
	MaxResults        int      `json:"maxResults"`
}

// CosmicSearchEngine handles vector-based cosmic search
type CosmicSearchEngine struct {
	geminiClient *gemini.Client
	// In production, this would connect to Pinecone/Weaviate
	vectorStore map[string]*StarNode // Mock storage for now
}

func NewCosmicSearchEngine(client *gemini.Client) *CosmicSearchEngine {
	return &CosmicSearchEngine{
		geminiClient: client,
		vectorStore:  make(map[string]*StarNode),
	}
}

// Search performs a cosmic search based on DNA and emotional filters
func (cse *CosmicSearchEngine) Search(ctx context.Context, req *CosmicSearchRequest) ([]*StarNode, error) {
	// 1. Generate embedding from query + DNA filters
	queryVector, err := cse.generateQueryVector(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to generate query vector: %w", err)
	}

	// 2. Search vector store (mock implementation)
	candidates := cse.searchVectorStore(queryVector, req)

	// 3. Calculate similarity scores
	for _, node := range candidates {
		node.SimilarityScore = cse.calculateDNASimilarity(req.DNAFilters, node.DNA)
	}

	// 4. Sort by similarity
	sort.Slice(candidates, func(i, j int) bool {
		return candidates[i].SimilarityScore > candidates[j].SimilarityScore
	})

	// 5. Limit results
	if req.MaxResults > 0 && len(candidates) > req.MaxResults {
		candidates = candidates[:req.MaxResults]
	}

	// 6. Assign 3D coordinates for visualization
	cse.assignSpaceCoordinates(candidates)

	return candidates, nil
}

// generateQueryVector creates an embedding from the search request
func (cse *CosmicSearchEngine) generateQueryVector(ctx context.Context, req *CosmicSearchRequest) ([]float64, error) {
	// In production, this would use Gemini to generate embeddings
	// For now, create a mock vector based on DNA filters

	vector := make([]float64, 10)
	vector[0] = float64(req.DNAFilters.HeroArchetype) / 100.0
	vector[1] = float64(req.DNAFilters.WorldSetting) / 100.0
	vector[2] = float64(req.DNAFilters.PowerSystem) / 100.0
	vector[3] = float64(req.DNAFilters.ConflictType) / 100.0
	vector[4] = float64(req.DNAFilters.RomanceLevel) / 100.0
	vector[5] = float64(req.DNAFilters.ComedyLevel) / 100.0
	vector[6] = float64(req.DNAFilters.DarknessLevel) / 100.0
	vector[7] = float64(req.DNAFilters.MysteryLevel) / 100.0

	// Add emotional intensity
	if len(req.EmotionalState) > 0 {
		vector[8] = req.EmotionalState[0].Intensity
	}

	return vector, nil
}

// searchVectorStore searches the mock vector store
func (cse *CosmicSearchEngine) searchVectorStore(queryVector []float64, req *CosmicSearchRequest) []*StarNode {
	var results []*StarNode

	for _, node := range cse.vectorStore {
		// Filter by year range
		if req.YearRange.From > 0 && node.Year < req.YearRange.From {
			continue
		}
		if req.YearRange.To > 0 && node.Year > req.YearRange.To {
			continue
		}

		// Filter by excluded genres
		if hasAnyGenre(node.Genres, req.ExcludeGenres) {
			continue
		}

		// Filter by dimensions
		if len(req.IncludeDimensions) > 0 {
			hasDimension := false
			for _, dim := range node.Dimensions {
				for _, wanted := range req.IncludeDimensions {
					if dim.Type == wanted {
						hasDimension = true
						break
					}
				}
			}
			if !hasDimension {
				continue
			}
		}

		results = append(results, node)
	}

	return results
}

// calculateDNASimilarity calculates similarity between two DNA profiles
func (cse *CosmicSearchEngine) calculateDNASimilarity(filter, target StoryDNA) float64 {
	differences := 0.0

	// Calculate weighted differences
	weights := map[string]float64{
		"heroArchetype": 1.2,
		"worldSetting":  1.0,
		"powerSystem":   1.1,
		"conflictType":  0.9,
		"romanceLevel":  0.8,
		"comedyLevel":   0.7,
		"darknessLevel": 1.0,
		"mysteryLevel":  0.9,
	}

	differences += weights["heroArchetype"] * math.Abs(float64(filter.HeroArchetype-target.HeroArchetype))
	differences += weights["worldSetting"] * math.Abs(float64(filter.WorldSetting-target.WorldSetting))
	differences += weights["powerSystem"] * math.Abs(float64(filter.PowerSystem-target.PowerSystem))
	differences += weights["conflictType"] * math.Abs(float64(filter.ConflictType-target.ConflictType))
	differences += weights["romanceLevel"] * math.Abs(float64(filter.RomanceLevel-target.RomanceLevel))
	differences += weights["comedyLevel"] * math.Abs(float64(filter.ComedyLevel-target.ComedyLevel))
	differences += weights["darknessLevel"] * math.Abs(float64(filter.DarknessLevel-target.DarknessLevel))
	differences += weights["mysteryLevel"] * math.Abs(float64(filter.MysteryLevel-target.MysteryLevel))

	// Normalize to 0-1 similarity score
	maxDiff := 100.0 * 8.0 // 8 attributes, max 100 difference each
	similarity := 1.0 - (differences / maxDiff)

	return math.Max(0, math.Min(1, similarity))
}

// assignSpaceCoordinates assigns 3D coordinates for visualization
func (cse *CosmicSearchEngine) assignSpaceCoordinates(nodes []*StarNode) {
	for i, node := range nodes {
		// Create a spiral galaxy distribution
		angle := float64(i) * 0.5
		radius := float64(i) * 0.3

		node.Coordinates = SpaceCoordinates{
			X: radius*math.Cos(angle) + float64(node.DNA.HeroArchetype-50)/10,
			Y: radius*math.Sin(angle) + float64(node.DNA.WorldSetting-50)/10,
			Z: float64(node.DNA.DarknessLevel-50)/10 + node.SimilarityScore*5,
		}
	}
}

// FindSimilarGalaxies finds clusters of similar works
func (cse *CosmicSearchEngine) FindSimilarGalaxies(ctx context.Context, mediaID int) ([]*StarNode, error) {
	// Find the source node
	var source *StarNode
	for _, node := range cse.vectorStore {
		if node.MediaID == mediaID {
			source = node
			break
		}
	}

	if source == nil {
		return nil, fmt.Errorf("media not found: %d", mediaID)
	}

	// Find similar nodes
	var similar []*StarNode
	for _, node := range cse.vectorStore {
		if node.MediaID == mediaID {
			continue
		}

		similarity := cse.calculateDNASimilarity(source.DNA, node.DNA)
		if similarity > 0.7 { // 70% similarity threshold
			node.SimilarityScore = similarity
			similar = append(similar, node)
		}
	}

	// Sort by similarity
	sort.Slice(similar, func(i, j int) bool {
		return similar[i].SimilarityScore > similar[j].SimilarityScore
	})

	return similar, nil
}

// GetTimeline returns works in chronological order with connections
func (cse *CosmicSearchEngine) GetTimeline(ctx context.Context, mediaID int) ([]*StarNode, error) {
	// Find all dimensions of the work
	var timeline []*StarNode

	for _, node := range cse.vectorStore {
		if node.MediaID == mediaID || cse.isConnected(node, mediaID) {
			timeline = append(timeline, node)
		}
	}

	// Sort by year
	sort.Slice(timeline, func(i, j int) bool {
		return timeline[i].Year < timeline[j].Year
	})

	return timeline, nil
}

// VisualSearch searches by image similarity
func (cse *CosmicSearchEngine) VisualSearch(ctx context.Context, imageData []byte) ([]*StarNode, error) {
	// In production, this would use image embeddings
	// For now, return mock results
	return []*StarNode{}, nil
}

// Helper functions
func hasAnyGenre(genres, exclude []string) bool {
	for _, g := range genres {
		for _, e := range exclude {
			if g == e {
				return true
			}
		}
	}
	return false
}

func (cse *CosmicSearchEngine) isConnected(node *StarNode, mediaID int) bool {
	for _, dim := range node.Dimensions {
		if dim.MediaID == mediaID {
			return true
		}
	}
	return false
}

// InitializeMockData populates the vector store with sample data
func (cse *CosmicSearchEngine) InitializeMockData() {
	// Solo Leveling universe
	cse.vectorStore["solo-leveling-manhwa"] = &StarNode{
		ID:      "solo-leveling-manhwa",
		MediaID: 1,
		Title:   "Solo Leveling",
		Type:    "manhwa",
		Year:    2018,
		Genres:  []string{"action", "fantasy", "supernatural"},
		DNA: StoryDNA{
			HeroArchetype: 80, // Chosen One
			WorldSetting:  70, // Urban Fantasy
			PowerSystem:   60, // System/Game-like
			ConflictType:  70, // Personal to Cosmic
			RomanceLevel:  20, // Minimal
			ComedyLevel:   30, // Some humor
			DarknessLevel: 60, // Mature
			MysteryLevel:  50, // Some twists
			Emotions: []EmotionTag{
				{Type: "excitement", Intensity: 0.9},
				{Type: "fear", Intensity: 0.4},
			},
			Genes: []string{"system", "leveling", "shadow-monarch", "dungeons"},
		},
		Dimensions: []DimensionLink{
			{Type: "novel", MediaID: 101, Title: "Solo Leveling Novel", Chapter: 1, Relation: "adaptation", Year: 2016},
			{Type: "anime", MediaID: 102, Title: "Solo Leveling Anime", Chapter: 1, Relation: "adaptation", Year: 2024},
		},
	}

	// Add more mock data...
	cse.vectorStore["tower-of-god-manhwa"] = &StarNode{
		ID:      "tower-of-god-manhwa",
		MediaID: 2,
		Title:   "Tower of God",
		Type:    "manhwa",
		Year:    2010,
		Genres:  []string{"action", "fantasy", "mystery"},
		DNA: StoryDNA{
			HeroArchetype: 40, // Underdog
			WorldSetting:  90, // Otherworld (Tower)
			PowerSystem:   50, // Shinsu/Magic
			ConflictType:  60, // Personal
			RomanceLevel:  40, // Subplot
			ComedyLevel:   40, // Balanced
			DarknessLevel: 50, // Mature
			MysteryLevel:  80, // Very complex
			Emotions: []EmotionTag{
				{Type: "mystery", Intensity: 0.9},
				{Type: "excitement", Intensity: 0.8},
			},
			Genes: []string{"tower", "climbing", "betrayal", "regulars"},
		},
		Dimensions: []DimensionLink{
			{Type: "anime", MediaID: 201, Title: "Tower of God Anime", Chapter: 1, Relation: "adaptation", Year: 2020},
		},
	}
}

// GetGalaxyClusters groups works into similarity clusters
func (cse *CosmicSearchEngine) GetGalaxyClusters(ctx context.Context) (map[string][]*StarNode, error) {
	clusters := make(map[string][]*StarNode)

	// Define galaxy types
	galaxyTypes := []string{
		"مجرة الاستدعاء",          // Summoning Galaxy
		"مجرة أبطال الظل",         // Shadow Heroes Galaxy
		"مجرة العودة بالزمن",      // Time Regression Galaxy
		"مجرة النجاة",             // Survival Galaxy
		"مجرة الرومانسية الخارقة", // Supernatural Romance Galaxy
	}

	for _, galaxyType := range galaxyTypes {
		clusters[galaxyType] = []*StarNode{}
	}

	// Cluster works based on DNA
	for _, node := range cse.vectorStore {
		// Simple clustering logic
		if containsAny(node.DNA.Genes, []string{"summon", "summoning", "tamer"}) {
			clusters["مجرة الاستدعاء"] = append(clusters["مجرة الاستدعاء"], node)
		} else if containsAny(node.DNA.Genes, []string{"shadow", "dark", "assassin"}) {
			clusters["مجرة أبطال الظل"] = append(clusters["مجرة أبطال الظل"], node)
		} else if containsAny(node.DNA.Genes, []string{"regression", "return", "reborn"}) {
			clusters["مجرة العودة بالزمن"] = append(clusters["مجرة العودة بالزمن"], node)
		} else {
			// Default cluster
			clusters["مجرة النجاة"] = append(clusters["مجرة النجاة"], node)
		}
	}

	return clusters, nil
}

func containsAny(slice []string, targets []string) bool {
	for _, s := range slice {
		for _, t := range targets {
			if s == t {
				return true
			}
		}
	}
	return false
}
