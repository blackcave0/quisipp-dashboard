"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Package, TrendingDown } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  lastRestocked: string
  status: "in_stock" | "low_stock" | "out_of_stock"
}

const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Organic Bananas",
    category: "Fruits",
    currentStock: 150,
    minStock: 50,
    maxStock: 200,
    lastRestocked: "2024-01-15",
    status: "in_stock",
  },
  {
    id: "2",
    name: "Whole Wheat Bread",
    category: "Bakery",
    currentStock: 25,
    minStock: 30,
    maxStock: 100,
    lastRestocked: "2024-01-14",
    status: "low_stock",
  },
  {
    id: "3",
    name: "Organic Milk",
    category: "Dairy",
    currentStock: 0,
    minStock: 20,
    maxStock: 80,
    lastRestocked: "2024-01-10",
    status: "out_of_stock",
  },
]

export function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [filter, setFilter] = useState<"all" | "low_stock" | "out_of_stock">("all")

  const filteredInventory = inventory.filter((item) => {
    if (filter === "all") return true
    return item.status === filter
  })

  const getStockPercentage = (current: number, max: number) => {
    return (current / max) * 100
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const updateStock = (id: string, newStock: number) => {
    setInventory(
      inventory.map((item) => {
        if (item.id === id) {
          let status: "in_stock" | "low_stock" | "out_of_stock" = "in_stock"
          if (newStock === 0) status = "out_of_stock"
          else if (newStock <= item.minStock) status = "low_stock"

          return { ...item, currentStock: newStock, status }
        }
        return item
      }),
    )
  }

  const lowStockCount = inventory.filter((item) => item.status === "low_stock").length
  const outOfStockCount = inventory.filter((item) => item.status === "out_of_stock").length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <p className="text-gray-600">Monitor and manage your stock levels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Items below minimum stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">Items requiring immediate restock</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Current stock levels and alerts</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                All Items
              </Button>
              <Button
                variant={filter === "low_stock" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("low_stock")}
              >
                Low Stock
              </Button>
              <Button
                variant={filter === "out_of_stock" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("out_of_stock")}
              >
                Out of Stock
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={item.currentStock}
                        onChange={(e) => updateStock(item.id, Number.parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-500">/ {item.maxStock}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={getStockPercentage(item.currentStock, item.maxStock)} className="w-20" />
                      <div className="text-xs text-gray-500">
                        {Math.round(getStockPercentage(item.currentStock, item.maxStock))}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(item.status) as any}>{item.status.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell>{item.lastRestocked}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      Restock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
