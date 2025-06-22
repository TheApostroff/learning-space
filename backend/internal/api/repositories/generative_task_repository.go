package repositories

import (
	"github.com/TheApostroff/skill-space/internal/api/models"
	"gorm.io/gorm"
)

type GenerativeTaskRepository struct {
	db *gorm.DB
}

func NewGenerativeTaskRepository(db *gorm.DB) *GenerativeTaskRepository {
	return &GenerativeTaskRepository{db: db}
}

func (r *GenerativeTaskRepository) Create(task *models.GenerativeTask) error {
	return r.db.Create(task).Error
}

func (r *GenerativeTaskRepository) GetByID(id string) (*models.GenerativeTask, error) {
	var task models.GenerativeTask
	err := r.db.First(&task, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &task, nil
}

func (r *GenerativeTaskRepository) CreateSubmission(submission *models.GenerativeTaskSubmission) error {
	return r.db.Create(submission).Error
}

func (r *GenerativeTaskRepository) GetSubmissionByID(id string) (*models.GenerativeTaskSubmission, error) {
	var submission models.GenerativeTaskSubmission
	err := r.db.Preload("TestCases").First(&submission, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &submission, nil
}
