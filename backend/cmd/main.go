package main

import (
	"log"

	"github.com/TheApostroff/skill-space/internal/app"
	"github.com/TheApostroff/skill-space/internal/config"
)

func main() {
	cfg := config.NewConfig()

	if err := app.Run(cfg); err != nil {
		log.Fatalf("failed to run app: %v", err)
	}
}
