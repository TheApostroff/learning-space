package repository

import (
	"github.com/TheApostroff/skill-space/internal/models"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) CreateUser(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) GetUser(id uint) (*models.User, error) {
	var user models.User
	err := r.db.Where("id = ?", id).First(&user).Error
	return &user, err
}

func (r *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	return &user, err
}

func (r *UserRepository) UpdateUser(user *models.User) error {
	return r.db.Where("id = ?", user.ID).Save(user).Error
}

func (r *UserRepository) DeleteUser(id uint) error {
	return r.db.Where("id = ?", id).Delete(&models.User{}).Error
}
