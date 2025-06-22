package services

import (
	"time"

	"github.com/TheApostroff/skill-space/internal/api/models"
	"github.com/TheApostroff/skill-space/internal/api/repositories"
)

type ForumService struct {
	repo *repositories.ForumRepository
}

func NewForumService(repo *repositories.ForumRepository) *ForumService {
	return &ForumService{repo: repo}
}

func (s *ForumService) GetForumPosts(forumID string) ([]models.ForumPost, error) {
	return s.repo.GetByForumID(forumID)
}

func (s *ForumService) CreatePost(req *models.ForumPostCreateRequest) (*models.ForumPost, error) {
	post := &models.ForumPost{
		ID:         GenerateID(),
		ForumID:    req.ForumID,
		AuthorID:   req.AuthorID,
		AuthorName: req.AuthorName,
		Title:      req.Title,
		Content:    req.Content,
		IsPinned:   false,
		Replies:    []models.ForumPost{},
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	err := s.repo.Create(post)
	if err != nil {
		return nil, err
	}

	return post, nil
}

func (s *ForumService) CreateReply(req *models.ForumReplyCreateRequest) (*models.ForumPost, error) {
	reply := &models.ForumPost{
		ID:         GenerateID(),
		AuthorID:   req.AuthorID,
		AuthorName: req.AuthorName,
		Content:    req.Content,
		ParentID:   &req.PostID,
		IsPinned:   false,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	err := s.repo.CreateReply(reply)
	if err != nil {
		return nil, err
	}

	return reply, nil
}

type UserService struct {
	repo *repositories.UserRepository
}

func NewUserService(repo *repositories.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) GetAllUsers() ([]models.APIUser, error) {
	return s.repo.GetAll()
}

func (s *UserService) GetUserByID(id string) (*models.APIUser, error) {
	return s.repo.GetByID(id)
}

func (s *UserService) GetUserByEmail(email string) (*models.APIUser, error) {
	return s.repo.GetByEmail(email)
}

func (s *UserService) CreateUser(req *models.APIUser) (*models.APIUser, error) {
	user := &models.APIUser{
		ID:        GenerateID(),
		Name:      req.Name,
		Email:     req.Email,
		Profile:   req.Profile,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	err := s.repo.Create(user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) UpdateUser(id string, req *models.UserUpdateRequest) (*models.APIUser, error) {
	user, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	if req.Name != nil {
		user.Name = *req.Name
	}
	if req.Email != nil {
		user.Email = *req.Email
	}
	if req.Profile != nil {
		user.Profile = *req.Profile
	}

	user.UpdatedAt = time.Now()

	err = s.repo.Update(user)
	if err != nil {
		return nil, err
	}

	return user, nil
}
