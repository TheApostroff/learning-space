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
import {
  BookOpen,
  Calendar,
  Users,
  FileText,
  Plus,
  X,
  ArrowLeft,
  Save,
  Eye,
} from "lucide-react"
import Link from "next/link"

export default function CreateCoursePage() {
  const [activeTab, setActiveTab] = useState("basic")
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    duration: "",
    maxStudents: 30,
    startDate: "",
    endDate: "",
    syllabus: [""],
    resources: [] as Array<{
      id: string
      title: string
      type: "pdf" | "video" | "link" | "document"
      url: string
      description: string
    }>,
  })

  const [newSyllabusItem, setNewSyllabusItem] = useState("")
  const [newResource, setNewResource] = useState({
    title: "",
    type: "pdf" as "pdf" | "video" | "link" | "document",
    url: "",
    description: "",
  })

  const handleAddSyllabusItem = () => {
    if (newSyllabusItem.trim()) {
      setCourseData(prev => ({
        ...prev,
        syllabus: [...prev.syllabus, newSyllabusItem.trim()]
      }))
      setNewSyllabusItem("")
    }
  }

  const handleRemoveSyllabusItem = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      syllabus: prev.syllabus.filter((_, i) => i !== index)
    }))
  }

  const handleAddResource = () => {
    if (newResource.title.trim() && newResource.url.trim()) {
      setCourseData(prev => ({
        ...prev,
        resources: [...prev.resources, {
          ...newResource,
          id: Date.now().toString(),
          title: newResource.title.trim(),
          url: newResource.url.trim(),
          description: newResource.description.trim(),
        }]
      }))
      setNewResource({
        title: "",
        type: "pdf",
        url: "",
        description: "",
      })
    }
  }

  const handleRemoveResource = (id: string) => {
    setCourseData(prev => ({
      ...prev,
      resources: prev.resources.filter(r => r.id !== id)
    }))
  }

  const handleCreateCourse = () => {
    // Handle course creation logic
    console.log("Creating course:", courseData)
    // Redirect to professor dashboard or course page
    window.location.href = "/professor-dashboard"
  }

  const isFormValid = () => {
    return (
      courseData.title.trim() &&
      courseData.description.trim() &&
      courseData.category.trim() &&
      courseData.duration.trim() &&
      courseData.startDate &&
      courseData.endDate
    )
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
                <p className="text-sm text-gray-500">Set up your course with all the details</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleCreateCourse} disabled={!isFormValid()}>
                <Save className="w-4 h-4 mr-2" />
                Create Course
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
              <BookOpen className="w-4 h-4" />
              <span>Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="syllabus" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Syllabus</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Resources</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Provide the essential details about your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Introduction to Computer Science"
                    value={courseData.title}
                    onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Course Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students will learn in this course..."
                    value={courseData.description}
                    onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Computer Science"
                      value={courseData.category}
                      onChange={(e) => setCourseData(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Difficulty Level</Label>
                    <Select value={courseData.level} onValueChange={(value: "beginner" | "intermediate" | "advanced") => setCourseData(prev => ({ ...prev, level: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 12 weeks"
                      value={courseData.duration}
                      onChange={(e) => setCourseData(prev => ({ ...prev, duration: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxStudents">Maximum Students</Label>
                    <Input
                      id="maxStudents"
                      type="number"
                      min="1"
                      value={courseData.maxStudents}
                      onChange={(e) => setCourseData(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 30 }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Schedule</CardTitle>
                <CardDescription>Set the start and end dates for your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={courseData.startDate}
                      onChange={(e) => setCourseData(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={courseData.endDate}
                      onChange={(e) => setCourseData(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Course Duration</h3>
                  <p className="text-sm text-blue-700">
                    {courseData.startDate && courseData.endDate ? (
                      <>
                        This course will run from{" "}
                        <span className="font-medium">{new Date(courseData.startDate).toLocaleDateString()}</span> to{" "}
                        <span className="font-medium">{new Date(courseData.endDate).toLocaleDateString()}</span>
                      </>
                    ) : (
                      "Please select start and end dates to see the course duration"
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="syllabus" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Syllabus</CardTitle>
                <CardDescription>Outline the topics and learning objectives for your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {courseData.syllabus.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <span className="text-sm font-medium text-gray-500 w-8">{index + 1}.</span>
                      <span className="flex-1">{item}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSyllabusItem(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label htmlFor="newSyllabusItem">Add Syllabus Item</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="newSyllabusItem"
                      placeholder="e.g., Introduction to programming concepts"
                      value={newSyllabusItem}
                      onChange={(e) => setNewSyllabusItem(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddSyllabusItem()}
                    />
                    <Button onClick={handleAddSyllabusItem} disabled={!newSyllabusItem.trim()}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Resources</CardTitle>
                <CardDescription>Add materials and resources for your students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {courseData.resources.map((resource) => (
                    <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{resource.type.toUpperCase()}</Badge>
                        <div>
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-gray-500">{resource.description}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveResource(resource.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Add New Resource</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="resourceTitle">Title</Label>
                      <Input
                        id="resourceTitle"
                        placeholder="Resource title"
                        value={newResource.title}
                        onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resourceType">Type</Label>
                      <Select value={newResource.type} onValueChange={(value: "pdf" | "video" | "link" | "document") => setNewResource(prev => ({ ...prev, type: value }))}>
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
                    <Label htmlFor="resourceUrl">URL</Label>
                    <Input
                      id="resourceUrl"
                      placeholder="https://example.com/resource"
                      value={newResource.url}
                      onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resourceDescription">Description</Label>
                    <Textarea
                      id="resourceDescription"
                      placeholder="Brief description of the resource"
                      value={newResource.description}
                      onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <Button onClick={handleAddResource} disabled={!newResource.title.trim() || !newResource.url.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Resource
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 