package main

import (
	"embed"
	"aniverse/internal/server"
)

// Embed the web directory
//
//go:embed web/*
var WebFS embed.FS

func main() {
	// Pass the embedded web interface to the server
	server.StartServer(WebFS, nil)
}

