package models

import "time"

// GenerativeTask represents an AI-generated task
type GenerativeTask struct {
	ID            string      `json:"id" gorm:"primaryKey"`
	ActivityID    string      `json:"activityId"`
	StudentID     string      `json:"studentId"`
	Title         string      `json:"title"`
	Description   string      `json:"description"`
	Requirements  StringSlice `json:"requirements" gorm:"type:text"`
	Difficulty    string      `json:"difficulty"`
	EstimatedTime int         `json:"estimatedTime"`
	Hints         StringSlice `json:"hints" gorm:"type:text"`
	CreatedAt     time.Time   `json:"createdAt"`
	UpdatedAt     time.Time   `json:"updatedAt"`
}

// GenerativeTaskSubmission represents a submission for a generative task
type GenerativeTaskSubmission struct {
	ID        string     `json:"id" gorm:"primaryKey"`
	TaskID    string     `json:"taskId"`
	StudentID string     `json:"studentId"`
	Code      string     `json:"code"`
	Score     int        `json:"score"`
	Feedback  string     `json:"feedback"`
	TestCases []TestCase `json:"testCases" gorm:"foreignKey:SubmissionID"`
	CreatedAt time.Time  `json:"createdAt"`
}

// TestCase represents a test case result
type TestCase struct {
	ID           string `json:"id" gorm:"primaryKey"`
	SubmissionID string `json:"-"`
	Name         string `json:"name"`
	Passed       bool   `json:"passed"`
}

// GenerativeTaskGenerateRequest represents the request to generate a task
type GenerativeTaskGenerateRequest struct {
	ActivityID string `json:"activityId" binding:"required"`
	Difficulty string `json:"difficulty" binding:"required"`
	StudentID  string `json:"studentId" binding:"required"`
}

// GenerativeTaskSubmitRequest represents the request to submit a generative task
type GenerativeTaskSubmitRequest struct {
	TaskID    string `json:"taskId" binding:"required"`
	Code      string `json:"code" binding:"required"`
	StudentID string `json:"studentId" binding:"required"`
}
