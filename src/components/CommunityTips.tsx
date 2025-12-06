"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { ThumbsUp, MessageCircle, Share2, Plus } from "./icons"

interface CommunityTip {
  id: string
  author: string
  title: string
  content: string
  category: "budgeting" | "savings" | "lifestyle" | "productivity"
  likes: number
  comments: number
  timestamp: string
}

const initialTips: CommunityTip[] = [
  {
    id: "1",
    author: "Alex Kim",
    title: "50/30/20 Budget Rule",
    content:
      "Allocate 50% of income to needs, 30% to wants, and 20% to savings. This simple rule helped me save ₱20,000 monthly!",
    category: "budgeting",
    likes: 234,
    comments: 18,
    timestamp: "2 days ago",
  },
  {
    id: "2",
    author: "Maria Santos",
    title: "Meal Prep Saves Time & Money",
    content:
      "Preparing meals on Sunday cuts my weekly food expenses by 40% and saves 2 hours daily. Win-win situation!",
    category: "lifestyle",
    likes: 189,
    comments: 24,
    timestamp: "4 days ago",
  },
  {
    id: "3",
    author: "John Reyes",
    title: "Automate Your Savings",
    content:
      "Set up automatic transfers to a separate savings account. Out of sight, out of mind. I've saved ₱50,000 in 6 months!",
    category: "savings",
    likes: 312,
    comments: 42,
    timestamp: "1 week ago",
  },
]

export function CommunityTips() {
  const [tips, setTips] = useState<CommunityTip[]>(initialTips)
  const [newTip, setNewTip] = useState({ title: "", content: "", category: "budgeting" as const })
  const [userName, setUserName] = useState("")

  const handleSubmitTip = () => {
    if (newTip.title.trim() && newTip.content.trim() && userName.trim()) {
      const tip: CommunityTip = {
        id: Date.now().toString(),
        author: userName,
        title: newTip.title,
        content: newTip.content,
        category: newTip.category,
        likes: 0,
        comments: 0,
        timestamp: "just now",
      }
      setTips([tip, ...tips])
      setNewTip({ title: "", content: "", category: "budgeting" })
      setUserName("")
    }
  }

  const handleLike = (id: string) => {
    setTips(tips.map((tip) => (tip.id === id ? { ...tip, likes: tip.likes + 1 } : tip)))
  }

  const categoryColors: Record<string, string> = {
    budgeting: "bg-blue-100 text-blue-800",
    savings: "bg-green-100 text-green-800",
    lifestyle: "bg-orange-100 text-orange-800",
    productivity: "bg-purple-100 text-purple-800",
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold">Community Tips & Peer Sharing</h1>
        <p className="text-muted-foreground">
          Share your budgeting hacks and productivity routines with fellow students.
        </p>
      </div>

      {/* Submit New Tip */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Share Your Tip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">Share a Budget Hack or Productivity Routine</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Tip</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Your Name</label>
                  <Input
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tip Title</label>
                  <Input
                    placeholder="Give your tip a catchy title"
                    value={newTip.title}
                    onChange={(e) => setNewTip({ ...newTip, title: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={newTip.category}
                    onChange={(e) => setNewTip({ ...newTip, category: e.target.value as any })}
                    className="w-full mt-2 px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="budgeting">Budgeting</option>
                    <option value="savings">Savings</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="productivity">Productivity</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Your Tip</label>
                  <Textarea
                    placeholder="Share your budget hack or productivity routine..."
                    value={newTip.content}
                    onChange={(e) => setNewTip({ ...newTip, content: e.target.value })}
                    className="mt-2"
                    rows={4}
                  />
                </div>
                <Button onClick={handleSubmitTip} className="w-full">
                  Share Tip
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Tips List */}
      <div className="grid gap-4">
        {tips.map((tip) => (
          <Card key={tip.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg">{tip.title}</CardTitle>
                    <Badge className={categoryColors[tip.category]}>{tip.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    by <span className="font-medium">{tip.author}</span> • {tip.timestamp}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{tip.content}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <button
                  onClick={() => handleLike(tip.id)}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{tip.likes}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span>{tip.comments}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
