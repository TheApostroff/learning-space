"use client"

import { useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Home,
  Download,
  TrendingUp,
  BarChart3,
  FileText,
  Calendar,
  Award,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { mockData } from "../../../lib/mock-data"

export default function GradesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [activeTab, setActiveTab] = useState("overview")

  const course = mockData.courses.find((c) => c.id === resolvedParams.id)
  const currentUser = mockData.users.find((u) => u.role === "student")
  const userGrades = mockData.grades.filter((g) => g.studentId === currentUser?.id && g.courseId === resolvedParams.id)

  // Mock additional grade data
  const gradeCategories = [
    {
      name: "Assignments",
      weight: 40,
      current: 85,
      total: 300,
      earned: 255,
      items: [
        { name: "HTML Portfolio", points: 85, total: 100, dueDate: "2024-12-25" },
        { name: "CSS Styling Project", points: 92, total: 100, dueDate: "2024-12-30" },
        { name: "JavaScript Interactive Page", points: 78, total: 100, dueDate: "2025-01-05" },
      ],
    },
    {
      name: "Quizzes",
      weight: 30,
      current: 88,
      total: 150,
      earned: 132,
      items: [
        { name: "HTML Basics Quiz", points: 45, total: 50, dueDate: "2024-12-15" },
        { name: "CSS Fundamentals Quiz", points: 42, total: 50, dueDate: "2024-12-22" },
        { name: "JavaScript Quiz", points: 45, total: 50, dueDate: "2024-12-29" },
      ],
    },
    {
      name: "Participation",
      weight: 20,
      current: 95,
      total: 100,
      earned: 95,
      items: [
        { name: "Forum Discussions", points: 48, total: 50, dueDate: "Ongoing" },
        { name: "Class Attendance", points: 47, total: 50, dueDate: "Ongoing" },
      ],
    },
    {
      name: "Final Project",
      weight: 10,
      current: 0,
      total: 100,
      earned: 0,
      items: [{ name: "Final Portfolio Website", points: 0, total: 100, dueDate: "2025-01-15" }],
    },
  ]

  const calculateOverallGrade = () => {
    let totalWeightedPoints = 0
    let totalWeight = 0

    gradeCategories.forEach((category) => {
      if (category.current > 0) {
        totalWeightedPoints += (category.current * category.weight) / 100
        totalWeight += category.weight
      }
    })

    return totalWeight > 0 ? (totalWeightedPoints / totalWeight) * 100 : 0
  }

  const overallGrade = calculateOverallGrade()

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    if (percentage >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const getLetterGrade = (percentage: number) => {
    if (percentage >= 97) return "A+"
    if (percentage >= 93) return "A"
    if (percentage >= 90) return "A-"
    if (percentage >= 87) return "B+"
    if (percentage >= 83) return "B"
    if (percentage >= 80) return "B-"
    if (percentage >= 77) return "C+"
    if (percentage >= 73) return "C"
    if (percentage >= 70) return "C-"
    if (percentage >= 67) return "D+"
    if (percentage >= 63) return "D"
    if (percentage >= 60) return "D-"
    return "F"
  }

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
            <span className="text-foreground">Grades</span>
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
                <h1 className="text-2xl font-bold">Grades</h1>
                <p className="text-muted-foreground">{course.title}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Grades
              </Button>
              <Button>
                <Eye className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Grade Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Grade</p>
                  <p className={`text-3xl font-bold ${getGradeColor(overallGrade)}`}>{overallGrade.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Letter Grade: {getLetterGrade(overallGrade)}</p>
                </div>
                <Award className={`w-8 h-8 ${getGradeColor(overallGrade)}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assignments</p>
                  <p className="text-2xl font-bold">85%</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">+3% from last</span>
                  </div>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quizzes</p>
                  <p className="text-2xl font-bold">88%</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">+5% from last</span>
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Class Rank</p>
                  <p className="text-2xl font-bold">3rd</p>
                  <p className="text-sm text-muted-foreground">out of {course.enrolledStudents.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Grade Overview</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="timeline">Grade Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Grade Breakdown */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Grade Breakdown</CardTitle>
                    <CardDescription>Your performance across different categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {gradeCategories.map((category) => (
                        <div key={category.name}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{category.name}</span>
                              <Badge variant="outline">{category.weight}% of grade</Badge>
                            </div>
                            <span className={`font-semibold ${getGradeColor(category.current)}`}>
                              {category.current}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Progress value={category.current} className="flex-1" />
                            <span className="text-sm text-muted-foreground">
                              {category.earned}/{category.total} pts
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Grade Summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Grade Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Current Grade</p>
                      <p className={`text-4xl font-bold ${getGradeColor(overallGrade)}`}>
                        {getLetterGrade(overallGrade)}
                      </p>
                      <p className="text-lg text-muted-foreground">{overallGrade.toFixed(1)}%</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Points Earned:</span>
                        <span className="font-medium">482/550</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Assignments Completed:</span>
                        <span className="font-medium">8/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Late Submissions:</span>
                        <span className="font-medium">1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Missing Assignments:</span>
                        <span className="font-medium text-red-600">2</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <div className="space-y-6">
              {gradeCategories.map((category) => (
                <Card key={category.name}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {category.name}
                          <Badge variant="outline">{category.weight}% of final grade</Badge>
                        </CardTitle>
                        <CardDescription>
                          Current average: {category.current}% ({category.earned}/{category.total} points)
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getGradeColor(category.current)}`}>{category.current}%</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assignment</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Percentage</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {category.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                              {item.points}/{item.total}
                            </TableCell>
                            <TableCell>
                              <span className={getGradeColor((item.points / item.total) * 100)}>
                                {((item.points / item.total) * 100).toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell>{item.dueDate}</TableCell>
                            <TableCell>
                              {item.points > 0 ? (
                                <Badge variant="default">Graded</Badge>
                              ) : (
                                <Badge variant="secondary">Pending</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Grade Timeline</CardTitle>
                <CardDescription>Your grade progression throughout the course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userGrades.map((grade, index) => (
                    <div key={grade.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{grade.assignmentTitle}</h4>
                        <p className="text-sm text-muted-foreground">
                          Graded on {new Date(grade.gradedAt).toLocaleDateString()}
                        </p>
                        {grade.feedback && <p className="text-sm mt-1">{grade.feedback}</p>}
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${getGradeColor(grade.score)}`}>{grade.score}%</p>
                        <p className="text-sm text-muted-foreground">{grade.letterGrade}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
