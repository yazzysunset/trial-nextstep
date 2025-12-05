"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Plus, DollarSign, AlertCircle, Lightbulb, Trash2 } from "./icons"
import { SimplePieChart } from "./simple-charts"
import { suggestCategory } from "../utils/expense-categorizer"
import { Alert, AlertDescription } from "./ui/alert" // Imported Alert components

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
  autoSuggested?: boolean
}

interface BudgetTrackerProps {
  transactions: Transaction[]
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
}

const categories = ["Food", "Transport", "Entertainment", "Supplies", "Healthcare", "Clothing", "Other"]
const budgetLimits = {
  Food: 600,
  Transport: 200,
  Entertainment: 300,
  Supplies: 150,
  Healthcare: 100,
  Clothing: 200,
  Other: 100,
}

export function BudgetTracker({ transactions, setTransactions }: BudgetTrackerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    category: "",
    customCategory: "",
    description: "",
  })
  const [categorySuggestion, setCategorySuggestion] = useState<{ category: string; confidence: number } | null>(null)
  const [validationError, setValidationError] = useState("") // Added validation error state

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>,
    )

  const chartData = Object.entries(expensesByCategory).map(([category, amount], index) => ({
    name: category,
    value: amount,
    color: [`#3b82f6`, `#06b6d4`, `#8b5cf6`, `#10b981`, `#f59e0b`, `#ef4444`, `#64748b`][index % 7],
  }))

  const budgetProgress = categories.map((category) => ({
    category,
    spent: expensesByCategory[category] || 0,
    limit: budgetLimits[category as keyof typeof budgetLimits],
    percentage: Math.round(
      ((expensesByCategory[category] || 0) / budgetLimits[category as keyof typeof budgetLimits]) * 100,
    ),
  }))

  useEffect(() => {
    if (formData.type === "expense" && formData.description && formData.description.length > 2) {
      const suggestion = suggestCategory(formData.description)
      if (suggestion.confidence > 0) {
        setCategorySuggestion({
          category: suggestion.category,
          confidence: Math.round(suggestion.confidence),
        })
      } else {
        setCategorySuggestion(null)
      }
    } else {
      setCategorySuggestion(null)
    }
  }, [formData.description, formData.type])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setValidationError("")

    // Validate amount
    if (!formData.amount || formData.amount.trim() === "") {
      setValidationError("Please enter a valid amount.")
      return
    }

    const amountValue = Number.parseFloat(formData.amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      setValidationError("Please enter a valid amount.")
      return
    }

    // Validate category
    if (!formData.category) {
      setValidationError("Please select a category.")
      return
    }

    // Validate custom category if "Other" is selected
    if (formData.category === "Other" && !formData.customCategory) {
      setValidationError("Please enter a custom category name.")
      return
    }

    // Validate description
    if (!formData.description || formData.description.trim() === "") {
      setValidationError("Please enter a description.")
      return
    }

    const finalCategory =
      formData.category === "Other" && formData.customCategory ? formData.customCategory : formData.category

    const newTransaction: Transaction = {
      id: editingTransaction?.id || Date.now().toString(),
      type: formData.type,
      amount: amountValue,
      category: finalCategory,
      description: formData.description,
      date: new Date().toISOString().split("T")[0],
      autoSuggested: formData.type === "expense" && categorySuggestion ? true : false,
    }

    if (editingTransaction) {
      setTransactions((prev) => prev.map((t) => (t.id === editingTransaction.id ? newTransaction : t)))
    } else {
      setTransactions((prev) => [...prev, newTransaction])
    }

    setFormData({ type: "expense", amount: "", category: "", customCategory: "", description: "" })
    setCategorySuggestion(null)
    setEditingTransaction(null)
    setValidationError("") // Clear validation error on success
    setIsAddDialogOpen(false)
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    const isCustomCategory =
      !categories.includes(transaction.category) &&
      transaction.category !== "Scholarship" &&
      transaction.category !== "Part-time Job" &&
      transaction.category !== "Family Support"
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: isCustomCategory ? "Other" : transaction.category,
      customCategory: isCustomCategory ? transaction.category : "",
      description: transaction.description,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const getAIInsights = () => {
    const insights = []

    if (balance < 0) {
      insights.push("Your expenses exceed your income. Consider reducing spending in entertainment or food categories.")
    }

    const highestSpending = Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a)[0]
    if (highestSpending && highestSpending[1] > 400) {
      insights.push(
        `You're spending the most on ${highestSpending[0]} (₱${highestSpending[1]}). Look for ways to optimize this category.`,
      )
    }

    const overBudgetCategories = budgetProgress.filter((p) => p.percentage > 100)
    if (overBudgetCategories.length > 0) {
      insights.push(`You're over budget in: ${overBudgetCategories.map((c) => c.category).join(", ")}`)
    }

    return insights.length > 0 ? insights : ["Great job! You're staying within your budget limits."]
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl">Smart Budget Tracker</h1>
          <p className="text-muted-foreground">Manage your income and expenses with AI-powered insights</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTransaction ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
              <DialogDescription>
                {editingTransaction
                  ? "Update your transaction details"
                  : "Add a new income or expense transaction. AI will auto-categorize expenses based on description."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {validationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "income" | "expense") => setFormData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Amount (₱)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., McDonald's lunch, Uber ride to office"
                />
              </div>

              {categorySuggestion && formData.type === "expense" && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    AI Suggestion: <span className="font-semibold">{categorySuggestion.category}</span>
                    <span className="text-xs text-blue-600 ml-2">({categorySuggestion.confidence}% match)</span>
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="w-full bg-blue-100 border-blue-300 hover:bg-blue-200"
                    onClick={() => setFormData((prev) => ({ ...prev, category: categorySuggestion.category }))}
                  >
                    Use Suggestion
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: value,
                      customCategory: value !== "Other" ? "" : prev.customCategory,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.type === "income" ? (
                      <>
                        <SelectItem value="Scholarship">Scholarship</SelectItem>
                        <SelectItem value="Part-time Job">Part-time Job</SelectItem>
                        <SelectItem value="Family Support">Family Support</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {formData.category === "Other" && (
                <div className="space-y-2">
                  <Label>Custom Category Name</Label>
                  <Input
                    value={formData.customCategory}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customCategory: e.target.value }))}
                    placeholder="Enter category name"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingTransaction ? "Update" : "Add"} Transaction
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setEditingTransaction(null)
                    setFormData({ type: "expense", amount: "", category: "", customCategory: "", description: "" })
                    setCategorySuggestion(null)
                    setValidationError("") // Clear validation error on cancel
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">₱{totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">₱{totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>₱{balance.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Budget Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Breakdown Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Spending Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <>
                <SimplePieChart data={chartData} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 min-w-0">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-sm truncate">{item.name}</span>
                      <span className="text-sm text-muted-foreground ml-auto whitespace-nowrap">₱{item.value}</span>
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

        {/* Budget Progress */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Budget Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetProgress.map((budget) => (
              <div key={budget.category} className="space-y-2">
                <div className="flex justify-between text-sm gap-2">
                  <span className="truncate">{budget.category}</span>
                  <span className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                    ₱{budget.spent} / ₱{budget.limit}
                    {budget.percentage > 90 && <AlertCircle className="h-3 w-3 text-yellow-500" />}
                  </span>
                </div>
                <Progress
                  value={Math.min(budget.percentage, 100)}
                  className={budget.percentage > 100 ? "bg-red-100" : ""}
                />
                {budget.percentage > 100 && (
                  <p className="text-xs text-red-600">Over budget by ₱{budget.spent - budget.limit}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            AI Budget Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getAIInsights().map((insight, index) => (
              <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[90px]">Date</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="min-w-[100px]">Category</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[150px]">Description</TableHead>
                  <TableHead className="min-w-[100px]">Amount</TableHead>
                  <TableHead className="min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions
                  .slice()
                  .reverse()
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Date(transaction.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant={transaction.type === "income" ? "default" : "secondary"}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate">{transaction.category}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-[180px] truncate">
                        {transaction.description}
                      </TableCell>
                      <TableCell
                        className={`whitespace-nowrap ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "income" ? "+" : "-"}₱{transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(transaction)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(transaction.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
