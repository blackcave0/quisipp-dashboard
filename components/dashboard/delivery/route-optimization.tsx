"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Route, Clock, Fuel, TrendingUp, AlertTriangle, CheckCircle, Zap, Navigation, Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RouteOptimization {
  id: string
  name: string
  status: "active" | "optimizing" | "completed" | "failed"
  algorithm: "shortest_path" | "fastest_time" | "balanced" | "eco_friendly"
  performance: {
    distanceReduction: number
    timeSavings: number
    fuelEfficiency: number
    successRate: number
  }
  routes: {
    id: string
    driver: string
    stops: number
    estimatedTime: number
    distance: number
    status: "pending" | "in_progress" | "completed"
  }[]
}

const mockOptimizations: RouteOptimization[] = [
  {
    id: "opt-1",
    name: "Morning Delivery Routes",
    status: "active",
    algorithm: "balanced",
    performance: {
      distanceReduction: 23.5,
      timeSavings: 18.2,
      fuelEfficiency: 15.8,
      successRate: 94.2,
    },
    routes: [
      {
        id: "route-1",
        driver: "John Smith",
        stops: 12,
        estimatedTime: 180,
        distance: 45.2,
        status: "in_progress",
      },
      {
        id: "route-2",
        driver: "Sarah Johnson",
        stops: 8,
        estimatedTime: 120,
        distance: 32.1,
        status: "completed",
      },
      {
        id: "route-3",
        driver: "Mike Davis",
        stops: 15,
        estimatedTime: 210,
        distance: 52.8,
        status: "pending",
      },
    ],
  },
  {
    id: "opt-2",
    name: "Afternoon Express Routes",
    status: "optimizing",
    algorithm: "fastest_time",
    performance: {
      distanceReduction: 31.2,
      timeSavings: 25.7,
      fuelEfficiency: 12.3,
      successRate: 96.8,
    },
    routes: [
      {
        id: "route-4",
        driver: "Lisa Wilson",
        stops: 6,
        estimatedTime: 90,
        distance: 28.5,
        status: "pending",
      },
      {
        id: "route-5",
        driver: "Tom Brown",
        stops: 9,
        estimatedTime: 135,
        distance: 38.7,
        status: "pending",
      },
    ],
  },
]

export function RouteOptimization() {
  const [optimizations, setOptimizations] = useState<RouteOptimization[]>(mockOptimizations)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("balanced")
  const [autoOptimization, setAutoOptimization] = useState(true)
  const [trafficIntegration, setTrafficIntegration] = useState(true)
  const [ecoFriendly, setEcoFriendly] = useState(false)
  const { toast } = useToast()

  const handleOptimizeRoutes = () => {
    toast({
      title: "Route Optimization Started",
      description: "AI is analyzing current routes and traffic patterns...",
    })

    // Simulate optimization process
    setTimeout(() => {
      toast({
        title: "Routes Optimized",
        description: "New optimized routes have been generated successfully.",
      })
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "optimizing":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRouteStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalRoutes = optimizations.reduce((sum, opt) => sum + opt.routes.length, 0)
  const activeRoutes = optimizations.reduce(
    (sum, opt) => sum + opt.routes.filter((route) => route.status === "in_progress").length,
    0,
  )
  const avgTimeSavings = Math.round(
    optimizations.reduce((sum, opt) => sum + opt.performance.timeSavings, 0) / optimizations.length,
  )
  const avgDistanceReduction = Math.round(
    optimizations.reduce((sum, opt) => sum + opt.performance.distanceReduction, 0) / optimizations.length,
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Route Optimization</h2>
          <p className="text-gray-600">AI-powered route optimization for maximum efficiency</p>
        </div>
        <Button onClick={handleOptimizeRoutes}>
          <Zap className="h-4 w-4 mr-2" />
          Optimize Routes
        </Button>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRoutes}</div>
            <p className="text-xs text-muted-foreground">{totalRoutes} total routes today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Savings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTimeSavings}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+5.2%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distance Reduction</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDistanceReduction}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+3.8%</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+2.1%</span> savings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Settings</CardTitle>
          <CardDescription>Configure AI optimization parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Optimization Algorithm</label>
                <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shortest_path">Shortest Path</SelectItem>
                    <SelectItem value="fastest_time">Fastest Time</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="eco_friendly">Eco-Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-optimization</h4>
                    <p className="text-sm text-gray-600">Automatically optimize routes every hour</p>
                  </div>
                  <Switch checked={autoOptimization} onCheckedChange={setAutoOptimization} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Traffic integration</h4>
                    <p className="text-sm text-gray-600">Consider real-time traffic data</p>
                  </div>
                  <Switch checked={trafficIntegration} onCheckedChange={setTrafficIntegration} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Eco-friendly routing</h4>
                    <p className="text-sm text-gray-600">Prioritize fuel-efficient routes</p>
                  </div>
                  <Switch checked={ecoFriendly} onCheckedChange={setEcoFriendly} />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Performance Insights</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Route Efficiency</span>
                    <span>87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Driver Utilization</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Customer Satisfaction</span>
                    <span>94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Optimizations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Optimizations</h3>
        {optimizations.map((optimization) => (
          <Card key={optimization.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{optimization.name}</CardTitle>
                  <CardDescription>
                    Algorithm: {optimization.algorithm.replace("_", " ")} •{optimization.routes.length} routes
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(optimization.status)}>{optimization.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{optimization.performance.distanceReduction}%</div>
                  <p className="text-sm text-gray-600">Distance Reduction</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{optimization.performance.timeSavings}%</div>
                  <p className="text-sm text-gray-600">Time Savings</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{optimization.performance.fuelEfficiency}%</div>
                  <p className="text-sm text-gray-600">Fuel Efficiency</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{optimization.performance.successRate}%</div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Routes</h4>
                {optimization.routes.map((route) => (
                  <div key={route.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium">{route.driver}</div>
                        <div className="text-sm text-gray-600">
                          {route.stops} stops • {route.distance} miles • {Math.round(route.estimatedTime / 60)}h{" "}
                          {route.estimatedTime % 60}m
                        </div>
                      </div>
                    </div>
                    <Badge className={getRouteStatusColor(route.status)}>{route.status.replace("_", " ")}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>Smart suggestions to improve delivery efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Route Consolidation Opportunity</h4>
                <p className="text-sm text-blue-700">
                  Combining routes 3 and 5 could save 15 minutes and reduce distance by 8.2 miles.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Peak Hour Optimization</h4>
                <p className="text-sm text-green-700">
                  Shifting 3 deliveries to off-peak hours could improve overall efficiency by 12%.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-900">Capacity Alert</h4>
                <p className="text-sm text-orange-700">
                  Downtown zone is approaching capacity. Consider adding an additional driver.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
