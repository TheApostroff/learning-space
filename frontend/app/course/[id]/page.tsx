"use client"

import { useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  Clock,
  FileText,
  Users,
  Download,
  MessageSquare,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star,
  Play,
  File,
  HelpCircle,
  Eye,
  ChevronDown,
  ChevronRight,
  Home,
  Video,
  FileImage,
  ExternalLink,
  BarChart3,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { mockData, type Activity } from "../../lib/mock-data"
import { cn } from "@/lib/utils"

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  const [newSectionTitle, setNewSectionTitle] = useState("")
  const [newSectionDescription, setNewSectionDescription] = useState("")
  const [showAddActivity, setShowAddActivity] = useState<string | null>(null)
  const [courseSections, setCourseSections] = useState(() => 
    mockData.courseSections.filter((s) => s.courseId === resolvedParams.id)
  )

  const course = mockData.courses.find((c) => c.id === resolvedParams.id)
  const instructor = mockData.users.find((u) => u.id === course?.instructorId)

  // Check if current user is the instructor (for navigation purposes)
  const isInstructor = instructor?.id === "professor-1" // In a real app, this would check the logged-in user

  if (!course) {
    return <div>Course not found</div>
  }

  const toggleSection = (sectionId: string) => {
    const newCollapsed = new Set(collapsedSections)
    if (newCollapsed.has(sectionId)) {
      newCollapsed.delete(sectionId)
    } else {
      newCollapsed.add(sectionId)
    }
    setCollapsedSections(newCollapsed)
  }

  const markActivityCompleted = (activityId: string) => {
    setCourseSections(prevSections => 
      prevSections.map(section => ({
        ...section,
        activities: section.activities.map(activity => 
          activity.id === activityId 
            ? { ...activity, completed: true }
            : activity
        )
      }))
    )
  }

  // Get completed activities from localStorage
  const getCompletedActivities = () => {
    return JSON.parse(localStorage.getItem('completedActivities') || '[]')
  }

  const isActivityCompleted = (activityId: string) => {
    return getCompletedActivities().includes(activityId)
  }

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />
      case "resource":
        return <File className="w-4 h-4" />
      case "assignment":
        return <FileText className="w-4 h-4" />
      case "quiz":
        return <HelpCircle className="w-4 h-4" />
      case "forum":
        return <MessageSquare className="w-4 h-4" />
      case "page":
        return <FileImage className="w-4 h-4" />
      case "url":
        return <ExternalLink className="w-4 h-4" />
      case "generative-task":
        return <Sparkles className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "video":
        return "bg-red-100 text-red-600 border-red-200"
      case "resource":
        return "bg-blue-100 text-blue-600 border-blue-200"
      case "assignment":
        return "bg-orange-100 text-orange-600 border-orange-200"
      case "quiz":
        return "bg-purple-100 text-purple-600 border-purple-200"
      case "forum":
        return "bg-green-100 text-green-600 border-green-200"
      case "page":
        return "bg-gray-100 text-gray-600 border-gray-200"
      case "url":
        return "bg-indigo-100 text-indigo-600 border-indigo-200"
      case "generative-task":
        return "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 border-purple-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const completedActivities = courseSections.reduce(
    (acc, section) => acc + section.activities.filter((a) => isActivityCompleted(a.id)).length,
    0,
  )
  const totalActivities = courseSections.reduce((acc, section) => acc + section.activities.length, 0)
  const progressPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href={isInstructor ? "/professor-dashboard" : "/student-dashboard"} className="hover:text-blue-600">
              <Home className="w-4 h-4" />
            </Link>
            <span>/</span>
            <Link href={isInstructor ? "/professor-dashboard" : "/student-dashboard"} className="hover:text-blue-600">
              My Courses
            </Link>
            <span>/</span>
            <span className="text-foreground">{course.title}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="text-muted-foreground">
                  {instructor?.name} • {course.category} • {course.level}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="font-semibold">{Math.round(progressPercentage)}%</p>
              </div>
              <Progress value={progressPercentage} className="w-32" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Course Description */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <p className="text-muted-foreground">{course.description}</p>
              </CardContent>
            </Card>

            {/* Course Sections */}
            <div className="space-y-4">
              {courseSections.map((section) => (
                <Card key={section.id} className="overflow-hidden">
                  <CardHeader
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {collapsedSections.has(section.id) ? (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                          {section.description && (
                            <CardDescription className="mt-1">{section.description}</CardDescription>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline">
                        {section.activities.filter((a) => isActivityCompleted(a.id)).length}/{section.activities.length} completed
                      </Badge>
                    </div>
                  </CardHeader>

                  {!collapsedSections.has(section.id) && (
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {section.activities.map((activity) => (
                          <div
                            key={activity.id}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-lg border transition-all hover:shadow-sm",
                              isActivityCompleted(activity.id) ? "bg-green-50 border-green-200" : "bg-white hover:bg-gray-50",
                            )}
                          >
                            {/* Activity Icon */}
                            <div
                              className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center border",
                                getActivityColor(activity.type),
                              )}
                            >
                              {getActivityIcon(activity.type)}
                            </div>

                            {/* Activity Content */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">{activity.title}</h3>
                                {isActivityCompleted(activity.id) && <CheckCircle className="w-4 h-4 text-green-600" />}
                              </div>
                              {activity.description && (
                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                              )}
                              {activity.metadata && (
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  {activity.metadata.fileSize && (
                                    <span>{activity.metadata.fileSize}</span>
                                  )}
                                  {activity.metadata.videoDuration && (
                                    <span>{activity.metadata.videoDuration}</span>
                                  )}
                                  {activity.metadata.points && (
                                    <span>{activity.metadata.points} points</span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Activity Actions */}
                            <div className="flex items-center gap-2">
                              <Link href={`/course/${resolvedParams.id}/activity/${activity.id}`}>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </Link>
                              {activity.metadata?.fileUrl && (
                                <Button size="sm" variant="ghost">
                                  <Download className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Duration: {course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{course.enrolledStudents.length} students enrolled</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Started: {new Date(course.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <span>Level: {course.level}</span>
                </div>
              </CardContent>
            </Card>

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={instructor?.avatar} />
                    <AvatarFallback>
                      {instructor?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{instructor?.name}</p>
                    <p className="text-sm text-muted-foreground">{instructor?.profile.department}</p>
                  </div>
                </div>
                {instructor?.profile.bio && (
                  <p className="text-sm text-muted-foreground mt-3">{instructor.profile.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Course Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Course Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {course.resources.slice(0, 3).map((resource) => (
                  <div key={resource.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <File className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{resource.title}</p>
                      <p className="text-xs text-muted-foreground">{resource.type.toUpperCase()}</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {course.resources.length > 3 && (
                  <Button variant="outline" size="sm" className="w-full">
                    View All Resources ({course.resources.length})
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/course/${resolvedParams.id}/participants`}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    View Participants
                  </Button>
                </Link>
                <Link href={`/course/${resolvedParams.id}/grades`}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Grades
                  </Button>
                </Link>
                <Link href={`/course/${resolvedParams.id}/calendar`}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Course Calendar
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Instructor
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
