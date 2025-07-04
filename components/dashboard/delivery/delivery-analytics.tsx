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
import { TrendingUp, Clock, MapPin, Star, DollarSign, Package, Users, Download, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Sample data for delivery analytics
const deliveryVolumeData = [
  { date: "2024-01-01", orders: 45, completed: 42, cancelled: 3 },
  { date: "2024-01-02", orders: 67, completed: 63, cancelled: 4 },
  { date: "2024-01-03", orders: 52, completed: 49, cancelled: 3 },
  { date: "2024-01-04", orders: 78, completed: 74, cancelled: 4 },
  { date: "2024-01-05", orders: 63, completed: 60, cancelled: 3 },
  { date: "2024-01-06", orders: 89, completed: 85, cancelled: 4 },
  { date: "2024-01-07", orders: 71, completed: 68, cancelled: 3 },
]

const deliveryTimeData = [
  { zone: "Downtown", avgTime: 28, target: 30, satisfaction: 4.7 },
  { zone: "Westside", avgTime: 45, target: 50, satisfaction: 4.5 },
  { zone: "Brooklyn", avgTime: 52, target: 60, satisfaction: 4.3 },
  { zone: "Queens", avgTime: 38, target: 45, satisfaction: 4.6 },
  { zone: "Bronx", avgTime: 42, target: 50, satisfaction: 4.4 },
]

const zonePerformanceData = [
  { name: "Downtown", value: 35, orders: 1250, revenue: 15000, color: "#8884d8" },
  { name: "Westside", value: 25, orders: 890, revenue: 11000, color: "#82ca9d" },
  { name: "Brooklyn", value: 20, orders: 756, revenue: 9500, color: "#ffc658" },
  { name: "Queens", value: 12, orders: 634, revenue: 7800, color: "#ff7300" },
  { name: "Bronx", value: 8, orders: 523, revenue: 6200, color: "#00ff00" },
]

const driverPerformanceData = [
  { name: "John Smith", deliveries: 156, rating: 4.8, efficiency: 92, onTime: 94 },
  { name: "Sarah Johnson", deliveries: 142, rating: 4.7, efficiency: 89, onTime: 91 },
  { name: "Mike Davis", deliveries: 138, rating: 4.6, efficiency: 87, onTime: 89 },
  { name: "Lisa Wilson", deliveries: 134, rating: 4.9, efficiency: 95, onTime: 96 },
  { name: "Tom Brown", deliveries: 128, rating: 4.5, efficiency: 85, onTime: 87 },
]

const customerSatisfactionData = [
  { date: "Week 1", rating: 4.2, complaints: 12, compliments: 45 },
  { date: "Week 2", rating: 4.4, complaints: 8, compliments: 52 },
  { date: "Week 3", rating: 4.6, complaints: 6, compliments: 58 },
  { date: "Week 4", rating: 4.5, complaints: 9, compliments: 48 },
  { date: "Week 5", rating: 4.7, complaints: 5, compliments: 62 },
  { date: "Week 6", rating: 4.8, complaints: 4, compliments: 68 },
]

const costAnalysisData = [
  { category: "Fuel", cost: 2400, percentage: 35, trend: 5.2 },
  { category: "Driver Wages", cost: 3200, percentage: 47, trend: 2.1 },
  { category: "Vehicle Maintenance", cost: 800, percentage: 12, trend: -1.5 },
  { category: "Insurance", cost: 400, percentage: 6, trend: 0.8 },
]

export function DeliveryAnalytics() {
  const [timeRange, setTimeRange] = useState("7days")
  const [selectedZone, setSelectedZone] = useState("all")
  const { toast } = useToast()

  const handleExportReport = (format: "pdf" | "csv") => {
    toast({
      title: `Exporting ${format.toUpperCase()} Report`,
      description: "Your delivery analytics report will be downloaded shortly...",
    })

    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${format.toUpperCase()} report has been downloaded successfully.`,
      })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Delivery Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into delivery performance and customer satisfaction</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExportReport("pdf")}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExportReport("csv")}>
            <FileText className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,287</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12.5%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36min</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">-3min</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6/5</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+0.2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$49,500</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+18.3%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="zones">Zone Performance</TabsTrigger>
          <TabsTrigger value="drivers">Driver Analytics</TabsTrigger>
          <TabsTrigger value="satisfaction">Customer Satisfaction</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Volume Trend</CardTitle>
                <CardDescription>Daily delivery orders and completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={deliveryVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value, name) => [
                        value,
                        name === "orders" ? "Orders" : name === "completed" ? "Completed" : "Cancelled",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stackId="2"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zone Distribution</CardTitle>
                <CardDescription>Delivery orders by zone</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={zonePerformanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} (${value}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {zonePerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Zone Performance Tab */}
        <TabsContent value="zones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Zone Performance Comparison</CardTitle>
              <CardDescription>Delivery time vs target by zone</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={deliveryTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="zone" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value}${name === "satisfaction" ? "/5" : " min"}`,
                      name === "avgTime" ? "Avg Time" : name === "target" ? "Target" : "Satisfaction",
                    ]}
                  />
                  <Bar dataKey="avgTime" fill="#8884d8" name="Avg Time" />
                  <Bar dataKey="target" fill="#82ca9d" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {zonePerformanceData.map((zone) => (
              <Card key={zone.name}>
                <CardHeader>
                  <CardTitle className="text-base">{zone.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Orders</span>
                      <span className="text-sm font-medium">{zone.orders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Revenue</span>
                      <span className="text-sm font-medium">${zone.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Market Share</span>
                      <span className="text-sm font-medium">{zone.value}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Driver Analytics Tab */}
        <TabsContent value="drivers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Driver Performance</CardTitle>
              <CardDescription>Top performing delivery drivers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {driverPerformanceData.map((driver, index) => (
                  <div key={driver.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{driver.name}</div>
                        <div className="text-sm text-gray-500">{driver.deliveries} deliveries</div>
                      </div>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{driver.rating}/5</div>
                        <div className="text-gray-500">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{driver.efficiency}%</div>
                        <div className="text-gray-500">Efficiency</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{driver.onTime}%</div>
                        <div className="text-gray-500">On Time</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Satisfaction Tab */}
        <TabsContent value="satisfaction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Satisfaction Trend</CardTitle>
              <CardDescription>Weekly satisfaction ratings and feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={customerSatisfactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[3.5, 5]} />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "rating" ? `${value}/5` : value,
                      name === "rating" ? "Rating" : name === "complaints" ? "Complaints" : "Compliments",
                    ]}
                  />
                  <Line type="monotone" dataKey="rating" stroke="#8884d8" strokeWidth={3} name="Rating" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Rating</span>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.6/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Reviews</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Positive Feedback</span>
                    <span className="font-medium text-green-600">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Response Rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Fast delivery</span>
                    <Badge variant="outline">+156</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Friendly driver</span>
                    <Badge variant="outline">+142</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Good packaging</span>
                    <Badge variant="outline">+98</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Late delivery</span>
                    <Badge variant="destructive">-23</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Damaged items</span>
                    <Badge variant="destructive">-12</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cost Analysis Tab */}
        <TabsContent value="costs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Cost Breakdown</CardTitle>
              <CardDescription>Monthly delivery costs by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costAnalysisData.map((item) => (
                  <div key={item.category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{item.category}</div>
                      <div className="text-sm text-gray-500">{item.percentage}% of total costs</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${item.cost.toLocaleString()}</div>
                      <div className={`text-sm ${item.trend >= 0 ? "text-red-500" : "text-green-500"}`}>
                        {item.trend >= 0 ? "+" : ""}
                        {item.trend}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost per Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$5.32</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">-$0.18</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Monthly Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$6,800</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500">+2.3%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">+3.2%</span> improvement
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>Smart recommendations based on delivery data analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Peak Hour Optimization</h4>
                    <p className="text-sm text-blue-700">
                      Delivery demand peaks at 6-8 PM. Adding 2 more drivers during this window could reduce average
                      delivery time by 12 minutes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Zone Expansion Opportunity</h4>
                    <p className="text-sm text-green-700">
                      High demand detected in adjacent areas. Expanding Brooklyn zone by 2 miles could increase revenue
                      by $8,500/month.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-900">Customer Retention</h4>
                    <p className="text-sm text-purple-700">
                      Customers with delivery times under 35 minutes have 23% higher retention rates. Focus on
                      optimizing slower zones.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-900">Cost Reduction</h4>
                    <p className="text-sm text-orange-700">
                      Implementing eco-friendly routes could reduce fuel costs by 15% while maintaining delivery times.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Predictive Analytics</CardTitle>
              <CardDescription>Forecasting and trend predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Next Week Forecast</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Expected Orders</span>
                      <span className="text-sm font-medium">1,450 (+12.7%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Peak Day</span>
                      <span className="text-sm font-medium">Friday</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Busiest Zone</span>
                      <span className="text-sm font-medium">Downtown</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Recommended Drivers</span>
                      <span className="text-sm font-medium">8 (+1)</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Seasonal Trends</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Holiday Impact</span>
                      <span className="text-sm font-medium">+35% orders</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Weather Sensitivity</span>
                      <span className="text-sm font-medium">High</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Growth Trend</span>
                      <span className="text-sm font-medium text-green-600">+18% YoY</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Capacity Utilization</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
