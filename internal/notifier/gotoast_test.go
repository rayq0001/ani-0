//go:build windows

package notifier

import (
	"github.com/go-toast/toast"
	"path/filepath"
	"aniverse/internal/test_utils"
	"testing"
)

func TestGoToast(t *testing.T) {
	test_utils.SetTwoLevelDeep()
	test_utils.InitTestProvider(t)

	notification := toast.Notification{
		AppID:   "Aniverse",
		Title:   "Aniverse",
		Icon:    filepath.Join(test_utils.ConfigData.Path.DataDir, "logo.png"),
		Message: "Auto Downloader has downloaded 1 episode",
	}
	err := notification.Push()
	if err != nil {
		t.Fatal(err)
	}

}
