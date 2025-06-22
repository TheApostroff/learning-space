"use client"

import { use, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  Clock,
  FileText,
  Users,
  Download,
  MessageSquare,
  Calendar,
  CheckCircle,
  Star,
  Play,
  File,
  HelpCircle,
  Eye,
  Home,
  Video,
  FileImage,
  ExternalLink,
  BarChart3,
  Sparkles,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { mockData, type Activity } from "../../../lib/mock-data"
import { cn } from "@/lib/utils"

export default function ActivityListPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  
  // Redirect to course page since this route should show all activities
  useEffect(() => {
    window.location.href = `/course/${resolvedParams.id}`
  }, [resolvedParams.id])

  const course = mockData.courses.find((c) => c.id === resolvedParams.id)
  const instructor = mockData.users.find((u) => u.id === course?.instructorId)
  const courseSections = mockData.courseSections.filter((s) => s.courseId === resolvedParams.id)

  // Check if current user is the instructor (for navigation purposes)
  const isInstructor = instructor?.id === "professor-1" // In a real app, this would check the logged-in user

  if (!course) {
    return <div>Course not found</div>
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

  // Show loading/redirect message while redirecting
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
            <Link href={`/course/${resolvedParams.id}`} className="hover:text-blue-600">
              {course.title}
            </Link>
            <span>/</span>
            <span className="text-foreground">Activities</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Course Activities</h1>
                <p className="text-muted-foreground">
                  {course.title} • {instructor?.name}
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
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">Redirecting to Course Page</h2>
          <p className="text-muted-foreground mb-6">
            You're being redirected to the full course page where you can view all activities.
          </p>
          <Link href={`/course/${resolvedParams.id}`}>
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Course Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 