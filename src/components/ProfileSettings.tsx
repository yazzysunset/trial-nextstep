"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Separator } from "./ui/separator"
import { Alert, AlertDescription } from "./ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { User, School, Bell, Eye, Shield, Palette, Save, Upload, CheckCircle } from "lucide-react"

interface UserData {
  firstName: string
  lastName: string
  email: string
  profilePhoto?: string
  studentId?: string
  university?: string
  major?: string
  year?: string
}

interface ProfileSettingsProps {
  onUpdateUser?: (userData: { firstName: string; lastName: string; email: string }) => void // Added onUpdateUser prop
}

export function ProfileSettings({ onUpdateUser }: ProfileSettingsProps) {
  // Added onUpdateUser prop
  const [profileData, setProfileData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    profilePhoto: "",
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUserData = localStorage.getItem("userData")
    if (savedUserData) {
      try {
        const userData = JSON.parse(savedUserData)
        setProfileData(userData)
      } catch (e) {
        console.error("Failed to load user data:", e)
      }
    }
    setIsLoading(false)
  }, [])

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    budgetAlerts: true,
    taskReminders: true,
    punctualityInsights: true,
    aiSuggestions: true,
    dataSharing: false,
    theme: "light",
  })

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [savedMessage, setSavedMessage] = useState("")

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("userData", JSON.stringify(profileData))
    if (onUpdateUser) {
      onUpdateUser({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
      })
    }
    setSavedMessage("Profile updated successfully!")
    setTimeout(() => setSavedMessage(""), 3000)
  }

  const handlePreferencesSave = () => {
    setSavedMessage("Preferences updated successfully!")
    setTimeout(() => setSavedMessage(""), 3000)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()

    if (passwords.newPassword !== passwords.confirmPassword) {
      setSavedMessage("Passwords do not match!")
      setTimeout(() => setSavedMessage(""), 3000)
      return
    }

    if (passwords.newPassword.length < 6) {
      setSavedMessage("Password must be at least 6 characters!")
      setTimeout(() => setSavedMessage(""), 3000)
      return
    }

    setSavedMessage("Password updated successfully!")
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setTimeout(() => setSavedMessage(""), 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePreferenceChange = (field: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const photoData = event.target?.result as string
        setProfileData((prev) => ({ ...prev, profilePhoto: photoData }))
        localStorage.setItem("userData", JSON.stringify({ ...profileData, profilePhoto: photoData }))
        setSavedMessage("Photo updated successfully!")
        setTimeout(() => setSavedMessage(""), 3000)
      }
      reader.readAsDataURL(file)
    }
  }

  if (isLoading) {
    return <div className="p-4 lg:p-6">Loading...</div>
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Success Message */}
      {savedMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{savedMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileData.profilePhoto || "/placeholder.svg"} alt="Profile" />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {profileData.firstName?.[0] || "U"}
                      {profileData.lastName?.[0] || "N"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" asChild>
                      <label className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Change Photo
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">Profile photo is blank unless you upload one</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={profileData.studentId || ""}
                  onChange={(e) => handleInputChange("studentId", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input
                  id="university"
                  value={profileData.university || ""}
                  onChange={(e) => handleInputChange("university", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="major">Major</Label>
                  <Input
                    id="major"
                    value={profileData.major || ""}
                    onChange={(e) => handleInputChange("major", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <Select value={profileData.year || ""} onValueChange={(value) => handleInputChange("year", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="First Year">First Year</SelectItem>
                      <SelectItem value="Second Year">Second Year</SelectItem>
                      <SelectItem value="Third Year">Third Year</SelectItem>
                      <SelectItem value="Fourth Year">Fourth Year</SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>

                <Button type="submit" variant="outline">
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preferences */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get instant alerts</p>
                </div>
                <Switch
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange("pushNotifications", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly progress summaries</p>
                </div>
                <Switch
                  checked={preferences.weeklyReports}
                  onCheckedChange={(checked) => handlePreferenceChange("weeklyReports", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Budget Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about spending limits</p>
                </div>
                <Switch
                  checked={preferences.budgetAlerts}
                  onCheckedChange={(checked) => handlePreferenceChange("budgetAlerts", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Task Reminders</Label>
                  <p className="text-sm text-muted-foreground">Reminders for upcoming deadlines</p>
                </div>
                <Switch
                  checked={preferences.taskReminders}
                  onCheckedChange={(checked) => handlePreferenceChange("taskReminders", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI & Insights */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                AI & Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>AI Suggestions</Label>
                  <p className="text-sm text-muted-foreground">Get personalized recommendations</p>
                </div>
                <Switch
                  checked={preferences.aiSuggestions}
                  onCheckedChange={(checked) => handlePreferenceChange("aiSuggestions", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Punctuality Insights</Label>
                  <p className="text-sm text-muted-foreground">Advanced time management tips</p>
                </div>
                <Switch
                  checked={preferences.punctualityInsights}
                  onCheckedChange={(checked) => handlePreferenceChange("punctualityInsights", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Anonymous Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">Help improve our services</p>
                </div>
                <Switch
                  checked={preferences.dataSharing}
                  onCheckedChange={(checked) => handlePreferenceChange("dataSharing", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) => handlePreferenceChange("theme", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Save Preferences */}
          <Button onClick={handlePreferencesSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}
