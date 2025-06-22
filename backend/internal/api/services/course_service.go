package services

import (
	"time"

	"github.com/TheApostroff/skill-space/internal/api/models"
	"github.com/TheApostroff/skill-space/internal/api/repositories"
)

type CourseService struct {
	repo *repositories.CourseRepository
}

func NewCourseService(repo *repositories.CourseRepository) *CourseService {
	return &CourseService{repo: repo}
}

func (s *CourseService) GetAllCourses() ([]models.Course, error) {
	return s.repo.GetAll()
}

func (s *CourseService) GetCourseByID(id string) (*models.Course, error) {
	return s.repo.GetByID(id)
}

func (s *CourseService) CreateCourse(req *models.CourseCreateRequest, instructorID string) (*models.Course, error) {
	course := &models.Course{
		ID:               GenerateID(),
		Title:            req.Title,
		Description:      req.Description,
		InstructorID:     instructorID,
		Category:         req.Category,
		Level:            req.Level,
		Duration:         req.Duration,
		EnrolledStudents: models.StringSlice{},
		MaxStudents:      req.MaxStudents,
		StartDate:        req.StartDate,
		EndDate:          req.EndDate,
		Status:           "active",
		Syllabus:         req.Syllabus,
		Resources:        []models.Resource{},
		CreatedAt:        time.Now(),
		UpdatedAt:        time.Now(),
	}

	err := s.repo.Create(course)
	if err != nil {
		return nil, err
	}

	return course, nil
}

func (s *CourseService) UpdateCourse(id string, req *models.CourseUpdateRequest) (*models.Course, error) {
	course, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	if req.Title != nil {
		course.Title = *req.Title
	}
	if req.Description != nil {
		course.Description = *req.Description
	}
	if req.MaxStudents != nil {
		course.MaxStudents = *req.MaxStudents
	}

	course.UpdatedAt = time.Now()

	err = s.repo.Update(course)
	if err != nil {
		return nil, err
	}

	return course, nil
}

func (s *CourseService) DeleteCourse(id string) error {
	return s.repo.Delete(id)
}
