"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Alert, AlertDescription } from "./ui/alert"
import { Badge } from "./ui/badge"
import { Loader2, Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { assessLifestyle } from "../api/lifestyle-assessment"
import type { LifestyleAssessment as LifestyleAssessmentType } from "../api/lifestyle-assessment"

export function LifestyleAssessment() {
  const [step, setStep] = useState<"questionnaire" | "loading" | "results">("questionnaire")
  const [responses, setResponses] = useState({
    sleepHours: "7",
    exerciseDays: "3",
    mealPrep: "sometimes",
    stressLevel: "moderate",
    studyHours: "4",
    screenTime: "6",
    socialActivities: "weekly",
    budgetAdherence: "good",
  })
  const [assessment, setAssessment] = useState<LifestyleAssessmentType | null>(null)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setResponses((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setStep("loading")
    setError("")

    try {
      const result = await assessLifestyle(responses)
      setAssessment(result)
      setStep("results")

      // Save assessment to localStorage
      const savedAssessments = JSON.parse(localStorage.getItem("lifestyleAssessments") || "[]")
      savedAssessments.push({
        date: new Date().toISOString(),
        assessment: result,
      })
      localStorage.setItem("lifestyleAssessments", JSON.stringify(savedAssessments))
    } catch (err) {
      setError("Failed to assess lifestyle. Please try again.")
      setStep("questionnaire")
      console.error(err)
    }
  }

  if (step === "loading") {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <h3 className="text-lg font-semibold">Analyzing Your Lifestyle</h3>
            <p className="text-muted-foreground">Using AI to assess your wellness profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (step === "results" && assessment) {
    const scoreColor =
      assessment.overallScore >= 80
        ? "text-green-600"
        : assessment.overallScore >= 60
          ? "text-blue-600"
          : assessment.overallScore >= 40
            ? "text-yellow-600"
            : "text-red-600"

    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Your Lifestyle Assessment Results</h1>
          <p className="text-muted-foreground mt-2">Comprehensive AI-powered wellness analysis</p>
        </div>

        {/* Overall Score */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className={`text-6xl font-bold ${scoreColor}`}>{assessment.overallScore}</div>
              <p className="text-lg font-semibold">Overall Wellness Score</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${assessment.overallScore}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Sleep Habits</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="capitalize">
                {assessment.sleepHabits}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Exercise Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="capitalize">
                {assessment.exerciseFrequency}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Diet Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="capitalize">
                {assessment.dietQuality}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Stress Level</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="capitalize">
                {assessment.stressLevel}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Work-Life Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="capitalize">
                {assessment.workLifeBalance}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Financial Wellness</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="capitalize">
                {assessment.financialWellness}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Strengths */}
        {assessment.strengths.length > 0 && (
          <Card className="border-0 shadow-sm border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Your Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {assessment.strengths.map((strength, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Areas for Improvement */}
        {assessment.areasForImprovement.length > 0 && (
          <Card className="border-0 shadow-sm border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {assessment.areasForImprovement.map((area, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Risk Factors */}
        {assessment.riskFactors.length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Risk Factors Identified:</strong>
              <ul className="mt-2 space-y-1 ml-4">
                {assessment.riskFactors.map((risk, idx) => (
                  <li key={idx} className="list-disc">
                    {risk}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Recommendations */}
        {assessment.recommendations.length > 0 && (
          <Card className="border-0 shadow-sm border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {assessment.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-3 pb-3 border-b last:border-0">
                    <span className="text-blue-600 font-bold text-lg flex-shrink-0">{idx + 1}</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setStep("questionnaire")} variant="outline" className="flex-1">
            Retake Assessment
          </Button>
          <Button onClick={() => window.location.reload()} className="flex-1">
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">AI-Powered Lifestyle Assessment</h1>
        <p className="text-muted-foreground mt-2">Answer these questions for a personalized wellness analysis</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Sleep Hours */}
            <div className="space-y-2">
              <Label htmlFor="sleepHours">How many hours do you typically sleep per night?</Label>
              <Input
                id="sleepHours"
                type="number"
                min="0"
                max="12"
                value={responses.sleepHours}
                onChange={(e) => handleInputChange("sleepHours", e.target.value)}
              />
            </div>

            {/* Exercise Days */}
            <div className="space-y-2">
              <Label htmlFor="exerciseDays">How many days per week do you exercise?</Label>
              <Select
                value={responses.exerciseDays}
                onValueChange={(value) => handleInputChange("exerciseDays", value)}
              >
                <SelectTrigger id="exerciseDays">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 days (Sedentary)</SelectItem>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="2">2 days</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="4">4 days</SelectItem>
                  <SelectItem value="5">5 days</SelectItem>
                  <SelectItem value="6">6 days</SelectItem>
                  <SelectItem value="7">7 days (Daily)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Meal Prep */}
            <div className="space-y-2">
              <Label htmlFor="mealPrep">How often do you prepare meals at home?</Label>
              <Select value={responses.mealPrep} onValueChange={(value) => handleInputChange("mealPrep", value)}>
                <SelectTrigger id="mealPrep">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rarely">Rarely</SelectItem>
                  <SelectItem value="sometimes">Sometimes</SelectItem>
                  <SelectItem value="often">Often</SelectItem>
                  <SelectItem value="always">Always</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stress Level */}
            <div className="space-y-2">
              <Label htmlFor="stressLevel">How would you rate your current stress level?</Label>
              <Select value={responses.stressLevel} onValueChange={(value) => handleInputChange("stressLevel", value)}>
                <SelectTrigger id="stressLevel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="very_high">Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Study Hours */}
            <div className="space-y-2">
              <Label htmlFor="studyHours">How many hours per day do you study/work?</Label>
              <Input
                id="studyHours"
                type="number"
                min="0"
                max="24"
                value={responses.studyHours}
                onChange={(e) => handleInputChange("studyHours", e.target.value)}
              />
            </div>

            {/* Screen Time */}
            <div className="space-y-2">
              <Label htmlFor="screenTime">How many hours per day do you spend on screens?</Label>
              <Input
                id="screenTime"
                type="number"
                min="0"
                max="24"
                value={responses.screenTime}
                onChange={(e) => handleInputChange("screenTime", e.target.value)}
              />
            </div>

            {/* Social Activities */}
            <div className="space-y-2">
              <Label htmlFor="socialActivities">How often do you engage in social activities?</Label>
              <Select
                value={responses.socialActivities}
                onValueChange={(value) => handleInputChange("socialActivities", value)}
              >
                <SelectTrigger id="socialActivities">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rarely">Rarely</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Budget Adherence */}
            <div className="space-y-2">
              <Label htmlFor="budgetAdherence">How well do you adhere to your budget?</Label>
              <Select
                value={responses.budgetAdherence}
                onValueChange={(value) => handleInputChange("budgetAdherence", value)}
              >
                <SelectTrigger id="budgetAdherence">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSubmit} size="lg" className="w-full">
              Get My Lifestyle Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
