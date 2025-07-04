"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, AlertTriangle, Package, ShoppingCart, TrendingDown, CheckCircle, X, Settings } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  type: "low_stock" | "new_order" | "pending_shipment" | "system" | "revenue"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "high" | "medium" | "low"
  actionRequired?: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "low_stock",
    title: "Low Stock Alert",
    message: "Organic Bananas are running low (5 units remaining)",
    timestamp: "2024-01-17T10:30:00Z",
    read: false,
    priority: "high",
    actionRequired: true,
  },
  {
    id: "2",
    type: "new_order",
    title: "New Order Received",
    message: "Order #ORD-1234 received from John Doe ($45.67)",
    timestamp: "2024-01-17T09:15:00Z",
    read: false,
    priority: "medium",
  },
  {
    id: "3",
    type: "pending_shipment",
    title: "Pending Shipment",
    message: "3 orders are pending shipment for over 24 hours",
    timestamp: "2024-01-17T08:45:00Z",
    read: true,
    priority: "high",
    actionRequired: true,
  },
  {
    id: "4",
    type: "system",
    title: "System Update",
    message: "New features have been added to your dashboard",
    timestamp: "2024-01-16T16:20:00Z",
    read: true,
    priority: "low",
  },
  {
    id: "5",
    type: "revenue",
    title: "Revenue Milestone",
    message: "Congratulations! You've reached $50,000 in monthly revenue",
    timestamp: "2024-01-16T14:10:00Z",
    read: false,
    priority: "medium",
  },
]

export function NotificationSystem() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [showAll, setShowAll] = useState(false)

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new notification
      if (Math.random() > 0.8) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: "new_order",
          title: "New Order Received",
          message: `Order #ORD-${Math.floor(Math.random() * 10000)} received`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: "medium",
        }

        setNotifications((prev) => [newNotification, ...prev])

        toast({
          title: "New Order Received",
          description: newNotification.message,
        })
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [toast])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "low_stock":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "new_order":
        return <ShoppingCart className="h-4 w-4 text-blue-500" />
      case "pending_shipment":
        return <Package className="h-4 w-4 text-red-500" />
      case "system":
        return <Settings className="h-4 w-4 text-gray-500" />
      case "revenue":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const displayNotifications = showAll ? notifications : notifications.slice(0, 5)

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button size="sm" variant="outline" onClick={markAllAsRead}>
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <CardDescription>Stay updated with important alerts and activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {displayNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border rounded-lg transition-colors ${
                  !notification.read ? "bg-blue-50 border-blue-200" : "bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium truncate">{notification.title}</h4>
                        <Badge variant={getPriorityColor(notification.priority) as any} className="text-xs">
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</span>
                        {notification.actionRequired && (
                          <Badge variant="outline" className="text-xs">
                            Action Required
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteNotification(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {notifications.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
              {showAll ? "Show Less" : `Show All (${notifications.length})`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
