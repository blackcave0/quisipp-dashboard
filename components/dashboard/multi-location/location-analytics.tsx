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
  ComposedChart,
  Area,
  AreaChart,
} from "recharts"
import { Download, MapPin, DollarSign, Users, ShoppingCart } from "lucide-react"

// Sample data for location analytics
const locationPerformanceData = [
  { location: "Downtown", revenue: 375000, orders: 1250, customers: 3500, efficiency: 95 },
  { location: "Westside", revenue: 255000, orders: 850, customers: 2200, efficiency: 88 },
  { location: "Express", revenue: 165000, orders: 650, customers: 1800, efficiency: 92 },
]

const monthlyComparisonData = [
  { month: "Jan", downtown: 320000, westside: 220000, express: 140000 },
  { month: "Feb", downtown: 340000, westside: 235000, express: 150000 },
  { month: "Mar", downtown: 360000, westside: 245000, express: 155000 },
  { month: "Apr", downtown: 355000, westside: 250000, express: 160000 },
  { month: "May", downtown: 370000, westside: 252000, express: 162000 },
  { month: "Jun", downtown: 375000, westside: 255000, express: 165000 },
]

const categoryPerformanceByLocation = [
  { category: "Fruits", downtown: 45000, westside: 32000, express: 18000 },
  { category: "Dairy", downtown: 38000, westside: 28000, express: 15000 },
  { category: "Meat", downtown: 42000, westside: 25000, express: 12000 },
  { category: "Bakery", downtown: 35000, westside: 22000, express: 10000 },
  { category: "Beverages", downtown: 25000, westside: 18000, express: 8000 },
]

const hourlyTrafficData = [
  { hour: "6AM", downtown: 45, westside: 25, express: 35 },
  { hour: "7AM", downtown: 120, westside: 80, express: 95 },
  { hour: "8AM", downtown: 180, westside: 120, express: 140 },
  { hour: "9AM", downtown: 150, westside: 100, express: 110 },
  { hour: "10AM", downtown: 200, westside: 140, express: 120 },
  { hour: "11AM", downtown: 250, westside: 180, express: 150 },
  { hour: "12PM", downtown: 320, westside: 220, express: 180 },
  { hour: "1PM", downtown: 280, westside: 200, express: 160 },
  { hour: "2PM", downtown: 220, westside: 160, express: 130 },
  { hour: "3PM", downtown: 180, westside: 140, express: 110 },
  { hour: "4PM", downtown: 200, westside: 150, express: 120 },
  { hour: "5PM", downtown: 280, westside: 200, express: 160 },
  { hour: "6PM", downtown: 350, westside: 250, express: 200 },
  { hour: "7PM", downtown: 300, westside: 220, express: 180 },
  { hour: "8PM", downtown: 200, westside: 150, express: 120 },
  { hour: "9PM", downtown: 120, westside: 90, express: 70 },
]

const employeeProductivityData = [
  { location: "Downtown", salesPerEmployee: 8333, ordersPerEmployee: 28, hoursWorked: 1800 },
  { location: "Westside", salesPerEmployee: 10200, ordersPerEmployee: 34, hoursWorked: 1600 },
  { location: "Express", salesPerEmployee: 13750, ordersPerEmployee: 54, hoursWorked: 1200 },
]

const inventoryTurnoverData = [
  { location: "Downtown", turnover: 12.5, daysOnHand: 29, stockouts: 3 },
  { location: "Westside", turnover: 10.8, daysOnHand: 34, stockouts: 5 },
  { location: "Express", turnover: 15.2, daysOnHand: 24, stockouts: 2 },
]

