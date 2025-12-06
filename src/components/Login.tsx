"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "./ui/alert"
import { Eye, EyeOff, Check, X } from "./icons"
import { Checkbox } from "./ui/checkbox"

interface LoginProps {
  onLogin: (userData: { firstName: string; lastName: string; email: string }) => void
}

export function Login({ onLogin }: LoginProps) {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  })

  const [error, setError] = useState("")

  const getPasswordRequirements = (password: string) => {
    return [
      { label: "At least 8 characters", met: password.length >= 8 },
      { label: "At least one uppercase letter", met: /[A-Z]/.test(password) },
      { label: "At least one lowercase letter", met: /[a-z]/.test(password) },
      { label: "At least one number", met: /[0-9]/.test(password) },
      { label: "At least one special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ]
  }

  const validatePassword = (password: string) => {
    const requirements = getPasswordRequirements(password)
    const unmet = requirements.filter((req) => !req.met)
    if (unmet.length > 0) return "Password does not meet all requirements."
    return null
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const savedUserData = localStorage.getItem("userData")
    if (savedUserData) {
      const user = JSON.parse(savedUserData)
      if (user.email === loginData.email) {
        onLogin(user)
        return
      }
    }

    if (loginData.email && loginData.password) {
      const namePart = loginData.email.split("@")[0]
      const mockUser = {
        firstName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
        lastName: "",
        email: loginData.email,
      }
      onLogin(mockUser)
    } else {
      setError("Please enter both email and password.")
    }
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!signupData.termsAccepted) {
      setError("You must accept the Terms and Conditions to create an account.")
      return
    }

    if (!signupData.firstName || !signupData.lastName || !signupData.email || !signupData.password) {
      setError("All fields are required.")
      return
    }

    const passwordError = validatePassword(signupData.password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    const newUser = {
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      email: signupData.email,
    }

    localStorage.setItem("userData", JSON.stringify(newUser))
    onLogin(newUser)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="m@example.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={signupData.firstName}
                      onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={signupData.lastName}
                      onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showSignupPassword ? "text" : "password"}
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="space-y-1 mt-2">
                    {getPasswordRequirements(signupData.password).map((req, index) => (
                      <div key={index} className="flex items-center text-xs">
                        {req.met ? (
                          <Check className="h-3 w-3 text-green-500 mr-2" />
                        ) : (
                          <X className="h-3 w-3 text-red-500 mr-2 drop-shadow-[0_0_2px_rgba(239,68,68,0.5)]" />
                        )}
                        <span className={req.met ? "text-green-600" : "text-muted-foreground"}>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  />
                </div>
                <div className="flex items-start gap-2 mt-4 p-3 bg-muted/50 rounded">
                  <Checkbox
                    id="terms-agree"
                    checked={signupData.termsAccepted}
                    onCheckedChange={(checked) => setSignupData({ ...signupData, termsAccepted: checked as boolean })}
                    className="mt-1"
                  />
                  <Label htmlFor="terms-agree" className="text-xs font-medium cursor-pointer">
                    I agree to the Terms and Conditions and understand all policies
                  </Label>
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
