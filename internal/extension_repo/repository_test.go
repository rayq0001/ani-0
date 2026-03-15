package extension_repo_test

import (
	"aniverse/internal/events"
	"aniverse/internal/extension_repo"
	"aniverse/internal/util"
	"testing"
)

func getRepo(t *testing.T) *extension_repo.Repository {
	logger := util.NewLogger()
	wsEventManager := events.NewMockWSEventManager(logger)

	return extension_repo.NewRepository(&extension_repo.NewRepositoryOptions{
		Logger:         logger,
		ExtensionDir:   "testdir",
		WSEventManager: wsEventManager,
	})
}
