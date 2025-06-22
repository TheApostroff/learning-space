package models

import "time"

// UserProfile represents user profile information
type UserProfile struct {
	Bio        string `json:"bio"`
	Department string `json:"department"`
	Phone      string `json:"phone"`
	Address    string `json:"address"`
}

// APIUser represents a user in the API context
type APIUser struct {
	ID        string      `json:"id" gorm:"primaryKey"`
	Name      string      `json:"name"`
	Email     string      `json:"email"`
	Role      string      `json:"role"`
	Avatar    string      `json:"avatar"`
	Profile   UserProfile `json:"profile" gorm:"embedded"`
	CreatedAt time.Time   `json:"createdAt"`
	LastLogin *time.Time  `json:"lastLogin,omitempty"`
	UpdatedAt time.Time   `json:"updatedAt"`
}

// UserUpdateRequest represents the request to update a user
type UserUpdateRequest struct {
	Name    *string      `json:"name,omitempty"`
	Email   *string      `json:"email,omitempty"`
	Profile *UserProfile `json:"profile,omitempty"`
}
