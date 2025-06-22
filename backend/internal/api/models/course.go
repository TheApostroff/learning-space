package models

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"
)

// StringSlice is a custom type for handling string arrays in GORM
type StringSlice []string

func (s StringSlice) Value() (driver.Value, error) {
	if len(s) == 0 {
		return "[]", nil
	}
	return json.Marshal(s)
}

func (s *StringSlice) Scan(value interface{}) error {
	if value == nil {
		*s = StringSlice{}
		return nil
	}

	var bytes []byte
	switch v := value.(type) {
	case []byte:
		bytes = v
	case string:
		bytes = []byte(v)
	default:
		return fmt.Errorf("cannot scan %T into StringSlice", value)
	}

	return json.Unmarshal(bytes, s)
}

// Course represents a course
type Course struct {
	ID               string      `json:"id" gorm:"primaryKey"`
	Title            string      `json:"title"`
	Description      string      `json:"description"`
	InstructorID     string      `json:"instructorId"`
	Category         string      `json:"category"`
	Level            string      `json:"level"`
	Duration         string      `json:"duration"`
	EnrolledStudents StringSlice `json:"enrolledStudents" gorm:"type:text"`
	MaxStudents      int         `json:"maxStudents"`
	StartDate        string      `json:"startDate"`
	EndDate          string      `json:"endDate"`
	Status           string      `json:"status"`
	Syllabus         StringSlice `json:"syllabus" gorm:"type:text"`
	Resources        []Resource  `json:"resources" gorm:"foreignKey:CourseID"`
	CreatedAt        time.Time   `json:"createdAt"`
	UpdatedAt        time.Time   `json:"updatedAt"`
}

// CourseCreateRequest represents the request to create a course
type CourseCreateRequest struct {
	Title       string      `json:"title" binding:"required"`
	Description string      `json:"description" binding:"required"`
	Category    string      `json:"category" binding:"required"`
	Level       string      `json:"level" binding:"required"`
	Duration    string      `json:"duration" binding:"required"`
	MaxStudents int         `json:"maxStudents" binding:"required"`
	StartDate   string      `json:"startDate" binding:"required"`
	EndDate     string      `json:"endDate" binding:"required"`
	Syllabus    StringSlice `json:"syllabus"`
}

// CourseUpdateRequest represents the request to update a course
type CourseUpdateRequest struct {
	Title       *string `json:"title,omitempty"`
	Description *string `json:"description,omitempty"`
	MaxStudents *int    `json:"maxStudents,omitempty"`
}
