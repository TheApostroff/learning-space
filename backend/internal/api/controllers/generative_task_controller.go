package controllers

import (
	"net/http"

	"github.com/TheApostroff/skill-space/internal/api/models"
	"github.com/TheApostroff/skill-space/internal/api/services"
	"github.com/gin-gonic/gin"
)

type GenerativeTaskController struct {
	service *services.GenerativeTaskService
}

func NewGenerativeTaskController(service *services.GenerativeTaskService) *GenerativeTaskController {
	return &GenerativeTaskController{service: service}
}

func (c *GenerativeTaskController) GenerateTask(ctx *gin.Context) {
	var req models.GenerativeTaskGenerateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Validation failed",
			Message: "Please check your input data",
		})
		return
	}

	task, err := c.service.GenerateTask(&req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to generate task",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    task,
		Message: "Task generated successfully",
	})
}

func (c *GenerativeTaskController) SubmitTask(ctx *gin.Context) {
	var req models.GenerativeTaskSubmitRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Validation failed",
			Message: "Please check your input data",
		})
		return
	}

	submission, err := c.service.SubmitTask(&req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to submit task",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    submission,
		Message: "Task submitted successfully",
	})
}

func (c *GenerativeTaskController) GetTaskHints(ctx *gin.Context) {
	taskID := ctx.Param("taskId")
	difficulty := ctx.Query("difficulty")

	hints, err := c.service.GetTaskHints(taskID, difficulty)
	if err != nil {
		ctx.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "Task not found",
			Message: "The requested task could not be found",
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    hints,
		Message: "Hints retrieved successfully",
	})
}
