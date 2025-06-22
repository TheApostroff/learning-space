package services

import (
	"time"

	"github.com/TheApostroff/skill-space/internal/api/models"
	"github.com/TheApostroff/skill-space/internal/api/repositories"
)

type GradeService struct {
	gradeRepo      *repositories.GradeRepository
	enrollmentRepo *repositories.EnrollmentRepository
}

func NewGradeService(gradeRepo *repositories.GradeRepository, enrollmentRepo *repositories.EnrollmentRepository) *GradeService {
	return &GradeService{
		gradeRepo:      gradeRepo,
		enrollmentRepo: enrollmentRepo,
	}
}

func (s *GradeService) GetAllGrades() ([]models.Grade, error) {
	return s.gradeRepo.GetAll()
}

func (s *GradeService) GetGradesByStudentID(studentID string) ([]models.Grade, error) {
	return s.gradeRepo.GetByStudentID(studentID)
}

func (s *GradeService) GetAllEnrollments() ([]models.Enrollment, error) {
	return s.enrollmentRepo.GetAll()
}

func (s *GradeService) CreateEnrollment(req *models.EnrollmentCreateRequest) (*models.Enrollment, error) {
	enrollment := &models.Enrollment{
		ID:         GenerateID(),
		StudentID:  req.StudentID,
		CourseID:   req.CourseID,
		EnrolledAt: time.Now(),
		Status:     "active",
		Progress:   0,
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	err := s.enrollmentRepo.Create(enrollment)
	if err != nil {
		return nil, err
	}

	return enrollment, nil
}
