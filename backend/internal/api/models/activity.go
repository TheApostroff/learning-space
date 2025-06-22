package models

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"
)

// ActivityMetadata is a custom type for handling metadata JSON in GORM
type ActivityMetadata map[string]interface{}

func (a ActivityMetadata) Value() (driver.Value, error) {
	if len(a) == 0 {
		return "{}", nil
	}
	return json.Marshal(a)
}

func (a *ActivityMetadata) Scan(value interface{}) error {
	if value == nil {
		*a = ActivityMetadata{}
		return nil
	}

	var bytes []byte
	switch v := value.(type) {
	case []byte:
		bytes = v
	case string:
		bytes = []byte(v)
	default:
		return fmt.Errorf("cannot scan %T into ActivityMetadata", value)
	}

	return json.Unmarshal(bytes, a)
}

// Section represents a course section
type Section struct {
	ID          string     `json:"id" gorm:"primaryKey"`
	CourseID    string     `json:"courseId"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Order       int        `json:"order"`
	Visible     bool       `json:"visible"`
	Activities  []Activity `json:"activities" gorm:"foreignKey:SectionID"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

// Activity represents an activity within a section
type Activity struct {
	ID             string           `json:"id" gorm:"primaryKey"`
	SectionID      string           `json:"sectionId"`
	Title          string           `json:"title"`
	Description    string           `json:"description"`
	Type           string           `json:"type"`
	Order          int              `json:"order"`
	Visible        bool             `json:"visible"`
	Completed      bool             `json:"completed"`
	DueDate        *string          `json:"dueDate,omitempty"`
	AvailableFrom  *string          `json:"availableFrom,omitempty"`
	AvailableUntil *string          `json:"availableUntil,omitempty"`
	Metadata       ActivityMetadata `json:"metadata" gorm:"type:text"`
	CreatedAt      time.Time        `json:"createdAt"`
	UpdatedAt      time.Time        `json:"updatedAt"`
}

// SectionCreateRequest represents the request to create a section
type SectionCreateRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	Order       int    `json:"order" binding:"required"`
	Visible     bool   `json:"visible"`
}

// ActivityCreateRequest represents the request to create an activity
type ActivityCreateRequest struct {
	Title          string                 `json:"title" binding:"required"`
	Description    string                 `json:"description"`
	Type           string                 `json:"type" binding:"required"`
	Order          int                    `json:"order" binding:"required"`
	Visible        bool                   `json:"visible"`
	DueDate        *string                `json:"dueDate,omitempty"`
	AvailableFrom  *string                `json:"availableFrom,omitempty"`
	AvailableUntil *string                `json:"availableUntil,omitempty"`
	Metadata       map[string]interface{} `json:"metadata"`
}

// ActivityUpdateRequest represents the request to update an activity
type ActivityUpdateRequest struct {
	Title       *string `json:"title,omitempty"`
	Description *string `json:"description,omitempty"`
	Visible     *bool   `json:"visible,omitempty"`
}
