"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "lucide-react"
import Link from "next/link"
import { mockData } from "../lib/mock-data"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const student = mockData.users.find((u) => u.role === "student")
  const enrolledCourses = mockData.courses.filter((course) => course.enrolledStudents.includes(student?.id || ""))

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
                {student?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{student?.name}</p>
              <p className="text-sm text-muted-foreground">Student</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link href="/student-dashboard">
              <Button variant={activeTab === "overview" ? "default" : "ghost"} className="w-full justify-start">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
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
              <GraduationCap className="w-4 h-4 mr-2" />
              Grades
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
            </TabsList>
          </div>

          <TabsContent value="overview">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {student?.name.split(" ")[0]}!</h1>
                <p className="text-muted-foreground">Here's what's happening in your courses</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{enrolledCourses.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {mockData.assignments.filter((a) => a.status === "pending").length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {mockData.assignments.filter((a) => a.status === "submitted").length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Assignments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockData.assignments
                      .filter((a) => a.status === "pending")
                      .slice(0, 3)
                      .map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{assignment.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={assignment.status === "pending" ? "destructive" : "default"}>
                            {assignment.status}
                          </Badge>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {enrolledCourses.slice(0, 3).map((course) => (
                      <div key={course.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{course.title}</span>
                          <span className="text-sm text-muted-foreground">75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">My Courses</h1>
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
                        <Progress value={75} className="h-2" />
                        <Button className="w-full">
                          <Link href={`/course/${course.id}`}>Continue Learning</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Assignments</h1>
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
                          {assignment.status === "pending" && <Button size="sm">Submit Assignment</Button>}
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
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
              <h1 className="text-3xl font-bold">Grades</h1>
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

          <TabsContent value="settings">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Settings</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={student?.name} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={student?.email} />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" defaultValue={student?.profile.bio} />
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Assignment Reminders</p>
                        <p className="text-sm text-muted-foreground">Get notified about upcoming assignments</p>
                      </div>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Grade Updates</p>
                        <p className="text-sm text-muted-foreground">Receive notifications when grades are posted</p>
                      </div>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Course Announcements</p>
                        <p className="text-sm text-muted-foreground">Stay updated with course news</p>
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
