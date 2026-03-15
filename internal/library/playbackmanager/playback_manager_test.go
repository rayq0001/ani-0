package playbackmanager_test

import (
	"aniverse/internal/api/anilist"
	"aniverse/internal/api/metadata_provider"
	"aniverse/internal/continuity"
	"aniverse/internal/database/db"
	"aniverse/internal/events"
	"aniverse/internal/extension"
	"aniverse/internal/library/playbackmanager"
	"aniverse/internal/platforms/anilist_platform"
	"aniverse/internal/test_utils"
	"aniverse/internal/util"
	"aniverse/internal/util/filecache"
	"testing"

	"github.com/stretchr/testify/require"
)

func getPlaybackManager(t *testing.T) (*playbackmanager.PlaybackManager, *anilist.AnimeCollection, error) {

	logger := util.NewLogger()

	wsEventManager := events.NewMockWSEventManager(logger)

	database, err := db.NewDatabase(test_utils.ConfigData.Path.DataDir, test_utils.ConfigData.Database.Name, logger)

	if err != nil {
		t.Fatalf("error while creating database, %v", err)
	}

	filecacher, err := filecache.NewCacher(t.TempDir())
	require.NoError(t, err)
	anilistClient := anilist.TestGetMockAnilistClient()
	anilistPlatform := anilist_platform.NewAnilistPlatform(util.NewRef(anilistClient), util.NewRef(extension.NewUnifiedBank()), logger, database)
	animeCollection, err := anilistPlatform.GetAnimeCollection(t.Context(), true)
	metadataProvider := metadata_provider.GetFakeProvider(t, database)
	require.NoError(t, err)
	continuityManager := continuity.NewManager(&continuity.NewManagerOptions{
		FileCacher: filecacher,
		Logger:     logger,
		Database:   database,
	})

	return playbackmanager.New(&playbackmanager.NewPlaybackManagerOptions{
		WSEventManager:      wsEventManager,
		Logger:              logger,
		PlatformRef:         util.NewRef(anilistPlatform),
		MetadataProviderRef: util.NewRef(metadataProvider),
		Database:            database,
		RefreshAnimeCollectionFunc: func() {
			// Do nothing
		},
		DiscordPresence:   nil,
		IsOfflineRef:      util.NewRef(false),
		ContinuityManager: continuityManager,
	}), animeCollection, nil
}
