package models

import "time"

// Grade represents a grade
type Grade struct {
	ID              string    `json:"id" gorm:"primaryKey"`
	StudentID       string    `json:"studentId"`
	StudentName     string    `json:"studentName"`
	AssignmentID    string    `json:"assignmentId"`
	AssignmentTitle string    `json:"assignmentTitle"`
	CourseID        string    `json:"courseId"`
	CourseName      string    `json:"courseName"`
	Score           int       `json:"score"`
	TotalPoints     int       `json:"totalPoints"`
	LetterGrade     string    `json:"letterGrade"`
	Feedback        string    `json:"feedback"`
	GradedBy        string    `json:"gradedBy"`
	GradedAt        time.Time `json:"gradedAt"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

// Enrollment represents a student enrollment in a course
type Enrollment struct {
	ID           string     `json:"id" gorm:"primaryKey"`
	StudentID    string     `json:"studentId"`
	CourseID     string     `json:"courseId"`
	EnrolledAt   time.Time  `json:"enrolledAt"`
	Status       string     `json:"status"`
	Progress     int        `json:"progress"`
	LastAccessed *time.Time `json:"lastAccessed,omitempty"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    time.Time  `json:"updatedAt"`
}

// EnrollmentCreateRequest represents the request to create an enrollment
type EnrollmentCreateRequest struct {
	CourseID  string `json:"courseId" binding:"required"`
	StudentID string `json:"studentId" binding:"required"`
}
