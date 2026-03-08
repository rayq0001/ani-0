package processors

import (
	"context"
	"fmt"
	"sync"
	"time"
)

// DownloadStatus represents the status of a download
type DownloadStatus string

const (
	StatusPending     DownloadStatus = "pending"
	StatusDownloading DownloadStatus = "downloading"
	StatusCompleted   DownloadStatus = "completed"
	StatusError       DownloadStatus = "error"
	StatusPaused      DownloadStatus = "paused"
)

// DownloadItem represents a chapter queued for download
type DownloadItem struct {
	ID          string         `json:"id"`
	MediaID     int            `json:"mediaId"`
	MangaTitle  string         `json:"mangaTitle"`
	Chapter     int            `json:"chapter"`
	PageCount   int            `json:"pageCount"`
	Status      DownloadStatus `json:"status"`
	Progress    int            `json:"progress"` // 0-100
	Error       string         `json:"error,omitempty"`
	StartedAt   *time.Time     `json:"startedAt,omitempty"`
	CompletedAt *time.Time     `json:"completedAt,omitempty"`
	Priority    int            `json:"priority"` // Higher = more important
}

// OfflineManager handles smart downloading for offline reading
type OfflineManager struct {
	downloadQueue      []*DownloadItem
	activeDownloads    map[string]*DownloadItem
	completedDownloads []*DownloadItem
	maxConcurrent      int
	mu                 sync.RWMutex
	downloadFunc       func(ctx context.Context, item *DownloadItem) error
}

// NewOfflineManager creates a new offline manager
func NewOfflineManager(maxConcurrent int) *OfflineManager {
	if maxConcurrent < 1 {
		maxConcurrent = 3
	}

	return &OfflineManager{
		downloadQueue:      make([]*DownloadItem, 0),
		activeDownloads:    make(map[string]*DownloadItem),
		completedDownloads: make([]*DownloadItem, 0),
		maxConcurrent:      maxConcurrent,
	}
}

// SetDownloadFunc sets the function used to perform downloads
func (om *OfflineManager) SetDownloadFunc(fn func(ctx context.Context, item *DownloadItem) error) {
	om.downloadFunc = fn
}

// QueueDownload adds a chapter to the download queue
func (om *OfflineManager) QueueDownload(mediaID int, mangaTitle string, chapter int, pageCount int, priority int) *DownloadItem {
	om.mu.Lock()
	defer om.mu.Unlock()

	item := &DownloadItem{
		ID:         generateDownloadID(mediaID, chapter),
		MediaID:    mediaID,
		MangaTitle: mangaTitle,
		Chapter:    chapter,
		PageCount:  pageCount,
		Status:     StatusPending,
		Progress:   0,
		Priority:   priority,
	}

	om.downloadQueue = append(om.downloadQueue, item)

	// Sort by priority (higher first)
	om.sortQueueByPriority()

	return item
}

// QueueNextChapters automatically queues upcoming chapters
func (om *OfflineManager) QueueNextChapters(mediaID int, mangaTitle string, currentChapter int, count int) []*DownloadItem {
	var items []*DownloadItem

	for i := 1; i <= count; i++ {
		chapter := currentChapter + i
		item := om.QueueDownload(mediaID, mangaTitle, chapter, 0, 100-i) // Decreasing priority
		items = append(items, item)
	}

	return items
}

// StartDownloads begins processing the download queue
func (om *OfflineManager) StartDownloads(ctx context.Context) {
	go om.processQueue(ctx)
}

// processQueue handles the download queue
func (om *OfflineManager) processQueue(ctx context.Context) {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			om.processNextItems(ctx)
		}
	}
}

// processNextItems starts downloads for pending items
func (om *OfflineManager) processNextItems(ctx context.Context) {
	om.mu.Lock()

	// Check how many active downloads we have
	activeCount := len(om.activeDownloads)
	if activeCount >= om.maxConcurrent {
		om.mu.Unlock()
		return
	}

	// Find pending items
	var toStart []*DownloadItem
	for _, item := range om.downloadQueue {
		if item.Status == StatusPending && len(toStart) < (om.maxConcurrent-activeCount) {
			toStart = append(toStart, item)
		}
	}
	om.mu.Unlock()

	// Start downloads
	for _, item := range toStart {
		go om.downloadItem(ctx, item)
	}
}

