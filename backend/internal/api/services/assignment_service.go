package services

import (
	"time"

	"github.com/TheApostroff/skill-space/internal/api/models"
	"github.com/TheApostroff/skill-space/internal/api/repositories"
)

type AssignmentService struct {
	repo *repositories.AssignmentRepository
}

func NewAssignmentService(repo *repositories.AssignmentRepository) *AssignmentService {
	return &AssignmentService{repo: repo}
}

func (s *AssignmentService) GetAllAssignments() ([]models.Assignment, error) {
	return s.repo.GetAll()
}

func (s *AssignmentService) GetAssignmentByID(id string) (*models.Assignment, error) {
	return s.repo.GetByID(id)
}

func (s *AssignmentService) CreateAssignment(req *models.AssignmentCreateRequest, instructorID string) (*models.Assignment, error) {
	assignment := &models.Assignment{
		ID:           GenerateID(),
		Title:        req.Title,
		Description:  req.Description,
		CourseID:     req.CourseID,
		InstructorID: instructorID,
		Type:         req.Type,
		TotalPoints:  req.TotalPoints,
		DueDate:      req.DueDate,
		Status:       "active",
		Instructions: req.Instructions,
		Attachments:  []models.Attachment{},
		Submissions:  []models.Submission{},
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	err := s.repo.Create(assignment)
	if err != nil {
		return nil, err
	}

	return assignment, nil
}

func (s *AssignmentService) SubmitAssignment(req *models.AssignmentSubmitRequest, studentID string) (*models.Submission, error) {
	submission := &models.Submission{
		ID:           GenerateID(),
		AssignmentID: req.AssignmentID,
		StudentID:    studentID,
		Content:      req.Content,
		Status:       "submitted",
		Attachments:  req.Attachments,
		SubmittedAt:  time.Now(),
	}

	err := s.repo.CreateSubmission(submission)
	if err != nil {
		return nil, err
	}

	return submission, nil
}

func (s *AssignmentService) GradeAssignment(req *models.AssignmentGradeRequest, gradedBy string) (*models.Submission, error) {
	submission, err := s.repo.GetSubmissionByID(req.SubmissionID)
	if err != nil {
		return nil, err
	}

	submission.Score = &req.Score
	submission.Feedback = &req.Feedback
	submission.Status = "graded"
	now := time.Now()
	submission.GradedAt = &now

	err = s.repo.UpdateSubmission(submission)
	if err != nil {
		return nil, err
	}

	return submission, nil
}
