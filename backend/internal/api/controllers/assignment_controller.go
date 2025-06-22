package controllers

import (
	"net/http"

	"github.com/TheApostroff/skill-space/internal/api/models"
	"github.com/TheApostroff/skill-space/internal/api/services"
	"github.com/gin-gonic/gin"
)

type AssignmentController struct {
	service *services.AssignmentService
}

func NewAssignmentController(service *services.AssignmentService) *AssignmentController {
	return &AssignmentController{service: service}
}

func (c *AssignmentController) GetAllAssignments(ctx *gin.Context) {
	assignments, err := c.service.GetAllAssignments()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to retrieve assignments",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    assignments,
		Message: "Assignments retrieved successfully",
	})
}

func (c *AssignmentController) GetAssignmentByID(ctx *gin.Context) {
	assignmentID := ctx.Param("assignmentId")

	assignment, err := c.service.GetAssignmentByID(assignmentID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "Assignment not found",
			Message: "The requested assignment could not be found",
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    assignment,
		Message: "Assignment retrieved successfully",
	})
}

func (c *AssignmentController) CreateAssignment(ctx *gin.Context) {
	var req models.AssignmentCreateRequest
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

	assignment, err := c.service.CreateAssignment(&req, instructorID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to create assignment",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Data:    assignment,
		Message: "Assignment created successfully",
	})
}

func (c *AssignmentController) SubmitAssignment(ctx *gin.Context) {
	var req models.AssignmentSubmitRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Validation failed",
			Message: "Please check your input data",
		})
		return
	}

	// In a real implementation, get studentID from authentication context
	studentID := "student-1"

	submission, err := c.service.SubmitAssignment(&req, studentID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to submit assignment",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Data:    submission,
		Message: "Assignment submitted successfully",
	})
}

func (c *AssignmentController) GradeAssignment(ctx *gin.Context) {
	var req models.AssignmentGradeRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Validation failed",
			Message: "Please check your input data",
		})
		return
	}

	// In a real implementation, get gradedBy from authentication context
	gradedBy := "professor-1"

	submission, err := c.service.GradeAssignment(&req, gradedBy)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to grade assignment",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    submission,
		Message: "Assignment graded successfully",
	})
}
