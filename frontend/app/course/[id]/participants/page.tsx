"use client"

import { useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  MessageSquare,
  Mail,
  MoreHorizontal,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ArrowLeft,
  Home,
  Filter,
  Download,
  UserPlus,
  Settings,
  UserMinus,
  Eye,
  Phone,
} from "lucide-react"
import Link from "next/link"
import { mockData } from "../../../lib/mock-data"

export default function ParticipantsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const course = mockData.courses.find((c) => c.id === resolvedParams.id)
  const instructor = mockData.users.find((u) => u.id === course?.instructorId)
  const students = mockData.users.filter((u) => u.role === "student" && course?.enrolledStudents.includes(u.id))

  const allParticipants = [
    ...(instructor ? [{ ...instructor, role: "instructor" as const }] : []),
    ...students.map((s) => ({ ...s, role: "student" as const })),
  ]

  const filteredParticipants = allParticipants.filter((participant) => {
    const matchesSearch =
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchQuery.toLowerCase())

    switch (activeTab) {
      case "instructors":
        return matchesSearch && participant.role === "instructor"
      case "students":
        return matchesSearch && participant.role === "student"
      default:
        return matchesSearch
    }
  })

  if (!course) {
    return <div>Course not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/student-dashboard" className="hover:text-blue-600">
              <Home className="w-4 h-4" />
            </Link>
            <span>/</span>
            <Link href="/student-dashboard" className="hover:text-blue-600">
              My Courses
            </Link>
            <span>/</span>
            <Link href={`/course/${resolvedParams.id}`} className="hover:text-blue-600">
              {course.title}
            </Link>
            <span>/</span>
            <span className="text-foreground">Participants</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/course/${resolvedParams.id}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Participants</h1>
                <p className="text-muted-foreground">{course.title}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export List
              </Button>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search participants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Course Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Instructors</span>
                  </div>
                  <Badge variant="outline">1</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Students</span>
                  </div>
                  <Badge variant="outline">{students.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Total Enrolled</span>
                  </div>
                  <Badge variant="outline">{allParticipants.length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message All
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Students
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Enroll Student
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Course Participants</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All ({allParticipants.length})</TabsTrigger>
                    <TabsTrigger value="instructors">Instructors (1)</TabsTrigger>
                    <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-6">
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {filteredParticipants.map((participant) => (
                          <div
                            key={participant.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                                <AvatarFallback>
                                  {participant.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold">{participant.name}</h3>
                                  <Badge
                                    variant={participant.role === "instructor" ? "default" : "secondary"}
                                    className="text-xs"
                                  >
                                    {participant.role === "instructor" ? "Instructor" : "Student"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{participant.email}</p>
                                {participant.profile.department && (
                                  <p className="text-xs text-muted-foreground">{participant.profile.department}</p>
                                )}
                                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  <span>Last active: {new Date(participant.lastLogin).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Mail className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="instructors" className="mt-6">
                    <div className="space-y-4">
                      {filteredParticipants
                        .filter((p) => p.role === "instructor")
                        .map((instructor) => (
                          <Card key={instructor.id} className="border-blue-200 bg-blue-50">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <Avatar className="w-16 h-16">
                                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                                  <AvatarFallback className="text-lg">
                                    {instructor.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-semibold">{instructor.name}</h3>
                                    <Badge variant="default">Course Instructor</Badge>
                                  </div>
                                  <p className="text-muted-foreground mb-2">{instructor.email}</p>
                                  <p className="text-sm mb-4">{instructor.profile.bio}</p>
                                  <div className="flex gap-2">
                                    <Button size="sm">
                                      <MessageSquare className="w-4 h-4 mr-2" />
                                      Send Message
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Mail className="w-4 h-4 mr-2" />
                                      Email
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="students" className="mt-6">
                    <ScrollArea className="h-96">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredParticipants
                          .filter((p) => p.role === "student")
                          .map((student) => (
                            <Card key={student.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <Avatar className="w-12 h-12">
                                    <AvatarImage src="/placeholder.svg?height=48&width=48" />
                                    <AvatarFallback>
                                      {student.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <h4 className="font-semibold mb-1">{student.name}</h4>
                                    <p className="text-sm text-muted-foreground mb-2">{student.email}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                      <span>Progress: 75%</span>
                                      <span>•</span>
                                      <span>Grade: 85%</span>
                                    </div>
                                    <div className="flex gap-1">
                                      <Button variant="ghost" size="sm" className="h-8 px-2">
                                        <MessageSquare className="w-3 h-3" />
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-8 px-2">
                                        <Mail className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
