package models

import "time"

// Assignment represents an assignment
type Assignment struct {
	ID           string       `json:"id" gorm:"primaryKey"`
	Title        string       `json:"title"`
	Description  string       `json:"description"`
	CourseID     string       `json:"courseId"`
	InstructorID string       `json:"instructorId"`
	Type         string       `json:"type"`
	TotalPoints  int          `json:"totalPoints"`
	DueDate      string       `json:"dueDate"`
	Status       string       `json:"status"`
	Instructions string       `json:"instructions"`
	Attachments  []Attachment `json:"attachments" gorm:"foreignKey:AssignmentID"`
	Submissions  []Submission `json:"submissions" gorm:"foreignKey:AssignmentID"`
	CreatedAt    time.Time    `json:"createdAt"`
	UpdatedAt    time.Time    `json:"updatedAt"`
}

// Submission represents an assignment submission
type Submission struct {
	ID           string       `json:"id" gorm:"primaryKey"`
	AssignmentID string       `json:"assignmentId"`
	StudentID    string       `json:"studentId"`
	Content      string       `json:"content"`
	Score        *int         `json:"score,omitempty"`
	Feedback     *string      `json:"feedback,omitempty"`
	Status       string       `json:"status"`
	Attachments  []Attachment `json:"attachments" gorm:"foreignKey:SubmissionID"`
	SubmittedAt  time.Time    `json:"submittedAt"`
	GradedAt     *time.Time   `json:"gradedAt,omitempty"`
}

// AssignmentCreateRequest represents the request to create an assignment
type AssignmentCreateRequest struct {
	Title        string `json:"title" binding:"required"`
	Description  string `json:"description" binding:"required"`
	CourseID     string `json:"courseId" binding:"required"`
	Type         string `json:"type" binding:"required"`
	TotalPoints  int    `json:"totalPoints" binding:"required"`
	DueDate      string `json:"dueDate" binding:"required"`
	Instructions string `json:"instructions"`
}

// AssignmentSubmitRequest represents the request to submit an assignment
type AssignmentSubmitRequest struct {
	AssignmentID string       `json:"assignmentId" binding:"required"`
	Content      string       `json:"content" binding:"required"`
	Attachments  []Attachment `json:"attachments"`
}

// AssignmentGradeRequest represents the request to grade an assignment
type AssignmentGradeRequest struct {
	SubmissionID string `json:"submissionId" binding:"required"`
	Score        int    `json:"score" binding:"required"`
	Feedback     string `json:"feedback"`
}
