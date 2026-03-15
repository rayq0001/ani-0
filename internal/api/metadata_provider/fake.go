package metadata_provider

import (
	"aniverse/internal/database/db"
	"aniverse/internal/extension"
	"aniverse/internal/util"
	"aniverse/internal/util/filecache"
	"testing"

	"github.com/stretchr/testify/require"
)

func GetFakeProvider(t *testing.T, db *db.Database) Provider {
	filecacher, err := filecache.NewCacher(t.TempDir())
	require.NoError(t, err)
	return NewProvider(&NewProviderImplOptions{
		Logger:           util.NewLogger(),
		FileCacher:       filecacher,
		Database:         db,
		ExtensionBankRef: util.NewRef(extension.NewUnifiedBank()),
	})
}
