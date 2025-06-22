export interface User {
  id: string
  name: string
  email: string
  role: "student" | "professor" | "admin"
  avatar?: string
  createdAt: string
  lastLogin: string
  profile: {
    bio?: string
    department?: string
    phone?: string
    address?: string
  }
}

export interface Course {
  id: string
  title: string
  description: string
  instructorId: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  duration: string
  enrolledStudents: string[] // Array of student IDs
  maxStudents: number
  startDate: string
  endDate: string
  status: "active" | "inactive" | "completed"
  syllabus: string[]
  resources: Resource[]
  createdAt: string
  updatedAt: string
}

export interface Resource {
  id: string
  title: string
  type: "pdf" | "video" | "link" | "document"
  url: string
  description?: string
  uploadedAt: string
}

export interface Assignment {
  id: string
  title: string
  description: string
  courseId: string
  instructorId: string
  type: "quiz" | "essay" | "project" | "exam"
  totalPoints: number
  dueDate: string
  status: "pending" | "submitted" | "graded" | "overdue"
  instructions: string
  attachments: Resource[]
  submissions: Submission[]
  createdAt: string
  updatedAt: string
}

export interface Submission {
  id: string
  assignmentId: string
  studentId: string
  content: string
  attachments: Resource[]
  submittedAt: string
  status: "submitted" | "late" | "graded"
  grade?: Grade
}

export interface Grade {
  id: string
  studentId: string
  studentName: string
  assignmentId: string
  assignmentTitle: string
  courseId: string
  courseName: string
  score: number
  totalPoints: number
  letterGrade: string
  feedback?: string
  gradedBy: string
  gradedAt: string
}

export interface Enrollment {
  id: string
  studentId: string
  courseId: string
  enrolledAt: string
  status: "active" | "completed" | "dropped"
  progress: number // Percentage
  lastAccessed: string
}

export interface Discussion {
  id: string
  courseId: string
  title: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
  replies: Reply[]
  isPinned: boolean
}

