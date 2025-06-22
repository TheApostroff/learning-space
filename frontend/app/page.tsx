"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Clock,
  FileText,
  GraduationCap,
  Home,
  MessageSquare,
  Settings,
  User,
  LogOut,
  CheckCircle,
  AlertCircle,
  Users,
  BarChart3,
  Plus,
  Edit,
  Eye,
  Sparkles,
  TrendingUp,
  Award,
  Calendar,
  Star,
  LogIn,
} from "lucide-react"
import Link from "next/link"
import { mockData } from "./lib/mock-data"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"student" | "professor">("student")
  
  // Check authentication state on component mount
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn")
    const role = localStorage.getItem("userRole") as "student" | "professor"
    
    if (loginStatus === "true" && role) {
      setIsLoggedIn(true)
      setUserRole(role)
    }
  }, [])
  
  const currentUser = mockData.users.find((u) => u.role === userRole)
  const enrolledCourses = mockData.courses.filter((course) => 
    userRole === "student" 
      ? course.enrolledStudents.includes(currentUser?.id || "")
      : course.instructorId === currentUser?.id
  )

  // Calculate course progress
  const getCourseProgress = (courseId: string) => {
    const courseSections = mockData.courseSections.filter((s) => s.courseId === courseId)
    const completedActivities = JSON.parse(localStorage.getItem('completedActivities') || '[]')
    
    const totalActivities = courseSections.reduce((acc, section) => acc + section.activities.length, 0)
    const completedCount = courseSections.reduce((acc, section) => 
      acc + section.activities.filter((a) => completedActivities.includes(a.id)).length, 0
    )
    
    return totalActivities > 0 ? Math.round((completedCount / totalActivities) * 100) : 0
  }

  const handleSignOut = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userRole")
    setIsLoggedIn(false)
    setUserRole("student")
  }

  // If not logged in, show simple sign-in page
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">SkillSpace</CardTitle>
            <CardDescription className="text-lg">AI-Powered Learning Platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-lg">
              Welcome to SkillSpace! Please sign in to access your learning dashboard.
            </p>
            <div className="space-y-3">
              <Link href="/login">
                <Button size="lg" className="w-full">
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Demo: Use any email/password combination
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Logged-in user dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">SkillSpace</h1>
                <p className="text-muted-foreground">AI-Powered Learning Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>
                    {currentUser?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="font-medium">{currentUser?.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{userRole}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="grades">Grades</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold">
                  Welcome back, {userRole === "professor" ? "Prof. " : ""}{currentUser?.name.split(" ")[0]}!
                </h2>
                <p className="text-muted-foreground">
                  {userRole === "professor" 
                    ? "Manage your courses and track student progress" 
                    : "Here's what's happening in your courses"
                  }
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {userRole === "professor" ? "Active Courses" : "Enrolled Courses"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{enrolledCourses.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {userRole === "professor" ? "Total Students" : "Pending Assignments"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {userRole === "professor" 
                        ? enrolledCourses.reduce((acc, course) => acc + course.enrolledStudents.length, 0)
                        : mockData.assignments.filter((a) => a.status === "pending").length
                      }
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      {userRole === "professor" ? "Assignments" : "Average Grade"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {userRole === "professor" ? mockData.assignments.length : "85%"}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {userRole === "professor" ? "Pending Grades" : "Completed"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {userRole === "professor" 
                        ? "12" 
                        : mockData.assignments.filter((a) => a.status === "submitted").length
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      {userRole === "professor" ? "Recent Submissions" : "Upcoming Assignments"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockData.assignments
                      .filter((a) => userRole === "professor" ? a.status === "submitted" : a.status === "pending")
                      .slice(0, 3)
                      .map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{assignment.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {userRole === "professor" 
                                ? "Student submission" 
                                : `Due: ${new Date(assignment.dueDate).toLocaleDateString()}`
                              }
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={assignment.status === "pending" ? "destructive" : "default"}>
                              {assignment.status}
                            </Badge>
                            {userRole === "professor" ? (
                              <Button size="sm" variant="outline">Review</Button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      {userRole === "professor" ? "Course Performance" : "Course Progress"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {enrolledCourses.slice(0, 3).map((course) => (
                      <div key={course.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{course.title}</span>
                          <span className="text-sm text-muted-foreground">
                            {userRole === "professor" 
                              ? `${course.enrolledStudents.length} students`
                              : `${getCourseProgress(course.id)}%`
                            }
                          </span>
                        </div>
                        <Progress value={getCourseProgress(course.id)} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {userRole === "professor" ? (
                      <>
                        <Link href="/create-course">
                          <Button variant="outline" className="w-full h-20 flex-col gap-2">
                            <Plus className="w-6 h-6" />
                            <span className="text-sm">Create Course</span>
                          </Button>
                        </Link>
                        <Link href="/create-assignment">
                          <Button variant="outline" className="w-full h-20 flex-col gap-2">
                            <FileText className="w-6 h-6" />
                            <span className="text-sm">Create Assignment</span>
                          </Button>
                        </Link>
                        <Link href="/gradebook">
                          <Button variant="outline" className="w-full h-20 flex-col gap-2">
                            <BarChart3 className="w-6 h-6" />
                            <span className="text-sm">View Gradebook</span>
                          </Button>
                        </Link>
                        <Link href="/analytics">
                          <Button variant="outline" className="w-full h-20 flex-col gap-2">
                            <TrendingUp className="w-6 h-6" />
                            <span className="text-sm">Analytics</span>
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/my-courses">
                          <Button variant="outline" className="w-full h-20 flex-col gap-2">
                            <BookOpen className="w-6 h-6" />
                            <span className="text-sm">My Courses</span>
                          </Button>
                        </Link>
                        <Link href="/assignments">
                          <Button variant="outline" className="w-full h-20 flex-col gap-2">
                            <FileText className="w-6 h-6" />
                            <span className="text-sm">Assignments</span>
                          </Button>
                        </Link>
                        <Link href="/grades">
                          <Button variant="outline" className="w-full h-20 flex-col gap-2">
                            <Award className="w-6 h-6" />
                            <span className="text-sm">My Grades</span>
                          </Button>
                        </Link>
                        <Link href="/calendar">
                          <Button variant="outline" className="w-full h-20 flex-col gap-2">
                            <Calendar className="w-6 h-6" />
                            <span className="text-sm">Calendar</span>
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">My Courses</h2>
                {userRole === "professor" && (
                  <Link href="/create-course">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Course
                    </Button>
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          {mockData.users.find((u) => u.id === course.instructorId)?.name}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </div>
                        <Progress value={getCourseProgress(course.id)} className="h-2" />
                        <div className="flex gap-2">
                          <Link href={`/course/${course.id}`}>
                            <Button size="sm" className="flex-1">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          {userRole === "professor" && (
                            <Link href={`/course/${course.id}/edit`}>
                              <Button size="sm" variant="outline" className="flex-1">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Assignments</h2>
                {userRole === "professor" && (
                  <Link href="/create-assignment">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Assignment
                    </Button>
                  </Link>
                )}
              </div>
              <div className="space-y-4">
                {mockData.assignments.map((assignment) => (
                  <Card key={assignment.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription>{assignment.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {assignment.status === "submitted" ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                          )}
                          <Badge variant={assignment.status === "pending" ? "destructive" : "default"}>
                            {assignment.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          {userRole === "student" && assignment.status === "pending" && (
                            <Button size="sm">Submit Assignment</Button>
                          )}
                          {userRole === "professor" && (
                            <Button size="sm">View Submissions</Button>
                          )}
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="grades">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Grades</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Grade Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockData.grades.map((grade) => (
                      <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{grade.assignmentTitle}</p>
                          <p className="text-sm text-muted-foreground">{grade.courseName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{grade.score}%</p>
                          <p className="text-sm text-muted-foreground">{grade.letterGrade}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
