"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  ShoppingCart,
  ArrowUpDown,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface POSOrder {
  id: string
  posSystem: string
  posOrderId: string
  customerName: string
  customerEmail?: string
  items: Array<{
    name: string
    sku: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  status: "pending" | "processing" | "completed" | "cancelled" | "refunded"
  syncStatus: "synced" | "pending" | "failed" | "conflict"
  posTimestamp: string
  syncTimestamp?: string
  notes?: string
  conflictReason?: string
}

const mockPOSOrders: POSOrder[] = [
  {
    id: "order-001",
    posSystem: "square",
    posOrderId: "SQ-ORD-12345",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    items: [
      { name: "Organic Bananas", sku: "ORG-BAN-001", quantity: 2, price: 2.99, total: 5.98 },
      { name: "Whole Wheat Bread", sku: "WWB-001", quantity: 1, price: 3.49, total: 3.49 },
      { name: "Fresh Milk", sku: "MILK-001", quantity: 1, price: 4.99, total: 4.99 },
    ],
    subtotal: 14.46,
    tax: 1.16,
    total: 15.62,
    paymentMethod: "Credit Card",
    status: "completed",
    syncStatus: "synced",
    posTimestamp: "2024-01-17T10:15:00Z",
    syncTimestamp: "2024-01-17T10:16:00Z",
  },
  {
    id: "order-002",
    posSystem: "shopify",
    posOrderId: "SHOP-ORD-67890",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    items: [
      { name: "Organic Apples", sku: "ORG-APP-001", quantity: 3, price: 4.49, total: 13.47 },
      { name: "Greek Yogurt", sku: "YOGURT-001", quantity: 2, price: 5.99, total: 11.98 },
    ],
    subtotal: 25.45,
    tax: 2.04,
    total: 27.49,
    paymentMethod: "Debit Card",
    status: "completed",
    syncStatus: "pending",
    posTimestamp: "2024-01-17T09:30:00Z",
  },
  {
    id: "order-003",
    posSystem: "clover",
    posOrderId: "CLV-ORD-11111",
    customerName: "Bob Johnson",
    items: [
      { name: "Chicken Breast", sku: "CHICKEN-001", quantity: 1, price: 8.99, total: 8.99 },
      { name: "Brown Rice", sku: "RICE-001", quantity: 2, price: 3.49, total: 6.98 },
    ],
    subtotal: 15.97,
    tax: 1.28,
    total: 17.25,
    paymentMethod: "Cash",
    status: "completed",
    syncStatus: "conflict",
    posTimestamp: "2024-01-17T08:45:00Z",
    conflictReason: "SKU CHICKEN-001 not found in inventory",
  },
  {
    id: "order-004",
    posSystem: "square",
    posOrderId: "SQ-ORD-22222",
    customerName: "Alice Wilson",
    customerEmail: "alice@example.com",
    items: [
      { name: "Organic Spinach", sku: "ORG-SPN-001", quantity: 1, price: 2.99, total: 2.99 },
      { name: "Tomatoes", sku: "TOM-001", quantity: 2, price: 1.99, total: 3.98 },
    ],
    subtotal: 6.97,
    tax: 0.56,
    total: 7.53,
    paymentMethod: "Credit Card",
    status: "processing",
    syncStatus: "failed",
    posTimestamp: "2024-01-17T11:20:00Z",
    conflictReason: "Network timeout during sync",
  },
]

export function POSOrderSync() {
  const { toast } = useToast()
  const [orders, setOrders] = useState<POSOrder[]>(mockPOSOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPOS, setFilterPOS] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSyncStatus, setFilterSyncStatus] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<POSOrder | null>(null)
  const [isSyncing, setIsSyncing] = useState<string | null>(null)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.posOrderId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPOS = filterPOS === "all" || order.posSystem === filterPOS
    const matchesStatus = filterStatus === "all" || order.status === filterStatus
    const matchesSyncStatus = filterSyncStatus === "all" || order.syncStatus === filterSyncStatus

    return matchesSearch && matchesPOS && matchesStatus && matchesSyncStatus
  })

  const handleSyncOrder = async (orderId: string) => {
    setIsSyncing(orderId)

    // Simulate sync process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              syncStatus: "synced",
              syncTimestamp: new Date().toISOString(),
              conflictReason: undefined,
            }
          : order,
      ),
    )

    setIsSyncing(null)
    toast({
      title: "Order Synced",
      description: "Order has been successfully synced to the system",
    })
  }

  const handleBulkSync = async () => {
    const pendingOrders = orders.filter((order) => order.syncStatus === "pending" || order.syncStatus === "failed")

    for (const order of pendingOrders) {
      await handleSyncOrder(order.id)
    }

    toast({
      title: "Bulk Sync Complete",
      description: `Synced ${pendingOrders.length} orders`,
    })
  }

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case "synced":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "conflict":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case "synced":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      case "conflict":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const syncedOrders = orders.filter((o) => o.syncStatus === "synced").length
  const pendingOrders = orders.filter((o) => o.syncStatus === "pending").length
  const failedOrders = orders.filter((o) => o.syncStatus === "failed" || o.syncStatus === "conflict").length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Order Synchronization</h3>
          <p className="text-gray-600">Manage orders from connected POS systems</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleBulkSync} variant="outline">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Bulk Sync
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Sync Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Synced</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{syncedOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{pendingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed/Conflicts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{failedOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Orders</CardTitle>
          <CardDescription>Search and filter POS orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterPOS} onValueChange={setFilterPOS}>
              <SelectTrigger>
                <SelectValue placeholder="POS System" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Systems</SelectItem>
                <SelectItem value="square">Square POS</SelectItem>
                <SelectItem value="shopify">Shopify POS</SelectItem>
                <SelectItem value="toast">Toast POS</SelectItem>
                <SelectItem value="clover">Clover POS</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSyncStatus} onValueChange={setFilterSyncStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Sync Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sync Status</SelectItem>
                <SelectItem value="synced">Synced</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="conflict">Conflict</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilterPOS("all")
                setFilterStatus("all")
                setFilterSyncStatus("all")
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>POS Orders</CardTitle>
          <CardDescription>{filteredOrders.length} orders found</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>POS System</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sync Status</TableHead>
                <TableHead>POS Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.posOrderId}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.posSystem}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      {order.customerEmail && <div className="text-sm text-gray-500">{order.customerEmail}</div>}
                    </div>
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSyncStatusIcon(order.syncStatus)}
                      <Badge variant={getSyncStatusColor(order.syncStatus) as any}>{order.syncStatus}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{formatTimestamp(order.posTimestamp)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.posOrderId}</DialogTitle>
                            <DialogDescription>Complete order information from POS system</DialogDescription>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium">Customer Information</h4>
                                  <p>{selectedOrder.customerName}</p>
                                  {selectedOrder.customerEmail && (
                                    <p className="text-sm text-gray-500">{selectedOrder.customerEmail}</p>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium">Order Status</h4>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={selectedOrder.status === "completed" ? "default" : "secondary"}>
                                      {selectedOrder.status}
                                    </Badge>
                                    <div className="flex items-center gap-1">
                                      {getSyncStatusIcon(selectedOrder.syncStatus)}
                                      <Badge variant={getSyncStatusColor(selectedOrder.syncStatus) as any}>
                                        {selectedOrder.syncStatus}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Order Items</h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Item</TableHead>
                                      <TableHead>SKU</TableHead>
                                      <TableHead>Qty</TableHead>
                                      <TableHead>Price</TableHead>
                                      <TableHead>Total</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedOrder.items.map((item, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.sku}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>${item.price.toFixed(2)}</TableCell>
                                        <TableCell>${item.total.toFixed(2)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>

                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Subtotal:</span>
                                  <p>${selectedOrder.subtotal.toFixed(2)}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Tax:</span>
                                  <p>${selectedOrder.tax.toFixed(2)}</p>
                                </div>
                                <div>
                                  <span className="font-medium">Total:</span>
                                  <p className="font-bold">${selectedOrder.total.toFixed(2)}</p>
                                </div>
                              </div>

                              {selectedOrder.conflictReason && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                  <h5 className="font-medium text-red-800 mb-1">Sync Conflict</h5>
                                  <p className="text-sm text-red-700">{selectedOrder.conflictReason}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {(order.syncStatus === "pending" ||
                        order.syncStatus === "failed" ||
                        order.syncStatus === "conflict") && (
                        <Button size="sm" onClick={() => handleSyncOrder(order.id)} disabled={isSyncing === order.id}>
                          <RefreshCw className={`h-4 w-4 mr-1 ${isSyncing === order.id ? "animate-spin" : ""}`} />
                          Sync
                        </Button>
                      )}
                    </div>
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
