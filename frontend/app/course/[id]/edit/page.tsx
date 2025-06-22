"use client"

import type React from "react"

import { useState, useRef, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Save,
  Plus,
  Settings,
  Trash2,
  Edit,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  HelpCircle,
  MessageSquare,
  File,
  ExternalLink,
  FileImage,
  Eye,
  EyeOff,
  Move,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { mockData, type CourseSection, type Activity } from "../../../lib/mock-data"
import { cn } from "@/lib/utils"

// Drag and Drop functionality
interface DragItem {
  type: "section" | "activity"
  id: string
  sectionId?: string
}

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const course = mockData.courses.find((c) => c.id === resolvedParams.id)
  const [courseSections, setCourseSections] = useState(
    mockData.courseSections?.filter((s) => s.courseId === resolvedParams.id) || [],
  )
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [newSectionTitle, setNewSectionTitle] = useState("")
  const [newSectionDescription, setNewSectionDescription] = useState("")
  const [showAddActivity, setShowAddActivity] = useState<string | null>(null)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  // Course settings state
  const [courseSettings, setCourseSettings] = useState({
    title: course?.title || "",
    category: course?.category || "",
    level: course?.level || "",
    duration: course?.duration || "",
  })

  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null)
  const [dragOverItem, setDragOverItem] = useState<DragItem | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)

  if (!course) {
    return <div>Course not found</div>
  }

  const addSection = () => {
    if (newSectionTitle.trim()) {
      const newSection: CourseSection = {
        id: `section-${Date.now()}`,
        courseId: resolvedParams.id,
        title: newSectionTitle,
        description: newSectionDescription,
        order: courseSections.length + 1,
        visible: true,
        activities: [],
      }
      setCourseSections([...courseSections, newSection])
      setNewSectionTitle("")
      setNewSectionDescription("")
    }
  }

  const deleteSection = (sectionId: string) => {
    setCourseSections(courseSections.filter((s) => s.id !== sectionId))
  }

  const toggleSectionVisibility = (sectionId: string) => {
    setCourseSections(courseSections.map((s) => (s.id === sectionId ? { ...s, visible: !s.visible } : s)))
  }

  const updateSectionTitle = (sectionId: string, title: string) => {
    setCourseSections(courseSections.map((s) => (s.id === sectionId ? { ...s, title } : s)))
  }

  const addActivity = (sectionId: string, activityType: Activity["type"]) => {
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      sectionId,
      title: `New ${activityType}`,
      description: "",
      type: activityType,
      order: courseSections.find((s) => s.id === sectionId)?.activities.length || 0 + 1,
      visible: true,
      metadata: {},
    }

    setCourseSections(
      courseSections.map((s) => (s.id === sectionId ? { ...s, activities: [...s.activities, newActivity] } : s)),
    )
    setShowAddActivity(null)
  }

  const deleteActivity = (sectionId: string, activityId: string) => {
    setCourseSections(
      courseSections.map((s) =>
        s.id === sectionId ? { ...s, activities: s.activities.filter((a) => a.id !== activityId) } : s,
      ),
    )
  }

  const toggleActivityVisibility = (sectionId: string, activityId: string) => {
    setCourseSections(
      courseSections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              activities: s.activities.map((a) => (a.id === activityId ? { ...a, visible: !a.visible } : a)),
            }
          : s,
      ),
    )
  }

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, item: DragItem) => {
    e.stopPropagation() // Prevent bubbling to parent
    setDraggedItem(item)
    setIsDragging(true)
    e.dataTransfer.effectAllowed = "move"

    // Create a custom drag image
    const dragElement = e.currentTarget as HTMLElement
    const rect = dragElement.getBoundingClientRect()
    e.dataTransfer.setDragImage(dragElement, rect.width / 2, rect.height / 2)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation()
    setDraggedItem(null)
    setDragOverItem(null)
    setIsDragging(false)
    dragCounter.current = 0
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDragEnter = (e: React.DragEvent, item: DragItem) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    setDragOverItem(item)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setDragOverItem(null)
    }
  }

  const handleDrop = (e: React.DragEvent, dropTarget: DragItem) => {
    e.preventDefault()
    e.stopPropagation()

    if (!draggedItem || draggedItem.id === dropTarget.id) {
      return
    }

    // Handle section reordering
    if (draggedItem.type === "section" && dropTarget.type === "section") {
      const newSections = [...courseSections]
      const draggedIndex = newSections.findIndex((s) => s.id === draggedItem.id)
      const targetIndex = newSections.findIndex((s) => s.id === dropTarget.id)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [draggedSection] = newSections.splice(draggedIndex, 1)
        newSections.splice(targetIndex, 0, draggedSection)

        // Update order numbers
        newSections.forEach((section, index) => {
          section.order = index + 1
        })

        setCourseSections(newSections)
      }
    }

    // Handle activity reordering within the same section
    if (draggedItem.type === "activity" && dropTarget.type === "activity" && draggedItem.sectionId === dropTarget.sectionId) {
      const section = courseSections.find((s) => s.id === draggedItem.sectionId)
      if (section) {
        const newActivities = [...section.activities]
        const draggedIndex = newActivities.findIndex((a) => a.id === draggedItem.id)
        const targetIndex = newActivities.findIndex((a) => a.id === dropTarget.id)

        if (draggedIndex !== -1 && targetIndex !== -1) {
          const [draggedActivity] = newActivities.splice(draggedIndex, 1)
          newActivities.splice(targetIndex, 0, draggedActivity)

          // Update order numbers
          newActivities.forEach((activity, index) => {
            activity.order = index + 1
          })

          setCourseSections(
            courseSections.map((s) => (s.id === draggedItem.sectionId ? { ...s, activities: newActivities } : s)),
          )
        }
      }
    }

    // Handle moving activity between sections
    if (draggedItem.type === "activity" && dropTarget.type === "section") {
      const sourceSection = courseSections.find((s) => s.id === draggedItem.sectionId)
      const targetSection = courseSections.find((s) => s.id === dropTarget.id)

      if (sourceSection && targetSection && sourceSection.id !== targetSection.id) {
        const activity = sourceSection.activities.find((a) => a.id === draggedItem.id)
        if (activity) {
          // Remove from source section
          const updatedSourceSection = {
            ...sourceSection,
            activities: sourceSection.activities.filter((a) => a.id !== draggedItem.id),
          }

          // Add to target section
          const updatedTargetSection = {
            ...targetSection,
            activities: [...targetSection.activities, { ...activity, sectionId: targetSection.id }],
          }

          setCourseSections(
            courseSections.map((s) => {
              if (s.id === sourceSection.id) return updatedSourceSection
              if (s.id === targetSection.id) return updatedTargetSection
              return s
            }),
          )
        }
      }
    }
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
        return <FileText className="w-4 h-4" />
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

  const toggleSection = (sectionId: string) => {
    const newCollapsed = new Set(collapsedSections)
    if (newCollapsed.has(sectionId)) {
      newCollapsed.delete(sectionId)
    } else {
      newCollapsed.add(sectionId)
    }
    setCollapsedSections(newCollapsed)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/course/${resolvedParams.id}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Edit Course</h1>
                <p className="text-muted-foreground">{course.title}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Course Content</h2>
                    <p className="text-muted-foreground">Organize your course into sections and activities</p>
                  </div>
                  <Button onClick={addSection} disabled={!newSectionTitle.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Add New Section Form */}
                <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="space-y-3">
                    <Input
                      placeholder="Section title"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                    />
                    <Input
                      placeholder="Section description (optional)"
                      value={newSectionDescription}
                      onChange={(e) => setNewSectionDescription(e.target.value)}
                    />
                  </div>
                </div>

                {/* Course Sections */}
                <div className="space-y-4">
                  {courseSections.map((section) => (
                    <div
                      key={section.id}
                      className={cn(
                        "border rounded-lg p-4 transition-all",
                        dragOverItem?.id === section.id && dragOverItem?.type === "section"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200",
                      )}
                      draggable
                      onDragStart={(e) => handleDragStart(e, { type: "section", id: section.id })}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDragEnter={(e) => handleDragEnter(e, { type: "section", id: section.id })}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, { type: "section", id: section.id })}
                    >
                      {/* Section Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSection(section.id)}
                            >
                              {collapsedSections.has(section.id) ? (
                                <ChevronRight className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                            {editingSection === section.id ? (
                              <Input
                                value={section.title}
                                onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                                onBlur={() => setEditingSection(null)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") setEditingSection(null)
                                }}
                                autoFocus
                              />
                            ) : (
                              <h3 className="font-medium">{section.title}</h3>
                            )}
                          </div>
                          <Badge variant={section.visible ? "default" : "secondary"}>
                            {section.visible ? "Visible" : "Hidden"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingSection(section.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSectionVisibility(section.id)}
                          >
                            {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAddActivity(showAddActivity === section.id ? null : section.id)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() => deleteSection(section.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Section Description */}
                      {section.description && (
                        <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                      )}

                      {/* Add Activity Form */}
                      {showAddActivity === section.id && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-2 gap-2">
                            {["page", "video", "resource", "assignment", "quiz", "forum", "url", "generative-task"].map((type) => (
                              <Button
                                key={type}
                                variant="outline"
                                size="sm"
                                onClick={() => addActivity(section.id, type as Activity["type"])}
                                className="justify-start"
                              >
                                {getActivityIcon(type as Activity["type"])}
                                <span className="ml-2 capitalize">{type === "generative-task" ? "Generative Practical Task" : type}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Activities */}
                      {!collapsedSections.has(section.id) && (
                        <div className="space-y-2">
                          {section.activities.map((activity) => (
                            <div
                              key={activity.id}
                              className={cn(
                                "flex items-center gap-3 p-3 bg-gray-50 rounded-lg transition-all",
                                dragOverItem?.id === activity.id && dragOverItem?.type === "activity"
                                  ? "border-2 border-blue-500 bg-blue-100"
                                  : "",
                              )}
                              draggable
                              onDragStart={(e) =>
                                handleDragStart(e, { type: "activity", id: activity.id, sectionId: section.id })
                              }
                              onDragEnd={handleDragEnd}
                              onDragOver={handleDragOver}
                              onDragEnter={(e) =>
                                handleDragEnter(e, { type: "activity", id: activity.id, sectionId: section.id })
                              }
                              onDragLeave={handleDragLeave}
                              onDrop={(e) =>
                                handleDrop(e, { type: "activity", id: activity.id, sectionId: section.id })
                              }
                            >
                              <Move className="w-4 h-4 text-muted-foreground cursor-move" />
                              <div className="flex items-center gap-2">
                                {getActivityIcon(activity.type)}
                                <span className="font-medium">{activity.title}</span>
                              </div>
                              <Badge variant={activity.visible ? "default" : "secondary"} className="ml-auto">
                                {activity.visible ? "Visible" : "Hidden"}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleActivityVisibility(section.id, activity.id)}
                                >
                                  {activity.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </Button>
                                <Link href={`/course/${resolvedParams.id}/activity/${activity.id}/edit`}>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600"
                                  onClick={() => deleteActivity(section.id, activity.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Course Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Course Title</Label>
                  <Input id="title" value={courseSettings.title} onChange={(e) => setCourseSettings({ ...courseSettings, title: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={courseSettings.category} onChange={(e) => setCourseSettings({ ...courseSettings, category: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Input id="level" value={courseSettings.level} onChange={(e) => setCourseSettings({ ...courseSettings, level: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" value={courseSettings.duration} onChange={(e) => setCourseSettings({ ...courseSettings, duration: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            {/* Course Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Course Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Sections</span>
                    <span className="font-medium">{courseSections.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Activities</span>
                    <span className="font-medium">
                      {courseSections.reduce((acc, section) => acc + section.activities.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Students</span>
                    <span className="font-medium">{course.enrolledStudents.length}</span>
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
