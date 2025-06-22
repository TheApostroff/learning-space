package repositories

import (
	"github.com/TheApostroff/skill-space/internal/api/models"
	"gorm.io/gorm"
)

type AssignmentRepository struct {
	db *gorm.DB
}

func NewAssignmentRepository(db *gorm.DB) *AssignmentRepository {
	return &AssignmentRepository{db: db}
}

func (r *AssignmentRepository) GetAll() ([]models.Assignment, error) {
	var assignments []models.Assignment
	err := r.db.Preload("Attachments").Preload("Submissions").Find(&assignments).Error
	return assignments, err
}

func (r *AssignmentRepository) GetByID(id string) (*models.Assignment, error) {
	var assignment models.Assignment
	err := r.db.Preload("Attachments").Preload("Submissions").First(&assignment, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &assignment, nil
}

func (r *AssignmentRepository) Create(assignment *models.Assignment) error {
	return r.db.Create(assignment).Error
}

func (r *AssignmentRepository) CreateSubmission(submission *models.Submission) error {
	return r.db.Create(submission).Error
}

func (r *AssignmentRepository) UpdateSubmission(submission *models.Submission) error {
	return r.db.Save(submission).Error
}

func (r *AssignmentRepository) GetSubmissionByID(id string) (*models.Submission, error) {
	var submission models.Submission
	err := r.db.First(&submission, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &submission, nil
}
