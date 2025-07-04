"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Package, AlertTriangle, TrendingDown, CheckCircle } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  maxStock: number
  availability: "in_stock" | "low_stock" | "out_of_stock"
  lastUpdated: string
}

const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Organic Bananas",
    category: "Fruits",
    currentStock: 150,
    maxStock: 200,
    availability: "in_stock",
    lastUpdated: "2024-01-17 10:30 AM",
  },
  {
    id: "2",
    name: "Whole Wheat Bread",
    category: "Bakery",
    currentStock: 25,
    maxStock: 100,
    availability: "low_stock",
    lastUpdated: "2024-01-17 09:15 AM",
  },
  {
    id: "3",
    name: "Organic Milk",
    category: "Dairy",
    currentStock: 0,
    maxStock: 80,
    availability: "out_of_stock",
    lastUpdated: "2024-01-17 08:45 AM",
  },
  {
    id: "4",
    name: "Fresh Eggs",
    category: "Dairy",
    currentStock: 89,
    maxStock: 120,
    availability: "in_stock",
    lastUpdated: "2024-01-17 11:00 AM",
  },
  {
    id: "5",
    name: "Chicken Breast",
    category: "Meat",
    currentStock: 45,
    maxStock: 80,
    availability: "in_stock",
    lastUpdated: "2024-01-17 10:45 AM",
  },
]

const categoryStockData = [
  { category: "Fruits", inStock: 85, lowStock: 10, outOfStock: 5 },
  { category: "Dairy", inStock: 70, lowStock: 20, outOfStock: 10 },
  { category: "Meat", inStock: 90, lowStock: 8, outOfStock: 2 },
  { category: "Bakery", inStock: 60, lowStock: 30, outOfStock: 10 },
  { category: "Beverages", inStock: 95, lowStock: 3, outOfStock: 2 },
]

export function InventoryMonitor() {
  const getStockPercentage = (current: number, max: number) => {
    return (current / max) * 100
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "in_stock":
        return "default"
      case "low_stock":
        return "destructive"
      case "out_of_stock":
        return "secondary"
      default:
        return "default"
    }
  }

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case "in_stock":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "low_stock":
        return <TrendingDown className="h-4 w-4 text-orange-500" />
      case "out_of_stock":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const inStockCount = mockInventory.filter((item) => item.availability === "in_stock").length
  const lowStockCount = mockInventory.filter((item) => item.availability === "low_stock").length
  const outOfStockCount = mockInventory.filter((item) => item.availability === "out_of_stock").length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Inventory Monitor</h2>
        <p className="text-gray-600">Real-time inventory levels and availability</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockInventory.length}</div>
            <p className="text-xs text-muted-foreground">Monitored products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{inStockCount}</div>
            <p className="text-xs text-muted-foreground">Available items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">Unavailable</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Levels by Category</CardTitle>
            <CardDescription>Inventory distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryStockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="inStock" stackId="a" fill="#22c55e" name="In Stock" />
                <Bar dataKey="lowStock" stackId="a" fill="#f59e0b" name="Low Stock" />
                <Bar dataKey="outOfStock" stackId="a" fill="#ef4444" name="Out of Stock" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-time Stock Status</CardTitle>
            <CardDescription>Current inventory levels and last updated times</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.currentStock}</span>
                          <span className="text-gray-500">/ {item.maxStock}</span>
                        </div>
                        <Progress value={getStockPercentage(item.currentStock, item.maxStock)} className="w-20" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getAvailabilityIcon(item.availability)}
                        <Badge variant={getAvailabilityColor(item.availability) as any}>
                          {item.availability.replace("_", " ")}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{item.lastUpdated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
