"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { BusinessOwnerDashboard } from "@/components/dashboard/business-owner-dashboard"
import { NotificationSystem } from "@/components/dashboard/notifications/notification-system"
import { Button } from "@/components/ui/button"
import { LogOut, Bell } from "lucide-react"
import { useState } from "react"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.role === "admin" ? "Admin Dashboard" : "Business Owner Dashboard"}
              </h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button variant="outline" size="sm" onClick={() => setShowNotifications(!showNotifications)}>
                  <Bell className="h-4 w-4" />
                </Button>
                {showNotifications && (
                  <div className="absolute right-0 top-12 z-50">
                    <NotificationSystem />
                  </div>
                )}
              </div>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.role === "admin" ? <AdminDashboard /> : <BusinessOwnerDashboard />}
      </main>
    </div>
  )
}
