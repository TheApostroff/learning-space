package controllers

import (
	"net/http"

	"github.com/TheApostroff/skill-space/internal/api/models"
	"github.com/TheApostroff/skill-space/internal/api/services"
	"github.com/gin-gonic/gin"
)

type CourseController struct {
	service *services.CourseService
}

func NewCourseController(service *services.CourseService) *CourseController {
	return &CourseController{service: service}
}

func (c *CourseController) GetAllCourses(ctx *gin.Context) {
	courses, err := c.service.GetAllCourses()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to retrieve courses",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    courses,
		Message: "Courses retrieved successfully",
	})
}

func (c *CourseController) GetCourseByID(ctx *gin.Context) {
	courseID := ctx.Param("courseId")

	course, err := c.service.GetCourseByID(courseID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "Course not found",
			Message: "The requested course could not be found",
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    course,
		Message: "Course retrieved successfully",
	})
}

func (c *CourseController) CreateCourse(ctx *gin.Context) {
	var req models.CourseCreateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Validation failed",
			Message: "Please check your input data",
		})
		return
	}

	// In a real implementation, get instructorID from authentication context
	instructorID := "professor-1"

	course, err := c.service.CreateCourse(&req, instructorID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to create course",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Data:    course,
		Message: "Course created successfully",
	})
}

func (c *CourseController) UpdateCourse(ctx *gin.Context) {
	courseID := ctx.Param("courseId")

	var req models.CourseUpdateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Validation failed",
			Message: "Please check your input data",
		})
		return
	}

	course, err := c.service.UpdateCourse(courseID, &req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to update course",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    course,
		Message: "Course updated successfully",
	})
}

func (c *CourseController) DeleteCourse(ctx *gin.Context) {
	courseID := ctx.Param("courseId")

	err := c.service.DeleteCourse(courseID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to delete course",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Course deleted successfully",
	})
}
