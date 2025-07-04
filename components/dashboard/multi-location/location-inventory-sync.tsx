"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, RefreshCw, ArrowUpDown, AlertTriangle, CheckCircle, Package, TrendingUp, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LocationInventory {
  locationId: string
  locationName: string
  productId: string
  productName: string
  sku: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  reservedStock: number
  availableStock: number
  lastUpdated: string
  status: "in_stock" | "low_stock" | "out_of_stock" | "overstocked"
  reorderPoint: number
  reorderQuantity: number
  cost: number
  price: number
}

interface InventoryTransfer {
  id: string
  fromLocation: string
  toLocation: string
  productName: string
  sku: string
  quantity: number
  status: "pending" | "in_transit" | "completed" | "cancelled"
  requestedBy: string
  requestDate: string
  completedDate?: string
  notes?: string
}

const mockInventoryData: LocationInventory[] = [
  {
    locationId: "loc-001",
    locationName: "Downtown",
    productId: "prod-001",
    productName: "Organic Bananas",
    sku: "ORG-BAN-001",
    category: "Fruits",
    currentStock: 150,
    minStock: 50,
    maxStock: 200,
    reservedStock: 25,
    availableStock: 125,
    lastUpdated: "2024-01-17T10:30:00Z",
    status: "in_stock",
    reorderPoint: 60,
    reorderQuantity: 100,
    cost: 1.5,
    price: 2.99,
  },
  {
    locationId: "loc-002",
    locationName: "Westside",
    productId: "prod-001",
    productName: "Organic Bananas",
    sku: "ORG-BAN-001",
    category: "Fruits",
    currentStock: 25,
    minStock: 30,
    maxStock: 150,
    reservedStock: 10,
    availableStock: 15,
    lastUpdated: "2024-01-17T10:25:00Z",
    status: "low_stock",
    reorderPoint: 35,
    reorderQuantity: 75,
    cost: 1.5,
    price: 2.99,
  },
  {
    locationId: "loc-003",
    locationName: "Express",
    productId: "prod-001",
    productName: "Organic Bananas",
    sku: "ORG-BAN-001",
    category: "Fruits",
    currentStock: 0,
    minStock: 20,
    maxStock: 100,
    reservedStock: 0,
    availableStock: 0,
    lastUpdated: "2024-01-17T09:15:00Z",
    status: "out_of_stock",
    reorderPoint: 25,
    reorderQuantity: 50,
    cost: 1.5,
    price: 2.99,
  },
  {
    locationId: "loc-001",
    locationName: "Downtown",
    productId: "prod-002",
    productName: "Whole Wheat Bread",
    sku: "WWB-001",
    category: "Bakery",
    currentStock: 75,
    minStock: 30,
    maxStock: 100,
    reservedStock: 15,
    availableStock: 60,
    lastUpdated: "2024-01-17T10:20:00Z",
    status: "in_stock",
    reorderPoint: 35,
    reorderQuantity: 50,
    cost: 2.0,
    price: 3.49,
  },
  {
    locationId: "loc-002",
    locationName: "Westside",
    productId: "prod-002",
    productName: "Whole Wheat Bread",
    sku: "WWB-001",
    category: "Bakery",
    currentStock: 120,
    minStock: 25,
    maxStock: 80,
    reservedStock: 20,
    availableStock: 100,
    lastUpdated: "2024-01-17T10:15:00Z",
    status: "overstocked",
    reorderPoint: 30,
    reorderQuantity: 40,
    cost: 2.0,
    price: 3.49,
  },
]

