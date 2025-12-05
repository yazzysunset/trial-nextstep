"use client"

import { useState, useEffect } from "react"
import { Dashboard } from "./components/Dashboard"
import { BudgetTracker } from "./components/BudgetTracker"
import { TaskManager } from "./components/TaskManager"
import { PunctualityLog } from "./components/PunctualityLog"
import { ProfileSettings } from "./components/ProfileSettings"
import { Sidebar } from "./components/Sidebar"
import { TopNav } from "./components/TopNav"
import { ExpenseAnalyticsDashboard } from "./components/ExpenseAnalyticsDashboard"
import { BillAndTaskReminders } from "./components/BillAndTaskReminders"
import { Login } from "./components/Login"

type CurrentPage = "dashboard" | "budget" | "tasks" | "punctuality" | "profile" | "analytics" | "reminders"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
  autoSuggested?: boolean
}

interface Task {
  id: string
  title: string
  description: string
  category: "academic" | "personal"
  priority: "low" | "medium" | "high"
  dueDate: string
  completed: boolean
  createdAt: string
}

interface AttendanceRecord {
  id: string
  date: string
  subject: string
  scheduledTime: string
  actualTime: string
  status: "on-time" | "late" | "absent"
  notes?: string
}

interface Reminder {
  id: string
  type: "bill" | "task"
  title: string
  description: string
  dueDate: string
  dueTime?: string
  amount?: number
  category?: string
  priority: "low" | "medium" | "high"
  isCompleted: boolean
  notificationSent: boolean
  createdAt: string
  recurrence?: "none" | "daily" | "weekly" | "monthly"
}

const initialTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    amount: 1500,
    category: "Scholarship",
    description: "Monthly scholarship",
    date: "2024-10-01",
  },
  { id: "2", type: "expense", amount: 450, category: "Food", description: "Grocery shopping", date: "2024-10-02" },
  { id: "3", type: "expense", amount: 120, category: "Transport", description: "Bus pass", date: "2024-10-03" },
  { id: "4", type: "expense", amount: 80, category: "Entertainment", description: "Movie tickets", date: "2024-10-04" },
  { id: "5", type: "expense", amount: 35, category: "Supplies", description: "Notebooks", date: "2024-10-05" },
]

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete Math Assignment",
    description: "Solve problems 1-20 in chapter 5",
    category: "academic",
    priority: "high",
    dueDate: "2024-10-08",
    completed: false,
    createdAt: "2024-10-01",
  },
  {
    id: "2",
    title: "Study for Chemistry Test",
    description: "Review chapters 8-10, focus on molecular bonds",
    category: "academic",
    priority: "high",
    dueDate: "2024-10-10",
    completed: false,
    createdAt: "2024-10-02",
  },
  {
    id: "3",
    title: "Grocery Shopping",
    description: "Buy ingredients for meal prep",
    category: "personal",
    priority: "medium",
    dueDate: "2024-10-07",
    completed: true,
    createdAt: "2024-10-02",
  },
  {
    id: "4",
    title: "Library Book Return",
    description: "Return borrowed textbooks",
    category: "personal",
    priority: "low",
    dueDate: "2024-10-15",
    completed: false,
    createdAt: "2024-10-03",
  },
]

const initialRecords: AttendanceRecord[] = [
  // Monday, October 20, 2025
  {
    id: "1",
    date: "2025-10-20",
    subject: "Networking 2 (LAB)",
    scheduledTime: "08:30",
    actualTime: "08:30",
    status: "on-time",
    notes: "",
  },
  {
    id: "2",
    date: "2025-10-20",
    subject: "Integrative Programming and Technologies (LAB)",
    scheduledTime: "11:30",
    actualTime: "11:28",
    status: "on-time",
    notes: "",
  },
  {
    id: "3",
    date: "2025-10-20",
    subject: "Integrative Programming and Technologies (LEC)",
    scheduledTime: "13:00",
    actualTime: "13:00",
    status: "on-time",
    notes: "",
  },
  {
    id: "4",
    date: "2025-10-20",
    subject: "IT Elective 1 - Project Management & Agile Methodologies (LAB)",
    scheduledTime: "14:30",
    actualTime: "14:35",
    status: "late",
    notes: "Previous class ran over",
  },
  {
    id: "5",
    date: "2025-10-20",
    subject: "IT Elective 1 - Project Management & Agile Methodologies (LEC)",
    scheduledTime: "16:00",
    actualTime: "16:00",
    status: "on-time",
    notes: "",
  },
  {
    id: "6",
    date: "2025-10-20",
    subject: "Networking 2 (LEC)",
    scheduledTime: "18:00",
    actualTime: "18:02",
    status: "late",
    notes: "Traffic",
  },

  // Tuesday, October 21, 2025
  {
    id: "7",
    date: "2025-10-21",
    subject: "Networking 2 (LAB)",
    scheduledTime: "08:30",
    actualTime: "08:30",
    status: "on-time",
    notes: "",
  },
  {
    id: "8",
    date: "2025-10-21",
    subject: "Integrative Programming and Technologies (LAB)",
    scheduledTime: "11:30",
    actualTime: "11:30",
    status: "on-time",
    notes: "",
  },
  {
    id: "9",
    date: "2025-10-21",
    subject: "Integrative Programming and Technologies (LEC)",
    scheduledTime: "13:00",
    actualTime: "13:00",
    status: "on-time",
    notes: "",
  },
  {
    id: "10",
    date: "2025-10-21",
    subject: "IT Elective 1 - Project Management & Agile Methodologies (LAB)",
    scheduledTime: "14:30",
    actualTime: "14:30",
    status: "on-time",
    notes: "",
  },
  {
    id: "11",
    date: "2025-10-21",
    subject: "IT Elective 1 - Project Management & Agile Methodologies (LEC)",
    scheduledTime: "16:00",
    actualTime: "16:00",
    status: "on-time",
    notes: "",
  },
  {
    id: "12",
    date: "2025-10-21",
    subject: "Networking 2 (LEC)",
    scheduledTime: "18:00",
    actualTime: "18:00",
    status: "on-time",
    notes: "",
  },

  // Wednesday, October 22, 2025
  {
    id: "13",
    date: "2025-10-22",
    subject: "IT Research Methods (LAB)",
    scheduledTime: "07:30",
    actualTime: "07:30",
    status: "on-time",
    notes: "",
  },
  {
    id: "14",
    date: "2025-10-22",
    subject: "Event Driven Programming (LEC)",
    scheduledTime: "09:00",
    actualTime: "09:00",
    status: "on-time",
    notes: "",
  },
  {
    id: "15",
    date: "2025-10-22",
    subject: "IT Research Methods (LEC)",
    scheduledTime: "11:00",
    actualTime: "11:00",
    status: "on-time",
    notes: "",
  },

  // Thursday, October 23, 2025
  {
    id: "16",
    date: "2025-10-23",
    subject: "IT Research Methods (LAB)",
    scheduledTime: "07:30",
    actualTime: "07:35",
    status: "late",
    notes: "Overslept alarm",
  },
  {
    id: "17",
    date: "2025-10-23",
    subject: "Event Driven Programming (LEC)",
    scheduledTime: "09:00",
    actualTime: "09:00",
    status: "on-time",
    notes: "",
  },
  {
    id: "18",
    date: "2025-10-23",
    subject: "IT Research Methods (LEC)",
    scheduledTime: "11:00",
    actualTime: "10:58",
    status: "on-time",
    notes: "",
  },
  {
    id: "19",
    date: "2025-10-23",
    subject: "Event Driven Programming (LAB)",
    scheduledTime: "13:00",
    actualTime: "13:00",
    status: "on-time",
    notes: "",
  },
]

