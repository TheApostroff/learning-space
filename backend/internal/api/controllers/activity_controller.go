package controllers

import (
	"net/http"

	"github.com/TheApostroff/skill-space/internal/api/models"
	"github.com/TheApostroff/skill-space/internal/api/services"
	"github.com/gin-gonic/gin"
)

type ActivityController struct {
	service *services.ActivityService
}

func NewActivityController(service *services.ActivityService) *ActivityController {
	return &ActivityController{service: service}
}

func (c *ActivityController) GetCourseSections(ctx *gin.Context) {
	courseID := ctx.Param("courseId")

	sections, err := c.service.GetSectionsByCourseID(courseID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to retrieve sections",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    sections,
		Message: "Course sections retrieved successfully",
	})
}

func (c *ActivityController) CreateSection(ctx *gin.Context) {
	courseID := ctx.Param("courseId")

	var req models.SectionCreateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Validation failed",
			Message: "Please check your input data",
		})
		return
	}

	section, err := c.service.CreateSection(courseID, &req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to create section",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Data:    section,
		Message: "Section created successfully",
	})
}

func (c *ActivityController) GetActivity(ctx *gin.Context) {
	activityID := ctx.Param("activityId")

	activity, err := c.service.GetActivityByID(activityID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "Activity not found",
			Message: "The requested activity could not be found",
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    activity,
		Message: "Activity retrieved successfully",
	})
}

func (c *ActivityController) CreateActivity(ctx *gin.Context) {
	sectionID := ctx.Param("sectionId")

	var req models.ActivityCreateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Validation failed",
			Message: "Please check your input data",
		})
		return
	}

	activity, err := c.service.CreateActivity(sectionID, &req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to create activity",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Data:    activity,
		Message: "Activity created successfully",
	})
}

func (c *ActivityController) UpdateActivity(ctx *gin.Context) {
	activityID := ctx.Param("activityId")

	var req models.ActivityUpdateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Validation failed",
			Message: "Please check your input data",
		})
		return
	}

	activity, err := c.service.UpdateActivity(activityID, &req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to update activity",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    activity,
		Message: "Activity updated successfully",
	})
}

func (c *ActivityController) DeleteActivity(ctx *gin.Context) {
	activityID := ctx.Param("activityId")

	err := c.service.DeleteActivity(activityID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to delete activity",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Activity deleted successfully",
	})
}
