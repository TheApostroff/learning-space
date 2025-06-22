"use client"

import { useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { mockData } from "../../../lib/mock-data"

export default function CalendarPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [currentDate, setCurrentDate] = useState(new Date())
  const course = mockData.courses.find((c) => c.id === resolvedParams.id)
  const courseSections = mockData.courseSections?.filter((s) => s.courseId === resolvedParams.id) || []

  if (!course) {
    return <div>Course not found</div>
  }

  // Get all activities with due dates
  const activitiesWithDates = courseSections
    .flatMap((section) =>
      section.activities
        .filter((activity) => activity.dueDate)
        .map((activity) => ({
          ...activity,
          sectionTitle: section.title,
          dueDate: new Date(activity.dueDate!),
        }))
    )
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const getActivitiesForDate = (date: Date) => {
    return activitiesWithDates.filter(
      (activity) =>
        activity.dueDate.getDate() === date.getDate() &&
        activity.dueDate.getMonth() === date.getMonth() &&
        activity.dueDate.getFullYear() === date.getFullYear()
    )
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "assignment":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "quiz":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "forum":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isPastDue = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
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
            <span className="text-foreground">Calendar</span>
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
                <h1 className="text-2xl font-bold">Course Calendar</h1>
                <p className="text-muted-foreground">{course.title}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Export Calendar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </CardTitle>
                    <CardDescription>Course deadlines and important dates</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={previousMonth}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextMonth}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {/* Day headers */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}

                  {/* Empty cells for days before the first day of the month */}
                  {Array.from({ length: startingDayOfWeek }, (_, i) => (
                    <div key={`empty-${i}`} className="p-2 min-h-[80px] bg-gray-50"></div>
                  ))}

                  {/* Days of the month */}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                    const activities = getActivitiesForDate(date)
                    const isCurrentDay = isToday(date)

                    return (
                      <div
                        key={day}
                        className={`p-2 min-h-[80px] border border-gray-200 ${
                          isCurrentDay ? "bg-blue-50 border-blue-300" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-sm font-medium ${
                              isCurrentDay ? "text-blue-600" : "text-gray-900"
                            }`}
                          >
                            {day}
                          </span>
                          {isCurrentDay && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <div className="space-y-1">
                          {activities.slice(0, 2).map((activity) => (
                            <div
                              key={activity.id}
                              className={`text-xs p-1 rounded border ${getActivityColor(activity.type)} ${
                                isPastDue(activity.dueDate) ? "opacity-60" : ""
                              }`}
                            >
                              <div className="font-medium truncate">{activity.title}</div>
                              <div className="text-xs opacity-75">{activity.type}</div>
                            </div>
                          ))}
                          {activities.length > 2 && (
                            <div className="text-xs text-muted-foreground text-center">
                              +{activities.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activitiesWithDates
                    .filter((activity) => activity.dueDate >= new Date())
                    .slice(0, 5)
                    .map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <div className={`w-3 h-3 rounded-full ${getActivityColor(activity.type).split(' ')[0]}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.dueDate.toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  {activitiesWithDates.filter((activity) => activity.dueDate >= new Date()).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No upcoming deadlines</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Past Due */}
            <Card>
              <CardHeader>
                <CardTitle>Past Due</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activitiesWithDates
                    .filter((activity) => isPastDue(activity.dueDate))
                    .slice(0, 3)
                    .map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg bg-red-50">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-red-800">{activity.title}</p>
                          <p className="text-xs text-red-600">
                            Due: {activity.dueDate.toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          Overdue
                        </Badge>
                      </div>
                    ))}
                  {activitiesWithDates.filter((activity) => isPastDue(activity.dueDate)).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No overdue items</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Calendar Legend */}
            <Card>
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Assignments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Quizzes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Forums</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Other Activities</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
