import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { DollarSign, CheckSquare, Clock, Calendar, AlertCircle, TrendingUp, TrendingDown, Target } from "./icons"
import { SimplePieChart, SimpleLineChart } from "./simple-charts"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
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

interface DashboardProps {
  transactions: Transaction[]
  tasks: Task[]
  attendanceRecords: AttendanceRecord[]
  userName?: string // Added userName prop
}

const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#64748b"]

export function Dashboard({ transactions, tasks, attendanceRecords, userName = "Student" }: DashboardProps) {
  // Added userName prop with default value
  // Calculate budget data
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  // Calculate expenses by category
  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>,
    )

  const totalExpenseAmount = Object.values(expensesByCategory).reduce((sum, val) => sum + val, 0)

  const budgetData = Object.entries(expensesByCategory).map(([category, amount], index) => ({
    name: category,
    value: totalExpenseAmount > 0 ? Math.round((amount / totalExpenseAmount) * 100) : 0,
    amount: amount,
    color: COLORS[index % COLORS.length],
  }))

  // Calculate task data
  const completedTasks = tasks.filter((t) => t.completed).length
  const totalTasks = tasks.length
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Calculate punctuality data
  const onTimeCount = attendanceRecords.filter((r) => r.status === "on-time").length
  const totalAttendance = attendanceRecords.filter((r) => r.status !== "absent").length
  const punctualityRate = totalAttendance > 0 ? Math.round((onTimeCount / totalAttendance) * 100) : 0

  // Get upcoming tasks (next 7 days)
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)

  const upcomingTasks = tasks
    .filter((task) => {
      const dueDate = new Date(task.dueDate)
      return dueDate >= today && dueDate <= nextWeek && !task.completed
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  // Group attendance records by week for trend chart
  const weeklyPunctuality = attendanceRecords.reduce(
    (acc, record) => {
      const date = new Date(record.date)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekKey = weekStart.toISOString().split("T")[0]

      if (!acc[weekKey]) {
        acc[weekKey] = { onTime: 0, total: 0 }
      }

      if (record.status !== "absent") {
        acc[weekKey].total++
        if (record.status === "on-time") {
          acc[weekKey].onTime++
        }
      }

      return acc
    },
    {} as Record<string, { onTime: number; total: number }>,
  )

  const punctualityData = Object.entries(weeklyPunctuality)
    .map(([week, data]) => ({
      week: new Date(week).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      rate: data.total > 0 ? Math.round((data.onTime / data.total) * 100) : 0,
    }))
    .slice(-6) // Last 6 weeks

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl">Welcome back, {userName}! 👋</h1> {/* Used userName prop */}
          <p className="text-muted-foreground">Here's your progress overview.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">₱{balance.toFixed(2)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {balance >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">Positive balance</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-destructive" />
                  <span className="text-destructive">Negative balance</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Task Completion</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {completedTasks}/{totalTasks}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">{taskCompletionRate}% completion rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Punctuality Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{punctualityRate}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">{onTimeCount} on-time arrivals</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Goal Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{taskCompletionRate}%</div>
            <Progress value={taskCompletionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Breakdown */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Budget Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {budgetData.length > 0 ? (
              <>
                <SimplePieChart data={budgetData} />
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {budgetData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 min-w-0">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-sm truncate">{item.name}</span>
                      <span className="text-sm text-muted-foreground ml-auto whitespace-nowrap">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Income</span>
                  <span className="text-sm text-green-600">₱{totalIncome.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Expenses</span>
                  <span className="text-sm text-destructive">₱{totalExpenses.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-sm">Balance</span>
                  <span className={`text-sm ${balance >= 0 ? "text-green-600" : "text-destructive"}`}>
                    ₱{balance.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <p className="text-sm">Recent Transactions</p>
                {transactions
                  .slice(-5)
                  .reverse()
                  .map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between text-sm gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Badge
                          variant={transaction.type === "income" ? "default" : "secondary"}
                          className="flex-shrink-0"
                        >
                          {transaction.type}
                        </Badge>
                        <span className="text-muted-foreground truncate">{transaction.category}</span>
                      </div>
                      <span
                        className={`whitespace-nowrap ${transaction.type === "income" ? "text-green-600" : "text-destructive"}`}
                      >
                        {transaction.type === "income" ? "+" : "-"}₱{transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Punctuality Trend */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Punctuality Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {punctualityData.length > 0 ? (
              <SimpleLineChart data={punctualityData} />
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                No punctuality data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Alerts */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {balance < 0 && (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm text-yellow-800">Budget Alert</p>
                    <p className="text-xs text-yellow-600">Negative balance detected</p>
                  </div>
                </div>
              )}

              {upcomingTasks.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-800">Upcoming Deadline</p>
                    <p className="text-xs text-blue-600">{upcomingTasks[0].title}</p>
                  </div>
                </div>
              )}

              {punctualityRate >= 90 && (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Target className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm text-green-800">Great Punctuality!</p>
                    <p className="text-xs text-green-600">{punctualityRate}% on-time rate</p>
                  </div>
                </div>
              )}

              {balance < 0 && upcomingTasks.length === 0 && punctualityRate < 90 && (
                <div className="flex items-center justify-center text-muted-foreground text-sm py-4">
                  No alerts at the moment
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
