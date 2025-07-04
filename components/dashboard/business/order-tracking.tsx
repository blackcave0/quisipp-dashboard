"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react"

interface Order {
  id: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  orderDate: string
  estimatedDelivery?: string
  trackingNumber?: string
  shippingAddress: string
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    items: [
      { name: "Organic Bananas", quantity: 2, price: 2.99 },
      { name: "Whole Wheat Bread", quantity: 1, price: 3.49 },
    ],
    total: 9.47,
    status: "delivered",
    orderDate: "2024-01-15",
    estimatedDelivery: "2024-01-17",
    trackingNumber: "TRK123456789",
    shippingAddress: "123 Main St, Anytown, CA 12345",
  },
  {
    id: "ORD-002",
    items: [
      { name: "Organic Milk", quantity: 1, price: 4.99 },
      { name: "Fresh Eggs", quantity: 1, price: 3.99 },
    ],
    total: 8.98,
    status: "shipped",
    orderDate: "2024-01-16",
    estimatedDelivery: "2024-01-18",
    trackingNumber: "TRK987654321",
    shippingAddress: "456 Oak Ave, Somewhere, CA 54321",
  },
  {
    id: "ORD-003",
    items: [
      { name: "Chicken Breast", quantity: 1, price: 8.99 },
      { name: "Organic Apples", quantity: 1, price: 4.49 },
    ],
    total: 13.48,
    status: "processing",
    orderDate: "2024-01-17",
    estimatedDelivery: "2024-01-19",
    shippingAddress: "789 Pine St, Elsewhere, CA 98765",
  },
]

export function OrderTracking() {
  const [orders] = useState<Order[]>(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "processing":
        return "default"
      case "shipped":
        return "default"
      case "delivered":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Order Tracking</h2>
        <p className="text-gray-600">Track your orders and delivery status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {orders.filter((o) => o.status === "processing").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
            <Truck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {orders.filter((o) => o.status === "shipped").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {orders.filter((o) => o.status === "delivered").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>Track the status of your recent orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Estimated Delivery</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <Badge variant={getStatusColor(order.status) as any}>{order.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.estimatedDelivery || "TBD"}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - {order.id}</DialogTitle>
                          <DialogDescription>Complete order information and tracking details</DialogDescription>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Order Status</h4>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(selectedOrder.status)}
                                  <Badge variant={getStatusColor(selectedOrder.status) as any}>
                                    {selectedOrder.status}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Tracking Number</h4>
                                <p className="text-sm font-mono">
                                  {selectedOrder.trackingNumber || "Not assigned yet"}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Shipping Address</h4>
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-1 text-gray-500" />
                                <p className="text-sm">{selectedOrder.shippingAddress}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Order Items</h4>
                              <div className="space-y-2">
                                {selectedOrder.items.map((item, index) => (
                                  <div key={index} className="flex justify-between items-center py-2 border-b">
                                    <div>
                                      <span className="font-medium">{item.name}</span>
                                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                                    </div>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="border-t pt-2 mt-2 font-medium flex justify-between">
                                <span>Total:</span>
                                <span>${selectedOrder.total.toFixed(2)}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Order Date:</span>
                                <p>{selectedOrder.orderDate}</p>
                              </div>
                              <div>
                                <span className="font-medium">Estimated Delivery:</span>
                                <p>{selectedOrder.estimatedDelivery || "TBD"}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
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
