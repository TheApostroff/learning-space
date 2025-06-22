# API Endpoints Specification

This document contains all the API endpoints that the frontend expects from the backend server. Each endpoint includes request/response examples and data structures.

## Base URL
```
http://localhost:3001/api
```

## Response Format
All API responses must follow this format:
```json
{
  "success": boolean,
  "data": any,
  "error": string (optional),
  "message": string (optional)
}
```

## Authentication
*Note: Authentication headers will be added in future iterations*

## Endpoints

### 1. Courses

#### GET /courses
**Description:** Get all courses

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "course-1",
      "title": "Introduction to Web Development",
      "description": "Learn the fundamentals of HTML, CSS, and JavaScript",
      "instructorId": "professor-1",
      "category": "Programming",
      "level": "beginner",
      "duration": "8 weeks",
      "enrolledStudents": ["student-1", "student-2"],
      "maxStudents": 50,
      "startDate": "2024-01-15",
      "endDate": "2024-03-15",
      "status": "active",
      "syllabus": ["Week 1: HTML Basics", "Week 2: CSS Styling"],
      "resources": [
        {
          "id": "resource-1",
          "title": "Course Syllabus",
          "type": "pdf",
          "url": "/resources/syllabus.pdf",
          "description": "Complete course syllabus",
          "uploadedAt": "2024-01-10T10:00:00Z"
        }
      ],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  ],
  "message": "Courses retrieved successfully"
}
```

#### GET /courses/{courseId}
**Description:** Get a specific course

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "course-1",
    "title": "Introduction to Web Development",
    "description": "Learn the fundamentals of HTML, CSS, and JavaScript",
    "instructorId": "professor-1",
    "category": "Programming",
    "level": "beginner",
    "duration": "8 weeks",
    "enrolledStudents": ["student-1", "student-2"],
    "maxStudents": 50,
    "startDate": "2024-01-15",
    "endDate": "2024-03-15",
    "status": "active",
    "syllabus": ["Week 1: HTML Basics", "Week 2: CSS Styling"],
    "resources": [...],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T00:00:00Z"
  },
  "message": "Course retrieved successfully"
}
```

#### POST /courses
**Description:** Create a new course

**Request:**
```json
{
  "title": "Advanced React Development",
  "description": "Master React hooks, context, and advanced patterns",
  "category": "Programming",
  "level": "advanced",
  "duration": "10 weeks",
  "maxStudents": 30,
  "startDate": "2024-02-01",
  "endDate": "2024-04-15",
  "syllabus": ["Week 1: React Hooks", "Week 2: Context API"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "course-123",
    "title": "Advanced React Development",
    "description": "Master React hooks, context, and advanced patterns",
    "instructorId": "professor-1",
    "category": "Programming",
    "level": "advanced",
    "duration": "10 weeks",
    "enrolledStudents": [],
    "maxStudents": 30,
    "startDate": "2024-02-01",
    "endDate": "2024-04-15",
    "status": "active",
    "syllabus": ["Week 1: React Hooks", "Week 2: Context API"],
    "resources": [],
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  },
  "message": "Course created successfully"
}
```

#### PUT /courses/{courseId}
**Description:** Update a course

**Request:**
```json
{
  "title": "Updated Course Title",
  "description": "Updated description",
  "maxStudents": 40
}
```

#### DELETE /courses/{courseId}
**Description:** Delete a course

**Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

### 2. Course Sections

#### GET /courses/{courseId}/sections
**Description:** Get all sections for a course

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "section-1",
      "courseId": "course-1",
      "title": "HTML Fundamentals",
      "description": "Learn the basics of HTML markup",
      "order": 1,
      "visible": true,
      "activities": [
        {
          "id": "activity-1",
          "sectionId": "section-1",
          "title": "Introduction to HTML",
          "description": "Learn about HTML structure and elements",
          "type": "video",
          "order": 1,
          "visible": true,
          "completed": false,
          "metadata": {
            "videoUrl": "/videos/intro-html.mp4",
            "videoDuration": "15:30",
            "fileSize": "45MB"
          }
        }
      ]
    }
  ],
  "message": "Course sections retrieved successfully"
}
```

#### POST /courses/{courseId}/sections
**Description:** Create a new section

**Request:**
```json
{
  "title": "CSS Styling",
  "description": "Learn CSS fundamentals and styling techniques",
  "order": 2,
  "visible": true
}
```

### 3. Activities

#### GET /courses/{courseId}/activities/{activityId}
**Description:** Get a specific activity

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "activity-1",
    "sectionId": "section-1",
    "title": "Introduction to HTML",
    "description": "Learn about HTML structure and elements",
    "type": "video",
    "order": 1,
    "visible": true,
    "completed": false,
    "dueDate": "2024-02-15",
    "availableFrom": "2024-01-15",
    "availableUntil": "2024-03-15",
    "metadata": {
      "videoUrl": "/videos/intro-html.mp4",
      "videoDuration": "15:30",
      "fileSize": "45MB",
      "fileType": "mp4",
      "url": "https://example.com/video",
      "attempts": 3,
      "timeLimit": 30,
      "questions": 10,
      "points": 100,
      "aiModel": "gpt-4",
      "creativityLevel": "medium",
      "difficulty": "easy",
      "taskType": "coding",
      "estimatedTime": 30
    }
  },
  "message": "Activity retrieved successfully"
}
```

