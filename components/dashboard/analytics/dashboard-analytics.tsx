"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import {
  Download,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"

// Sample data for analytics
const productSalesData = [
  { date: "2024-01-01", sales: 1200, orders: 45, revenue: 3600 },
  { date: "2024-01-02", sales: 1800, orders: 67, revenue: 5400 },
  { date: "2024-01-03", sales: 1500, orders: 52, revenue: 4500 },
  { date: "2024-01-04", sales: 2200, orders: 78, revenue: 6600 },
  { date: "2024-01-05", sales: 1900, orders: 63, revenue: 5700 },
  { date: "2024-01-06", sales: 2500, orders: 89, revenue: 7500 },
  { date: "2024-01-07", sales: 2100, orders: 71, revenue: 6300 },
]

const bestSellingProducts = [
  { name: "Organic Bananas", value: 25, sales: 1250, color: "#8884d8" },
  { name: "Whole Wheat Bread", value: 20, sales: 890, color: "#82ca9d" },
  { name: "Fresh Eggs", value: 18, sales: 756, color: "#ffc658" },
  { name: "Organic Milk", value: 15, sales: 634, color: "#ff7300" },
  { name: "Chicken Breast", value: 12, sales: 523, color: "#00ff00" },
  { name: "Others", value: 10, sales: 400, color: "#ff0000" },
]

const categorySalesData = [
  { category: "Fruits", sales: 35000, percentage: 35, color: "#8884d8" },
  { category: "Dairy", sales: 25000, percentage: 25, color: "#82ca9d" },
  { category: "Meat", sales: 20000, percentage: 20, color: "#ffc658" },
  { category: "Bakery", sales: 15000, percentage: 15, color: "#ff7300" },
  { category: "Beverages", sales: 5000, percentage: 5, color: "#00ff00" },
]

const inventoryTrendData = [
  { date: "Week 1", stockIn: 500, stockOut: 320, netStock: 180 },
  { date: "Week 2", stockIn: 650, stockOut: 480, netStock: 170 },
  { date: "Week 3", stockIn: 720, stockOut: 590, netStock: 130 },
  { date: "Week 4", stockIn: 580, stockOut: 420, netStock: 160 },
  { date: "Week 5", stockIn: 800, stockOut: 650, netStock: 150 },
  { date: "Week 6", stockIn: 750, stockOut: 580, netStock: 170 },
]

const orderTrackingData = {
  totalOrders: 1287,
  pending: 45,
  processing: 123,
  shipped: 89,
  delivered: 1020,
  cancelled: 10,
  fulfillmentRate: 94.2,
  lateOrders: 23,
  avgDeliveryTime: 2.3,
}

const revenueByBusinessOwner = [
  { name: "John's Store", revenue: 45000, orders: 234, products: 45 },
  { name: "Mary's Market", revenue: 38000, orders: 198, products: 38 },
  { name: "Bob's Grocery", revenue: 32000, orders: 167, products: 42 },
  { name: "Lisa's Shop", revenue: 28000, orders: 145, products: 35 },
  { name: "Tom's Store", revenue: 22000, orders: 123, products: 28 },
]

const revenueByCategory = [
  { category: "Fruits", revenue: 45000, growth: 12.5 },
  { category: "Dairy", revenue: 38000, growth: 8.3 },
  { category: "Meat", revenue: 35000, growth: 15.7 },
  { category: "Bakery", revenue: 28000, growth: -2.1 },
  { category: "Beverages", revenue: 18000, growth: 22.4 },
]

interface DashboardAnalyticsProps {
  userRole?: "admin" | "business_owner"
}

