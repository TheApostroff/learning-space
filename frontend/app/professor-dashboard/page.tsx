"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  Users,
  FileText,
  GraduationCap,
  Home,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Edit,
  Eye,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { mockData } from "../lib/mock-data"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ProfessorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const professor = mockData.users.find((u) => u.role === "professor")
  const professorCourses = mockData.courses.filter((course) => course.instructorId === professor?.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">SkillSpace</span>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>
                {professor?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{professor?.name}</p>
              <p className="text-sm text-muted-foreground">Professor</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "courses" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("courses")}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              My Courses
            </Button>
            <Button
              variant={activeTab === "assignments" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("assignments")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Assignments
            </Button>
            <Button
              variant={activeTab === "grades" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("grades")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Gradebook
            </Button>
            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Link href="/messages">
              <Button variant="ghost" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Button>
            </Link>
          </nav>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="grades">Grades</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Welcome back, Prof. {professor?.name.split(" ")[1]}!</h1>
                <p className="text-muted-foreground">Manage your courses and track student progress</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{professorCourses.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {professorCourses.reduce((acc, course) => acc + course.enrolledStudents.length, 0)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockData.assignments.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Pending Grades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Submissions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockData.assignments
                      .filter((a) => a.status === "submitted")
                      .slice(0, 3)
                      .map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{assignment.title}</p>
                            <p className="text-sm text-muted-foreground">Student submission</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {professorCourses.slice(0, 3).map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-muted-foreground">{course.enrolledStudents.length} students</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">85%</p>
                          <p className="text-sm text-muted-foreground">Avg. Grade</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">My Courses</h1>
                <Link href="/create-course">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Course
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {professorCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          {course.enrolledStudents.length} students enrolled
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/course/${course.id}`}>
                            <Button size="sm" className="flex-1">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Link href={`/course/${course.id}/edit`}>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-sm font-medium mb-2">Recent Students:</p>
                          <div className="space-y-1">
                            {course.enrolledStudents.slice(0, 2).map((studentId) => {
                              const student = mockData.users.find((u) => u.id === studentId)
                              return (
                                <div key={studentId} className="flex items-center gap-2 text-xs">
                                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs">
                                    {student?.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </div>
                                  <span className="text-muted-foreground">{student?.name}</span>
                                </div>
                              )
                            })}
                            {course.enrolledStudents.length > 2 && (
                              <p className="text-xs text-muted-foreground">
                                +{course.enrolledStudents.length - 2} more
                              </p>
                            )}
                          </div>
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
                <h1 className="text-3xl font-bold">Assignments</h1>
                <Link href="/create-assignment">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Assignment
                  </Button>
                </Link>
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
                        <Badge variant={assignment.status === "pending" ? "destructive" : "default"}>
                          {assignment.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm">View Submissions</Button>
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
              <h1 className="text-3xl font-bold">Gradebook</h1>
              <Card>
                <CardHeader>
                  <CardTitle>Student Grades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockData.grades.map((grade) => (
                      <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{grade.studentName}</p>
                          <p className="text-sm text-muted-foreground">{grade.assignmentTitle}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-bold">{grade.score}%</p>
                            <p className="text-sm text-muted-foreground">{grade.letterGrade}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Edit Grade
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Settings</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Update your professional information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={professor?.name} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={professor?.email} />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" defaultValue={professor?.profile.department} />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" defaultValue={professor?.profile.bio} />
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Teaching Preferences</CardTitle>
                    <CardDescription>Configure your teaching settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-grade Quizzes</p>
                        <p className="text-sm text-muted-foreground">Automatically grade multiple choice quizzes</p>
                      </div>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Late Submission Penalty</p>
                        <p className="text-sm text-muted-foreground">Apply penalty for late submissions</p>
                      </div>
                      <Badge variant="secondary">10% per day</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Student Notifications</p>
                        <p className="text-sm text-muted-foreground">Send notifications to students</p>
                      </div>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
