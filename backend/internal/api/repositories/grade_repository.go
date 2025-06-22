package repositories

import (
	"github.com/TheApostroff/skill-space/internal/api/models"
	"gorm.io/gorm"
)

type GradeRepository struct {
	db *gorm.DB
}

func NewGradeRepository(db *gorm.DB) *GradeRepository {
	return &GradeRepository{db: db}
}

func (r *GradeRepository) GetAll() ([]models.Grade, error) {
	var grades []models.Grade
	err := r.db.Find(&grades).Error
	return grades, err
}

func (r *GradeRepository) GetByStudentID(studentID string) ([]models.Grade, error) {
	var grades []models.Grade
	err := r.db.Where("student_id = ?", studentID).Find(&grades).Error
	return grades, err
}

func (r *GradeRepository) Create(grade *models.Grade) error {
	return r.db.Create(grade).Error
}

type EnrollmentRepository struct {
	db *gorm.DB
}

func NewEnrollmentRepository(db *gorm.DB) *EnrollmentRepository {
	return &EnrollmentRepository{db: db}
}

func (r *EnrollmentRepository) GetAll() ([]models.Enrollment, error) {
	var enrollments []models.Enrollment
	err := r.db.Find(&enrollments).Error
	return enrollments, err
}

func (r *EnrollmentRepository) Create(enrollment *models.Enrollment) error {
	return r.db.Create(enrollment).Error
}
