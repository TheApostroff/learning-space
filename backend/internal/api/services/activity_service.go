package services

import (
	"time"

	"github.com/TheApostroff/skill-space/internal/api/models"
	"github.com/TheApostroff/skill-space/internal/api/repositories"
)

type ActivityService struct {
	sectionRepo  *repositories.SectionRepository
	activityRepo *repositories.ActivityRepository
}

func NewActivityService(sectionRepo *repositories.SectionRepository, activityRepo *repositories.ActivityRepository) *ActivityService {
	return &ActivityService{
		sectionRepo:  sectionRepo,
		activityRepo: activityRepo,
	}
}

func (s *ActivityService) GetSectionsByCourseID(courseID string) ([]models.Section, error) {
	return s.sectionRepo.GetByCourseID(courseID)
}

func (s *ActivityService) CreateSection(courseID string, req *models.SectionCreateRequest) (*models.Section, error) {
	section := &models.Section{
		ID:          GenerateID(),
		CourseID:    courseID,
		Title:       req.Title,
		Description: req.Description,
		Order:       req.Order,
		Visible:     req.Visible,
		Activities:  []models.Activity{},
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	err := s.sectionRepo.Create(section)
	if err != nil {
		return nil, err
	}

	return section, nil
}

func (s *ActivityService) GetActivityByID(activityID string) (*models.Activity, error) {
	return s.activityRepo.GetByID(activityID)
}

func (s *ActivityService) CreateActivity(sectionID string, req *models.ActivityCreateRequest) (*models.Activity, error) {
	activity := &models.Activity{
		ID:             GenerateID(),
		SectionID:      sectionID,
		Title:          req.Title,
		Description:    req.Description,
		Type:           req.Type,
		Order:          req.Order,
		Visible:        req.Visible,
		Completed:      false,
		DueDate:        req.DueDate,
		AvailableFrom:  req.AvailableFrom,
		AvailableUntil: req.AvailableUntil,
		Metadata:       models.ActivityMetadata(req.Metadata),
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}

	err := s.activityRepo.Create(activity)
	if err != nil {
		return nil, err
	}

	return activity, nil
}

func (s *ActivityService) UpdateActivity(activityID string, req *models.ActivityUpdateRequest) (*models.Activity, error) {
	activity, err := s.activityRepo.GetByID(activityID)
	if err != nil {
		return nil, err
	}

	if req.Title != nil {
		activity.Title = *req.Title
	}
	if req.Description != nil {
		activity.Description = *req.Description
	}
	if req.Visible != nil {
		activity.Visible = *req.Visible
	}

	activity.UpdatedAt = time.Now()

	err = s.activityRepo.Update(activity)
	if err != nil {
		return nil, err
	}

	return activity, nil
}

func (s *ActivityService) DeleteActivity(activityID string) error {
	return s.activityRepo.Delete(activityID)
}
