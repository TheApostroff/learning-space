# API Response Examples

This document provides examples of expected API responses for each request type in the EduLearn platform.

## Authentication

### Login Request
```json
POST /api/auth/login
{
  "email": "sarah.wilson@university.edu",
  "password": "password123",
  "role": "professor"
}
```

### Login Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "professor-1",
      "name": "Dr. Sarah Wilson",
      "email": "sarah.wilson@university.edu",
      "role": "professor",
      "avatar": "/avatars/professor-1.jpg",
      "profile": {
        "bio": "Professor of Computer Science with 15 years of experience",
        "department": "Computer Science",
        "phone": "+1-555-0200"
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2024-12-22T10:30:00Z"
  }
}
```

## Courses

### Get All Courses
```json
GET /api/courses
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "course-1",
      "title": "Introduction to Web Development",
      "description": "Learn the fundamentals of HTML, CSS, and JavaScript",
      "instructorId": "professor-1",
      "category": "Computer Science",
      "level": "beginner",
      "duration": "12 weeks",
      "enrolledStudents": ["student-1", "student-2"],
      "maxStudents": 30,
      "startDate": "2024-09-01T00:00:00Z",
      "endDate": "2024-12-15T00:00:00Z",
      "status": "active",
      "syllabus": [
        "HTML Fundamentals",
        "CSS Styling",
        "JavaScript Basics",
        "DOM Manipulation",
        "Responsive Design",
        "Final Project"
      ],
      "resources": [
        {
          "id": "resource-1",
          "title": "HTML Basics Guide",
          "type": "pdf",
          "url": "/resources/html-basics.pdf",
          "description": "Comprehensive guide to HTML elements",
          "uploadedAt": "2024-09-01T00:00:00Z"
        }
      ],
      "createdAt": "2024-08-15T00:00:00Z",
      "updatedAt": "2024-12-01T00:00:00Z"
    }
  ]
}
```

### Create Course
```json
POST /api/courses
{
  "title": "Advanced JavaScript Programming",
  "description": "Deep dive into modern JavaScript concepts and frameworks",
  "category": "Computer Science",
  "level": "intermediate",
  "duration": "10 weeks",
  "maxStudents": 25,
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-03-25T00:00:00Z",
  "syllabus": [
    "ES6+ Features",
    "Async Programming",
    "React Fundamentals",
    "State Management",
    "Testing",
    "Deployment"
  ]
}
```

### Response
```json
{
  "success": true,
  "data": {
    "id": "course-3",
    "title": "Advanced JavaScript Programming",
    "description": "Deep dive into modern JavaScript concepts and frameworks",
    "instructorId": "professor-1",
    "category": "Computer Science",
    "level": "intermediate",
    "duration": "10 weeks",
    "enrolledStudents": [],
    "maxStudents": 25,
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": "2024-03-25T00:00:00Z",
    "status": "active",
    "syllabus": [
      "ES6+ Features",
      "Async Programming",
      "React Fundamentals",
      "State Management",
      "Testing",
      "Deployment"
    ],
    "resources": [],
    "createdAt": "2024-12-21T10:30:00Z",
    "updatedAt": "2024-12-21T10:30:00Z"
  }
}
```

## Course Sections

### Get Course Sections
```json
GET /api/courses/course-1/sections
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "section-1",
      "courseId": "course-1",
      "title": "Week 1: Introduction to Web Development",
      "description": "Getting started with HTML, CSS, and development environment setup",
      "order": 1,
      "visible": true,
      "activities": [
        {
          "id": "activity-1",
          "sectionId": "section-1",
          "title": "Course Introduction Video",
          "description": "Welcome to Web Development - Overview of what we'll learn",
          "type": "video",
          "order": 1,
          "visible": true,
          "completed": true,
          "metadata": {
            "videoUrl": "/videos/intro.mp4",
            "videoDuration": "15:30"
          }
        }
      ]
    }
  ]
}
```

### Create Section
```json
POST /api/courses/course-1/sections
{
  "title": "Week 4: JavaScript Fundamentals",
  "description": "Introduction to JavaScript programming basics",
  "order": 4,
  "visible": true
}
```

### Response
```json
{
  "success": true,
  "data": {
    "id": "section-4",
    "courseId": "course-1",
    "title": "Week 4: JavaScript Fundamentals",
    "description": "Introduction to JavaScript programming basics",
    "order": 4,
    "visible": true,
    "activities": []
  }
}
```

## Activities

### Get Activity
```json
GET /api/courses/course-1/activities/activity-1
```

### Response
```json
{
  "success": true,
  "data": {
    "id": "activity-1",
    "sectionId": "section-1",
    "title": "Course Introduction Video",
    "description": "Welcome to Web Development - Overview of what we'll learn",
    "type": "video",
    "order": 1,
    "visible": true,
    "completed": true,
    "metadata": {
      "videoUrl": "/videos/intro.mp4",
      "videoDuration": "15:30"
    }
  }
}
```

### Create Activity
```json
POST /api/sections/section-1/activities
{
  "title": "JavaScript Variables and Data Types",
  "description": "Learn about variables, strings, numbers, and booleans in JavaScript",
  "type": "page",
  "order": 1,
  "visible": true,
  "metadata": {}
}
```

### Response
```json
{
  "success": true,
  "data": {
    "id": "activity-11",
    "sectionId": "section-1",
    "title": "JavaScript Variables and Data Types",
    "description": "Learn about variables, strings, numbers, and booleans in JavaScript",
    "type": "page",
    "order": 1,
    "visible": true,
    "completed": false,
    "metadata": {}
  }
}
```

## Generative Tasks

### Generate Task
```json
POST /api/generative-tasks/generate
{
  "activityId": "activity-9",
  "difficulty": "medium",
  "studentId": "student-1"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "taskId": "task-123",
    "title": "CSS Flexbox Layout Challenge",
    "description": "Create a responsive navigation bar using CSS Flexbox",
    "requirements": [
      "Create a horizontal navigation bar",
      "Use flexbox for layout",
      "Make it responsive for mobile devices",
      "Include hover effects",
      "Use semantic HTML structure"
    ],
    "example": {
      "input": "Navigation items: Home, About, Services, Contact",
      "output": "A responsive horizontal navigation bar",
      "explanation": "The navigation should collapse into a hamburger menu on mobile devices"
    },
    "constraints": [
      "Use only CSS Flexbox (no Grid)",
      "Mobile-first approach",
      "Maximum 3 breakpoints",
      "No JavaScript allowed"
    ],
    "difficulty": "medium",
    "estimatedTime": 30,
    "hints": [
      "Use flex-direction: row for horizontal layout",
      "Consider using flex-wrap for responsive behavior",
      "Use media queries for mobile breakpoints"
    ]
  }
}
```

### Submit Generative Task
```json
POST /api/generative-tasks/submit
{
  "taskId": "task-123",
  "code": "<nav class=\"navbar\">\n  <ul class=\"nav-list\">\n    <li><a href=\"#\">Home</a></li>\n    <li><a href=\"#\">About</a></li>\n    <li><a href=\"#\">Services</a></li>\n    <li><a href=\"#\">Contact</a></li>\n  </ul>\n</nav>",
  "studentId": "student-1"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "evaluationId": "eval-456",
    "correct": true,
    "score": 95,
    "feedback": "Excellent work! Your navigation bar is well-structured and responsive. The flexbox implementation is correct and the hover effects work properly.",
    "testCases": [
      {
        "name": "Desktop Layout",
        "passed": true,
        "input": "Desktop viewport",
        "expected": "Horizontal navigation",
        "actual": "Horizontal navigation displayed correctly"
      },
      {
        "name": "Mobile Responsiveness",
        "passed": true,
        "input": "Mobile viewport",
        "expected": "Responsive behavior",
        "actual": "Navigation adapts to mobile screen"
      },
      {
        "name": "Hover Effects",
        "passed": true,
        "input": "Mouse hover",
        "expected": "Visual feedback",
        "actual": "Hover effects working properly"
      }
    ],
    "suggestions": [
      "Consider adding smooth transitions for better UX",
      "You could add a logo to the navigation",
      "Consider using CSS custom properties for easier theming"
    ]
  }
}
```

### Get Task Hints
```json
GET /api/generative-tasks/task-123/hints?difficulty=medium
```

### Response
```json
{
  "success": true,
  "data": {
    "hints": [
      "Use flex-direction: row for horizontal layout",
      "Consider using flex-wrap for responsive behavior",
      "Use media queries for mobile breakpoints",
      "Remember to set justify-content for proper spacing",
      "Use flex-basis or flex-grow for flexible items"
    ],
    "difficulty": "medium",
    "unlockedAt": "2024-12-21T10:35:00Z"
  }
}
```

## Assignments

### Get Assignments
```json
GET /api/assignments
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "assignment-1",
      "title": "HTML Portfolio Project",
      "description": "Create a personal portfolio website using HTML and CSS",
      "courseId": "course-1",
      "instructorId": "professor-1",
      "type": "project",
      "totalPoints": 100,
      "dueDate": "2024-12-25T23:59:00Z",
      "status": "pending",
      "instructions": "Create a responsive portfolio website showcasing your skills and projects",
      "attachments": [],
      "submissions": [],
      "createdAt": "2024-12-01T00:00:00Z",
      "updatedAt": "2024-12-01T00:00:00Z"
    }
  ]
}
```

### Submit Assignment
```json
POST /api/assignments/submit
{
  "assignmentId": "assignment-1",
  "content": "I have created a portfolio website with the following features...",
  "attachments": [
    {
      "id": "file-1",
      "title": "portfolio.zip",
      "type": "zip",
      "url": "/uploads/portfolio.zip",
      "size": 2048576
    }
  ]
}
```

### Response
```json
{
  "success": true,
  "data": {
    "submissionId": "submission-1",
    "assignmentId": "assignment-1",
    "studentId": "student-1",
    "content": "I have created a portfolio website with the following features...",
    "attachments": [
      {
        "id": "file-1",
        "title": "portfolio.zip",
        "type": "zip",
        "url": "/uploads/portfolio.zip",
        "size": 2048576
      }
    ],
    "submittedAt": "2024-12-21T10:30:00Z",
    "status": "submitted"
  }
}
```

## Grades

### Get Student Grades
```json
GET /api/grades/student/student-1
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "grade-1",
      "studentId": "student-1",
      "studentName": "Alice Johnson",
      "assignmentId": "assignment-2",
      "assignmentTitle": "JavaScript Quiz",
      "courseId": "course-1",
      "courseName": "Introduction to Web Development",
      "score": 85,
      "totalPoints": 50,
      "letterGrade": "B+",
      "feedback": "Good understanding of JavaScript concepts. Review arrow functions.",
      "gradedBy": "professor-1",
      "gradedAt": "2024-12-16T00:00:00Z"
    }
  ]
}
```

## Forum Posts

### Get Forum Posts
```json
GET /api/forum-posts?forumId=activity-3
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "post-1",
      "forumId": "activity-3",
      "authorId": "student-1",
      "authorName": "Alice Johnson",
      "title": "Hello everyone!",
      "content": "Hi! I'm Alice, a Computer Science major excited to learn web development. Looking forward to working with you all!",
      "createdAt": "2024-12-20T10:30:00Z",
      "isPinned": false,
      "replies": [
        {
          "id": "reply-1",
          "postId": "post-1",
          "authorId": "professor-1",
          "authorName": "Dr. Sarah Wilson",
          "content": "Welcome Alice! Great to have you in the class.",
          "createdAt": "2024-12-20T11:00:00Z"
        }
      ]
    }
  ]
}
```

### Create Forum Post
```json
POST /api/forum-posts
{
  "forumId": "activity-3",
  "title": "Question about HTML semantics",
  "content": "I'm confused about when to use <article> vs <section>. Can someone explain the difference?",
  "authorId": "student-1",
  "authorName": "Alice Johnson"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "id": "post-2",
    "forumId": "activity-3",
    "authorId": "student-1",
    "authorName": "Alice Johnson",
    "title": "Question about HTML semantics",
    "content": "I'm confused about when to use <article> vs <section>. Can someone explain the difference?",
    "createdAt": "2024-12-21T10:30:00Z",
    "isPinned": false,
    "replies": []
  }
}
```

## Users

### Get Users
```json
GET /api/users
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "student-1",
      "name": "Alice Johnson",
      "email": "alice.johnson@student.edu",
      "role": "student",
      "avatar": "/avatars/student-1.jpg",
      "createdAt": "2024-01-15T00:00:00Z",
      "lastLogin": "2024-12-21T08:30:00Z",
      "profile": {
        "bio": "Computer Science major interested in web development",
        "department": "Computer Science",
        "phone": "+1-555-0123"
      }
    }
  ]
}
```

## Error Responses

### Validation Error
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "title": "Title is required",
    "email": "Invalid email format"
  }
}
```

### Not Found Error
```json
{
  "success": false,
  "error": "Course not found",
  "message": "The requested course with ID 'course-999' does not exist"
}
```

### Authentication Error
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired authentication token"
}
```

### Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred. Please try again later."
}
```

## Pagination

For endpoints that return lists, pagination is supported:

```json
GET /api/courses?page=1&limit=10
```

### Response with Pagination
```json
{
  "success": true,
  "data": [
    // ... course items
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## File Upload

### Upload File
```json
POST /api/upload
Content-Type: multipart/form-data

{
  "file": [binary data],
  "type": "assignment",
  "assignmentId": "assignment-1"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "id": "file-1",
    "title": "portfolio.zip",
    "type": "zip",
    "url": "/uploads/portfolio.zip",
    "size": 2048576,
    "uploadedAt": "2024-12-21T10:30:00Z"
  }
}
``` 