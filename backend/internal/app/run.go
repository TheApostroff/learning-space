package app

import (
	"fmt"

	"github.com/TheApostroff/skill-space/internal/config"
	"github.com/TheApostroff/skill-space/internal/controller"
	"github.com/TheApostroff/skill-space/internal/models"
	"github.com/TheApostroff/skill-space/internal/repository"
	"github.com/TheApostroff/skill-space/internal/service"
	"github.com/TheApostroff/skill-space/pkg/database"
	"github.com/gin-gonic/gin"
)

func Run(cfg *config.Config) error {
	db, err := database.NewPostgres(&cfg.Server)
	if err != nil {
		return err
	}

	router := gin.Default()

	repo := repository.NewUserRepository(db)
	svc := service.NewUserService(repo)
	ctrl := controller.NewUserController(svc)

	user_router := router.Group("/users")
	{
		user_router.POST("/register", ctrl.CreateUser)
		user_router.POST("/login", ctrl.LoginUser)
		user_router.GET("/:id", ctrl.GetUser)
		user_router.PUT("/:id", ctrl.UpdateUser)
		user_router.DELETE("/:id", ctrl.DeleteUser)

	}

	router.Run(fmt.Sprintf("%s:%s", cfg.Host, cfg.Port))

	db.AutoMigrate(&models.User{})
	return nil
}
