package app

import (
	"fmt"
	"log"

	"github.com/TheApostroff/skill-space/internal/api/controllers"
	"github.com/TheApostroff/skill-space/internal/api/models"
	"github.com/TheApostroff/skill-space/internal/api/repositories"
	"github.com/TheApostroff/skill-space/internal/api/services"
	"github.com/TheApostroff/skill-space/internal/config"
	"github.com/TheApostroff/skill-space/pkg/database"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// App represents the application
type App struct {
	Router *gin.Engine
	DB     *gorm.DB
	Config *config.Config
}

// NewApp creates a new application instance
func NewApp(cfg *config.Config) (*App, error) {
	// Initialize database
	db, err := database.NewPostgres(&cfg.Server)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Initialize Gin router
	router := gin.Default()

	return &App{
		Router: router,
		DB:     db,
		Config: cfg,
	}, nil
}

// SetupMiddleware configures middleware for the application
func (a *App) SetupMiddleware() {
	// Enable CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:3001"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	a.Router.Use(cors.New(config))

	// Add logging middleware
	a.Router.Use(gin.Logger())
	a.Router.Use(gin.Recovery())
}

// SetupDatabase performs database migrations
func (a *App) SetupDatabase() error {
	// Auto-migrate all models
	err := a.DB.AutoMigrate(
		&models.Course{},
		&models.Resource{},
		&models.Section{},
		&models.Activity{},
		&models.Assignment{},
		&models.Attachment{},
		&models.Submission{},
		&models.GenerativeTask{},
		&models.GenerativeTaskSubmission{},
		&models.TestCase{},
		&models.Grade{},
		&models.Enrollment{},
		&models.ForumPost{},
		&models.APIUser{},
	)
	if err != nil {
		return fmt.Errorf("failed to migrate database: %w", err)
	}

	log.Println("Database migration completed successfully")
	return nil
}

// SetupRoutes configures all routes for the application
func (a *App) SetupRoutes() {
	// Initialize repositories
	courseRepo := repositories.NewCourseRepository(a.DB)
	sectionRepo := repositories.NewSectionRepository(a.DB)
	activityRepo := repositories.NewActivityRepository(a.DB)
	assignmentRepo := repositories.NewAssignmentRepository(a.DB)
	generativeTaskRepo := repositories.NewGenerativeTaskRepository(a.DB)
	gradeRepo := repositories.NewGradeRepository(a.DB)
	enrollmentRepo := repositories.NewEnrollmentRepository(a.DB)
	forumRepo := repositories.NewForumRepository(a.DB)
	userRepo := repositories.NewUserRepository(a.DB)

	// Initialize services
	courseService := services.NewCourseService(courseRepo)
	activityService := services.NewActivityService(sectionRepo, activityRepo)
	assignmentService := services.NewAssignmentService(assignmentRepo)
	generativeTaskService := services.NewGenerativeTaskService(generativeTaskRepo)
	gradeService := services.NewGradeService(gradeRepo, enrollmentRepo)
	forumService := services.NewForumService(forumRepo)
	userService := services.NewUserService(userRepo)

	// Initialize controllers
	courseController := controllers.NewCourseController(courseService)
	activityController := controllers.NewActivityController(activityService)
	assignmentController := controllers.NewAssignmentController(assignmentService)
	generativeTaskController := controllers.NewGenerativeTaskController(generativeTaskService)
	gradeController := controllers.NewGradeController(gradeService)
	forumController := controllers.NewForumController(forumService)
	userController := controllers.NewUserController(userService)

	// Setup API routes
	a.setupAPIRoutes(
		courseController,
		activityController,
		assignmentController,
		generativeTaskController,
		gradeController,
		forumController,
		userController,
	)
}

// setupAPIRoutes configures all API routes
func (a *App) setupAPIRoutes(
	courseController *controllers.CourseController,
	activityController *controllers.ActivityController,
	assignmentController *controllers.AssignmentController,
	generativeTaskController *controllers.GenerativeTaskController,
	gradeController *controllers.GradeController,
	forumController *controllers.ForumController,
	userController *controllers.UserController,
) {
	// API routes group
	api := a.Router.Group("/api")
	{
		// Health check endpoint
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, models.APIResponse{
				Success: true,
				Data:    map[string]string{"status": "healthy"},
				Message: "API is running",
			})
		})

		// Course routes
		courses := api.Group("/courses")
		{
			courses.GET("", courseController.GetAllCourses)
			courses.POST("", courseController.CreateCourse)
			courses.GET("/:courseId", courseController.GetCourseByID)
			courses.PUT("/:courseId", courseController.UpdateCourse)
			courses.DELETE("/:courseId", courseController.DeleteCourse)

			// Course sections
			courses.GET("/:courseId/sections", activityController.GetCourseSections)
			courses.POST("/:courseId/sections", activityController.CreateSection)

			// Activities
			courses.GET("/:courseId/activities/:activityId", activityController.GetActivity)
		}

		// Section routes
		sections := api.Group("/sections")
		{
			sections.POST("/:sectionId/activities", activityController.CreateActivity)
		}

		// Activity routes
		activities := api.Group("/activities")
		{
			activities.PUT("/:activityId", activityController.UpdateActivity)
			activities.DELETE("/:activityId", activityController.DeleteActivity)
		}

		// Assignment routes
		assignments := api.Group("/assignments")
		{
			assignments.GET("", assignmentController.GetAllAssignments)
			assignments.POST("", assignmentController.CreateAssignment)
			assignments.GET("/:assignmentId", assignmentController.GetAssignmentByID)
			assignments.POST("/submit", assignmentController.SubmitAssignment)
			assignments.POST("/grade", assignmentController.GradeAssignment)
		}

		// Generative task routes
		generativeTasks := api.Group("/generative-tasks")
		{
			generativeTasks.POST("/generate", generativeTaskController.GenerateTask)
			generativeTasks.POST("/submit", generativeTaskController.SubmitTask)
			generativeTasks.GET("/:taskId/hints", generativeTaskController.GetTaskHints)
		}

		// Grade routes
		grades := api.Group("/grades")
		{
			grades.GET("", gradeController.GetAllGrades)
			grades.GET("/student/:studentId", gradeController.GetGradesByStudentID)
		}

		// Enrollment routes
		enrollments := api.Group("/enrollments")
		{
			enrollments.GET("", gradeController.GetAllEnrollments)
			enrollments.POST("", gradeController.CreateEnrollment)
		}

		// Forum routes
		forumPosts := api.Group("/forum-posts")
		{
			forumPosts.GET("", forumController.GetForumPosts)
			forumPosts.POST("", forumController.CreatePost)
			forumPosts.POST("/reply", forumController.CreateReply)
		}

		// User routes
		users := api.Group("/users")
		{
			users.GET("", userController.GetAllUsers)
			users.GET("/:email", userController.GetUserByEmail)
			users.POST("/", userController.CreateUser)
			users.PUT("/:userId", userController.UpdateUser)
		}
	}
}

// Run starts the application
func (a *App) Run() error {
	// Setup middleware
	a.SetupMiddleware()

	// Setup database
	if err := a.SetupDatabase(); err != nil {
		return err
	}

	// Setup routes
	a.SetupRoutes()

	// Start server
	addr := fmt.Sprintf("%s:%s", a.Config.Host, a.Config.Port)
	log.Printf("Starting Learning Space API server on %s", addr)
	log.Printf("API endpoints available at http://%s/api", addr)

	return a.Router.Run(addr)
}

// RunApp is the main entry point for running the application
func RunApp(cfg *config.Config) error {
	app, err := NewApp(cfg)
	if err != nil {
		return fmt.Errorf("failed to create app: %w", err)
	}

	return app.Run()
}
