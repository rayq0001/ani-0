package main

import (
	"encoding/json"
	"net/http"
	"strings"
)

type PlanetData struct {
	Name     string   `json:"name"`
	Manga    string   `json:"manga"`
	Tags     []string `json:"tags"`
	Episodes int      `json:"episodes"`
}

func main() {
	http.HandleFunc("/api/data/", func(w http.ResponseWriter, r *http.Request) {
		// السماح بالطلبات من خدمات أخرى (CORS)
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")

		query := strings.TrimPrefix(r.URL.Path, "/api/data/")

		// بيانات وهمية (يمكنك ربطها بقاعدة بيانات لاحقاً)
		var data PlanetData
		if strings.ToLower(query) == "one piece" || query == "ون بيس" {
			data = PlanetData{
				Name:     "ون بيس - One Piece",
				Manga:    "مستمرة (الفصل 1100+)",
				Tags:     []string{"شونين", "مغامرة", "خيال"},
				Episodes: 1090,
			}
		} else {
			data = PlanetData{Name: "كوكب مجهول", Manga: "غير معروف", Tags: []string{"غامض"}}
		}

		json.NewEncoder(w).Encode(data)
	})

	println("Go Data Service running on port 8080...")
	http.ListenAndServe(":8080", nil)
}
