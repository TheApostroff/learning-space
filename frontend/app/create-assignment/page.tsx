"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FileText,
  Calendar,
  Upload,
  Plus,
  X,
  ArrowLeft,
  Save,
  Eye,
  Clock,
  Users,
} from "lucide-react"
import Link from "next/link"
import { mockData } from "../lib/mock-data"

export default function CreateAssignmentPage() {
  const [activeTab, setActiveTab] = useState("basic")
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    courseId: "",
    type: "essay" as "quiz" | "essay" | "project" | "exam",
    totalPoints: 100,
    dueDate: "",
    dueTime: "",
    instructions: "",
    allowLateSubmission: false,
    latePenalty: 10,
    maxAttempts: 1,
    timeLimit: 0,
    attachments: [] as Array<{
      id: string
      title: string
      type: "pdf" | "video" | "link" | "document"
      url: string
      description: string
    }>,
    rubric: [] as Array<{
      id: string
      criterion: string
      points: number
      description: string
    }>,
  })

  const [newAttachment, setNewAttachment] = useState({
    title: "",
    type: "pdf" as "pdf" | "video" | "link" | "document",
    url: "",
    description: "",
  })

  const [newRubricItem, setNewRubricItem] = useState({
    criterion: "",
    points: 0,
    description: "",
  })

  const professorCourses = mockData.courses.filter(course => course.instructorId === "professor-1")

  const handleAddAttachment = () => {
    if (newAttachment.title.trim() && newAttachment.url.trim()) {
      setAssignmentData(prev => ({
        ...prev,
        attachments: [...prev.attachments, {
          ...newAttachment,
          id: Date.now().toString(),
          title: newAttachment.title.trim(),
          url: newAttachment.url.trim(),
          description: newAttachment.description.trim(),
        }]
      }))
      setNewAttachment({
        title: "",
        type: "pdf",
        url: "",
        description: "",
      })
    }
  }

  const handleRemoveAttachment = (id: string) => {
    setAssignmentData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== id)
    }))
  }

  const handleAddRubricItem = () => {
    if (newRubricItem.criterion.trim() && newRubricItem.points > 0) {
      setAssignmentData(prev => ({
        ...prev,
        rubric: [...prev.rubric, {
          ...newRubricItem,
          id: Date.now().toString(),
          criterion: newRubricItem.criterion.trim(),
          description: newRubricItem.description.trim(),
        }]
      }))
      setNewRubricItem({
        criterion: "",
        points: 0,
        description: "",
      })
    }
  }

  const handleRemoveRubricItem = (id: string) => {
    setAssignmentData(prev => ({
      ...prev,
      rubric: prev.rubric.filter(r => r.id !== id)
    }))
  }

  const handleCreateAssignment = () => {
    // Handle assignment creation logic
    console.log("Creating assignment:", assignmentData)
    // Redirect to professor dashboard or course page
    window.location.href = "/professor-dashboard"
  }

  const isFormValid = () => {
    return (
      assignmentData.title.trim() &&
      assignmentData.description.trim() &&
      assignmentData.courseId &&
      assignmentData.dueDate &&
      assignmentData.instructions.trim()
    )
  }

  const totalRubricPoints = assignmentData.rubric.reduce((sum, item) => sum + item.points, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/professor-dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Assignment</h1>
                <p className="text-sm text-gray-500">Set up your assignment with all the details</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleCreateAssignment} disabled={!isFormValid()}>
                <Save className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
            <TabsTrigger value="attachments" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Attachments</span>
            </TabsTrigger>
            <TabsTrigger value="rubric" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Rubric</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Provide the essential details about your assignment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Assignment Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Final Research Paper"
                    value={assignmentData.title}
                    onChange={(e) => setAssignmentData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Assignment Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students need to do for this assignment..."
                    value={assignmentData.description}
                    onChange={(e) => setAssignmentData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="course">Course *</Label>
                    <Select value={assignmentData.courseId} onValueChange={(value) => setAssignmentData(prev => ({ ...prev, courseId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {professorCourses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Assignment Type</Label>
                    <Select value={assignmentData.type} onValueChange={(value: "quiz" | "essay" | "project" | "exam") => setAssignmentData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="essay">Essay</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalPoints">Total Points</Label>
                    <Input
                      id="totalPoints"
                      type="number"
                      min="1"
                      value={assignmentData.totalPoints}
                      onChange={(e) => setAssignmentData(prev => ({ ...prev, totalPoints: parseInt(e.target.value) || 100 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Maximum Attempts</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      min="1"
                      value={assignmentData.maxAttempts}
                      onChange={(e) => setAssignmentData(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions *</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Provide detailed instructions for students..."
                    value={assignmentData.instructions}
                    onChange={(e) => setAssignmentData(prev => ({ ...prev, instructions: e.target.value }))}
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Settings</CardTitle>
                <CardDescription>Configure deadlines, time limits, and submission options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={assignmentData.dueDate}
                      onChange={(e) => setAssignmentData(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueTime">Due Time</Label>
                    <Input
                      id="dueTime"
                      type="time"
                      value={assignmentData.dueTime}
                      onChange={(e) => setAssignmentData(prev => ({ ...prev, dueTime: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowLateSubmission"
                      checked={assignmentData.allowLateSubmission}
                      onCheckedChange={(checked) => setAssignmentData(prev => ({ ...prev, allowLateSubmission: checked as boolean }))}
                    />
                    <Label htmlFor="allowLateSubmission">Allow late submissions</Label>
                  </div>

                  {assignmentData.allowLateSubmission && (
                    <div className="space-y-2">
                      <Label htmlFor="latePenalty">Late Penalty (%)</Label>
                      <Input
                        id="latePenalty"
                        type="number"
                        min="0"
                        max="100"
                        value={assignmentData.latePenalty}
                        onChange={(e) => setAssignmentData(prev => ({ ...prev, latePenalty: parseInt(e.target.value) || 0 }))}
                      />
                      <p className="text-sm text-gray-500">Percentage of points deducted for late submissions</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="0"
                    placeholder="0 for no time limit"
                    value={assignmentData.timeLimit}
                    onChange={(e) => setAssignmentData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 0 }))}
                  />
                  <p className="text-sm text-gray-500">Set to 0 for no time limit</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Assignment Summary</h3>
                  <div className="space-y-1 text-sm text-blue-700">
                    <p><strong>Type:</strong> {assignmentData.type.charAt(0).toUpperCase() + assignmentData.type.slice(1)}</p>
                    <p><strong>Points:</strong> {assignmentData.totalPoints}</p>
                    <p><strong>Due:</strong> {assignmentData.dueDate ? new Date(assignmentData.dueDate).toLocaleDateString() : "Not set"}</p>
                    <p><strong>Attempts:</strong> {assignmentData.maxAttempts}</p>
                    {assignmentData.timeLimit > 0 && (
                      <p><strong>Time Limit:</strong> {assignmentData.timeLimit} minutes</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attachments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Attachments</CardTitle>
                <CardDescription>Add files and resources for your students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {assignmentData.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{attachment.type.toUpperCase()}</Badge>
                        <div>
                          <h4 className="font-medium">{attachment.title}</h4>
                          <p className="text-sm text-gray-500">{attachment.description}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAttachment(attachment.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Add New Attachment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="attachmentTitle">Title</Label>
                      <Input
                        id="attachmentTitle"
                        placeholder="Attachment title"
                        value={newAttachment.title}
                        onChange={(e) => setNewAttachment(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="attachmentType">Type</Label>
                      <Select value={newAttachment.type} onValueChange={(value: "pdf" | "video" | "link" | "document") => setNewAttachment(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="link">Link</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attachmentUrl">URL</Label>
                    <Input
                      id="attachmentUrl"
                      placeholder="https://example.com/resource"
                      value={newAttachment.url}
                      onChange={(e) => setNewAttachment(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attachmentDescription">Description</Label>
                    <Textarea
                      id="attachmentDescription"
                      placeholder="Brief description of the attachment"
                      value={newAttachment.description}
                      onChange={(e) => setNewAttachment(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <Button onClick={handleAddAttachment} disabled={!newAttachment.title.trim() || !newAttachment.url.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Attachment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rubric" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Grading Rubric</CardTitle>
                <CardDescription>Define criteria and point values for grading</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {assignmentData.rubric.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{item.points} pts</Badge>
                          <h4 className="font-medium">{item.criterion}</h4>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRubricItem(item.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Add Rubric Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rubricCriterion">Criterion</Label>
                      <Input
                        id="rubricCriterion"
                        placeholder="e.g., Content Quality"
                        value={newRubricItem.criterion}
                        onChange={(e) => setNewRubricItem(prev => ({ ...prev, criterion: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rubricPoints">Points</Label>
                      <Input
                        id="rubricPoints"
                        type="number"
                        min="1"
                        value={newRubricItem.points}
                        onChange={(e) => setNewRubricItem(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rubricDescription">Description</Label>
                    <Textarea
                      id="rubricDescription"
                      placeholder="Describe what students need to achieve for this criterion"
                      value={newRubricItem.description}
                      onChange={(e) => setNewRubricItem(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <Button onClick={handleAddRubricItem} disabled={!newRubricItem.criterion.trim() || newRubricItem.points <= 0}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Rubric Item
                  </Button>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">Rubric Summary</h3>
                  <div className="space-y-1 text-sm text-green-700">
                    <p><strong>Total Criteria:</strong> {assignmentData.rubric.length}</p>
                    <p><strong>Total Points:</strong> {totalRubricPoints}</p>
                    <p><strong>Assignment Points:</strong> {assignmentData.totalPoints}</p>
                    {totalRubricPoints !== assignmentData.totalPoints && (
                      <p className="text-orange-600"><strong>Note:</strong> Rubric points don't match assignment points</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 