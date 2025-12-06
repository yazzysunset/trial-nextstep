"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { TermsAndConditions } from "./TermsAndConditions"
import { Zap, TrendingUp, Clock, BarChart3, Brain, Bell, Users } from "./icons"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"

export function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleGetStarted = () => {
    if (!termsAccepted) {
      alert("Please accept the Terms and Conditions to continue.")
      return
    }
    onGetStarted()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">NextStep</span>
          </div>
          <div className="flex items-center gap-4">
            <TermsAndConditions />
            <Button onClick={handleGetStarted} disabled={!termsAccepted}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Take Control of Your <span className="text-primary">Financial Future</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            NextStep is your all-in-one platform for smart budgeting, goal tracking, and financial planning designed
            specifically for students.
          </p>
          <Button size="lg" onClick={handleGetStarted} disabled={!termsAccepted} className="mt-8">
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
            title="Smart Budget Tracker"
            description="Monitor daily expenses and automatically categorize spending habits with AI-powered insights."
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-primary" />}
            title="Goal-Based Savings"
            description="Set financial goals and track progress visually with customizable milestones."
          />
          <FeatureCard
            icon={<Clock className="h-6 w-6 text-primary" />}
            title="Routine Planner"
            description="Combine financial planning with time management for better daily schedules."
          />
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6 text-primary" />}
            title="Analytics Dashboard"
            description="Get insights into monthly trends, overspending areas, and overall budget health."
          />
          <FeatureCard
            icon={<Brain className="h-6 w-6 text-primary" />}
            title="AI Recommendations"
            description="Receive personalized budgeting strategies and lifestyle adjustment suggestions."
          />
          <FeatureCard
            icon={<Bell className="h-6 w-6 text-primary" />}
            title="Smart Reminders"
            description="Automated alerts for upcoming payments and daily task priorities."
          />
          <FeatureCard
            icon={<Users className="h-6 w-6 text-primary" />}
            title="Community Tips"
            description="Share budgeting hacks and productivity routines with other students."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="p-12 bg-primary/10 border-primary/20">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Finances?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who are taking control of their financial future with NextStep.
          </p>
          <Button size="lg" onClick={handleGetStarted} disabled={!termsAccepted}>
            Get Started Now
          </Button>
        </Card>
      </section>

      <section className="container mx-auto px-4 py-8">
        <Card className="p-6 bg-muted/50 border-muted">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms-accept"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="terms-accept" className="text-sm font-medium cursor-pointer flex-1">
              I agree to the{" "}
              <span className="text-primary font-semibold">
                <TermsAndConditions />
              </span>
              . I understand and accept all terms and conditions.
            </Label>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 NextStep. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <TermsAndConditions />
            <a href="#" className="hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  )
}
