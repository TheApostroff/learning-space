import { mockData, type ApiResponse, type CreateCourseRequest, type CreateAssignmentRequest, type SubmitAssignmentRequest, type GradeAssignmentRequest, type CreateSectionRequest, type UpdateSectionRequest, type CreateActivityRequest, type UpdateActivityRequest, type CreateForumPostRequest, type CreateForumReplyRequest, type UpdateUserRequest } from './mock-data'

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_API_URL
const MOCK_DELAY = parseInt(process.env.NEXT_PUBLIC_MOCK_DELAY || '500') // Configurable mock delay

// Enhanced API client with better error handling and mock support
class ApiClient {
  private baseUrl: string
  private useMock: boolean
  private mockDelay: number

  constructor(baseUrl: string, useMock: boolean = false, mockDelay: number = 500) {
    this.baseUrl = baseUrl
    this.useMock = useMock
    this.mockDelay = mockDelay
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    if (this.useMock) {
      // Simulate API delay for more realistic behavior
      await new Promise(resolve => setTimeout(resolve, this.mockDelay))
      return this.handleMockRequest<T>(endpoint, options)
    }

    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Ensure response matches ApiResponse format
      if (data.success !== undefined) {
        return data as ApiResponse<T>
      } else {
        // If server doesn't return ApiResponse format, wrap it
        return {
          success: true,
          data: data as T,
        }
      }
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  private handleMockRequest<T>(endpoint: string, options: RequestInit): ApiResponse<T> {
    try {
      // Mock API endpoints with proper error handling
      switch (endpoint) {
        case '/courses':
          if (options.method === 'GET') {
            return { 
              success: true, 
              data: mockData.courses as T,
              message: 'Courses retrieved successfully'
            }
          }
          if (options.method === 'POST') {
            const body = JSON.parse(options.body as string)
            const newCourse = {
              id: `course-${Date.now()}`,
              ...body,
              enrolledStudents: [],
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            return { 
              success: true, 
              data: newCourse as T,
              message: 'Course created successfully'
            }
          }
          break

        case '/courses/course-1':
          return { 
            success: true, 
            data: mockData.courses[0] as T,
            message: 'Course retrieved successfully'
          }

        case '/courses/course-1/sections':
          return { 
            success: true, 
            data: mockData.courseSections as T,
            message: 'Course sections retrieved successfully'
          }

        case '/activities/activity-6b':
          return { 
            success: true, 
            data: mockData.courseSections[1].activities[3] as T,
            message: 'Activity retrieved successfully'
          }

        case '/activities/activity-9':
          return { 
            success: true, 
            data: mockData.courseSections[2].activities[2] as T,
            message: 'Activity retrieved successfully'
          }

        case '/assignments':
          if (options.method === 'GET') {
            return { 
              success: true, 
              data: mockData.assignments as T,
              message: 'Assignments retrieved successfully'
            }
          }
          if (options.method === 'POST') {
            const body = JSON.parse(options.body as string)
            const newAssignment = {
              id: `assignment-${Date.now()}`,
              ...body,
              status: 'pending',
              submissions: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            return { 
              success: true, 
              data: newAssignment as T,
              message: 'Assignment created successfully'
            }
          }
          break

        case '/grades':
          return { 
            success: true, 
            data: mockData.grades as T,
            message: 'Grades retrieved successfully'
          }

        case '/enrollments':
          return { 
            success: true, 
            data: mockData.enrollments as T,
            message: 'Enrollments retrieved successfully'
          }

        case '/forum-posts':
          return { 
            success: true, 
            data: mockData.forumPosts as T,
            message: 'Forum posts retrieved successfully'
          }

        case '/users':
          return { 
            success: true, 
            data: mockData.users as T,
            message: 'Users retrieved successfully'
          }

        case '/generative-tasks/generate':
          const generateBody = JSON.parse(options.body as string)
          return {
            success: true,
            data: {
              taskId: `task-${Date.now()}`,
              title: `AI Generated Task - ${generateBody.difficulty}`,
              description: "Create a responsive web component using modern CSS techniques",
              requirements: [
                "Use CSS Grid or Flexbox for layout",
                "Make it responsive for all screen sizes",
                "Include hover effects and transitions",
                "Follow accessibility guidelines"
              ],
              difficulty: generateBody.difficulty,
              estimatedTime: 30,
              hints: [
                "Start with mobile-first approach",
                "Use CSS custom properties for theming",
                "Test your code frequently"
              ]
            } as T,
            message: 'Task generated successfully'
          }

        case '/generative-tasks/submit':
          const submitBody = JSON.parse(options.body as string)
          return {
            success: true,
            data: {
              submissionId: `submission-${Date.now()}`,
              taskId: submitBody.taskId,
              score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
              feedback: "Good work! Your solution demonstrates understanding of the concepts.",
              testCases: [
                { name: "Responsive Design", passed: true },
                { name: "CSS Implementation", passed: true },
                { name: "Accessibility", passed: Math.random() > 0.3 }
              ]
            } as T,
            message: 'Task submitted successfully'
          }

        default:
          // Handle dynamic routes
          if (endpoint.startsWith('/courses/') && endpoint.endsWith('/sections')) {
            const courseId = endpoint.split('/')[2]
            const sections = mockData.courseSections.filter(s => s.courseId === courseId)
            return { 
              success: true, 
              data: sections as T,
              message: 'Course sections retrieved successfully'
            }
          }

          if (endpoint.startsWith('/courses/') && endpoint.includes('/activities/')) {
            const parts = endpoint.split('/')
            const courseId = parts[2]
            const activityId = parts[4]
            const sections = mockData.courseSections.filter(s => s.courseId === courseId)
            const activity = sections.flatMap(s => s.activities).find(a => a.id === activityId)
            
            if (activity) {
              return { 
                success: true, 
                data: activity as T,
                message: 'Activity retrieved successfully'
              }
            } else {
              return { 
                success: false, 
                error: 'Activity not found',
                message: 'The requested activity could not be found'
              }
            }
          }

          if (endpoint.startsWith('/generative-tasks/') && endpoint.includes('/hints')) {
            const difficulty = new URLSearchParams(endpoint.split('?')[1]).get('difficulty') || 'medium'
            
            const hints = {
              easy: [
                "Start with basic HTML structure",
                "Use simple CSS properties",
                "Test your code frequently"
              ],
              medium: [
                "Use CSS Grid or Flexbox for layout",
                "Implement responsive design",
                "Add interactive elements"
              ],
              hard: [
                "Optimize for performance",
                "Implement advanced CSS features",
                "Consider accessibility standards"
              ]
            }
            
            return {
              success: true,
              data: hints[difficulty as keyof typeof hints] as T,
              message: 'Hints retrieved successfully'
            }
          }

          return { 
            success: false, 
            error: 'Endpoint not found in mock data',
            message: 'The requested endpoint is not available in mock mode'
          }
      }

      return { 
        success: false, 
        error: 'Unknown endpoint',
        message: 'The requested endpoint is not supported'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Mock request failed',
        message: 'An error occurred while processing the mock request'
      }
    }
  }

  // Course endpoints
  async getCourses() {
    return this.request('/courses')
  }

  async getCourse(courseId: string) {
    return this.request(`/courses/${courseId}`)
  }

  async createCourse(data: CreateCourseRequest) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCourse(courseId: string, data: Partial<CreateCourseRequest>) {
    return this.request(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteCourse(courseId: string) {
    return this.request(`/courses/${courseId}`, {
      method: 'DELETE',
    })
  }

  // Section endpoints
  async getCourseSections(courseId: string) {
    return this.request(`/courses/${courseId}/sections`)
  }

  async createSection(courseId: string, data: CreateSectionRequest) {
    return this.request(`/courses/${courseId}/sections`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateSection(sectionId: string, data: UpdateSectionRequest) {
    return this.request(`/sections/${sectionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteSection(sectionId: string) {
    return this.request(`/sections/${sectionId}`, {
      method: 'DELETE',
    })
  }

  // Activity endpoints
  async getActivity(courseId: string, activityId: string) {
    return this.request(`/courses/${courseId}/activities/${activityId}`)
  }

  async createActivity(sectionId: string, data: CreateActivityRequest) {
    return this.request(`/sections/${sectionId}/activities`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateActivity(activityId: string, data: UpdateActivityRequest) {
    return this.request(`/activities/${activityId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteActivity(activityId: string) {
    return this.request(`/activities/${activityId}`, {
      method: 'DELETE',
    })
  }

  // Assignment endpoints
  async getAssignments() {
    return this.request('/assignments')
  }

  async getAssignment(assignmentId: string) {
    return this.request(`/assignments/${assignmentId}`)
  }

  async createAssignment(data: CreateAssignmentRequest) {
    return this.request('/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async submitAssignment(data: SubmitAssignmentRequest) {
    return this.request('/assignments/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async gradeAssignment(data: GradeAssignmentRequest) {
    return this.request('/assignments/grade', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Generative Task endpoints
  async generateTask(activityId: string, difficulty: string, studentId: string) {
    return this.request('/generative-tasks/generate', {
      method: 'POST',
      body: JSON.stringify({ activityId, difficulty, studentId }),
    })
  }

  async submitGenerativeTask(taskId: string, code: string, studentId: string) {
    return this.request('/generative-tasks/submit', {
      method: 'POST',
      body: JSON.stringify({ taskId, code, studentId }),
    })
  }

  async getGenerativeTaskHints(taskId: string, difficulty: string) {
    return this.request(`/generative-tasks/${taskId}/hints?difficulty=${difficulty}`)
  }

  // Grade endpoints
  async getGrades() {
    return this.request('/grades')
  }

  async getStudentGrades(studentId: string) {
    return this.request(`/grades/student/${studentId}`)
  }

  // Enrollment endpoints
  async getEnrollments() {
    return this.request('/enrollments')
  }

  async enrollStudent(courseId: string, studentId: string) {
    return this.request('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId, studentId }),
    })
  }

  // Forum endpoints
  async getForumPosts(forumId: string) {
    return this.request(`/forum-posts?forumId=${forumId}`)
  }

  async createForumPost(data: CreateForumPostRequest) {
    return this.request('/forum-posts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async createForumReply(data: CreateForumReplyRequest) {
    return this.request('/forum-posts/reply', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // User endpoints
  async getUsers() {
    return this.request('/users')
  }

  async getUser(userId: string) {
    return this.request(`/users/${userId}`)
  }

  async updateUser(userId: string, data: UpdateUserRequest) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL, USE_MOCK_DATA, MOCK_DELAY)

// Export convenience functions
export const api = {
  // Courses
  getCourses: () => apiClient.getCourses(),
  getCourse: (courseId: string) => apiClient.getCourse(courseId),
  createCourse: (data: CreateCourseRequest) => apiClient.createCourse(data),
  updateCourse: (courseId: string, data: Partial<CreateCourseRequest>) => apiClient.updateCourse(courseId, data),
  deleteCourse: (courseId: string) => apiClient.deleteCourse(courseId),

  // Sections
  getCourseSections: (courseId: string) => apiClient.getCourseSections(courseId),
  createSection: (courseId: string, data: CreateSectionRequest) => apiClient.createSection(courseId, data),
  updateSection: (sectionId: string, data: UpdateSectionRequest) => apiClient.updateSection(sectionId, data),
  deleteSection: (sectionId: string) => apiClient.deleteSection(sectionId),

  // Activities
  getActivity: (courseId: string, activityId: string) => apiClient.getActivity(courseId, activityId),
  createActivity: (sectionId: string, data: CreateActivityRequest) => apiClient.createActivity(sectionId, data),
  updateActivity: (activityId: string, data: UpdateActivityRequest) => apiClient.updateActivity(activityId, data),
  deleteActivity: (activityId: string) => apiClient.deleteActivity(activityId),

  // Assignments
  getAssignments: () => apiClient.getAssignments(),
  getAssignment: (assignmentId: string) => apiClient.getAssignment(assignmentId),
  createAssignment: (data: CreateAssignmentRequest) => apiClient.createAssignment(data),
  submitAssignment: (data: SubmitAssignmentRequest) => apiClient.submitAssignment(data),
  gradeAssignment: (data: GradeAssignmentRequest) => apiClient.gradeAssignment(data),

  // Generative Tasks
  generateTask: (activityId: string, difficulty: string, studentId: string) => apiClient.generateTask(activityId, difficulty, studentId),
  submitGenerativeTask: (taskId: string, code: string, studentId: string) => apiClient.submitGenerativeTask(taskId, code, studentId),
  getGenerativeTaskHints: (taskId: string, difficulty: string) => apiClient.getGenerativeTaskHints(taskId, difficulty),

  // Grades
  getGrades: () => apiClient.getGrades(),
  getStudentGrades: (studentId: string) => apiClient.getStudentGrades(studentId),

  // Enrollments
  getEnrollments: () => apiClient.getEnrollments(),
  enrollStudent: (courseId: string, studentId: string) => apiClient.enrollStudent(courseId, studentId),

  // Forum
  getForumPosts: (forumId: string) => apiClient.getForumPosts(forumId),
  createForumPost: (data: CreateForumPostRequest) => apiClient.createForumPost(data),
  createForumReply: (data: CreateForumReplyRequest) => apiClient.createForumReply(data),

  // Users
  getUsers: () => apiClient.getUsers(),
  getUser: (userId: string) => apiClient.getUser(userId),
  updateUser: (userId: string, data: UpdateUserRequest) => apiClient.updateUser(userId, data),
}

// Export mock data for direct access when needed
export { mockData }

// Export configuration for debugging
export const apiConfig = {
  baseUrl: API_BASE_URL,
  useMock: USE_MOCK_DATA,
  mockDelay: MOCK_DELAY,
} 