package controllers

import (
	"net/http"

	"github.com/TheApostroff/skill-space/internal/api/models"
	"github.com/TheApostroff/skill-space/internal/api/services"
	"github.com/gin-gonic/gin"
)

type ForumController struct {
	service *services.ForumService
}

func NewForumController(service *services.ForumService) *ForumController {
	return &ForumController{service: service}
}

func (c *ForumController) GetForumPosts(ctx *gin.Context) {
	forumID := ctx.Query("forumId")
	if forumID == "" {
		ctx.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Validation failed",
			Message: "forumId query parameter is required",
		})
		return
	}

	posts, err := c.service.GetForumPosts(forumID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to retrieve forum posts",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    posts,
		Message: "Forum posts retrieved successfully",
	})
}

func (c *ForumController) CreatePost(ctx *gin.Context) {
	var req models.ForumPostCreateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Validation failed",
			Message: "Please check your input data",
		})
		return
	}

	post, err := c.service.CreatePost(&req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to create post",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Data:    post,
		Message: "Forum post created successfully",
	})
}

func (c *ForumController) CreateReply(ctx *gin.Context) {
	var req models.ForumReplyCreateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Validation failed",
			Message: "Please check your input data",
		})
		return
	}

	reply, err := c.service.CreateReply(&req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to create reply",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Data:    reply,
		Message: "Forum reply created successfully",
	})
}

type UserController struct {
	service *services.UserService
}

func NewUserController(service *services.UserService) *UserController {
	return &UserController{service: service}
}

func (c *UserController) GetAllUsers(ctx *gin.Context) {
	users, err := c.service.GetAllUsers()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to retrieve users",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    users,
		Message: "Users retrieved successfully",
	})
}

func (c *UserController) GetUserByID(ctx *gin.Context) {
	userID := ctx.Param("userId")

	user, err := c.service.GetUserByID(userID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "User not found",
			Message: "The requested user could not be found",
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    user,
		Message: "User retrieved successfully",
	})
}

func (c *UserController) GetUserByEmail(ctx *gin.Context) {
	email := ctx.Query("email")
	if email == "" {
		ctx.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Validation failed",
			Message: "email query parameter is required",
		})
		return
	}

	user, err := c.service.GetUserByEmail(email)
	if err != nil {
		ctx.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Error:   "User not found",
			Message: "The requested user could not be found",
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    user,
		Message: "User retrieved successfully",
	})
}

func (c *UserController) CreateUser(ctx *gin.Context) {
	var req models.APIUser
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Validation failed",
			Message: "Please check your input data",
		})
		return
	}

	user, err := c.service.CreateUser(&req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to create user",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Data:    user,
		Message: "User created successfully",
	})
}

func (c *UserController) UpdateUser(ctx *gin.Context) {
	userID := ctx.Param("userId")

	var req models.UserUpdateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Error:   "Validation failed",
			Message: "Please check your input data",
		})
		return
	}

	user, err := c.service.UpdateUser(userID, &req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Error:   "Failed to update user",
			Message: err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Data:    user,
		Message: "User updated successfully",
	})
}
