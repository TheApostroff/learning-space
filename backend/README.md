# Learning Space API Implementation

This directory contains the complete API implementation for the Learning Space application, built according to the specifications in `frontend/API_ENDPOINTS_SPECIFICATION.md`.

## Structure

```
internal/api/
├── controllers/          # HTTP request handlers
├── models/              # Data models and DTOs
├── repositories/        # Database access layer
├── services/           # Business logic layer
└── router.go           # API routes configuration
```

## Features Implemented

### 1. Course Management
- **GET /api/courses** - Get all courses
- **POST /api/courses** - Create a new course
- **GET /api/courses/{courseId}** - Get specific course
- **PUT /api/courses/{courseId}** - Update course
- **DELETE /api/courses/{courseId}** - Delete course

### 2. Course Sections and Activities
- **GET /api/courses/{courseId}/sections** - Get course sections
- **POST /api/courses/{courseId}/sections** - Create section
- **GET /api/courses/{courseId}/activities/{activityId}** - Get activity
- **POST /api/sections/{sectionId}/activities** - Create activity
- **PUT /api/activities/{activityId}** - Update activity
- **DELETE /api/activities/{activityId}** - Delete activity

### 3. Assignment Management
- **GET /api/assignments** - Get all assignments
- **POST /api/assignments** - Create assignment
- **GET /api/assignments/{assignmentId}** - Get assignment
- **POST /api/assignments/submit** - Submit assignment
- **POST /api/assignments/grade** - Grade assignment

### 4. Generative Tasks (AI-powered)
- **POST /api/generative-tasks/generate** - Generate AI task
- **POST /api/generative-tasks/submit** - Submit task solution
- **GET /api/generative-tasks/{taskId}/hints** - Get task hints

### 5. Grades and Enrollments
- **GET /api/grades** - Get all grades
- **GET /api/grades/student/{studentId}** - Get student grades
- **GET /api/enrollments** - Get all enrollments
- **POST /api/enrollments** - Create enrollment

### 6. Forum System
- **GET /api/forum-posts?forumId={forumId}** - Get forum posts
- **POST /api/forum-posts** - Create forum post
- **POST /api/forum-posts/reply** - Create reply

### 7. User Management
- **GET /api/users** - Get all users
- **GET /api/users/{userId}** - Get user
- **PUT /api/users/{userId}** - Update user

## Response Format

All API responses follow the standard format:
```json
{
  "success": boolean,
  "data": any,
  "error": string (optional),
  "message": string (optional)
}
```

## Authentication

Currently using mock authentication. In production, implement proper JWT-based authentication and authorization.

## Database Models

The implementation includes complete GORM models with proper relationships:
- Course → Resources (one-to-many)
- Course → Sections → Activities (nested relationships)
- Assignment → Submissions → Attachments (complex relationships)
- Forum posts with threaded replies
- User profiles with embedded data

## Running the API

The API is integrated into the main application. Run:

```bash
cd backend
go run cmd/main.go
```

The API will be available at `http://localhost:3001/api` (or configured port).

## CORS Configuration

CORS is configured to allow requests from:
- http://localhost:3000 (frontend dev server)
- http://localhost:3001 (API server)

## Development Notes

1. **Mock Data**: The AI task generation currently returns mock data. In production, integrate with actual AI services.

2. **File Uploads**: File attachment URLs are stored as strings. Implement actual file upload handling as needed.

3. **Validation**: Basic validation is implemented. Add more comprehensive validation rules as needed.

4. **Error Handling**: Standard error responses are implemented. Enhance with more specific error codes if needed.

5. **Database Migration**: All models are auto-migrated when the application starts.

## Future Enhancements

- JWT authentication and authorization
- File upload handling
- Real AI integration for generative tasks
- Caching layer for better performance
- API rate limiting
- Comprehensive logging and monitoring