export function LocationAnalytics() {
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedMetric, setSelectedMetric] = useState("revenue")
  const [comparisonType, setComparisonType] = useState("revenue")

  const handleExportReport = () => {
    // Simulate export functionality
    console.log("Exporting location analytics report...")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Location Analytics</h2>
          <p className="text-gray-600">Compare performance across all store locations</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Network Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$795,000</div>
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
            <div className="text-2xl font-bold">2,750</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8.2%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7,500</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+15.3%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Revenue/Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$265,000</div>
            <p className="text-xs text-muted-foreground">Monthly average</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Performance Overview Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Location Performance Overview</CardTitle>
                <CardDescription>Key metrics comparison across all locations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={locationPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [value.toLocaleString(), name]} />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operational Efficiency</CardTitle>
                <CardDescription>Efficiency scores by location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locationPerformanceData.map((location) => (
                    <div key={location.location} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{location.location} Store</div>
                        <div className="text-sm text-gray-500">
                          {location.orders} orders • {location.customers} customers
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{location.efficiency}%</div>
                        <Badge variant={location.efficiency >= 90 ? "default" : "secondary"}>
                          {location.efficiency >= 90 ? "Excellent" : "Good"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Distribution</CardTitle>
              <CardDescription>Revenue contribution by location</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={locationPerformanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ location, revenue }) =>
                      `${location}: $${(revenue / 1000).toFixed(0)}K (${(
                        (revenue / locationPerformanceData.reduce((sum, item) => sum + item.revenue, 0)) * 100
                      ).toFixed(1)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {locationPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#8884d8", "#82ca9d", "#ffc658"][index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Monthly Revenue Comparison</h3>
            <Select value={comparisonType} onValueChange={setComparisonType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="customers">Customers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Location Performance Trends</CardTitle>
              <CardDescription>Monthly performance comparison across locations</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                  <Line type="monotone" dataKey="downtown" stroke="#8884d8" strokeWidth={2} name="Downtown" />
                  <Line type="monotone" dataKey="westside" stroke="#82ca9d" strokeWidth={2} name="Westside" />
                  <Line type="monotone" dataKey="express" stroke="#ffc658" strokeWidth={2} name="Express" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {locationPerformanceData.map((location, index) => (
              <Card key={location.location}>
                <CardHeader>
                  <CardTitle className="text-lg">{location.location} Store</CardTitle>
                  <CardDescription>Performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-2xl font-bold">${location.revenue.toLocaleString()}</div>
                      <p className="text-sm text-gray-500">Monthly Revenue</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">{location.orders}</div>
                        <p className="text-gray-500">Orders</p>
                      </div>
                      <div>
                        <div className="font-medium">{location.customers}</div>
                        <p className="text-gray-500">Customers</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Efficiency</span>
                        <span>{location.efficiency}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${location.efficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Traffic Patterns Tab */}
        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Traffic Patterns</CardTitle>
              <CardDescription>Customer traffic throughout the day by location</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={hourlyTrafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="downtown"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="Downtown"
                  />
                  <Area
                    type="monotone"
                    dataKey="westside"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    name="Westside"
                  />
                  <Area type="monotone" dataKey="express" stackId="1" stroke="#ffc658" fill="#ffc658" name="Express" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Peak Hours</CardTitle>
                <CardDescription>Busiest times by location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium">Downtown</div>
                    <div className="text-sm text-gray-500">6PM - 7PM (350 customers)</div>
                  </div>
                  <div>
                    <div className="font-medium">Westside</div>
                    <div className="text-sm text-gray-500">6PM - 7PM (250 customers)</div>
                  </div>
                  <div>
                    <div className="font-medium">Express</div>
                    <div className="text-sm text-gray-500">6PM - 7PM (200 customers)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Off-Peak Hours</CardTitle>
                <CardDescription>Quietest times by location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium">Downtown</div>
                    <div className="text-sm text-gray-500">6AM - 7AM (45 customers)</div>
                  </div>
                  <div>
                    <div className="font-medium">Westside</div>
                    <div className="text-sm text-gray-500">6AM - 7AM (25 customers)</div>
                  </div>
                  <div>
                    <div className="font-medium">Express</div>
                    <div className="text-sm text-gray-500">9PM - 10PM (70 customers)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Daily Traffic</CardTitle>
                <CardDescription>Total daily customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium">Downtown</div>
                    <div className="text-sm text-gray-500">2,850 customers/day</div>
                  </div>
                  <div>
                    <div className="font-medium">Westside</div>
                    <div className="text-sm text-gray-500">2,045 customers/day</div>
                  </div>
                  <div>
                    <div className="font-medium">Express</div>
                    <div className="text-sm text-gray-500">1,635 customers/day</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Employee Productivity Tab */}
        <TabsContent value="productivity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Productivity Metrics</CardTitle>
              <CardDescription>Performance metrics per employee by location</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={employeeProductivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="salesPerEmployee" fill="#8884d8" name="Sales per Employee ($)" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="ordersPerEmployee"
                    stroke="#ff7300"
                    strokeWidth={2}
                    name="Orders per Employee"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {employeeProductivityData.map((location) => (
              <Card key={location.location}>
                <CardHeader>
                  <CardTitle>{location.location} Store</CardTitle>
                  <CardDescription>Employee productivity metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold">${location.salesPerEmployee.toLocaleString()}</div>
                      <p className="text-sm text-gray-500">Sales per Employee</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">{location.ordersPerEmployee}</div>
                        <p className="text-gray-500">Orders/Employee</p>
                      </div>
                      <div>
                        <div className="font-medium">{location.hoursWorked}</div>
                        <p className="text-gray-500">Hours Worked</p>
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">
                        ${(location.salesPerEmployee / location.hoursWorked).toFixed(2)}
                      </div>
                      <p className="text-sm text-gray-500">Revenue per Hour</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Inventory Management Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Turnover Analysis</CardTitle>
              <CardDescription>Inventory efficiency metrics by location</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inventoryTurnoverData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="turnover" fill="#8884d8" name="Turnover Rate" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {inventoryTurnoverData.map((location) => (
              <Card key={location.location}>
                <CardHeader>
                  <CardTitle>{location.location} Store</CardTitle>
                  <CardDescription>Inventory performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold">{location.turnover}x</div>
                      <p className="text-sm text-gray-500">Annual Turnover Rate</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">{location.daysOnHand}</div>
                        <p className="text-gray-500">Days on Hand</p>
                      </div>
                      <div>
                        <div className="font-medium">{location.stockouts}</div>
                        <p className="text-gray-500">Stockouts</p>
                      </div>
                    </div>
                    <Badge variant={location.turnover >= 12 ? "default" : "secondary"}>
                      {location.turnover >= 12 ? "Excellent" : "Good"} Performance
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Category Performance Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance by Location</CardTitle>
              <CardDescription>Revenue breakdown by product category across locations</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryPerformanceByLocation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="downtown" fill="#8884d8" name="Downtown" />
                  <Bar dataKey="westside" fill="#82ca9d" name="Westside" />
                  <Bar dataKey="express" fill="#ffc658" name="Express" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Category - Downtown</CardTitle>
                <CardDescription>Best performing category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">Fruits</div>
                  <div className="text-lg text-green-600">$45,000</div>
                  <p className="text-sm text-gray-500">28% of total revenue</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Category - Westside</CardTitle>
                <CardDescription>Best performing category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">Fruits</div>
                  <div className="text-lg text-green-600">$32,000</div>
                  <p className="text-sm text-gray-500">25% of total revenue</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Category - Express</CardTitle>
                <CardDescription>Best performing category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">Fruits</div>
                  <div className="text-lg text-green-600">$18,000</div>
                  <p className="text-sm text-gray-500">27% of total revenue</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