export interface Reply {
  id: string
  discussionId: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
  parentReplyId?: string // For nested replies
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "assignment" | "grade" | "course" | "system"
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

// Add these new interfaces after the existing ones

export interface CourseSection {
  id: string
  courseId: string
  title: string
  description?: string
  order: number
  visible: boolean
  activities: Activity[]
}

export interface Activity {
  id: string
  sectionId: string
  title: string
  description?: string
  type: "assignment" | "quiz" | "forum" | "resource" | "page" | "video" | "url" | "generative-task"
  order: number
  visible: boolean
  completed?: boolean
  dueDate?: string
  availableFrom?: string
  availableUntil?: string
  metadata: {
    fileUrl?: string
    fileSize?: string
    fileType?: string
    videoUrl?: string
    videoDuration?: string
    url?: string
    attempts?: number
    timeLimit?: number
    questions?: number
    points?: number
    aiModel?: string
    creativityLevel?: string
    difficulty?: string
    taskType?: string
    estimatedTime?: number
  }
}

export interface ForumPost {
  id: string
  forumId: string
  authorId: string
  authorName: string
  title: string
  content: string
  createdAt: string
  replies: ForumReply[]
  isPinned: boolean
}

export interface ForumReply {
  id: string
  postId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
}

// Mock Data
export const mockData = {
  users: [
    {
      id: "student-1",
      name: "Alice Johnson",
      email: "alice.johnson@student.edu",
      role: "student" as const,
      createdAt: "2024-01-15T00:00:00Z",
      lastLogin: "2024-12-21T08:30:00Z",
      profile: {
        bio: "Computer Science major interested in web development",
        department: "Computer Science",
        phone: "+1-555-0123",
      },
    },
    {
      id: "student-2",
      name: "Bob Smith",
      email: "bob.smith@student.edu",
      role: "student" as const,
      createdAt: "2024-01-20T00:00:00Z",
      lastLogin: "2024-12-20T14:15:00Z",
      profile: {
        bio: "Mathematics student with focus on data analysis",
        department: "Mathematics",
        phone: "+1-555-0124",
      },
    },
    {
      id: "professor-1",
      name: "Dr. Sarah Wilson",
      email: "sarah.wilson@university.edu",
      role: "professor" as const,
      createdAt: "2023-08-01T00:00:00Z",
      lastLogin: "2024-12-21T09:00:00Z",
      profile: {
        bio: "Professor of Computer Science with 15 years of experience",
        department: "Computer Science",
        phone: "+1-555-0200",
      },
    },
  ] as User[],

  courses: [
    {
      id: "course-1",
      title: "Introduction to Web Development",
      description: "Learn the fundamentals of HTML, CSS, and JavaScript",
      instructorId: "professor-1",
      category: "Computer Science",
      level: "beginner" as const,
      duration: "12 weeks",
      enrolledStudents: ["student-1", "student-2"],
      maxStudents: 30,
      startDate: "2024-09-01T00:00:00Z",
      endDate: "2024-12-15T00:00:00Z",
      status: "active" as const,
      syllabus: [
        "HTML Fundamentals",
        "CSS Styling",
        "JavaScript Basics",
        "DOM Manipulation",
        "Responsive Design",
        "Final Project",
      ],
      resources: [
        {
          id: "resource-1",
          title: "HTML Basics Guide",
          type: "pdf" as const,
          url: "/resources/html-basics.pdf",
          description: "Comprehensive guide to HTML elements",
          uploadedAt: "2024-09-01T00:00:00Z",
        },
      ],
      createdAt: "2024-08-15T00:00:00Z",
      updatedAt: "2024-12-01T00:00:00Z",
    },
    {
      id: "course-2",
      title: "Data Structures and Algorithms",
      description: "Advanced course covering fundamental data structures and algorithms",
      instructorId: "professor-1",
      category: "Computer Science",
      level: "intermediate" as const,
      duration: "16 weeks",
      enrolledStudents: ["student-1"],
      maxStudents: 25,
      startDate: "2024-09-01T00:00:00Z",
      endDate: "2024-12-20T00:00:00Z",
      status: "active" as const,
      syllabus: [
        "Arrays and Linked Lists",
        "Stacks and Queues",
        "Trees and Graphs",
        "Sorting Algorithms",
        "Search Algorithms",
        "Dynamic Programming",
      ],
      resources: [],
      createdAt: "2024-08-15T00:00:00Z",
      updatedAt: "2024-12-01T00:00:00Z",
    },
  ] as Course[],

  assignments: [
    {
      id: "assignment-1",
      title: "HTML Portfolio Project",
      description: "Create a personal portfolio website using HTML and CSS",
      courseId: "course-1",
      instructorId: "professor-1",
      type: "project" as const,
      totalPoints: 100,
      dueDate: "2024-12-25T23:59:00Z",
      status: "pending" as const,
      instructions: "Create a responsive portfolio website showcasing your skills and projects",
      attachments: [],
      submissions: [],
      createdAt: "2024-12-01T00:00:00Z",
      updatedAt: "2024-12-01T00:00:00Z",
    },
    {
      id: "assignment-2",
      title: "JavaScript Quiz",
      description: "Test your knowledge of JavaScript fundamentals",
      courseId: "course-1",
      instructorId: "professor-1",
      type: "quiz" as const,
      totalPoints: 50,
      dueDate: "2024-12-22T23:59:00Z",
      status: "submitted" as const,
      instructions: "Complete all 20 questions about JavaScript basics",
      attachments: [],
      submissions: [],
      createdAt: "2024-11-15T00:00:00Z",
      updatedAt: "2024-12-15T00:00:00Z",
    },
    {
      id: "assignment-3",
      title: "Binary Tree Implementation",
      description: "Implement a binary search tree with basic operations",
      courseId: "course-2",
      instructorId: "professor-1",
      type: "project" as const,
      totalPoints: 150,
      dueDate: "2024-12-30T23:59:00Z",
      status: "pending" as const,
      instructions: "Implement insert, delete, search, and traversal operations",
      attachments: [],
      submissions: [],
      createdAt: "2024-12-01T00:00:00Z",
      updatedAt: "2024-12-01T00:00:00Z",
    },
  ] as Assignment[],

  grades: [
    {
      id: "grade-1",
      studentId: "student-1",
      studentName: "Alice Johnson",
      assignmentId: "assignment-2",
      assignmentTitle: "JavaScript Quiz",
      courseId: "course-1",
      courseName: "Introduction to Web Development",
      score: 85,
      totalPoints: 50,
      letterGrade: "B+",
      feedback: "Good understanding of JavaScript concepts. Review arrow functions.",
      gradedBy: "professor-1",
      gradedAt: "2024-12-16T00:00:00Z",
    },
    {
      id: "grade-2",
      studentId: "student-2",
      studentName: "Bob Smith",
      assignmentId: "assignment-2",
      assignmentTitle: "JavaScript Quiz",
      courseId: "course-1",
      courseName: "Introduction to Web Development",
      score: 92,
      totalPoints: 50,
      letterGrade: "A-",
      feedback: "Excellent work! Strong grasp of all concepts covered.",
      gradedBy: "professor-1",
      gradedAt: "2024-12-16T00:00:00Z",
    },
  ] as Grade[],

  enrollments: [
    {
      id: "enrollment-1",
      studentId: "student-1",
      courseId: "course-1",
      enrolledAt: "2024-09-01T00:00:00Z",
      status: "active" as const,
      progress: 75,
      lastAccessed: "2024-12-21T08:30:00Z",
    },
    {
      id: "enrollment-2",
      studentId: "student-1",
      courseId: "course-2",
      enrolledAt: "2024-09-01T00:00:00Z",
      status: "active" as const,
      progress: 60,
      lastAccessed: "2024-12-20T15:45:00Z",
    },
    {
      id: "enrollment-3",
      studentId: "student-2",
      courseId: "course-1",
      enrolledAt: "2024-09-01T00:00:00Z",
      status: "active" as const,
      progress: 80,
      lastAccessed: "2024-12-20T14:15:00Z",
    },
  ] as Enrollment[],

  courseSections: [
    {
      id: "section-1",
      courseId: "course-1",
      title: "Week 1: Introduction to Web Development",
      description: "Getting started with HTML, CSS, and development environment setup",
      order: 1,
      visible: true,
      activities: [
        {
          id: "activity-1",
          sectionId: "section-1",
          title: "Course Introduction Video",
          description: "Welcome to Web Development - Overview of what we'll learn",
          type: "video" as const,
          order: 1,
          visible: true,
          completed: true,
          metadata: {
            videoUrl: "/videos/intro.mp4",
            videoDuration: "15:30",
          },
        },
        {
          id: "activity-2",
          sectionId: "section-1",
          title: "HTML Basics Guide",
          description: "Comprehensive guide to HTML elements and structure",
          type: "resource" as const,
          order: 2,
          visible: true,
          completed: true,
          metadata: {
            fileUrl: "/resources/html-basics.pdf",
            fileSize: "2.5 MB",
            fileType: "PDF",
          },
        },
        {
          id: "activity-3",
          sectionId: "section-1",
          title: "Introduction Forum",
          description: "Introduce yourself to your classmates",
          type: "forum" as const,
          order: 3,
          visible: true,
          completed: false,
          metadata: {},
        },
      ],
    },
    {
      id: "section-2",
      courseId: "course-1",
      title: "Week 2: HTML Fundamentals",
      description: "Deep dive into HTML elements, attributes, and semantic markup",
      order: 2,
      visible: true,
      activities: [
        {
          id: "activity-4",
          sectionId: "section-2",
          title: "HTML Elements Lecture",
          description: "Understanding different HTML elements and their purposes",
          type: "video" as const,
          order: 1,
          visible: true,
          completed: false,
          metadata: {
            videoUrl: "/videos/html-elements.mp4",
            videoDuration: "25:45",
          },
        },
        {
          id: "activity-5",
          sectionId: "section-2",
          title: "HTML Practice Quiz",
          description: "Test your knowledge of HTML basics",
          type: "quiz" as const,
          order: 2,
          visible: true,
          completed: false,
          dueDate: "2024-12-28T23:59:00Z",
          metadata: {
            questions: 15,
            timeLimit: 30,
            attempts: 3,
            points: 50,
          },
        },
        {
          id: "activity-6",
          sectionId: "section-2",
          title: "Create Your First Webpage",
          description: "Build a simple HTML page using the elements we've learned",
          type: "assignment" as const,
          order: 3,
          visible: true,
          completed: false,
          dueDate: "2024-12-30T23:59:00Z",
          metadata: {
            points: 100,
          },
        },
        {
          id: "activity-6b",
          sectionId: "section-2",
          title: "HTML Structure Challenge",
          description: "AI-generated coding challenge to test your HTML knowledge",
          type: "generative-task" as const,
          order: 4,
          visible: true,
          completed: false,
          metadata: {
            points: 50,
            aiModel: "gpt-4",
            creativityLevel: "balanced",
            difficulty: "medium",
            taskType: "mixed",
            estimatedTime: 30,
          },
        },
      ],
    },
    {
      id: "section-3",
      courseId: "course-1",
      title: "Week 3: CSS Styling",
      description: "Introduction to CSS for styling and layout",
      order: 3,
      visible: true,
      activities: [
        {
          id: "activity-7",
          sectionId: "section-3",
          title: "CSS Fundamentals",
          description: "Learn the basics of CSS selectors, properties, and values",
          type: "page" as const,
          order: 1,
          visible: true,
          completed: false,
          metadata: {},
        },
        {
          id: "activity-8",
          sectionId: "section-3",
          title: "CSS Reference Sheet",
          description: "Quick reference for common CSS properties",
          type: "resource" as const,
          order: 2,
          visible: true,
          completed: false,
          metadata: {
            fileUrl: "/resources/css-reference.pdf",
            fileSize: "1.8 MB",
            fileType: "PDF",
          },
        },
        {
          id: "activity-9",
          sectionId: "section-3",
          title: "CSS Layout Challenge",
          description: "AI-generated challenge to practice CSS flexbox and grid",
          type: "generative-task" as const,
          order: 3,
          visible: true,
          completed: false,
          metadata: {
            points: 75,
            aiModel: "gpt-4",
            creativityLevel: "creative",
            difficulty: "hard",
            taskType: "design",
            estimatedTime: 45,
          },
        },
        {
          id: "activity-10",
          sectionId: "section-3",
          title: "Responsive Design Generator",
          description: "AI-powered task to create responsive CSS layouts for different screen sizes",
          type: "generative-task" as const,
          order: 4,
          visible: true,
          completed: false,
          metadata: {
            points: 60,
            aiModel: "gpt-4",
            creativityLevel: "balanced",
            difficulty: "medium",
            taskType: "responsive",
            estimatedTime: 35,
          },
        },
      ],
    },
  ] as CourseSection[],

  forumPosts: [
    {
      id: "post-1",
      forumId: "activity-3",
      authorId: "student-1",
      authorName: "Alice Johnson",
      title: "Hello everyone!",
      content:
        "Hi! I'm Alice, a Computer Science major excited to learn web development. Looking forward to working with you all!",
      createdAt: "2024-12-20T10:30:00Z",
      isPinned: false,
      replies: [
        {
          id: "reply-1",
          postId: "post-1",
          authorId: "professor-1",
          authorName: "Dr. Sarah Wilson",
          content: "Welcome Alice! Great to have you in the class.",
          createdAt: "2024-12-20T11:00:00Z",
        },
      ],
    },
  ] as ForumPost[],
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Request Types for API endpoints
export interface CreateCourseRequest {
  title: string
  description: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  duration: string
  maxStudents: number
  startDate: string
  endDate: string
  syllabus: string[]
}

export interface CreateAssignmentRequest {
  title: string
  description: string
  courseId: string
  type: "quiz" | "essay" | "project" | "exam"
  totalPoints: number
  dueDate: string
  instructions: string
}

export interface SubmitAssignmentRequest {
  assignmentId: string
  content: string
  attachments?: Resource[]
}

export interface GradeAssignmentRequest {
  submissionId: string
  score: number
  feedback?: string
}

// Additional interfaces for API requests
export interface CreateSectionRequest {
  title: string
  description?: string
  order: number
  visible: boolean
}

export interface UpdateSectionRequest {
  title?: string
  description?: string
  order?: number
  visible?: boolean
}

export interface CreateActivityRequest {
  title: string
  description?: string
  type: Activity["type"]
  order: number
  visible: boolean
  dueDate?: string
  availableFrom?: string
  availableUntil?: string
  metadata: Activity["metadata"]
}

export interface UpdateActivityRequest {
  title?: string
  description?: string
  type?: Activity["type"]
  order?: number
  visible?: boolean
  dueDate?: string
  availableFrom?: string
  availableUntil?: string
  metadata?: Partial<Activity["metadata"]>
}

export interface CreateForumPostRequest {
  forumId: string
  title: string
  content: string
  authorId: string
  authorName: string
}

export interface CreateForumReplyRequest {
  postId: string
  content: string
  authorId: string
  authorName: string
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  profile?: {
    bio?: string
    department?: string
    phone?: string
    address?: string
  }
}
