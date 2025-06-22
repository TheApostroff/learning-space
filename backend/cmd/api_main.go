package main

import (
	"log"

	"github.com/TheApostroff/skill-space/internal/api/app"
	"github.com/TheApostroff/skill-space/internal/config"
)

func main() {
	cfg := config.NewConfig()

	// Setup API routes
	app, err := app.NewApp(cfg)
	if err != nil {
		log.Fatalf("failed to create app: %v", err)
	}

	// Start server
	log.Printf("Starting server on %s:%s", cfg.Host, cfg.Port)
	if err := app.Run(); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
