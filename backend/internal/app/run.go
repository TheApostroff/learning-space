package app

import (
	"github.com/TheApostroff/skill-space/internal/config"
	"github.com/TheApostroff/skill-space/internal/models"
	"github.com/TheApostroff/skill-space/pkg/database"
)

func Run(cfg *config.Config) error {
	db, err := database.NewPostgres(&cfg.Server)
	if err != nil {
		return err
	}

	db.AutoMigrate(&models.User{})

	return nil
}
