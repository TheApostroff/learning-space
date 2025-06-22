package models

import "time"

// APIResponse represents the standard API response format
type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
	Message string      `json:"message,omitempty"`
}

// Resource represents a file resource
type Resource struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	CourseID    string    `json:"courseId"`
	Title       string    `json:"title"`
	Type        string    `json:"type"`
	URL         string    `json:"url"`
	Description string    `json:"description"`
	UploadedAt  time.Time `json:"uploadedAt"`
}

// Attachment represents a file attachment
type Attachment struct {
	ID           string    `json:"id" gorm:"primaryKey"`
	AssignmentID *string   `json:"assignmentId,omitempty"`
	SubmissionID *string   `json:"submissionId,omitempty"`
	Title        string    `json:"title"`
	Type         string    `json:"type"`
	URL          string    `json:"url"`
	Description  string    `json:"description"`
	UploadedAt   time.Time `json:"uploadedAt"`
}
