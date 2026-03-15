package handlers

import (
	"aniverse/internal/manga"
	"sort"

	"github.com/labstack/echo/v4"
)

// Comics Types
type ComicsType string

const (
	ComicsTypeManga  ComicsType = "manga"
	ComicsTypeManhwa ComicsType = "manhwa"
	ComicsTypeManhua ComicsType = "manhua"
)

// Country mapping for comics types
var comicsTypeCountries = map[ComicsType][]string{
	ComicsTypeManga:  {"JP"},
	ComicsTypeManhwa: {"KR"},
	ComicsTypeManhua: {"CN", "TW"},
}

// ComicsEntry represents a single comics entry with enhanced data
type ComicsEntry struct {
	ID            int                                 `json:"id"`
	MediaID       int                                 `json:"mediaId"`
	Title         string                              `json:"title"`
	CoverImage    string                              `json:"coverImage"`
	BannerImage   string                              `json:"bannerImage"`
	Country       string                              `json:"country"`
	ChaptersRead  int                                 `json:"chaptersRead"`
	TotalChapters int                                 `json:"totalChapters"`
	Progress      float64                             `json:"progress"`
	Status        string                              `json:"status"`
	Score         float64                             `json:"score"`
	Genres        []string                            `json:"genres"`
	Tags          []string                            `json:"tags"`
	Description   string                              `json:"description"`
	Year          int                                 `json:"year"`
	LatestChapter *manga.MangaLatestChapterNumberItem `json:"latestChapter,omitempty"`
	IsFavourite   bool                                `json:"isFavourite"`
}

// ComicsList represents a list of comics entries
type ComicsList struct {
	Type    string        `json:"type"`
	Name    string        `json:"name"`
	Entries []ComicsEntry `json:"entries"`
	Count   int           `json:"count"`
}

// ComicsCollection represents the full comics collection response
type ComicsCollection struct {
	Manga  ComicsList  `json:"manga"`
	Manhwa ComicsList  `json:"manhwa"`
	Manhua ComicsList  `json:"manhua"`
	Stats  ComicsStats `json:"stats"`
}

// ComicsStats represents statistics for comics
type ComicsStats struct {
	TotalManga     int     `json:"totalManga"`
	TotalManhwa    int     `json:"totalManhwa"`
	TotalManhua    int     `json:"totalManhua"`
	TotalChapters  int     `json:"totalChapters"`
	ChaptersRead   int     `json:"chaptersRead"`
	AverageScore   float64 `json:"averageScore"`
	CompletionRate float64 `json:"completionRate"`
}

// GetComicsCollectionRequest represents the request body for getting comics collection
type GetComicsCollectionRequest struct {
	Type string `json:"type,omitempty"` // "manga", "manhwa", "manhua", or empty for all
}

// HandleGetComicsCollection
//
//	@summary returns the user's comics collection organized by type.
//	@desc This endpoint returns all comics (manga, manhwa, manhua) organized by type with enhanced data.
//	@route /api/v1/comics/collection [POST]
//	@returns ComicsCollection
func (h *Handler) HandleGetComicsCollection(c echo.Context) error {
	var b GetComicsCollectionRequest
	if err := c.Bind(&b); err != nil {
		return h.RespondWithError(c, err)
	}

	// Get manga collection from AniList
	mangaCollection, err := h.App.GetMangaCollection(false)
	if err != nil {
		return h.RespondWithError(c, err)
	}

	// Convert anilist.MangaCollection to manga.Collection
	collection := &manga.Collection{}
	if mangaCollection != nil {
		collection, _ = manga.NewCollection(&manga.NewCollectionOptions{
			MangaCollection: mangaCollection,
			PlatformRef:     h.App.AnilistPlatformRef,
		})
	}

	// Get latest chapter numbers
	latestChapters, err := h.App.MangaRepository.GetMangaLatestChapterNumbersMap()
	if err != nil {
		latestChapters = make(map[int][]manga.MangaLatestChapterNumberItem)
	}

	// Build collection
	comicsCollection := ComicsCollection{
		Manga:  buildComicsList(collection, ComicsTypeManga, latestChapters),
		Manhwa: buildComicsList(collection, ComicsTypeManhwa, latestChapters),
		Manhua: buildComicsList(collection, ComicsTypeManhua, latestChapters),
		Stats:  buildComicsStats(collection, latestChapters),
	}

	return h.RespondWithData(c, comicsCollection)
}