#### POST /sections/{sectionId}/activities
**Description:** Create a new activity

**Request:**
```json
{
  "title": "CSS Layout Challenge",
  "description": "Practice CSS Grid and Flexbox",
  "type": "generative-task",
  "order": 3,
  "visible": true,
  "dueDate": "2024-02-20",
  "metadata": {
    "aiModel": "gpt-4",
    "creativityLevel": "medium",
    "difficulty": "easy",
    "taskType": "coding",
    "estimatedTime": 45
  }
}
```

#### PUT /activities/{activityId}
**Description:** Update an activity

**Request:**
```json
{
  "title": "Updated Activity Title",
  "description": "Updated description",
  "visible": false
}
```

#### DELETE /activities/{activityId}
**Description:** Delete an activity

### 4. Assignments

#### GET /assignments
**Description:** Get all assignments

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "assignment-1",
      "title": "Portfolio Website",
      "description": "Create a personal portfolio website using HTML and CSS",
      "courseId": "course-1",
      "instructorId": "professor-1",
      "type": "project",
      "totalPoints": 100,
      "dueDate": "2024-02-15",
      "status": "pending",
      "instructions": "Create a responsive portfolio website...",
      "attachments": [
        {
          "id": "attachment-1",
          "title": "Assignment Guidelines",
          "type": "pdf",
          "url": "/assignments/guidelines.pdf",
          "description": "Detailed assignment guidelines",
          "uploadedAt": "2024-01-15T10:00:00Z"
        }
      ],
      "submissions": [],
      "createdAt": "2024-01-15T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  ],
  "message": "Assignments retrieved successfully"
}
```

#### GET /assignments/{assignmentId}
**Description:** Get a specific assignment

#### POST /assignments
**Description:** Create a new assignment

**Request:**
```json
{
  "title": "JavaScript Quiz",
  "description": "Test your JavaScript knowledge",
  "courseId": "course-1",
  "type": "quiz",
  "totalPoints": 50,
  "dueDate": "2024-02-20",
  "instructions": "Complete the JavaScript quiz with 20 questions"
}
```

#### POST /assignments/submit
**Description:** Submit an assignment

**Request:**
```json
{
  "assignmentId": "assignment-1",
  "content": "My assignment submission content...",
  "attachments": [
    {
      "title": "My Portfolio",
      "type": "zip",
      "url": "/uploads/portfolio.zip",
      "description": "Portfolio website files"
    }
  ]
}
```

#### POST /assignments/grade
**Description:** Grade an assignment

**Request:**
```json
{
  "submissionId": "submission-1",
  "score": 85,
  "feedback": "Excellent work! Your portfolio demonstrates strong CSS skills."
}
```

### 5. Generative Tasks

#### POST /generative-tasks/generate
**Description:** Generate an AI-powered task

**Request:**
```json
{
  "activityId": "activity-1",
  "difficulty": "medium",
  "studentId": "student-1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "task-123",
    "title": "AI Generated Task - Medium",
    "description": "Create a responsive web component using modern CSS techniques",
    "requirements": [
      "Use CSS Grid or Flexbox for layout",
      "Make it responsive for all screen sizes",
      "Include hover effects and transitions",
      "Follow accessibility guidelines"
    ],
    "difficulty": "medium",
    "estimatedTime": 30,
    "hints": [
      "Start with mobile-first approach",
      "Use CSS custom properties for theming",
      "Test your code frequently"
    ]
  },
  "message": "Task generated successfully"
}
```

#### POST /generative-tasks/submit
**Description:** Submit a generative task solution

**Request:**
```json
{
  "taskId": "task-123",
  "code": "<nav class=\"navbar\">...</nav>",
  "studentId": "student-1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submissionId": "submission-123",
    "taskId": "task-123",
    "score": 85,
    "feedback": "Good work! Your solution demonstrates understanding of the concepts.",
    "testCases": [
      {
        "name": "Responsive Design",
        "passed": true
      },
      {
        "name": "CSS Implementation",
        "passed": true
      },
      {
        "name": "Accessibility",
        "passed": false
      }
    ]
  },
  "message": "Task submitted successfully"
}
```

#### GET /generative-tasks/{taskId}/hints?difficulty={difficulty}
**Description:** Get hints for a generative task

**Response:**
```json
{
  "success": true,
  "data": [
    "Start with mobile-first approach",
    "Use CSS custom properties for theming",
    "Test your code frequently"
  ],
  "message": "Hints retrieved successfully"
}
```

### 6. Grades

#### GET /grades
**Description:** Get all grades

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "grade-1",
      "studentId": "student-1",
      "studentName": "Alice Johnson",
      "assignmentId": "assignment-1",
      "assignmentTitle": "Portfolio Website",
      "courseId": "course-1",
      "courseName": "Introduction to Web Development",
      "score": 85,
      "totalPoints": 100,
      "letterGrade": "B+",
      "feedback": "Excellent work on the portfolio design!",
      "gradedBy": "professor-1",
      "gradedAt": "2024-02-16T10:00:00Z"
    }
  ],
  "message": "Grades retrieved successfully"
}
```

