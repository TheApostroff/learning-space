package repositories

import (
	"github.com/TheApostroff/skill-space/internal/api/models"
	"gorm.io/gorm"
)

type CourseRepository struct {
	db *gorm.DB
}

func NewCourseRepository(db *gorm.DB) *CourseRepository {
	return &CourseRepository{db: db}
}

func (r *CourseRepository) GetAll() ([]models.Course, error) {
	var courses []models.Course
	err := r.db.Preload("Resources").Find(&courses).Error
	return courses, err
}

func (r *CourseRepository) GetByID(id string) (*models.Course, error) {
	var course models.Course
	err := r.db.Preload("Resources").First(&course, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &course, nil
}

func (r *CourseRepository) Create(course *models.Course) error {
	return r.db.Create(course).Error
}

func (r *CourseRepository) Update(course *models.Course) error {
	return r.db.Save(course).Error
}

func (r *CourseRepository) Delete(id string) error {
	return r.db.Delete(&models.Course{}, "id = ?", id).Error
}
