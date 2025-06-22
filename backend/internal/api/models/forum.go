package models

import "time"

// ForumPost represents a forum post
type ForumPost struct {
	ID         string      `json:"id" gorm:"primaryKey"`
	ForumID    string      `json:"forumId"`
	AuthorID   string      `json:"authorId"`
	AuthorName string      `json:"authorName"`
	Title      string      `json:"title"`
	Content    string      `json:"content"`
	IsPinned   bool        `json:"isPinned"`
	Replies    []ForumPost `json:"replies" gorm:"foreignKey:ParentID"`
	ParentID   *string     `json:"parentId,omitempty"`
	CreatedAt  time.Time   `json:"createdAt"`
	UpdatedAt  time.Time   `json:"updatedAt"`
}

// ForumPostCreateRequest represents the request to create a forum post
type ForumPostCreateRequest struct {
	ForumID    string `json:"forumId" binding:"required"`
	Title      string `json:"title" binding:"required"`
	Content    string `json:"content" binding:"required"`
	AuthorID   string `json:"authorId" binding:"required"`
	AuthorName string `json:"authorName" binding:"required"`
}

// ForumReplyCreateRequest represents the request to create a forum reply
type ForumReplyCreateRequest struct {
	PostID     string `json:"postId" binding:"required"`
	Content    string `json:"content" binding:"required"`
	AuthorID   string `json:"authorId" binding:"required"`
	AuthorName string `json:"authorName" binding:"required"`
}