#### GET /grades/student/{studentId}
**Description:** Get grades for a specific student

### 7. Enrollments

#### GET /enrollments
**Description:** Get all enrollments

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "enrollment-1",
      "studentId": "student-1",
      "courseId": "course-1",
      "enrolledAt": "2024-01-10T00:00:00Z",
      "status": "active",
      "progress": 65,
      "lastAccessed": "2024-02-15T14:30:00Z"
    }
  ],
  "message": "Enrollments retrieved successfully"
}
```

#### POST /enrollments
**Description:** Enroll a student in a course

**Request:**
```json
{
  "courseId": "course-1",
  "studentId": "student-1"
}
```

### 8. Forum Posts

#### GET /forum-posts?forumId={forumId}
**Description:** Get forum posts for a specific forum

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "post-1",
      "forumId": "forum-1",
      "authorId": "student-1",
      "authorName": "Alice Johnson",
      "title": "CSS Grid vs Flexbox",
      "content": "When should I use CSS Grid vs Flexbox?",
      "createdAt": "2024-02-15T10:00:00Z",
      "replies": [
        {
          "id": "reply-1",
          "postId": "post-1",
          "authorId": "professor-1",
          "authorName": "Dr. Sarah Wilson",
          "content": "Great question! Use Grid for 2D layouts...",
          "createdAt": "2024-02-15T11:00:00Z"
        }
      ],
      "isPinned": false
    }
  ],
  "message": "Forum posts retrieved successfully"
}
```

#### POST /forum-posts
**Description:** Create a new forum post

**Request:**
```json
{
  "forumId": "forum-1",
  "title": "Help with CSS Layout",
  "content": "I'm having trouble with responsive design...",
  "authorId": "student-1",
  "authorName": "Alice Johnson"
}
```

#### POST /forum-posts/reply
**Description:** Create a forum reply

**Request:**
```json
{
  "postId": "post-1",
  "content": "Here's how you can fix that...",
  "authorId": "professor-1",
  "authorName": "Dr. Sarah Wilson"
}
```

### 9. Users

#### GET /users
**Description:** Get all users

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "student-1",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "student",
      "avatar": "/avatars/alice.jpg",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLogin": "2024-02-15T14:30:00Z",
      "profile": {
        "bio": "Passionate about web development",
        "department": "Computer Science",
        "phone": "+1234567890",
        "address": "123 Main St, City, State"
      }
    }
  ],
  "message": "Users retrieved successfully"
}
```

#### GET /users/{userId}
**Description:** Get a specific user

#### PUT /users/{userId}
**Description:** Update a user

**Request:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "profile": {
    "bio": "Updated bio",
    "department": "Updated Department"
  }
}
```

## Error Responses

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found",
  "message": "The requested resource could not be found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Please check your input data"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Data Types

### Activity Types
- `"video"` - Video content
- `"resource"` - File/document resource
- `"assignment"` - Assignment task
- `"quiz"` - Quiz/test
- `"forum"` - Discussion forum
- `"page"` - Static page content
- `"url"` - External link
- `"generative-task"` - AI-generated coding task

### Assignment Types
- `"quiz"` - Multiple choice/short answer
- `"essay"` - Written assignment
- `"project"` - Project-based assignment
- `"exam"` - Formal examination

### User Roles
- `"student"` - Student user
- `"professor"` - Instructor user
- `"admin"` - Administrator user

### Course Levels
- `"beginner"` - Beginner level
- `"intermediate"` - Intermediate level
- `"advanced"` - Advanced level

### Course Status
- `"active"` - Currently active
- `"inactive"` - Not currently active
- `"completed"` - Course completed

## Notes for Backend Implementation

1. **All responses must include** `success`, `data` (or `error`), and `message` fields
2. **Use proper HTTP status codes** (200, 201, 400, 404, 500, etc.)
3. **Implement proper validation** for all input data
4. **Handle CORS** for cross-origin requests
5. **Use consistent date formats** (ISO 8601: `2024-02-15T10:00:00Z`)
6. **Implement proper error handling** with meaningful error messages
7. **Consider pagination** for endpoints that return lists (courses, assignments, etc.)
8. **Add authentication/authorization** in future iterations
9. **Implement rate limiting** for API protection
10. **Add request/response logging** for debugging

## Testing

The frontend includes comprehensive mock data that matches these specifications. Test your backend implementation against the mock data structure to ensure compatibility. 