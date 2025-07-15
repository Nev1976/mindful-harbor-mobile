import { Settings, User, Bell, Moon, Sun, Smartphone, Coffee } from "lucide-react";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const userName = "Sarah";
  const userEmail = "sarah@example.com";
  const memberSince = "January 2024";

  return (
    <div className="pb-20">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Profile Header */}
        <Card className="mindful-card mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-300 to-sage-300 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-warm-gray-800">{userName}</h2>
                <p className="text-sm text-warm-gray-600">{userEmail}</p>
                <p className="text-xs text-warm-gray-500">Member since {memberSince}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <Card className="mindful-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Your Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-light text-teal-600 mb-1">7</div>
                <div className="text-xs text-warm-gray-600">Day Streak</div>
              </div>
              <div>
                <div className="text-2xl font-light text-sage-600 mb-1">23</div>
                <div className="text-xs text-warm-gray-600">Reflections</div>
              </div>
              <div>
                <div className="text-2xl font-light text-coral-600 mb-1">47</div>
                <div className="text-xs text-warm-gray-600">Micro Moments</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="mindful-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="w-5 h-5 text-warm-gray-600" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-warm-gray-600" />
                <div>
                  <div className="font-medium text-warm-gray-800">Daily Reminders</div>
                  <div className="text-xs text-warm-gray-600">Get gentle nudges to practice mindfulness</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-warm-gray-600" />
                <div>
                  <div className="font-medium text-warm-gray-800">Dark Mode</div>
                  <div className="text-xs text-warm-gray-600">Switch to dark theme</div>
                </div>
              </div>
              <Switch />
            </div>

            <Separator />

            {/* Quiet Hours */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-warm-gray-600" />
                <div>
                  <div className="font-medium text-warm-gray-800">Quiet Hours</div>
                  <div className="text-xs text-warm-gray-600">Pause notifications during rest time</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="mindful-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="ghost" className="w-full justify-start">
              <Coffee className="w-5 h-5 mr-3 text-warm-gray-600" />
              Reminder Schedule
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Sun className="w-5 h-5 mr-3 text-warm-gray-600" />
              Prompt Categories
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <User className="w-5 h-5 mr-3 text-warm-gray-600" />
              Account Settings
            </Button>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="mindful-card">
          <CardHeader>
            <CardTitle className="text-lg">About Mindful Harbor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-warm-gray-600 leading-relaxed">
              Mindful Harbor is designed to help you cultivate happiness and presence in everyday life through 
              evidence-based mindfulness practices, gentle reminders, and meaningful reflections.
            </p>
            <div className="pt-2 text-xs text-warm-gray-500">
              Version 1.0.0
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