// buildComicsList builds a comics list for a specific type
func buildComicsList(collection *manga.Collection, comicsType ComicsType, latestChapters map[int][]manga.MangaLatestChapterNumberItem) ComicsList {
	countries := comicsTypeCountries[comicsType]

	var entries []ComicsEntry

	for _, list := range collection.Lists {
		for _, entry := range list.Entries {
			media := entry.Media
			if media == nil {
				continue
			}

			// Check if media matches the comics type by country
			country := getCountryOfOriginSafe(media)
			if !contains(countries, country) {
				continue
			}

			// Get latest chapter info
			var latestChapter *manga.MangaLatestChapterNumberItem
			if chapters, ok := latestChapters[media.GetID()]; ok && len(chapters) > 0 {
				latestChapter = &chapters[0]
			}

			// Calculate progress
			totalChapters := getChaptersSafe(media)
			if totalChapters == 0 && latestChapter != nil {
				totalChapters = latestChapter.Number
			}

			progress := 0.0
			chaptersRead := 0
			score := 0.0
			status := ""
			if entry.EntryListData != nil {
				chaptersRead = entry.EntryListData.Progress
				score = entry.EntryListData.Score
				if entry.EntryListData.Status != nil {
					status = string(*entry.EntryListData.Status)
				}
				if totalChapters > 0 {
					progress = float64(entry.EntryListData.Progress) / float64(totalChapters) * 100
				}
			}

			// Extract genres
			genres := getGenresSafe(media)

			// Extract tags - BaseManga doesn't have Tags field
			tags := make([]string, 0)

			comicsEntry := ComicsEntry{
				ID:            entry.MediaId,
				MediaID:       media.GetID(),
				Title:         media.GetTitleSafe(),
				CoverImage:    media.GetCoverImageSafe(),
				BannerImage:   media.GetBannerImageSafe(),
				Country:       country,
				ChaptersRead:  chaptersRead,
				TotalChapters: totalChapters,
				Progress:      progress,
				Status:        status,
				Score:         score,
				Genres:        genres,
				Tags:          tags,
				Description:   getDescriptionSafe(media),
				Year:          getStartYearSafe(media),
				LatestChapter: latestChapter,
				IsFavourite:   false,
			}

			entries = append(entries, comicsEntry)
		}
	}

	// Sort entries by title
	sort.Slice(entries, func(i, j int) bool {
		return entries[i].Title < entries[j].Title
	})

	return ComicsList{
		Type:    string(comicsType),
		Name:    getComicsTypeName(comicsType),
		Entries: entries,
		Count:   len(entries),
	}
}

// Helper functions for safe access to BaseManga fields
func getCountryOfOriginSafe(media interface{ GetCountryOfOrigin() *string }) string {
	if media == nil {
		return ""
	}
	co := media.GetCountryOfOrigin()
	if co == nil {
		return ""
	}
	return *co
}

func getChaptersSafe(media interface{ GetChapters() *int }) int {
	if media == nil {
		return 0
	}
	ch := media.GetChapters()
	if ch == nil {
		return 0
	}
	return *ch
}

func getDescriptionSafe(media interface{ GetDescription() *string }) string {
	if media == nil {
		return ""
	}
	desc := media.GetDescription()
	if desc == nil {
		return ""
	}
	return *desc
}

func getStartYearSafe(media interface{ GetStartYearSafe() int }) int {
	if media == nil {
		return 0
	}
	return media.GetStartYearSafe()
}

func getGenresSafe(media interface{ GetGenres() []*string }) []string {
	if media == nil {
		return nil
	}
	genres := media.GetGenres()
	var result []string
	for _, g := range genres {
		if g != nil && *g != "" {
			result = append(result, *g)
		}
	}
	return result
}