const mockTransfers: InventoryTransfer[] = [
  {
    id: "transfer-001",
    fromLocation: "Downtown",
    toLocation: "Express",
    productName: "Organic Bananas",
    sku: "ORG-BAN-001",
    quantity: 50,
    status: "pending",
    requestedBy: "Mike Davis",
    requestDate: "2024-01-17T11:00:00Z",
    notes: "Urgent restock needed for weekend rush",
  },
  {
    id: "transfer-002",
    fromLocation: "Westside",
    toLocation: "Downtown",
    productName: "Whole Wheat Bread",
    sku: "WWB-001",
    quantity: 30,
    status: "in_transit",
    requestedBy: "John Smith",
    requestDate: "2024-01-17T09:30:00Z",
    notes: "Balancing overstock",
  },
  {
    id: "transfer-003",
    fromLocation: "Downtown",
    toLocation: "Westside",
    productName: "Fresh Milk",
    sku: "MILK-001",
    quantity: 20,
    status: "completed",
    requestedBy: "Sarah Johnson",
    requestDate: "2024-01-16T14:00:00Z",
    completedDate: "2024-01-17T08:00:00Z",
  },
]

export function LocationInventorySync() {
  const { toast } = useToast()
  const [inventoryData, setInventoryData] = useState<LocationInventory[]>(mockInventoryData)
  const [transfers, setTransfers] = useState<InventoryTransfer[]>(mockTransfers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLocation, setFilterLocation] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const [transferForm, setTransferForm] = useState({
    fromLocation: "",
    toLocation: "",
    productId: "",
    quantity: "",
    notes: "",
  })

  const filteredInventory = inventoryData.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation = filterLocation === "all" || item.locationId === filterLocation
    const matchesStatus = filterStatus === "all" || item.status === filterStatus

    return matchesSearch && matchesLocation && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in_stock":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "low_stock":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "out_of_stock":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "overstocked":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_stock":
        return "default"
      case "low_stock":
        return "destructive"
      case "out_of_stock":
        return "destructive"
      case "overstocked":
        return "default"
      default:
        return "secondary"
    }
  }

  const getTransferStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "in_transit":
        return "default"
      case "completed":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const handleSyncInventory = async () => {
    setIsSyncing(true)

    // Simulate sync process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update last updated timestamps
    setInventoryData((prev) =>
      prev.map((item) => ({
        ...item,
        lastUpdated: new Date().toISOString(),
      })),
    )

    setIsSyncing(false)
    toast({
      title: "Inventory Synced",
      description: "All location inventories have been synchronized",
    })
  }

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault()

    const newTransfer: InventoryTransfer = {
      id: `transfer-${Date.now()}`,
      fromLocation: transferForm.fromLocation,
      toLocation: transferForm.toLocation,
      productName: inventoryData.find((item) => item.productId === transferForm.productId)?.productName || "",
      sku: inventoryData.find((item) => item.productId === transferForm.productId)?.sku || "",
      quantity: Number.parseInt(transferForm.quantity),
      status: "pending",
      requestedBy: "Current User",
      requestDate: new Date().toISOString(),
      notes: transferForm.notes,
    }

    setTransfers([newTransfer, ...transfers])
    setTransferForm({
      fromLocation: "",
      toLocation: "",
      productId: "",
      quantity: "",
      notes: "",
    })
    setIsTransferDialogOpen(false)

    toast({
      title: "Transfer Request Created",
      description: "Inventory transfer request has been submitted",
    })
  }

  const handleApproveTransfer = (transferId: string) => {
    setTransfers((prev) =>
      prev.map((transfer) => (transfer.id === transferId ? { ...transfer, status: "in_transit" } : transfer)),
    )

    toast({
      title: "Transfer Approved",
      description: "Transfer request has been approved and is now in transit",
    })
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const locations = Array.from(new Set(inventoryData.map((item) => item.locationName)))
  const products = Array.from(new Set(inventoryData.map((item) => ({ id: item.productId, name: item.productName }))))

  const lowStockItems = inventoryData.filter((item) => item.status === "low_stock" || item.status === "out_of_stock")
  const overstockedItems = inventoryData.filter((item) => item.status === "overstocked")
  const pendingTransfers = transfers.filter((transfer) => transfer.status === "pending")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Multi-Location Inventory</h2>
          <p className="text-gray-600">Manage inventory across all store locations</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Create Transfer
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl">
              <DialogHeader>
                <DialogTitle>Create Inventory Transfer</DialogTitle>
                <DialogDescription>Transfer inventory between store locations</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTransfer} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From Location</label>
                    <Select
                      value={transferForm.fromLocation}
                      onValueChange={(value) => setTransferForm({ ...transferForm, fromLocation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To Location</label>
                    <Select
                      value={transferForm.toLocation}
                      onValueChange={(value) => setTransferForm({ ...transferForm, toLocation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations
                          .filter((location) => location !== transferForm.fromLocation)
                          .map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Product</label>
                  <Select
                    value={transferForm.productId}
                    onValueChange={(value) => setTransferForm({ ...transferForm, productId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input
                    type="number"
                    value={transferForm.quantity}
                    onChange={(e) => setTransferForm({ ...transferForm, quantity: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes (Optional)</label>
                  <Input
                    value={transferForm.notes}
                    onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                    placeholder="Add any notes about this transfer"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsTransferDialogOpen(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">Create Transfer</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Button onClick={handleSyncInventory} disabled={isSyncing} variant="outline" className="w-full sm:w-auto">
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
            Sync All
          </Button>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overstocked Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{overstockedItems.length}</div>
            <p className="text-xs text-muted-foreground">Consider redistribution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{pendingTransfers.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.length}</div>
            <p className="text-xs text-muted-foreground">Active locations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Inventory Levels</TabsTrigger>
          <TabsTrigger value="transfers">Transfer Requests</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
        </TabsList>

        {/* Inventory Levels Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filter Inventory</CardTitle>
              <CardDescription>Search and filter inventory across all locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    <SelectItem value="overstocked">Overstocked</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setFilterLocation("all")
                    setFilterStatus("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Levels</CardTitle>
              <CardDescription>{filteredInventory.length} items found</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item, index) => (
                    <TableRow key={`${item.locationId}-${item.productId}-${index}`}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-gray-500">{item.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.locationName}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium">{item.currentStock}</div>
                          <div className="text-xs text-gray-500">
                            Min: {item.minStock} | Max: {item.maxStock}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium">{item.availableStock}</div>
                          <div className="text-xs text-gray-500">Reserved: {item.reservedStock}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <Badge variant={getStatusColor(item.status) as any}>{item.status.replace("_", " ")}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{formatTimestamp(item.lastUpdated)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transfer Requests Tab */}
        <TabsContent value="transfers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Requests</CardTitle>
              <CardDescription>Manage inventory transfers between locations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transfer ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>From → To</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell className="font-medium">{transfer.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transfer.productName}</div>
                          <div className="text-sm text-gray-500">{transfer.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{transfer.fromLocation}</Badge>
                          <span>→</span>
                          <Badge variant="outline">{transfer.toLocation}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{transfer.quantity}</TableCell>
                      <TableCell>
                        <Badge variant={getTransferStatusColor(transfer.status) as any}>{transfer.status}</Badge>
                      </TableCell>
                      <TableCell>{transfer.requestedBy}</TableCell>
                      <TableCell className="text-sm">{formatTimestamp(transfer.requestDate)}</TableCell>
                      <TableCell>
                        {transfer.status === "pending" && (
                          <Button size="sm" onClick={() => handleApproveTransfer(transfer.id)}>
                            Approve
                          </Button>
                        )}
                        {transfer.status === "in_transit" && (
                          <Button size="sm" variant="outline">
                            Track
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>Items that need immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockItems.map((item, index) => (
                    <div key={`${item.locationId}-${item.productId}-${index}`} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-gray-500">
                            {item.locationName} • {item.sku}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-red-600">{item.currentStock} units</div>
                          <div className="text-xs text-gray-500">Min: {item.minStock}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overstocked Items</CardTitle>
                <CardDescription>Items that could be redistributed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overstockedItems.map((item, index) => (
                    <div key={`${item.locationId}-${item.productId}-${index}`} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-gray-500">
                            {item.locationName} • {item.sku}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-blue-600">{item.currentStock} units</div>
                          <div className="text-xs text-gray-500">Max: {item.maxStock}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