// downloadItem performs the actual download
func (om *OfflineManager) downloadItem(ctx context.Context, item *DownloadItem) {
	// Update status
	om.mu.Lock()
	item.Status = StatusDownloading
	now := time.Now()
	item.StartedAt = &now
	om.activeDownloads[item.ID] = item
	om.mu.Unlock()

	// Perform download
	if om.downloadFunc != nil {
		err := om.downloadFunc(ctx, item)

		om.mu.Lock()
		delete(om.activeDownloads, item.ID)

		if err != nil {
			item.Status = StatusError
			item.Error = err.Error()
		} else {
			item.Status = StatusCompleted
			item.Progress = 100
			completedAt := time.Now()
			item.CompletedAt = &completedAt
			om.completedDownloads = append(om.completedDownloads, item)
		}
		om.mu.Unlock()
	}
}

// UpdateProgress updates the download progress
func (om *OfflineManager) UpdateProgress(downloadID string, progress int) {
	om.mu.Lock()
	defer om.mu.Unlock()

	if item, exists := om.activeDownloads[downloadID]; exists {
		item.Progress = progress
	}
}

// GetQueue returns the current download queue
func (om *OfflineManager) GetQueue() []*DownloadItem {
	om.mu.RLock()
	defer om.mu.RUnlock()

	// Combine all items
	allItems := make([]*DownloadItem, 0)
	allItems = append(allItems, om.downloadQueue...)

	for _, item := range om.activeDownloads {
		allItems = append(allItems, item)
	}

	allItems = append(allItems, om.completedDownloads...)

	return allItems
}

// GetActiveDownloads returns currently downloading items
func (om *OfflineManager) GetActiveDownloads() []*DownloadItem {
	om.mu.RLock()
	defer om.mu.RUnlock()

	items := make([]*DownloadItem, 0, len(om.activeDownloads))
	for _, item := range om.activeDownloads {
		items = append(items, item)
	}

	return items
}

// GetCompletedDownloads returns completed downloads
func (om *OfflineManager) GetCompletedDownloads() []*DownloadItem {
	om.mu.RLock()
	defer om.mu.RUnlock()

	return om.completedDownloads
}

// PauseDownload pauses an active download
func (om *OfflineManager) PauseDownload(downloadID string) error {
	om.mu.Lock()
	defer om.mu.Unlock()

	if item, exists := om.activeDownloads[downloadID]; exists {
		item.Status = StatusPaused
		return nil
	}

	return fmt.Errorf("download not found or not active")
}

// ResumeDownload resumes a paused download
func (om *OfflineManager) ResumeDownload(downloadID string) error {
	om.mu.Lock()
	defer om.mu.Unlock()

	for _, item := range om.downloadQueue {
		if item.ID == downloadID && item.Status == StatusPaused {
			item.Status = StatusPending
			return nil
		}
	}

	return fmt.Errorf("paused download not found")
}

// CancelDownload cancels a download
func (om *OfflineManager) CancelDownload(downloadID string) error {
	om.mu.Lock()
	defer om.mu.Unlock()

	// Remove from active
	delete(om.activeDownloads, downloadID)

	// Remove from queue
	newQueue := make([]*DownloadItem, 0)
	for _, item := range om.downloadQueue {
		if item.ID != downloadID {
			newQueue = append(newQueue, item)
		}
	}
	om.downloadQueue = newQueue

	return nil
}

// ClearCompleted removes completed downloads from history
func (om *OfflineManager) ClearCompleted() {
	om.mu.Lock()
	defer om.mu.Unlock()

	om.completedDownloads = make([]*DownloadItem, 0)
}

// GetStats returns download statistics
func (om *OfflineManager) GetStats() map[string]interface{} {
	om.mu.RLock()
	defer om.mu.RUnlock()

	pending := 0
	downloading := 0
	completed := 0
	error := 0

	for _, item := range om.downloadQueue {
		if item.Status == StatusPending {
			pending++
		}
	}

	downloading = len(om.activeDownloads)
	completed = len(om.completedDownloads)

	for _, item := range om.downloadQueue {
		if item.Status == StatusError {
			error++
		}
	}

	return map[string]interface{}{
		"pending":     pending,
		"downloading": downloading,
		"completed":   completed,
		"error":       error,
		"total":       pending + downloading + completed + error,
	}
}

// sortQueueByPriority sorts the queue by priority (highest first)
func (om *OfflineManager) sortQueueByPriority() {
	// Simple bubble sort for small lists
	for i := 0; i < len(om.downloadQueue); i++ {
		for j := i + 1; j < len(om.downloadQueue); j++ {
			if om.downloadQueue[j].Priority > om.downloadQueue[i].Priority {
				om.downloadQueue[i], om.downloadQueue[j] = om.downloadQueue[j], om.downloadQueue[i]
			}
		}
	}
}

// Helper function
func generateDownloadID(mediaID, chapter int) string {
	return fmt.Sprintf("dl_%d_%d_%d", mediaID, chapter, time.Now().UnixNano())
}
