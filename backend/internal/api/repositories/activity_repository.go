package repositories

import (
	"github.com/TheApostroff/skill-space/internal/api/models"
	"gorm.io/gorm"
)

type SectionRepository struct {
	db *gorm.DB
}

func NewSectionRepository(db *gorm.DB) *SectionRepository {
	return &SectionRepository{db: db}
}

func (r *SectionRepository) GetByCourseID(courseID string) ([]models.Section, error) {
	var sections []models.Section
	err := r.db.Preload("Activities").Where("course_id = ?", courseID).Find(&sections).Error
	return sections, err
}

func (r *SectionRepository) Create(section *models.Section) error {
	return r.db.Create(section).Error
}

type ActivityRepository struct {
	db *gorm.DB
}

func NewActivityRepository(db *gorm.DB) *ActivityRepository {
	return &ActivityRepository{db: db}
}

func (r *ActivityRepository) GetByID(id string) (*models.Activity, error) {
	var activity models.Activity
	err := r.db.First(&activity, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &activity, nil
}

func (r *ActivityRepository) Create(activity *models.Activity) error {
	return r.db.Create(activity).Error
}

func (r *ActivityRepository) Update(activity *models.Activity) error {
	return r.db.Save(activity).Error
}

func (r *ActivityRepository) Delete(id string) error {
	return r.db.Delete(&models.Activity{}, "id = ?", id).Error
}