export function DashboardAnalytics({ userRole }: DashboardAnalyticsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [timeRange, setTimeRange] = useState("7days")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  const currentUserRole = userRole || user?.role || "business_owner"

  const handleExportReport = (format: "pdf" | "csv") => {
    toast({
      title: `Exporting ${format.toUpperCase()} Report`,
      description: "Your report will be downloaded shortly...",
    })

    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${format.toUpperCase()} report has been downloaded successfully.`,
      })
    }, 2000)
  }

  const getPermissionBasedData = () => {
    if (currentUserRole === "admin") {
      return {
        showAllBusinessOwners: true,
        showSystemMetrics: true,
        showUserManagement: true,
        canExportAllData: true,
      }
    } else {
      return {
        showAllBusinessOwners: false,
        showSystemMetrics: false,
        showUserManagement: false,
        canExportAllData: false,
      }
    }
  }

  const permissions = getPermissionBasedData()

  return (
    <div className="space-y-6">
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold">
            {currentUserRole === "admin" ? "System Analytics" : "My Business Analytics"}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {currentUserRole === "admin"
              ? "Comprehensive system-wide analytics and insights"
              : "Your business performance and insights"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2 sm:gap-3">
            <Button variant="outline" onClick={() => handleExportReport("pdf")} className="flex-1 sm:flex-none">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
            <Button variant="outline" onClick={() => handleExportReport("csv")} className="flex-1 sm:flex-none">
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">CSV</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentUserRole === "admin" ? "165,000" : "45,000"}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12.5%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUserRole === "admin" ? "1,287" : "234"}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8.2%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUserRole === "admin" ? "188" : "45"}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+3.8%</span> from last period
            </p>
          </CardContent>
        </Card>

        {permissions.showSystemMetrics && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Business Owners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+2</span> new this month
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          {permissions.showSystemMetrics && <TabsTrigger value="system">System</TabsTrigger>}
        </TabsList>

        {/* Sales Analytics Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Sales Trend</CardTitle>
                <CardDescription>Daily sales performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={productSalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value, name) => [
                        value,
                        name === "sales" ? "Sales" : name === "orders" ? "Orders" : "Revenue ($)",
                      ]}
                    />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} name="Sales" />
                    <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} name="Orders" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={productSalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value) => [`$${value}`, "Revenue"]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Analytics Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Best-selling Products</CardTitle>
                <CardDescription>Top performing products by sales volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bestSellingProducts}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} (${value}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {bestSellingProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category-wise Sales Distribution</CardTitle>
                <CardDescription>Sales performance by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categorySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                    <Bar dataKey="sales" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Analytics Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Trend</CardTitle>
              <CardDescription>Stock in vs. stock out over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={inventoryTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stockIn" stackId="a" fill="#22c55e" name="Stock In" />
                  <Bar dataKey="stockOut" stackId="a" fill="#ef4444" name="Stock Out" />
                  <Line type="monotone" dataKey="netStock" stroke="#8884d8" strokeWidth={2} name="Net Stock" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Analytics Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fulfillment Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{orderTrackingData.fulfillmentRate}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Late Orders</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">{orderTrackingData.lateOrders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">{orderTrackingData.avgDeliveryTime} days</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processing</CardTitle>
                <Package className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-500">{orderTrackingData.processing}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>
              <CardDescription>Current order statuses across the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{orderTrackingData.pending}</div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{orderTrackingData.processing}</div>
                  <Badge variant="default">Processing</Badge>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">{orderTrackingData.shipped}</div>
                  <Badge variant="default">Shipped</Badge>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{orderTrackingData.delivered}</div>
                  <Badge variant="default">Delivered</Badge>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{orderTrackingData.cancelled}</div>
                  <Badge variant="destructive">Cancelled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Analytics Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {permissions.showAllBusinessOwners && (
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Business Owner</CardTitle>
                  <CardDescription>Top performing business owners</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueByBusinessOwner.map((owner, index) => (
                      <div key={owner.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{owner.name}</div>
                            <div className="text-sm text-gray-500">
                              {owner.orders} orders • {owner.products} products
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${owner.revenue.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>Category performance with growth rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueByCategory.map((category) => (
                    <div key={category.category} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{category.category}</div>
                        <div className={`text-sm ${category.growth >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {category.growth >= 0 ? "+" : ""}
                          {category.growth.toFixed(1)}% growth
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${category.revenue.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Analytics Tab (Admin Only) */}
        {permissions.showSystemMetrics && (
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Overall system performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Server Uptime</span>
                      <Badge variant="default">99.9%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Database Performance</span>
                      <Badge variant="default">Excellent</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>API Response Time</span>
                      <Badge variant="default">120ms</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>Recent user engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Active Users (24h)</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Registrations</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Session Duration</span>
                      <span className="font-medium">24m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Insights</CardTitle>
                  <CardDescription>Key system metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Products</span>
                      <span className="font-medium">2,847</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Orders</span>
                      <span className="font-medium">15,234</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue (MTD)</span>
                      <span className="font-medium">$234,567</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
