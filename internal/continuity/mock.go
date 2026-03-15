package continuity

import (
	"github.com/stretchr/testify/require"
	"path/filepath"
	"aniverse/internal/database/db"
	"aniverse/internal/util"
	"aniverse/internal/util/filecache"
	"testing"
)

func GetMockManager(t *testing.T, db *db.Database) *Manager {
	logger := util.NewLogger()
	cacher, err := filecache.NewCacher(filepath.Join(t.TempDir(), "cache"))
	require.NoError(t, err)

	manager := NewManager(&NewManagerOptions{
		FileCacher: cacher,
		Logger:     logger,
		Database:   db,
	})

	return manager
}
