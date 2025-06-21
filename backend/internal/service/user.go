package service

import (
	"github.com/TheApostroff/skill-space/internal/models"
	"github.com/TheApostroff/skill-space/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) CreateUser(user *models.User) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	return s.repo.CreateUser(user)
}

func (s *UserService) LoginUser(user *models.User) (*models.User, error) {
	u, err := s.repo.GetUserByEmail(user.Email)
	if err != nil {
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(user.Password))
	if err != nil {
		return nil, err
	}

	return u, nil
}

func (s *UserService) GetUser(id uint) (*models.User, error) {
	return s.repo.GetUser(id)
}

func (s *UserService) UpdateUser(user *models.User) error {
	return s.repo.UpdateUser(user)
}

func (s *UserService) DeleteUser(id uint) error {
	return s.repo.DeleteUser(id)
}