// buildComicsStats builds statistics for comics
func buildComicsStats(collection *manga.Collection, latestChapters map[int][]manga.MangaLatestChapterNumberItem) ComicsStats {
	stats := ComicsStats{}

	for _, list := range collection.Lists {
		for _, entry := range list.Entries {
			media := entry.Media
			if media == nil {
				continue
			}

			country := getCountryOfOriginSafe(media)

			// Count by type
			switch {
			case contains(comicsTypeCountries[ComicsTypeManga], country):
				stats.TotalManga++
			case contains(comicsTypeCountries[ComicsTypeManhwa], country):
				stats.TotalManhwa++
			case contains(comicsTypeCountries[ComicsTypeManhua], country):
				stats.TotalManhua++
			}

			// Count chapters
			totalChapters := getChaptersSafe(media)
			if totalChapters == 0 {
				if chapters, ok := latestChapters[media.GetID()]; ok && len(chapters) > 0 {
					totalChapters = chapters[0].Number
				}
			}

			stats.TotalChapters += totalChapters
			if entry.EntryListData != nil {
				stats.ChaptersRead += entry.EntryListData.Progress
				// Sum scores for average
				if entry.EntryListData.Score > 0 {
					stats.AverageScore += entry.EntryListData.Score
				}
			}
		}
	}

	// Calculate average score
	totalEntries := stats.TotalManga + stats.TotalManhwa + stats.TotalManhua
	if totalEntries > 0 {
		stats.AverageScore = stats.AverageScore / float64(totalEntries)
	}

	// Calculate completion rate
	if stats.TotalChapters > 0 {
		stats.CompletionRate = float64(stats.ChaptersRead) / float64(stats.TotalChapters) * 100
	}

	return stats
}

// getComicsTypeName returns the display name for a comics type
func getComicsTypeName(comicsType ComicsType) string {
	switch comicsType {
	case ComicsTypeManga:
		return "Manga"
	case ComicsTypeManhwa:
		return "Manhwa"
	case ComicsTypeManhua:
		return "Manhua"
	default:
		return "Unknown"
	}
}

// contains checks if a string slice contains a value
func contains(slice []string, value string) bool {
	for _, v := range slice {
		if v == value {
			return true
		}
	}
	return false
}

// HandleGetComicsStats
//
//	@summary returns statistics for the user's comics collection.
//	@route /api/v1/comics/stats [GET]
//	@returns ComicsStats
func (h *Handler) HandleGetComicsStats(c echo.Context) error {
	// Get manga collection
	mangaCollection, err := h.App.GetMangaCollection(false)
	if err != nil {
		return h.RespondWithError(c, err)
	}

	// Convert anilist.MangaCollection to manga.Collection
	collection := &manga.Collection{}
	if mangaCollection != nil {
		collection, _ = manga.NewCollection(&manga.NewCollectionOptions{
			MangaCollection: mangaCollection,
			PlatformRef:     h.App.AnilistPlatformRef,
		})
	}

	// Get latest chapter numbers
	latestChapters, err := h.App.MangaRepository.GetMangaLatestChapterNumbersMap()
	if err != nil {
		latestChapters = make(map[int][]manga.MangaLatestChapterNumberItem)
	}

	stats := buildComicsStats(collection, latestChapters)

	return h.RespondWithData(c, stats)
}

// HandleGetComicsByType
//
//	@summary returns comics of a specific type.
//	@route /api/v1/comics/{type} [GET]
//	@param type - string - true - "Type of comics (manga, manhwa, manhua)"
//	@returns ComicsList
func (h *Handler) HandleGetComicsByType(c echo.Context) error {
	comicsType := ComicsType(c.Param("type"))

	// Validate type
	if _, ok := comicsTypeCountries[comicsType]; !ok {
		return h.RespondWithError(c, echo.NewHTTPError(400, "Invalid comics type"))
	}

	// Get manga collection
	mangaCollection, err := h.App.GetMangaCollection(false)
	if err != nil {
		return h.RespondWithError(c, err)
	}

	// Convert anilist.MangaCollection to manga.Collection
	collection := &manga.Collection{}
	if mangaCollection != nil {
		collection, _ = manga.NewCollection(&manga.NewCollectionOptions{
			MangaCollection: mangaCollection,
			PlatformRef:     h.App.AnilistPlatformRef,
		})
	}

	// Get latest chapter numbers
	latestChapters, err := h.App.MangaRepository.GetMangaLatestChapterNumbersMap()
	if err != nil {
		latestChapters = make(map[int][]manga.MangaLatestChapterNumberItem)
	}

	list := buildComicsList(collection, comicsType, latestChapters)

	return h.RespondWithData(c, list)
}
