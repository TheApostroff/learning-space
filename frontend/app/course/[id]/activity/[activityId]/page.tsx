"use client"

import type React from "react"

import { useState, useRef, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  Reply,
  Pin,
  MoreHorizontal,
  Send,
  Home,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Upload,
  FileText,
  Clock,
  CheckCircle,
  SkipBack,
  SkipForward,
  Settings,
  Subtitles,
  Bookmark,
  Share,
  AlertCircle,
  Calendar,
  User,
  Eye,
  Sparkles,
  Star,
  HelpCircle,
  BarChart3,
  Edit,
  Target,
  File,
  Video,
  FileImage,
  ExternalLink,
  Users,
  Download,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { mockData } from "../../../../lib/mock-data"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export default function ActivityPage({ params }: { params: Promise<{ id: string; activityId: string }> }) {
  const resolvedParams = use(params)
  const [newPost, setNewPost] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [assignmentText, setAssignmentText] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(930) // 15:30 in seconds
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showTranscript, setShowTranscript] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [activeTab, setActiveTab] = useState("video")
  const videoRef = useRef<HTMLDivElement>(null)

  const course = mockData.courses.find((c) => c.id === resolvedParams.id)
  const instructor = mockData.users.find((u) => u.id === course?.instructorId)
  const courseSections = mockData.courseSections.filter((s) => s.courseId === resolvedParams.id)
  const activity = courseSections
    .flatMap((s) => s.activities)
    .find((a) => a.id === resolvedParams.activityId)
  const forumPosts = mockData.forumPosts?.filter((p) => p.forumId === resolvedParams.activityId) || []

  // Check if current user is the instructor (for navigation purposes)
  const isInstructor = instructor?.id === "professor-1" // In a real app, this would check the logged-in user

  // Mark activity as completed when page loads
  useEffect(() => {
    if (activity && !activity.completed) {
      // In a real app, this would make an API call to mark the activity as completed
      // For now, we'll just log it
      console.log(`Activity ${activity.id} marked as completed`)
      
      // Update localStorage to track completion (for demo purposes)
      const completedActivities = JSON.parse(localStorage.getItem('completedActivities') || '[]')
      if (!completedActivities.includes(activity.id)) {
        completedActivities.push(activity.id)
        localStorage.setItem('completedActivities', JSON.stringify(completedActivities))
      }
    }
  }, [activity])

  // Mock video transcript data
  const transcript = [
    {
      time: 0,
      text: "Welcome to Introduction to Web Development. I'm Dr. Sarah Wilson, and I'll be your instructor for this course.",
    },
    { time: 15, text: "In this video, we'll cover the fundamentals of HTML, CSS, and JavaScript." },
    { time: 30, text: "HTML, or HyperText Markup Language, is the backbone of every web page." },
    { time: 60, text: "It provides the structure and content that browsers can understand and display." },
    { time: 90, text: "CSS, or Cascading Style Sheets, is responsible for the visual presentation." },
    { time: 120, text: "It controls colors, fonts, layouts, and animations on your web pages." },
    { time: 180, text: "JavaScript adds interactivity and dynamic behavior to your websites." },
    { time: 240, text: "Together, these three technologies form the foundation of modern web development." },
  ]

  // Mock notes data
  const [notes, setNotes] = useState([
    { id: 1, time: 45, text: "Remember: HTML provides structure", timestamp: "0:45" },
    { id: 2, time: 135, text: "CSS = styling and presentation", timestamp: "2:15" },
    { id: 3, time: 195, text: "JavaScript makes pages interactive", timestamp: "3:15" },
  ])

  const [newNote, setNewNote] = useState("")

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            return duration
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, duration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime)
  }

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        time: currentTime,
        text: newNote,
        timestamp: formatTime(currentTime),
      }
      setNotes([...notes, note])
      setNewNote("")
    }
  }

  const jumpToTime = (time: number) => {
    setCurrentTime(time)
  }

  if (!course || !activity) {
    return <div>Activity not found</div>
  }

  const handleSubmitPost = () => {
    if (newPost.trim()) {
      console.log("Submitting post:", newPost)
      setNewPost("")
    }
  }

  const handleSubmitReply = (postId: string) => {
    if (replyContent.trim()) {
      console.log("Submitting reply to", postId, ":", replyContent)
      setReplyContent("")
      setReplyTo(null)
    }
  }

  const handleQuizSubmit = () => {
    console.log("Submitting quiz answers:", quizAnswers)
    setQuizSubmitted(true)
  }

  const handleAssignmentSubmit = () => {
    console.log("Submitting assignment:", { text: assignmentText, files: uploadedFiles })
    alert("Assignment submitted successfully!")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles([...uploadedFiles, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  // Mock quiz questions
  const quizQuestions = [
    {
      id: "q1",
      question: "What does HTML stand for?",
      type: "multiple-choice",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Home Tool Markup Language",
        "Hyperlink and Text Markup Language",
      ],
      correctAnswer: 0,
      points: 2,
    },
    {
      id: "q2",
      question: "CSS is used for styling web pages.",
      type: "true-false",
      correctAnswer: "true",
      points: 1,
    },
    {
      id: "q3",
      question: "What is the purpose of the <head> tag in HTML?",
      type: "short-answer",
      points: 3,
    },
  ]

  const renderVideoActivity = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Video Player Section */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* Video Player */}
              <div
                ref={videoRef}
                className="relative bg-black aspect-video group cursor-pointer"
                onClick={() => setIsPlaying(!isPlaying)}
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
              >
                {/* Video Content Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    {!isPlaying ? (
                      <Play className="w-20 h-20 mx-auto mb-4 opacity-80" />
                    ) : (
                      <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <div className="w-2 h-8 bg-white mx-1 animate-pulse"></div>
                        <div className="w-2 h-8 bg-white mx-1 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-8 bg-white mx-1 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    )}
                    <p className="text-lg">Introduction to Web Development</p>
                    <p className="text-sm opacity-80">Dr. Sarah Wilson</p>
                  </div>
                </div>

                {/* Video Controls */}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300",
                    showControls ? "opacity-100" : "opacity-0",
                  )}
                >
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div
                      className="w-full h-1 bg-white/30 rounded-full cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const percent = (e.clientX - rect.left) / rect.width
                        handleSeek(Math.floor(percent * duration))
                      }}
                    >
                      <div
                        className="h-full bg-blue-500 rounded-full relative"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      >
                        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentTime(Math.max(0, currentTime - 10))
                        }}
                      >
                        <SkipBack className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsPlaying(!isPlaying)
                        }}
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentTime(Math.min(duration, currentTime + 10))
                        }}
                      >
                        <SkipForward className="w-4 h-4" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsMuted(!isMuted)
                          }}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => {
                            setVolume(Number.parseFloat(e.target.value))
                            setIsMuted(false)
                          }}
                          className="w-16 accent-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={playbackRate}
                        onChange={(e) => setPlaybackRate(Number.parseFloat(e.target.value))}
                        className="bg-black/50 text-white text-sm rounded px-2 py-1 border border-white/30"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2x</option>
                      </select>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowTranscript(!showTranscript)
                        }}
                      >
                        <Subtitles className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{activity.title}</h2>
                    <p className="text-muted-foreground mb-4">
                      {activity.description ||
                        "This video introduces the fundamentals of web development, covering HTML, CSS, and JavaScript basics."}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Dr. Sarah Wilson
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {activity.metadata.videoDuration || "15:30"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        124 views
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round((currentTime / duration) * 100)}%</span>
                  </div>
                  <Progress value={(currentTime / duration) * 100} className="h-2" />
                </div>

                {currentTime / duration > 0.8 && (
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-900">Video Completed!</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Great job! You've watched most of this video. This activity is now marked as complete.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="transcript">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Video Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {transcript.map((item, index) => (
                        <div
                          key={index}
                          className={cn(
                            "p-3 rounded-lg cursor-pointer transition-colors",
                            currentTime >= item.time && currentTime < (transcript[index + 1]?.time || duration)
                              ? "bg-blue-100 border border-blue-300"
                              : "hover:bg-gray-50",
                          )}
                          onClick={() => jumpToTime(item.time)}
                        >
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="text-xs">
                              {formatTime(item.time)}
                            </Badge>
                            <p className="text-sm flex-1">{item.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">My Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Note */}
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add a note at current time..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={2}
                    />
                    <Button onClick={addNote} size="sm" disabled={!newNote.trim()}>
                      Add Note at {formatTime(currentTime)}
                    </Button>
                  </div>

                  <Separator />

                  {/* Notes List */}
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => jumpToTime(note.time)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              {note.timestamp}
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-sm">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )

  const renderAssignmentActivity = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <FileText className="w-6 h-6" />
                {activity.title}
              </CardTitle>
              <CardDescription className="text-base mt-2">{activity.description}</CardDescription>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="mb-2">
                {activity.metadata.points} points
              </Badge>
              {activity.dueDate && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Due: {new Date(activity.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Assignment Instructions */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Instructions</h3>
              <Card className="border-l-4 border-l-blue-500 bg-blue-50">
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p className="mb-4">
                      Create a personal portfolio website using HTML and CSS. Your portfolio should demonstrate your
                      understanding of web development fundamentals.
                    </p>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>A homepage with your introduction and professional summary</li>
                      <li>A projects section showcasing at least 3 projects with descriptions</li>
                      <li>A contact section with your information and a contact form</li>
                      <li>Responsive design that works on mobile devices</li>
                      <li>Clean, semantic HTML structure</li>
                      <li>CSS styling with proper use of flexbox or grid</li>
                    </ul>
                    <h4 className="font-semibold mb-2 mt-4">Submission Format:</h4>
                    <p>
                      Submit your project as a ZIP file containing all HTML, CSS, and image files. Include a README.txt
                      file with instructions on how to view your website.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Submission Area */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Your Submission</h3>

              <Tabs defaultValue="text" className="w-full">
                <TabsList>
                  <TabsTrigger value="text">Text Submission</TabsTrigger>
                  <TabsTrigger value="files">File Upload</TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <div>
                    <Label htmlFor="submission-text">Text Submission</Label>
                    <Textarea
                      id="submission-text"
                      value={assignmentText}
                      onChange={(e) => setAssignmentText(e.target.value)}
                      placeholder="Enter your text submission here. You can include links to your hosted website, GitHub repository, or provide additional notes about your project..."
                      rows={8}
                      className="mt-2"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="files" className="space-y-4">
                  <div>
                    <Label>File Upload</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">Upload your project files</p>
                      <p className="text-muted-foreground mb-4">Drag and drop files here, or click to browse</p>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".zip,.html,.css,.js,.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                      />
                      <label htmlFor="file-upload">
                        <Button variant="outline" className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Files
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground mt-3">
                        Accepted formats: ZIP, HTML, CSS, JS, Images, PDF, DOC (Max 50MB total)
                      </p>
                    </div>

                    {/* Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-3">Uploaded Files ({uploadedFiles.length})</h4>
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <div>
                                  <p className="font-medium">{file.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Submission Actions */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  <span>You can submit multiple times. Only your latest submission will be graded.</span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">Save Draft</Button>
                  <Button
                    onClick={handleAssignmentSubmit}
                    disabled={!assignmentText.trim() && uploadedFiles.length === 0}
                  >
                    Submit Assignment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderQuizActivity = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Clock className="w-6 h-6" />
                {activity.title}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {activity.metadata.questions} questions • {activity.metadata.timeLimit} minutes •{" "}
                {activity.metadata.points} points total
              </CardDescription>
            </div>
            {!quizSubmitted && (
              <div className="text-right">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  Time Remaining: 28:45
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Attempt 1 of {activity.metadata.attempts || 1}</p>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!quizSubmitted ? (
            <div className="space-y-8">
              {/* Quiz Instructions */}
              <Card className="border-l-4 border-l-orange-500 bg-orange-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Quiz Instructions</h3>
                  <ul className="text-sm space-y-1">
                    <li>• You have {activity.metadata.timeLimit} minutes to complete this quiz</li>
                    <li>• You can attempt this quiz {activity.metadata.attempts} time(s)</li>
                    <li>• Make sure to save your answers before the time runs out</li>
                    <li>• You can navigate between questions using the navigation below</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Questions */}
              {quizQuestions.map((question, index) => (
                <Card key={question.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Question {index + 1}</span>
                      <Badge variant="outline">
                        {question.points} {question.points === 1 ? "point" : "points"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-6 font-medium text-lg">{question.question}</p>

                    {question.type === "multiple-choice" && (
                      <RadioGroup
                        value={quizAnswers[question.id] || ""}
                        onValueChange={(value) => setQuizAnswers({ ...quizAnswers, [question.id]: value })}
                        className="space-y-3"
                      >
                        {question.options?.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <RadioGroupItem value={optionIndex.toString()} />
                            <Label className="cursor-pointer flex-1 text-base">{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}

                    {question.type === "true-false" && (
                      <RadioGroup
                        value={quizAnswers[question.id] || ""}
                        onValueChange={(value) => setQuizAnswers({ ...quizAnswers, [question.id]: value })}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="true" />
                          <Label className="cursor-pointer flex-1 text-base">True</Label>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value="false" />
                          <Label className="cursor-pointer flex-1 text-base">False</Label>
                        </div>
                      </RadioGroup>
                    )}

                    {question.type === "short-answer" && (
                      <Textarea
                        value={quizAnswers[question.id] || ""}
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, [question.id]: e.target.value })}
                        placeholder="Enter your answer here..."
                        rows={4}
                        className="text-base"
                      />
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Quiz Navigation */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        Progress: {Object.keys(quizAnswers).length} of {quizQuestions.length} answered
                      </span>
                      <Progress
                        value={(Object.keys(quizAnswers).length / quizQuestions.length) * 100}
                        className="w-32 h-2"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline">Save Draft</Button>
                      <Button
                        onClick={handleQuizSubmit}
                        size="lg"
                        disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                      >
                        Submit Quiz
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Quiz Submitted Successfully!</h3>
              <p className="text-muted-foreground mb-6 text-lg">Your answers have been saved and are being graded.</p>

              <Card className="max-w-md mx-auto">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4">Your Results</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Score:</span>
                      <span className="font-semibold">5/6 points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Percentage:</span>
                      <span className="font-semibold text-green-600">83%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Grade:</span>
                      <Badge variant="default">B+</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Used:</span>
                      <span>16:23 / 30:00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 flex gap-3 justify-center">
                <Button variant="outline">Review Answers</Button>
                <Link href={`/course/${resolvedParams.id}`}>
                  <Button>Return to Course</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderResourceActivity = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FileText className="w-6 h-6" />
            {activity.title}
          </CardTitle>
          <CardDescription className="text-base">
            {activity.metadata.fileType?.toUpperCase()} • {activity.metadata.fileSize}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-muted-foreground text-lg">
              {activity.description || "Download this resource to access the course materials."}
            </p>

            {/* Resource Preview */}
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{activity.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {activity.metadata.fileType?.toUpperCase()} Document • {activity.metadata.fileSize}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button size="lg">
                    <Download className="w-5 h-5 mr-2" />
                    Download File
                  </Button>
                  <Button variant="outline" size="lg">
                    <Eye className="w-5 h-5 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Resource Information</h4>
                    <ul className="text-blue-700 space-y-1">
                      <li>• This resource contains important course materials</li>
                      <li>• Downloading this file will mark the activity as complete</li>
                      <li>• You can download this file multiple times</li>
                      <li>• Make sure you have the appropriate software to open this file type</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderForumActivity = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Forum Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <MessageSquare className="w-6 h-6" />
            {activity.title}
          </CardTitle>
          <CardDescription className="text-base">
            {activity.description || "Participate in course discussions and share your thoughts with classmates."}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* New Post */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Start a New Discussion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="post-title">Discussion Title</Label>
            <Input id="post-title" placeholder="Enter a descriptive title for your discussion..." className="mt-2" />
          </div>
          <div>
            <Label htmlFor="post-content">Message</Label>
            <Textarea
              id="post-content"
              placeholder="What would you like to discuss? Share your thoughts, ask questions, or start a conversation..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={6}
              className="mt-2"
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Attach File
              </Button>
              <span className="text-sm text-muted-foreground">You can attach images, documents, or other files</span>
            </div>
            <Button onClick={handleSubmitPost} disabled={!newPost.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Post Discussion
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Forum Posts */}
      <div className="space-y-6">
        {forumPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" />
                    <AvatarFallback>
                      {post.authorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      {post.isPinned && <Pin className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="font-medium">{post.authorName}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{post.replies.length} replies</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-base leading-relaxed">{post.content}</p>

              <div className="flex items-center gap-6 mb-6">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  Like (12)
                </Button>
                <Button variant="ghost" size="sm" className="gap-2" onClick={() => setReplyTo(post.id)}>
                  <Reply className="w-4 h-4" />
                  Reply
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share className="w-4 h-4" />
                  Share
                </Button>
              </div>

              {/* Replies */}
              {post.replies.length > 0 && (
                <div className="space-y-4 border-t pt-6">
                  <h4 className="font-semibold">Replies ({post.replies.length})</h4>
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-4 pl-4 border-l-2 border-gray-200">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback className="text-sm">
                          {reply.authorName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{reply.authorName}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{reply.content}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <Button variant="ghost" size="sm" className="h-8 text-xs">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Like
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 text-xs">
                            <Reply className="w-3 h-3 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              {replyTo === post.id && (
                <div className="mt-6 space-y-4 border-t pt-6">
                  <h4 className="font-semibold">Reply to this discussion</h4>
                  <Textarea
                    placeholder="Write your reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setReplyTo(null)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleSubmitReply(post.id)} disabled={!replyContent.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      Post Reply
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {forumPosts.length === 0 && (
          <Card>
            <CardContent className="text-center py-16">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-3">No discussions yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to start a discussion in this forum! Share your thoughts, ask questions, or help your
                classmates.
              </p>
              <Button>Start the First Discussion</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )

  const renderGenerativeTaskActivity = () => {
    const [taskState, setTaskState] = useState<'difficulty-selection' | 'task-generation' | 'task-display' | 'submission' | 'evaluation'>('task-display')
    const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedTask, setGeneratedTask] = useState<any>(null)
    const [codeSubmission, setCodeSubmission] = useState("")
    const [isEvaluating, setIsEvaluating] = useState(false)
    const [evaluationResult, setEvaluationResult] = useState<any>(null)
    const [hints, setHints] = useState<string[]>([])
    const [showHints, setShowHints] = useState(false)

    // Initialize with a default task when component mounts
    useEffect(() => {
      const defaultTask = {
        title: `CSS Layout Challenge - ${selectedDifficulty.toUpperCase()}`,
        description: `Create a responsive layout using CSS according to the following requirements:`,
        requirements: [
          "Create a responsive navigation bar",
          "Use flexbox for layout",
          "Make it responsive for mobile devices",
          "Include hover effects",
          "Use semantic HTML structure"
        ],
        example: {
          input: "Navigation items: Home, About, Services, Contact",
          output: "A responsive horizontal navigation bar",
          explanation: "The navigation should collapse into a hamburger menu on mobile devices"
        },
        constraints: [
          "Use only CSS Flexbox (no Grid)",
          "Mobile-first approach",
          "Maximum 3 breakpoints",
          "No JavaScript allowed"
        ]
      }
      setGeneratedTask(defaultTask)
    }, [])

    const handleDifficultySelection = (difficulty: 'easy' | 'medium' | 'hard') => {
      setSelectedDifficulty(difficulty)
      setTaskState('task-generation')
      setIsGenerating(true)
      
      // Simulate task generation
      setTimeout(() => {
        const mockTask = {
          title: `CSS Layout Challenge - ${difficulty.toUpperCase()}`,
          description: `Create a responsive layout using CSS according to the following requirements:`,
          requirements: [
            "Create a responsive navigation bar",
            "Use flexbox for layout",
            "Make it responsive for mobile devices",
            "Include hover effects",
            "Use semantic HTML structure",
            difficulty === 'hard' ? "Add smooth transitions and animations" : "",
            difficulty === 'hard' ? "Implement a dropdown menu" : ""
          ].filter(Boolean),
          example: {
            input: "Navigation items: Home, About, Services, Contact",
            output: "A responsive horizontal navigation bar",
            explanation: "The navigation should collapse into a hamburger menu on mobile devices"
          },
          constraints: difficulty === 'easy' ? [
            "Use only CSS Flexbox (no Grid)",
            "Mobile-first approach",
            "Maximum 2 breakpoints"
          ] : difficulty === 'medium' ? [
            "Use only CSS Flexbox (no Grid)",
            "Mobile-first approach",
            "Maximum 3 breakpoints",
            "Include hover effects"
          ] : [
            "Use only CSS Flexbox (no Grid)",
            "Mobile-first approach",
            "Maximum 4 breakpoints",
            "Include hover effects and transitions",
            "Implement dropdown functionality"
          ]
        }
        
        setGeneratedTask(mockTask)
        setIsGenerating(false)
        setTaskState('task-display')
      }, 2000)
    }

    const handleSubmitCode = () => {
      setIsEvaluating(true)
      
      // Simulate code evaluation
      setTimeout(() => {
        const isCorrect = Math.random() > 0.3 // 70% success rate for demo
        setEvaluationResult({
          correct: isCorrect,
          score: isCorrect ? 100 : 60,
          feedback: isCorrect 
            ? "Excellent! Your solution is correct and efficient. Well done!"
            : "Your solution has some issues. Check the layout and responsiveness.",
          testCases: [
            { input: "Desktop viewport", expected: "Horizontal navigation", actual: isCorrect ? "Horizontal navigation displayed correctly" : "Layout issues detected", passed: isCorrect },
            { input: "Mobile viewport", expected: "Responsive behavior", actual: isCorrect ? "Navigation adapts to mobile screen" : "Not responsive", passed: isCorrect },
            { input: "Hover effects", expected: "Visual feedback", actual: isCorrect ? "Hover effects working properly" : "No hover effects", passed: isCorrect }
          ]
        })
        setIsEvaluating(false)
        setTaskState('evaluation')
      }, 1500)
    }

    const getHints = () => {
      const difficultyHints = {
        easy: [
          "Use display: flex for the navigation container",
          "Set flex-direction: row for horizontal layout",
          "Use justify-content: space-between for spacing",
          "Add basic hover effects with :hover pseudo-class"
        ],
        medium: [
          "Use flexbox with flex-wrap for responsive behavior",
          "Add media queries for mobile breakpoints",
          "Use flex-basis or flex-grow for flexible items",
          "Consider using a hamburger menu for mobile"
        ],
        hard: [
          "Implement CSS transitions for smooth animations",
          "Use CSS transforms for dropdown menus",
          "Add accessibility features with ARIA labels",
          "Consider using CSS custom properties for theming"
        ]
      }
      
      setHints(difficultyHints[selectedDifficulty])
      setShowHints(true)
    }

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Task Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center border border-purple-200">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">{activity.title}</CardTitle>
                <CardDescription className="text-base">
                  AI-generated personalized coding challenges based on your skill level
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Difficulty Selection */}
        {taskState === 'difficulty-selection' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Choose Your Challenge Level
              </CardTitle>
              <CardDescription>
                Select the difficulty level that matches your current skill and confidence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-green-300"
                  onClick={() => handleDifficultySelection('easy')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Easy</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Perfect for beginners or when you want to build confidence
                    </p>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div>• Basic concepts</div>
                      <div>• Clear examples</div>
                      <div>• Step-by-step guidance</div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-300"
                  onClick={() => handleDifficultySelection('medium')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-6 h-6 text-blue-600" />
                      <Star className="w-6 h-6 text-blue-600 -ml-1" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Medium</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Balanced challenge for intermediate learners
                    </p>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div>• Moderate complexity</div>
                      <div>• Multiple concepts</div>
                      <div>• Some edge cases</div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-red-300"
                  onClick={() => handleDifficultySelection('hard')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-6 h-6 text-red-600" />
                      <Star className="w-6 h-6 text-red-600 -ml-1" />
                      <Star className="w-6 h-6 text-red-600 -ml-1" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Hard</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Advanced challenges for experienced developers
                    </p>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div>• Complex algorithms</div>
                      <div>• Performance optimization</div>
                      <div>• Edge case handling</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Task Generation */}
        {taskState === 'task-generation' && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Generating Your Task</h3>
              <p className="text-muted-foreground mb-4">
                AI is creating a personalized {selectedDifficulty} challenge based on your progress...
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• Analyzing course materials</div>
                <div>• Considering your skill level</div>
                <div>• Creating unique problem</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Task Display */}
        {taskState === 'task-display' && generatedTask && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{generatedTask.title}</span>
                  <Badge variant="outline" className="capitalize">{selectedDifficulty}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Problem Description</h4>
                  <p className="text-muted-foreground">{generatedTask.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Requirements</h4>
                  <ul className="space-y-1">
                    {generatedTask.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Example</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Input:</strong> {generatedTask.example.input}</div>
                        <div><strong>Output:</strong> {generatedTask.example.output}</div>
                        <div><strong>Explanation:</strong> {generatedTask.example.explanation}</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-orange-800 mb-2">Constraints</h4>
                      <ul className="space-y-1 text-sm">
                        {generatedTask.constraints.map((constraint: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{constraint}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={getHints}>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Get Hints
                  </Button>
                  <Button onClick={() => setTaskState('submission')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Start Coding
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Hints Section */}
            {showHints && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Hints for {selectedDifficulty} level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {hints.map((hint, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-blue-800">{hint}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Code Submission */}
        {taskState === 'submission' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Write Your Solution
              </CardTitle>
              <CardDescription>
                Implement your solution in the code editor below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="code-editor">Your Code</Label>
                <Textarea
                  id="code-editor"
                  value={codeSubmission}
                  onChange={(e) => setCodeSubmission(e.target.value)}
                  placeholder={`<!-- Write your HTML here -->
<nav class="navbar">
  <!-- Your navigation structure -->
</nav>

/* Write your CSS here */
.navbar {
  /* Your styles */
}`}
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setTaskState('task-display')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Task
                </Button>
                <Button 
                  onClick={handleSubmitCode}
                  disabled={!codeSubmission.trim()}
                  className="ml-auto"
                >
                  {isEvaluating ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Solution
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Evaluation Results */}
        {taskState === 'evaluation' && evaluationResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Evaluation Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Result Summary */}
              <div className={`p-4 rounded-lg ${evaluationResult.correct ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {evaluationResult.correct ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  )}
                  <span className="font-semibold">
                    {evaluationResult.correct ? "Success!" : "Needs Improvement"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-semibold">{evaluationResult.score}%</span>
                </div>
                <div className="mt-2">
                  <span className="font-medium">Feedback:</span>
                  <p className="text-sm mt-1">{evaluationResult.feedback}</p>
                </div>
              </div>

              {/* Test Cases */}
              <div>
                <h4 className="font-semibold mb-3">Test Cases</h4>
                <div className="space-y-2">
                  {evaluationResult.testCases.map((testCase: any, index: number) => (
                    <div key={index} className={`p-3 rounded-lg border ${testCase.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {testCase.passed ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="font-medium">{testCase.input}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expected: {testCase.expected} | Actual: {testCase.actual}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setTaskState('submission')}>
                  <Edit className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => setTaskState('difficulty-selection')}>
                  <Target className="w-4 h-4 mr-2" />
                  New Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

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
            <span className="text-foreground">{activity.title}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/course/${resolvedParams.id}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{activity.title}</h1>
                  <p className="text-muted-foreground">
                    {course.title} • {instructor?.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Activity Type</p>
                <Badge variant="outline" className="capitalize">
                  {activity.type === "generative-task" ? "Generative Task" : activity.type}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {renderVideoActivity()}
          {renderAssignmentActivity()}
          {renderQuizActivity()}
          {renderResourceActivity()}
          {renderForumActivity()}
          {renderGenerativeTaskActivity()}
        </div>
      </div>
    </div>
  )
}