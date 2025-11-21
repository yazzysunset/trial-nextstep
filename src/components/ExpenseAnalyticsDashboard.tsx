import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Filter,
  Target as PieChartIcon,
  BarChart3, // Added BarChart3 import
} from "./icons"
import { SimpleLineChart, SimpleBarChart } from "./simple-charts"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
}

interface ExpenseAnalyticsDashboardProps {
  transactions: Transaction[]
}

interface MonthlyData {
  month: string
  income: number
  expenses: number
  balance: number
}

interface SpendingInsight {
  category: string
  amount: number
  percentage: number
  trend: "up" | "down" | "stable"
  trendPercent: number
}

export function ExpenseAnalyticsDashboard({ transactions }: ExpenseAnalyticsDashboardProps) {
  // Get current year's monthly data
  const getMonthlyData = (): MonthlyData[] => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMonth(i)
      return date
    })

    return months.map((date) => {
      const monthStr = date.toISOString().substring(0, 7)
      const monthTransactions = transactions.filter((t) => t.date.startsWith(monthStr))

      const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

      const expenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

      return {
        month: date.toLocaleDateString("en-US", { month: "short" }),
        income,
        expenses,
        balance: income - expenses,
      }
    })
  }

  // Calculate spending by category
  const getSpendingByCategory = (): SpendingInsight[] => {
    const currentMonth = new Date().toISOString().substring(0, 7)
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().substring(0, 7)

    const currentExpenses = transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
      .reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount
          return acc
        },
        {} as Record<string, number>,
      )

    const lastExpenses = transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(lastMonth))
      .reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount
          return acc
        },
        {} as Record<string, number>,
      )

    const total = Object.values(currentExpenses).reduce((sum, val) => sum + val, 0)

    return Object.entries(currentExpenses)
      .map(([category, amount]) => {
        const lastAmount = lastExpenses[category] || 0
        const change = lastAmount > 0 ? ((amount - lastAmount) / lastAmount) * 100 : 0
        const trend = Math.abs(change) < 5 ? "stable" : change > 0 ? "up" : "down"

        return {
          category,
          amount,
          percentage: total > 0 ? (amount / total) * 100 : 0,
          trend: trend as "up" | "down" | "stable",
          trendPercent: Math.abs(change),
        }
      })
      .sort((a, b) => b.amount - a.amount)
  }

  // Get health score (0-100)
  const getHealthScore = (): { score: number; status: string; color: string } => {
    const currentMonth = new Date().toISOString().substring(0, 7)
    const monthTransactions = transactions.filter((t) => t.date.startsWith(currentMonth))

    const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const expenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const ratio = income > 0 ? (expenses / income) * 100 : 100

    let score = 100
    if (ratio > 100) score -= 30
    else if (ratio > 80) score -= 15
    else if (ratio > 60) score -= 5

    let status = "Excellent"
    let color = "text-green-600"

    if (score < 50) {
      status = "Critical"
      color = "text-red-600"
    } else if (score < 70) {
      status = "Warning"
      color = "text-yellow-600"
    } else if (score < 85) {
      status = "Good"
      color = "text-blue-600"
    }

    return { score: Math.max(0, score), status, color }
  }

  // Get overspending alerts
  const getOverspendingAlerts = () => {
    const insights = getSpendingByCategory()
    const alerts = insights
      .filter((insight) => insight.percentage > 25 || (insight.trend === "up" && insight.trendPercent > 20))
      .slice(0, 3)

    return alerts
  }

  const getPredictiveAnalytics = () => {
    const monthlyData = getMonthlyData()
    const recentMonths = monthlyData.filter((d) => d.expenses > 0).slice(-3) // Last 3 active months

    if (recentMonths.length === 0) return null

    const avgExpense = recentMonths.reduce((sum, m) => sum + m.expenses, 0) / recentMonths.length
    const predictedExpense = avgExpense * 1.05 // Simple 5% buffer projection

    const spendingInsights = getSpendingByCategory()
    const topCategory = spendingInsights[0]

    return {
      predictedAmount: predictedExpense,
      predictedSavings: (monthlyData[new Date().getMonth()]?.income || 0) - predictedExpense,
      topCategoryPrediction: topCategory
        ? {
            name: topCategory.category,
            amount: topCategory.amount * 1.02, // 2% increase prediction
          }
        : null,
    }
  }

  const monthlyData = getMonthlyData()
  const spendingInsights = getSpendingByCategory()
  const healthScore = getHealthScore()
  const alerts = getOverspendingAlerts()
  const prediction = getPredictiveAnalytics()

  // Prepare chart data
  const lineChartData = monthlyData
    .filter((d) => d.expenses > 0 || d.income > 0)
    .map((d) => ({
      week: d.month,
      rate: Math.round((d.expenses / (d.income || 1)) * 100),
    }))

  const barChartData = spendingInsights.slice(0, 5).map((insight) => ({
    week: insight.category,
    rate: Math.round(insight.percentage),
  }))

  const currentMonth = new Date().toISOString().substring(0, 7)
  const currentMonthData = monthlyData[new Date().getMonth()]
  const totalIncome = currentMonthData?.income || 0
  const totalExpenses = currentMonthData?.expenses || 0

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl">Expense Analytics</h1>
        <p className="text-muted-foreground">Detailed insights into your spending patterns and budget health</p>
      </div>

      {/* Health Score Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Budget Health Score</span>
            <span className={`text-3xl font-bold ${healthScore.color}`}>{healthScore.score}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Status: {healthScore.status}</span>
              <span className={healthScore.color}>{healthScore.status}</span>
            </div>
            <Progress value={healthScore.score} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg">
              <p className="text-xs text-muted-foreground">Current Month Income</p>
              <p className="text-lg font-semibold text-green-600">₱{totalIncome.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-xs text-muted-foreground">Current Month Expenses</p>
              <p className="text-lg font-semibold text-red-600">₱{totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lineChartData.length > 0 ? (
              <SimpleLineChart data={lineChartData} />
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">No data available</div>
            )}
            <p className="text-xs text-muted-foreground mt-3">Expense to Income Ratio by Month</p>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Top Spending Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {barChartData.length > 0 ? (
              <SimpleBarChart data={barChartData} />
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">No data available</div>
            )}
            <p className="text-xs text-muted-foreground mt-3">% of Total Monthly Expenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Spending Insights */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Detailed Spending Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {spendingInsights.length > 0 ? (
              spendingInsights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{insight.category}</span>
                      <Badge
                        variant={
                          insight.trend === "up" ? "destructive" : insight.trend === "down" ? "secondary" : "outline"
                        }
                      >
                        {insight.trend === "up" ? (
                          <>
                            <TrendingUp className="h-3 w-3 mr-1" />+{insight.trendPercent.toFixed(0)}%
                          </>
                        ) : insight.trend === "down" ? (
                          <>
                            <TrendingDown className="h-3 w-3 mr-1" />-{insight.trendPercent.toFixed(0)}%
                          </>
                        ) : (
                          "Stable"
                        )}
                      </Badge>
                    </div>
                    <Progress value={insight.percentage} />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>₱{insight.amount.toFixed(2)}</span>
                      <span>{insight.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-6">No spending data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alerts & Recommendations */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Overspending Alerts & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-orange-900 mb-1">{alert.category}</p>
                      <p className="text-sm text-orange-800">
                        {alert.trend === "up"
                          ? `Spending in this category increased by ${alert.trendPercent.toFixed(0)}% compared to last month.`
                          : `This is your highest spending category at ${alert.percentage.toFixed(1)}% of total expenses.`}
                      </p>
                      <p className="text-xs text-orange-700 mt-2">Currently: ₱{alert.amount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Spending Under Control</p>
                  <p className="text-sm text-green-800">No major overspending detected. Keep up the good budgeting!</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Emerging Technology Integration
        </h2>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-slate-50 to-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Predictive Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Next Month's Forecast</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-indigo-700">
                      ₱{prediction ? prediction.predictedAmount.toFixed(2) : "0.00"}
                    </span>
                    <span className="text-xs text-muted-foreground">estimated expenses</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Based on your lifestyle patterns and previous transaction history, we project a slight increase in
                    spending next month.
                  </p>
                </div>

                {prediction?.topCategoryPrediction && (
                  <div className="p-3 bg-white/50 rounded-lg border border-slate-200">
                    <p className="text-xs font-medium text-slate-600 mb-1">Highest Likely Expense</p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800">{prediction.topCategoryPrediction.name}</span>
                      <span className="text-slate-600">~₱{prediction.topCategoryPrediction.amount.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Projected Savings Potential</p>
                  <Progress
                    value={
                      prediction && prediction.predictedAmount > 0
                        ? (prediction.predictedSavings / prediction.predictedAmount) * 100
                        : 0
                    }
                    className="h-2 mb-2"
                  />
                  <p className="text-sm text-slate-700">
                    You are on track to save approximately{" "}
                    <span className="font-bold text-green-600">
                      ₱{prediction ? Math.max(0, prediction.predictedSavings).toFixed(2) : "0.00"}
                    </span>{" "}
                    next month if current trends continue.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-white">
                    AI Forecast
                  </Badge>
                  <Badge variant="outline" className="bg-white">
                    Lifestyle Analysis
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
