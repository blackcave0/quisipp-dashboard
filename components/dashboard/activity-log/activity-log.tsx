"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download, User, Package, Edit, Trash2, Plus, Eye } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

interface ActivityLog {
  id: string
  userId: string
  userName: string
  userRole: "admin" | "business_owner"
  action: "create" | "update" | "delete" | "view" | "login" | "logout"
  resource: "product" | "order" | "user" | "inventory" | "system"
  resourceId?: string
  description: string
  timestamp: string
  ipAddress: string
  userAgent: string
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: "1",
    userId: "user-1",
    userName: "John Doe",
    userRole: "business_owner",
    action: "create",
    resource: "product",
    resourceId: "prod-123",
    description: "Created new product: Organic Bananas",
    timestamp: "2024-01-17T10:30:00Z",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: "2",
    userId: "admin-1",
    userName: "Admin User",
    userRole: "admin",
    action: "update",
    resource: "inventory",
    resourceId: "inv-456",
    description: "Updated inventory levels for Whole Wheat Bread",
    timestamp: "2024-01-17T09:15:00Z",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  },
  {
    id: "3",
    userId: "user-2",
    userName: "Jane Smith",
    userRole: "business_owner",
    action: "view",
    resource: "order",
    resourceId: "ord-789",
    description: "Viewed order details for ORD-789",
    timestamp: "2024-01-17T08:45:00Z",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
  },
  {
    id: "4",
    userId: "admin-1",
    userName: "Admin User",
    userRole: "admin",
    action: "delete",
    resource: "product",
    resourceId: "prod-999",
    description: "Deleted discontinued product: Old Brand Milk",
    timestamp: "2024-01-16T16:20:00Z",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: "5",
    userId: "user-3",
    userName: "Bob Johnson",
    userRole: "business_owner",
    action: "login",
    resource: "system",
    description: "User logged into the system",
    timestamp: "2024-01-16T14:10:00Z",
    ipAddress: "192.168.1.103",
    userAgent: "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36",
  },
]

export function ActivityLog() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<ActivityLog[]>(mockActivityLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterResource, setFilterResource] = useState("all")
  const [filterUser, setFilterUser] = useState("all")

  const isAdmin = user?.role === "admin"

  // Filter activities based on user role
  const userFilteredActivities = isAdmin ? activities : activities.filter((activity) => activity.userId === user?.id)

  const filteredActivities = userFilteredActivities.filter((activity) => {
    const matchesSearch =
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.userName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAction = filterAction === "all" || activity.action === filterAction
    const matchesResource = filterResource === "all" || activity.resource === filterResource
    const matchesUser = filterUser === "all" || activity.userId === filterUser

    return matchesSearch && matchesAction && matchesResource && matchesUser
  })

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <Plus className="h-4 w-4 text-green-500" />
      case "update":
        return <Edit className="h-4 w-4 text-blue-500" />
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-500" />
      case "view":
        return <Eye className="h-4 w-4 text-gray-500" />
      case "login":
      case "logout":
        return <User className="h-4 w-4 text-purple-500" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "default"
      case "update":
        return "default"
      case "delete":
        return "destructive"
      case "view":
        return "secondary"
      case "login":
      case "logout":
        return "outline"
      default:
        return "secondary"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const exportLogs = () => {
    const csvContent = [
      ["Timestamp", "User", "Role", "Action", "Resource", "Description", "IP Address"].join(","),
      ...filteredActivities.map((activity) =>
        [
          activity.timestamp,
          activity.userName,
          activity.userRole,
          activity.action,
          activity.resource,
          `"${activity.description}"`,
          activity.ipAddress,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `activity-log-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const uniqueUsers = Array.from(new Set(activities.map((a) => a.userId)))
    .map((userId) => activities.find((a) => a.userId === userId))
    .filter(Boolean) as ActivityLog[]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Activity Log</h2>
          <p className="text-gray-600">
            {isAdmin ? "Track all user actions and system activities" : "Your activity history"}
          </p>
        </div>
        <Button onClick={exportLogs} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Activities</CardTitle>
          <CardDescription>Search and filter activity logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger>
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="view">View</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterResource} onValueChange={setFilterResource}>
              <SelectTrigger>
                <SelectValue placeholder="Resource" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="order">Order</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>

            {isAdmin && (
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger>
                  <SelectValue placeholder="User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user.userId} value={user.userId}>
                      {user.userName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilterAction("all")
                setFilterResource("all")
                setFilterUser("all")
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
          <CardDescription>{filteredActivities.length} activities found</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                {isAdmin && <TableHead>User</TableHead>}
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Description</TableHead>
                {isAdmin && <TableHead>IP Address</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="text-sm">{formatTimestamp(activity.timestamp)}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div>
                        <div className="font-medium">{activity.userName}</div>
                        <Badge variant="outline" className="text-xs">
                          {activity.userRole}
                        </Badge>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(activity.action)}
                      <Badge variant={getActionColor(activity.action) as any}>{activity.action}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{activity.resource}</Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="truncate" title={activity.description}>
                      {activity.description}
                    </div>
                  </TableCell>
                  {isAdmin && <TableCell className="text-sm text-gray-500">{activity.ipAddress}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