const initialReminders: Reminder[] = [
  {
    id: "1",
    type: "bill",
    title: "Electricity Bill",
    description: "Monthly electricity payment",
    dueDate: "2024-10-25",
    dueTime: "17:00",
    amount: 1200,
    category: "Utilities",
    priority: "high",
    isCompleted: false,
    notificationSent: false,
    createdAt: "2024-10-10",
    recurrence: "monthly",
  },
  {
    id: "2",
    type: "bill",
    title: "Internet Bill",
    description: "Monthly internet subscription",
    dueDate: "2024-10-28",
    dueTime: "18:00",
    amount: 1500,
    category: "Internet",
    priority: "high",
    isCompleted: false,
    notificationSent: false,
    createdAt: "2024-10-10",
    recurrence: "monthly",
  },
  {
    id: "3",
    type: "task",
    title: "Project Submission",
    description: "Submit final project for IT course",
    dueDate: "2024-10-26",
    dueTime: "23:59",
    priority: "high",
    isCompleted: false,
    notificationSent: false,
    createdAt: "2024-10-12",
  },
  {
    id: "4",
    type: "task",
    title: "Doctor Appointment",
    description: "Annual checkup appointment",
    dueDate: "2024-10-30",
    dueTime: "10:00",
    priority: "medium",
    isCompleted: false,
    notificationSent: false,
    createdAt: "2024-10-15",
  },
]

export default function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>("dashboard")
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialRecords)
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders)

  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUserData = localStorage.getItem("userData")
    if (savedUserData) {
      try {
        setUser(JSON.parse(savedUserData))
      } catch (e) {
        console.error("Failed to parse user data", e)
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (userData: { firstName: string; lastName: string; email: string }) => {
    setUser(userData)
    localStorage.setItem("userData", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("userData")
    window.location.reload()
  }

  const handleUpdateUser = (userData: { firstName: string; lastName: string; email: string }) => {
    setUser((prev) => ({ ...prev, ...userData }))
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            transactions={transactions}
            tasks={tasks}
            attendanceRecords={attendanceRecords}
            userName={user.firstName}
          />
        )
      case "budget":
        return <BudgetTracker transactions={transactions} setTransactions={setTransactions} />
      case "tasks":
        return <TaskManager tasks={tasks} setTasks={setTasks} />
      case "punctuality":
        return <PunctualityLog attendanceRecords={attendanceRecords} setAttendanceRecords={setAttendanceRecords} />
      case "profile":
        return <ProfileSettings onUpdateUser={handleUpdateUser} />
      case "analytics":
        return <ExpenseAnalyticsDashboard transactions={transactions} />
      case "reminders":
        return <BillAndTaskReminders reminders={reminders} setReminders={setReminders} />
      default:
        return (
          <Dashboard
            transactions={transactions}
            tasks={tasks}
            attendanceRecords={attendanceRecords}
            userName={user.firstName}
          />
        )
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex items-center flex-shrink-0">
          <div className="md:hidden p-4">
            <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} onLogout={handleLogout} isMobile={true} />
          </div>

          <div className="flex-1 min-w-0">
            <TopNav currentPage={currentPage} onPageChange={setCurrentPage} onLogout={handleLogout} />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">{renderCurrentPage()}</main>
      </div>
    </div>
  )
}
