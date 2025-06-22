package controllers

import (
	"net/http"

	"github.com/TheApostroff/skill-space/internal/api/models"
	"github.com/TheApostroff/skill-space/internal/api/services"
	"github.com/gin-gonic/gin"
)

type GradeController struct {
	service *services.GradeService
}

func NewGradeController(service *services.GradeService) *GradeController {
	return &GradeController{service: service}
}

func (c *GradeController) GetAllGrades(ctx *gin.Context) {
	grades, err := c.service.GetAllGrades()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to retrieve grades",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    grades,
		Message: "Grades retrieved successfully",
	})
}

func (c *GradeController) GetGradesByStudentID(ctx *gin.Context) {
	studentID := ctx.Param("studentId")

	grades, err := c.service.GetGradesByStudentID(studentID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to retrieve grades",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    grades,
		Message: "Student grades retrieved successfully",
	})
}

func (c *GradeController) GetAllEnrollments(ctx *gin.Context) {
	enrollments, err := c.service.GetAllEnrollments()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to retrieve enrollments",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    enrollments,
		Message: "Enrollments retrieved successfully",
	})
}

func (c *GradeController) CreateEnrollment(ctx *gin.Context) {
	var req models.EnrollmentCreateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Validation failed",
			Message: "Please check your input data",
		})
		return
	}

	enrollment, err := c.service.CreateEnrollment(&req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to create enrollment",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Data:    enrollment,
		Message: "Enrollment created successfully",
	})
}
