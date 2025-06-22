package services

import (
	"math/rand"
	"time"

	"github.com/TheApostroff/skill-space/internal/api/models"
	"github.com/TheApostroff/skill-space/internal/api/repositories"
)

type GenerativeTaskService struct {
	repo *repositories.GenerativeTaskRepository
}

func NewGenerativeTaskService(repo *repositories.GenerativeTaskRepository) *GenerativeTaskService {
	return &GenerativeTaskService{repo: repo}
}

func (s *GenerativeTaskService) GenerateTask(req *models.GenerativeTaskGenerateRequest) (*models.GenerativeTask, error) {
	// Mock AI generation - in a real implementation, this would call an AI service
	task := &models.GenerativeTask{
		ID:          GenerateID(),
		ActivityID:  req.ActivityID,
		StudentID:   req.StudentID,
		Title:       "AI Generated Task - " + req.Difficulty,
		Description: "Create a responsive web component using modern CSS techniques",
		Requirements: models.StringSlice{
			"Use CSS Grid or Flexbox for layout",
			"Make it responsive for all screen sizes",
			"Include hover effects and transitions",
			"Follow accessibility guidelines",
		},
		Difficulty:    req.Difficulty,
		EstimatedTime: 30,
		Hints: models.StringSlice{
			"Start with mobile-first approach",
			"Use CSS custom properties for theming",
			"Test your code frequently",
		},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	err := s.repo.Create(task)
	if err != nil {
		return nil, err
	}

	return task, nil
}

func (s *GenerativeTaskService) SubmitTask(req *models.GenerativeTaskSubmitRequest) (*models.GenerativeTaskSubmission, error) {
	// Mock evaluation - in a real implementation, this would evaluate the code
	score := rand.Intn(40) + 60 // Random score between 60-100

	submission := &models.GenerativeTaskSubmission{
		ID:        GenerateID(),
		TaskID:    req.TaskID,
		StudentID: req.StudentID,
		Code:      req.Code,
		Score:     score,
		Feedback:  "Good work! Your solution demonstrates understanding of the concepts.",
		TestCases: []models.TestCase{
			{
				ID:     GenerateID(),
				Name:   "Responsive Design",
				Passed: true,
			},
			{
				ID:     GenerateID(),
				Name:   "CSS Implementation",
				Passed: true,
			},
			{
				ID:     GenerateID(),
				Name:   "Accessibility",
				Passed: score > 80,
			},
		},
		CreatedAt: time.Now(),
	}

	err := s.repo.CreateSubmission(submission)
	if err != nil {
		return nil, err
	}

	return submission, nil
}

func (s *GenerativeTaskService) GetTaskHints(taskID string, difficulty string) ([]string, error) {
	task, err := s.repo.GetByID(taskID)
	if err != nil {
		return nil, err
	}

	return []string(task.Hints), nil
}
