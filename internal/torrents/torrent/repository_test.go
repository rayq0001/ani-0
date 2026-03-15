package torrent

import (
	"aniverse/internal/api/metadata_provider"
	"aniverse/internal/extension"
	"aniverse/internal/util"
	"testing"
)

func getTestRepo(t *testing.T) *Repository {
	logger := util.NewLogger()
	metadataProvider := metadata_provider.GetFakeProvider(t, nil)
	metadataProviderRef := util.NewRef[metadata_provider.Provider](metadataProvider)

	extensionBank := extension.NewUnifiedBank()

	repo := NewRepository(&NewRepositoryOptions{
		Logger:              logger,
		MetadataProviderRef: metadataProviderRef,
		ExtensionBankRef:    util.NewRef(extensionBank),
	})

	repo.SetSettings(&RepositorySettings{
		DefaultAnimeProvider: "",
	})

	return repo
}
