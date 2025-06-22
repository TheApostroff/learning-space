package repositories

import (
	"github.com/TheApostroff/skill-space/internal/api/models"
	"gorm.io/gorm"
)

type ForumRepository struct {
	db *gorm.DB
}

func NewForumRepository(db *gorm.DB) *ForumRepository {
	return &ForumRepository{db: db}
}

func (r *ForumRepository) GetByForumID(forumID string) ([]models.ForumPost, error) {
	var posts []models.ForumPost
	err := r.db.Preload("Replies").Where("forum_id = ? AND parent_id IS NULL", forumID).Find(&posts).Error
	return posts, err
}

func (r *ForumRepository) Create(post *models.ForumPost) error {
	return r.db.Create(post).Error
}

func (r *ForumRepository) CreateReply(reply *models.ForumPost) error {
	return r.db.Create(reply).Error
}

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) GetAll() ([]models.APIUser, error) {
	var users []models.APIUser
	err := r.db.Find(&users).Error
	return users, err
}

func (r *UserRepository) GetByID(id string) (*models.APIUser, error) {
	var user models.APIUser
	err := r.db.First(&user, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetByEmail(email string) (*models.APIUser, error) {
	var user models.APIUser
	err := r.db.First(&user, "email = ?", email).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) Update(user *models.APIUser) error {
	return r.db.Save(user).Error
}

func (r *UserRepository) Create(user *models.APIUser) error {
	return r.db.Create(user).Error
}
