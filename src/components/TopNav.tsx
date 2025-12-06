"use client"

import { Bell, Search, User } from "./icons"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"

interface TopNavProps {
  currentPage: string
  onPageChange: (page: string) => void
  onLogout: () => void
}

const pageDisplayNames: Record<string, string> = {
  dashboard: "Dashboard",
  budget: "Budget Tracker",
  tasks: "Task Manager",
  punctuality: "Punctuality Log",
  analytics: "Expense Analytics",
  reminders: "Bills & Task Reminders",
  community: "Community Tips & Peer Sharing",
  profile: "Profile Settings",
}

export function TopNav({ currentPage, onPageChange, onLogout }: TopNavProps) {
  return (
    <header className="border-b bg-card border-border px-4 lg:px-6 h-16 flex items-center justify-between">
      {/* Page Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg hidden sm:block">{pageDisplayNames[currentPage]}</h1>
      </div>

      {/* Search Bar - Hidden on Mobile */}
      <div className="hidden lg:flex items-center gap-2 flex-1 max-w-md mx-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10 bg-input-background border-0" aria-label="Search" />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
        {/* Search Icon for Mobile */}
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                3
              </Badge>
              <span className="sr-only">View notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
            <div className="p-3 border-b">
              <h4 className="text-sm">Recent Notifications</h4>
            </div>
            <DropdownMenuItem className="p-3">
              <div>
                <p className="text-sm">Budget Alert</p>
                <p className="text-xs text-muted-foreground">You've spent 85% of your monthly budget</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3">
              <div>
                <p className="text-sm">Task Reminder</p>
                <p className="text-xs text-muted-foreground">Assignment due tomorrow</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3">
              <div>
                <p className="text-sm">Punctuality Improvement</p>
                <p className="text-xs text-muted-foreground">You're on track for your attendance goal!</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-3 text-center text-sm text-primary cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground">ST</AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-3 border-b">
              <p className="text-sm">Student</p>
              <p className="text-xs text-muted-foreground">student@university.edu</p>
            </div>
            <DropdownMenuItem onClick={() => onPageChange("profile")} className="cursor-pointer">
              <User className="h-4 w-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
