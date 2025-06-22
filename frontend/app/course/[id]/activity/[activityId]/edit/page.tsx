"use client"

import { useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Save,
  Eye,
  Settings,
  FileText,
  Video,
  File,
  HelpCircle,
  MessageSquare,
  FileImage,
  ExternalLink,
  Upload,
  Calendar,
  Star,
  Clock,
  Users,
  EyeOff,
  Trash2,
  Sparkles,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { mockData, type Activity } from "../../../../../lib/mock-data"

export default function ActivityEditPage({ params }: { params: Promise<{ id: string; activityId: string }> }) {
  const resolvedParams = use(params)
  const [activeTab, setActiveTab] = useState("content")
  const [activity, setActivity] = useState(
    (() => {
      const course = mockData.courses.find((c) => c.id === resolvedParams.id)
      const sections = mockData.courseSections?.filter((s) => s.courseId === resolvedParams.id) || []
      return sections.flatMap((s) => s.activities).find((a) => a.id === resolvedParams.activityId)
    })()
  )

  const course = mockData.courses.find((c) => c.id === resolvedParams.id)
  const sections = mockData.courseSections?.filter((s) => s.courseId === resolvedParams.id) || []

  if (!course || !activity) {
    return <div>Activity not found</div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/course/${resolvedParams.id}/edit`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course Edit
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getActivityColor(
                    activity.type,
                  )}`}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Edit Activity</h1>
                  <p className="text-muted-foreground">{activity.title}</p>
                </div>
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Update activity title, description, and content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Activity Title</Label>
                      <Input
                        id="title"
                        value={activity.title}
                        onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={activity.description}
                        onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Activity Type</Label>
                      <Select
                        value={activity.type}
                        onValueChange={(value) => setActivity({ ...activity, type: value as Activity["type"] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="page">Page</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="resource">Resource</SelectItem>
                          <SelectItem value="assignment">Assignment</SelectItem>
                          <SelectItem value="quiz">Quiz</SelectItem>
                          <SelectItem value="forum">Forum</SelectItem>
                          <SelectItem value="url">URL</SelectItem>
                          <SelectItem value="generative-task">Generative Practical Task</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Type-specific content */}
                {activity.type === "video" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Video Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="videoUrl">Video URL</Label>
                        <Input id="videoUrl" placeholder="https://..." />
                      </div>
                      <div>
                        <Label htmlFor="videoFile">Upload Video File</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop video file here, or click to browse
                          </p>
                          <Button variant="outline" size="sm">
                            Choose File
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="duration">Duration (minutes)</Label>
                          <Input id="duration" type="number" placeholder="15" />
                        </div>
                        <div>
                          <Label htmlFor="quality">Quality</Label>
                          <Select defaultValue="hd">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sd">Standard Definition</SelectItem>
                              <SelectItem value="hd">High Definition</SelectItem>
                              <SelectItem value="4k">4K</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activity.type === "assignment" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Assignment Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="instructions">Assignment Instructions</Label>
                        <Textarea
                          id="instructions"
                          placeholder="Provide detailed instructions for the assignment..."
                          rows={6}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="points">Points</Label>
                          <Input id="points" type="number" placeholder="100" />
                        </div>
                        <div>
                          <Label htmlFor="maxSubmissions">Max Submissions</Label>
                          <Input id="maxSubmissions" type="number" placeholder="3" />
                        </div>
                      </div>
                      <div>
                        <Label>Allowed File Types</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {["PDF", "DOC", "DOCX", "TXT", "ZIP"].map((type) => (
                            <Badge key={type} variant="outline" className="cursor-pointer">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activity.type === "quiz" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Quiz Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                          <Input id="timeLimit" type="number" placeholder="30" />
                        </div>
                        <div>
                          <Label htmlFor="attempts">Max Attempts</Label>
                          <Input id="attempts" type="number" placeholder="3" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="passingScore">Passing Score (%)</Label>
                        <Input id="passingScore" type="number" placeholder="70" />
                      </div>
                      <div className="space-y-2">
                        <Label>Quiz Options</Label>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">Shuffle questions</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">Show results immediately</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">Allow review after submission</span>
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activity.type === "generative-task" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Generative Practical Task Configuration
                      </CardTitle>
                      <CardDescription>
                        Configure AI-powered task generation based on course materials and student performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* AI Model Configuration */}
                      <div>
                        <Label className="text-base font-medium">AI Model Settings</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label htmlFor="aiModel">AI Model</Label>
                            <Select defaultValue="gpt-4">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                <SelectItem value="claude-3">Claude 3</SelectItem>
                                <SelectItem value="custom">Custom Model</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="creativity">Creativity Level</Label>
                            <Select defaultValue="balanced">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="conservative">Conservative</SelectItem>
                                <SelectItem value="balanced">Balanced</SelectItem>
                                <SelectItem value="creative">Creative</SelectItem>
                                <SelectItem value="very-creative">Very Creative</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Content Sources */}
                      <div>
                        <Label className="text-base font-medium">Content Sources</Label>
                        <div className="space-y-3 mt-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="courseMaterials" defaultChecked />
                              <Label htmlFor="courseMaterials">Course materials and lectures</Label>
                            </div>
                            <Badge variant="secondary">Primary</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="previousAssignments" defaultChecked />
                              <Label htmlFor="previousAssignments">Previous assignments and solutions</Label>
                            </div>
                            <Badge variant="secondary">Recommended</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="topQuestions" />
                              <Label htmlFor="topQuestions">Top questions from last years</Label>
                            </div>
                            <Badge variant="secondary">Historical</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="industryExamples" />
                              <Label htmlFor="industryExamples">Industry examples and case studies</Label>
                            </div>
                            <Badge variant="secondary">Optional</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="studentPerformance" />
                              <Label htmlFor="studentPerformance">Student performance data</Label>
                            </div>
                            <Badge variant="secondary">Analytics</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Difficulty Configuration */}
                      <div>
                        <Label className="text-base font-medium">Difficulty Settings</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label htmlFor="baseDifficulty">Base Difficulty</Label>
                            <Select defaultValue="medium">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                                <SelectItem value="expert">Expert</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="adaptiveDifficulty">Adaptive Difficulty</Label>
                            <Select defaultValue="enabled">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="disabled">Disabled</SelectItem>
                                <SelectItem value="enabled">Enabled</SelectItem>
                                <SelectItem value="aggressive">Aggressive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Label htmlFor="difficultyRange">Difficulty Range</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input type="number" placeholder="1" min="1" max="10" className="w-16" />
                            <span>to</span>
                            <Input type="number" placeholder="10" min="1" max="10" className="w-16" />
                            <span className="text-sm text-muted-foreground">(1-10 scale)</span>
                          </div>
                        </div>
                      </div>

                      {/* Task Generation Parameters */}
                      <div>
                        <Label className="text-base font-medium">Task Generation</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label htmlFor="taskType">Task Type</Label>
                            <Select defaultValue="mixed">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="coding">Coding Challenge</SelectItem>
                                <SelectItem value="analysis">Analysis Task</SelectItem>
                                <SelectItem value="design">Design Task</SelectItem>
                                <SelectItem value="problem-solving">Problem Solving</SelectItem>
                                <SelectItem value="mixed">Mixed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="taskComplexity">Task Complexity</Label>
                            <Select defaultValue="moderate">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="simple">Simple (1-2 steps)</SelectItem>
                                <SelectItem value="moderate">Moderate (3-5 steps)</SelectItem>
                                <SelectItem value="complex">Complex (6-10 steps)</SelectItem>
                                <SelectItem value="advanced">Advanced (10+ steps)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
                          <Input id="estimatedTime" type="number" placeholder="45" />
                        </div>
                      </div>

                      {/* Personalization Settings */}
                      <div>
                        <Label className="text-base font-medium">Personalization</Label>
                        <div className="space-y-3 mt-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="personalizeByLevel" defaultChecked />
                              <Label htmlFor="personalizeByLevel">Personalize by skill level</Label>
                            </div>
                            <Badge variant="secondary">AI-powered</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="personalizeByInterests" />
                              <Label htmlFor="personalizeByInterests">Personalize by interests</Label>
                            </div>
                            <Badge variant="secondary">Optional</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="personalizeByLearningStyle" />
                              <Label htmlFor="personalizeByLearningStyle">Adapt to learning style</Label>
                            </div>
                            <Badge variant="secondary">Experimental</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Quality Control */}
                      <div>
                        <Label className="text-base font-medium">Quality Control</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label htmlFor="reviewMode">Review Mode</Label>
                            <Select defaultValue="auto">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="auto">Automatic</SelectItem>
                                <SelectItem value="manual">Manual Review</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="qualityThreshold">Quality Threshold</Label>
                            <Select defaultValue="high">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low (Fast)</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High (Recommended)</SelectItem>
                                <SelectItem value="very-high">Very High (Slow)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Advanced Settings */}
                      <div>
                        <Label className="text-base font-medium">Advanced Settings</Label>
                        <div className="space-y-3 mt-2">
                          <div>
                            <Label htmlFor="customPrompt">Custom Generation Prompt</Label>
                            <Textarea
                              id="customPrompt"
                              placeholder="Enter custom instructions for task generation..."
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="maxTokens">Max Tokens</Label>
                              <Input id="maxTokens" type="number" placeholder="2000" />
                              <p className="text-xs text-muted-foreground mt-1">
                                Maximum length of AI response (higher = more detailed tasks)
                              </p>
                            </div>
                            <div>
                              <Label htmlFor="temperature">Temperature</Label>
                              <Input id="temperature" type="number" step="0.1" min="0" max="2" placeholder="0.7" />
                              <p className="text-xs text-muted-foreground mt-1">
                                Creativity level (0.0 = focused, 2.0 = very creative)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input id="dueDate" type="datetime-local" />
                      </div>
                      <div>
                        <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
                        <Input id="estimatedTime" type="number" placeholder="30" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="points">Points</Label>
                      <Input id="points" type="number" placeholder="10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Visibility</Label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={activity.visible}
                            onChange={(e) => setActivity({ ...activity, visible: e.target.checked })}
                            className="rounded"
                          />
                          <span className="text-sm">Visible to students</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Require completion</span>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Access Control</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Who can access this activity?</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All enrolled students</SelectItem>
                          <SelectItem value="specific">Specific students</SelectItem>
                          <SelectItem value="groups">Student groups</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Prerequisites</Label>
                      <Select defaultValue="none">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No prerequisites</SelectItem>
                          <SelectItem value="previous">Previous activity completion</SelectItem>
                          <SelectItem value="score">Minimum score requirement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="order">Display Order</Label>
                      <Input id="order" type="number" placeholder="1" />
                    </div>
                    <div>
                      <Label htmlFor="section">Section</Label>
                      <Select defaultValue={activity.sectionId}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map((section) => (
                            <SelectItem key={section.id} value={section.id}>
                              {section.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="metadata">Custom Metadata (JSON)</Label>
                      <Textarea
                        id="metadata"
                        placeholder='{"key": "value"}'
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <h4 className="font-medium text-red-800 mb-2">Delete Activity</h4>
                        <p className="text-sm text-red-600 mb-3">
                          This action cannot be undone. This will permanently delete the activity and all associated data.
                        </p>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Activity
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(
                        activity.type,
                      )}`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.type}</p>
                    </div>
                    <Badge variant={activity.visible ? "default" : "secondary"}>
                      {activity.visible ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Description: {activity.description || "No description"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Views</span>
                    <span className="font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Completions</span>
                    <span className="font-medium">856</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average Score</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Time Spent</span>
                    <span className="font-medium">12.5 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Activity
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  View Submissions
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Duplicate Activity
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
