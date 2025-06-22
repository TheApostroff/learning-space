"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Send,
  Paperclip,
  MoreHorizontal,
  Star,
  Archive,
  Reply,
  Forward,
  MessageSquare,
  Users,
  Clock,
  Circle,
  ArrowLeft,
  Plus,
  Filter,
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  from: string
  to: string[]
  subject: string
  content: string
  timestamp: string
  read: boolean
  starred: boolean
  attachments?: { name: string; size: string }[]
  courseId?: string
}

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [activeTab, setActiveTab] = useState("inbox")
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState({
    to: "",
    subject: "",
    content: "",
  })
  const [showCompose, setShowCompose] = useState(false)

  // Mock messages data
  const messages: Message[] = [
    {
      id: "msg-1",
      from: "Dr. Sarah Wilson",
      to: ["Alice Johnson"],
      subject: "Assignment Feedback - HTML Portfolio",
      content:
        "Hi Alice,\n\nI've reviewed your HTML portfolio assignment and I'm impressed with your work! Your use of semantic HTML elements shows a good understanding of web standards.\n\nA few suggestions for improvement:\n- Consider adding more descriptive alt text for your images\n- The navigation could benefit from better accessibility features\n- Great job on the responsive design!\n\nOverall grade: A-\n\nKeep up the excellent work!\n\nBest regards,\nDr. Wilson",
      timestamp: "2024-12-21T10:30:00Z",
      read: false,
      starred: true,
      courseId: "course-1",
    },
    {
      id: "msg-2",
      from: "Bob Smith",
      to: ["Alice Johnson"],
      subject: "Study Group for JavaScript Quiz",
      content:
        "Hey Alice!\n\nI'm organizing a study group for the upcoming JavaScript quiz. Would you like to join us? We're planning to meet this Saturday at 2 PM in the library.\n\nLet me know if you're interested!\n\nBob",
      timestamp: "2024-12-20T15:45:00Z",
      read: true,
      starred: false,
    },
    {
      id: "msg-3",
      from: "Course System",
      to: ["Alice Johnson"],
      subject: "New Assignment Posted: CSS Styling Project",
      content:
        "A new assignment has been posted in Introduction to Web Development:\n\nCSS Styling Project\nDue: December 30, 2024\nPoints: 100\n\nPlease check the course page for full details.",
      timestamp: "2024-12-19T09:00:00Z",
      read: true,
      starred: false,
      courseId: "course-1",
    },
    {
      id: "msg-4",
      from: "Dr. Sarah Wilson",
      to: ["All Students"],
      subject: "Course Announcement: Office Hours Update",
      content:
        "Dear Students,\n\nI'm updating my office hours for the remainder of the semester:\n\nMonday: 2-4 PM\nWednesday: 10 AM-12 PM\nFriday: 1-3 PM\n\nPlease feel free to drop by if you have any questions about the course material.\n\nBest,\nDr. Wilson",
      timestamp: "2024-12-18T14:20:00Z",
      read: true,
      starred: false,
      courseId: "course-1",
    },
  ]

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase())

    switch (activeTab) {
      case "inbox":
        return matchesSearch
      case "starred":
        return matchesSearch && message.starred
      case "sent":
        return matchesSearch && message.from === "Alice Johnson"
      default:
        return matchesSearch
    }
  })

  const handleSendMessage = () => {
    console.log("Sending message:", newMessage)
    setNewMessage({ to: "", subject: "", content: "" })
    setShowCompose(false)
  }

  const toggleStar = (messageId: string) => {
    // In a real app, this would update the message in the backend
    console.log("Toggle star for message:", messageId)
  }

  const markAsRead = (messageId: string) => {
    // In a real app, this would update the message in the backend
    console.log("Mark as read:", messageId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/student-dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Messages</h1>
                <p className="text-muted-foreground">Communicate with instructors and classmates</p>
              </div>
            </div>
            <Button onClick={() => setShowCompose(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Compose
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Message Tabs */}
            <Card>
              <CardContent className="p-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
                  <TabsList className="grid w-full grid-cols-1 h-auto">
                    <TabsTrigger value="inbox" className="justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Inbox ({messages.filter((m) => !m.read).length})
                    </TabsTrigger>
                    <TabsTrigger value="starred" className="justify-start">
                      <Star className="w-4 h-4 mr-2" />
                      Starred ({messages.filter((m) => m.starred).length})
                    </TabsTrigger>
                    <TabsTrigger value="sent" className="justify-start">
                      <Send className="w-4 h-4 mr-2" />
                      Sent
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Message Classmates
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Instructor
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Archive className="w-4 h-4 mr-2" />
                  Archived Messages
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Messages List */}
          <div className="lg:col-span-2">
            {showCompose ? (
              <Card>
                <CardHeader>
                  <CardTitle>Compose Message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="to">To</Label>
                    <Input
                      id="to"
                      value={newMessage.to}
                      onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
                      placeholder="Enter recipient email or name..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                      placeholder="Enter subject..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Message</Label>
                    <Textarea
                      id="content"
                      value={newMessage.content}
                      onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                      placeholder="Type your message..."
                      rows={8}
                    />
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach File
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowCompose(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSendMessage}>
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : selectedMessage ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedMessage(null)}>
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {selectedMessage.from
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{selectedMessage.from}</span>
                        </div>
                        <span>•</span>
                        <span>{new Date(selectedMessage.timestamp).toLocaleString()}</span>
                        {selectedMessage.courseId && (
                          <>
                            <span>•</span>
                            <Badge variant="outline">Course Related</Badge>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleStar(selectedMessage.id)}>
                        <Star
                          className={`w-4 h-4 ${selectedMessage.starred ? "fill-yellow-400 text-yellow-400" : ""}`}
                        />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{selectedMessage.content}</div>

                    {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Attachments</h4>
                        <div className="space-y-2">
                          {selectedMessage.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 border rounded">
                              <Paperclip className="w-4 h-4" />
                              <span className="text-sm">{attachment.name}</span>
                              <span className="text-xs text-muted-foreground">({attachment.size})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="flex gap-2">
                      <Button>
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                      <Button variant="outline">
                        <Forward className="w-4 h-4 mr-2" />
                        Forward
                      </Button>
                      <Button variant="outline">
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {activeTab === "inbox" && "Inbox"}
                      {activeTab === "starred" && "Starred Messages"}
                      {activeTab === "sent" && "Sent Messages"}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {filteredMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                            !message.read ? "bg-blue-50 border-blue-200" : ""
                          }`}
                          onClick={() => {
                            setSelectedMessage(message)
                            if (!message.read) markAsRead(message.id)
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback>
                                  {message.from
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`font-medium ${!message.read ? "font-semibold" : ""}`}>
                                    {message.from}
                                  </span>
                                  {!message.read && <Circle className="w-2 h-2 fill-blue-500 text-blue-500" />}
                                  {message.starred && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                                </div>
                                <h4 className={`text-sm mb-1 ${!message.read ? "font-semibold" : ""}`}>
                                  {message.subject}
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  <span>{new Date(message.timestamp).toLocaleDateString()}</span>
                                  {message.courseId && (
                                    <Badge variant="outline" className="text-xs">
                                      Course
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
