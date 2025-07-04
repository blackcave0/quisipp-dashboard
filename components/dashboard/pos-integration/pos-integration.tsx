"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertCircle,
  CheckCircle,
  Settings,
  RefreshCw,
  Download,
  Link,
  Unlink,
  Activity,
  ShoppingCart,
  DollarSign,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"

interface POSSystem {
  id: string
  name: string
  logo: string
  description: string
  features: string[]
  status: "connected" | "disconnected" | "error" | "syncing"
  lastSync: string
  apiVersion: string
  webhookUrl?: string
  credentials?: {
    apiKey?: string
    secretKey?: string
    merchantId?: string
    locationId?: string
  }
}

interface POSTransaction {
  id: string
  posSystem: string
  transactionId: string
  amount: number
  items: Array<{
    name: string
    quantity: number
    price: number
    sku?: string
  }>
  paymentMethod: string
  timestamp: string
  status: "completed" | "pending" | "failed" | "refunded"
  customerInfo?: {
    name?: string
    email?: string
    phone?: string
  }
}

interface SyncStatus {
  posSystem: string
  lastSync: string
  status: "success" | "error" | "in_progress"
  recordsSynced: number
  errors: string[]
}

const mockPOSSystems: POSSystem[] = [
  {
    id: "square",
    name: "Square POS",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Popular POS system with comprehensive payment processing",
    features: ["Payment Processing", "Inventory Management", "Customer Management", "Analytics"],
    status: "connected",
    lastSync: "2024-01-17T10:30:00Z",
    apiVersion: "2023-10-18",
    webhookUrl: "https://your-app.com/webhooks/square",
    credentials: {
      apiKey: "sq0idp-***************",
      secretKey: "sq0csp-***************",
      locationId: "L1234567890",
    },
  },
  {
    id: "shopify",
    name: "Shopify POS",
    logo: "/placeholder.svg?height=40&width=40",
    description: "E-commerce platform with integrated POS capabilities",
    features: ["Multi-channel Sales", "Inventory Sync", "Customer Profiles", "Reporting"],
    status: "connected",
    lastSync: "2024-01-17T09:45:00Z",
    apiVersion: "2023-10",
    webhookUrl: "https://your-app.com/webhooks/shopify",
    credentials: {
      apiKey: "shpat_***************",
      secretKey: "shpss_***************",
    },
  },
  {
    id: "toast",
    name: "Toast POS",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Restaurant-focused POS system with advanced features",
    features: ["Order Management", "Kitchen Display", "Staff Management", "Menu Management"],
    status: "disconnected",
    lastSync: "Never",
    apiVersion: "v2",
  },
  {
    id: "clover",
    name: "Clover POS",
    logo: "/placeholder.svg?height=40&width=40",
    description: "Versatile POS system for retail and restaurants",
    features: ["Payment Processing", "Inventory Tracking", "Employee Management", "Custom Apps"],
    status: "error",
    lastSync: "2024-01-16T14:20:00Z",
    apiVersion: "v3",
    credentials: {
      apiKey: "clv_***************",
      merchantId: "MERCHANT123",
    },
  },
]

const mockTransactions: POSTransaction[] = [
  {
    id: "txn-001",
    posSystem: "square",
    transactionId: "SQ-TXN-12345",
    amount: 45.67,
    items: [
      { name: "Organic Bananas", quantity: 2, price: 2.99, sku: "ORG-BAN-001" },
      { name: "Whole Wheat Bread", quantity: 1, price: 3.49, sku: "WWB-001" },
      { name: "Fresh Milk", quantity: 1, price: 4.99, sku: "MILK-001" },
    ],
    paymentMethod: "Credit Card",
    timestamp: "2024-01-17T10:15:00Z",
    status: "completed",
    customerInfo: {
      name: "John Doe",
      email: "john@example.com",
    },
  },
  {
    id: "txn-002",
    posSystem: "shopify",
    transactionId: "SHOP-ORD-67890",
    amount: 28.45,
    items: [
      { name: "Organic Apples", quantity: 3, price: 4.49, sku: "ORG-APP-001" },
      { name: "Greek Yogurt", quantity: 2, price: 5.99, sku: "YOGURT-001" },
    ],
    paymentMethod: "Debit Card",
    timestamp: "2024-01-17T09:30:00Z",
    status: "completed",
    customerInfo: {
      name: "Jane Smith",
      email: "jane@example.com",
    },
  },
]

const mockSyncStatus: SyncStatus[] = [
  {
    posSystem: "square",
    lastSync: "2024-01-17T10:30:00Z",
    status: "success",
    recordsSynced: 156,
    errors: [],
  },
  {
    posSystem: "shopify",
    lastSync: "2024-01-17T09:45:00Z",
    status: "success",
    recordsSynced: 89,
    errors: [],
  },
  {
    posSystem: "clover",
    lastSync: "2024-01-16T14:20:00Z",
    status: "error",
    recordsSynced: 0,
    errors: ["Authentication failed", "Invalid merchant ID"],
  },
]

export function POSIntegration() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [posSystems, setPOSSystems] = useState<POSSystem[]>(mockPOSSystems)
  const [transactions, setTransactions] = useState<POSTransaction[]>(mockTransactions)
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>(mockSyncStatus)
  const [selectedPOS, setSelectedPOS] = useState<POSSystem | null>(null)
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [isSyncing, setIsSyncing] = useState<string | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "disconnected":
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "syncing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "default"
      case "disconnected":
        return "secondary"
      case "error":
        return "destructive"
      case "syncing":
        return "default"
      default:
        return "secondary"
    }
  }

  const handleConnect = async (posId: string) => {
    setIsSyncing(posId)

    // Simulate API connection
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setPOSSystems((prev) =>
      prev.map((pos) =>
        pos.id === posId
          ? {
              ...pos,
              status: "connected",
              lastSync: new Date().toISOString(),
            }
          : pos,
      ),
    )

    setIsSyncing(null)
    toast({
      title: "POS System Connected",
      description: `Successfully connected to ${posSystems.find((p) => p.id === posId)?.name}`,
    })
  }

  const handleDisconnect = (posId: string) => {
    setPOSSystems((prev) =>
      prev.map((pos) =>
        pos.id === posId
          ? {
              ...pos,
              status: "disconnected",
              credentials: undefined,
            }
          : pos,
      ),
    )

    toast({
      title: "POS System Disconnected",
      description: `Disconnected from ${posSystems.find((p) => p.id === posId)?.name}`,
    })
  }

  const handleSync = async (posId: string) => {
    setIsSyncing(posId)

    // Simulate sync process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setPOSSystems((prev) =>
      prev.map((pos) =>
        pos.id === posId
          ? {
              ...pos,
              lastSync: new Date().toISOString(),
            }
          : pos,
      ),
    )

    // Update sync status
    setSyncStatuses((prev) =>
      prev.map((status) =>
        status.posSystem === posId
          ? {
              ...status,
              lastSync: new Date().toISOString(),
              status: "success",
              recordsSynced: Math.floor(Math.random() * 200) + 50,
              errors: [],
            }
          : status,
      ),
    )

    setIsSyncing(null)
    toast({
      title: "Sync Complete",
      description: `Successfully synced data from ${posSystems.find((p) => p.id === posId)?.name}`,
    })
  }

  const handleBulkSync = async () => {
    const connectedSystems = posSystems.filter((pos) => pos.status === "connected")

    for (const pos of connectedSystems) {
      await handleSync(pos.id)
    }

    toast({
      title: "Bulk Sync Complete",
      description: `Synced data from ${connectedSystems.length} POS systems`,
    })
  }

  const formatTimestamp = (timestamp: string) => {
    if (timestamp === "Never") return timestamp
    return new Date(timestamp).toLocaleString()
  }

  const connectedSystems = posSystems.filter((pos) => pos.status === "connected")
  const totalTransactions = transactions.length
  const totalRevenue = transactions.reduce((sum, txn) => sum + txn.amount, 0)
  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">POS Integration</h2>
          <p className="text-gray-600">Connect and manage your Point of Sale systems</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleBulkSync} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Systems</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedSystems.length}</div>
            <p className="text-xs text-muted-foreground">of {posSystems.length} total systems</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8.5%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {syncStatuses.filter((s) => s.status === "success").length}
            </div>
            <p className="text-xs text-muted-foreground">systems synced successfully</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="systems" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="systems">POS Systems</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="sync">Sync Status</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* POS Systems Tab */}
        <TabsContent value="systems" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posSystems.map((pos) => (
              <Card key={pos.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={pos.logo || "/placeholder.svg"} alt={pos.name} className="w-10 h-10 rounded" />
                      <div>
                        <CardTitle className="text-lg">{pos.name}</CardTitle>
                        <CardDescription>{pos.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(isSyncing === pos.id ? "syncing" : pos.status)}
                      <Badge variant={getStatusColor(pos.status) as any}>
                        {isSyncing === pos.id ? "syncing" : pos.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {pos.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Last Sync:</span>
                        <p className="text-gray-600">{formatTimestamp(pos.lastSync)}</p>
                      </div>
                      <div>
                        <span className="font-medium">API Version:</span>
                        <p className="text-gray-600">{pos.apiVersion}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {pos.status === "connected" ? (
                        <>
                          <Button size="sm" onClick={() => handleSync(pos.id)} disabled={isSyncing === pos.id}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing === pos.id ? "animate-spin" : ""}`} />
                            Sync Now
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setSelectedPOS(pos)}>
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDisconnect(pos.id)}>
                            <Unlink className="h-4 w-4 mr-2" />
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" onClick={() => handleConnect(pos.id)} disabled={isSyncing === pos.id}>
                          <Link className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest transactions from connected POS systems</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>POS System</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.transactionId}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{posSystems.find((p) => p.id === transaction.posSystem)?.name}</Badge>
                      </TableCell>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>{transaction.items.length} items</TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatTimestamp(transaction.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync Status Tab */}
        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Synchronization Status</CardTitle>
              <CardDescription>Monitor data sync status across all POS systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncStatuses.map((status) => (
                  <div key={status.posSystem} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={posSystems.find((p) => p.id === status.posSystem)?.logo || "/placeholder.svg"}
                          alt=""
                          className="w-8 h-8 rounded"
                        />
                        <div>
                          <h4 className="font-medium">{posSystems.find((p) => p.id === status.posSystem)?.name}</h4>
                          <p className="text-sm text-gray-600">Last sync: {formatTimestamp(status.lastSync)}</p>
                        </div>
                      </div>
                      <Badge variant={status.status === "success" ? "default" : "destructive"}>{status.status}</Badge>
                    </div>

                    {status.status === "success" && (
                      <div className="text-sm text-gray-600">Successfully synced {status.recordsSynced} records</div>
                    )}

                    {status.errors.length > 0 && (
                      <div className="mt-2">
                        <h5 className="font-medium text-red-600 mb-1">Errors:</h5>
                        <ul className="text-sm text-red-600 space-y-1">
                          {status.errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>Configure global POS integration settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-sync">Auto Sync</Label>
                    <p className="text-sm text-gray-600">Automatically sync data every hour</p>
                  </div>
                  <Switch id="auto-sync" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="real-time">Real-time Updates</Label>
                    <p className="text-sm text-gray-600">Enable webhook notifications for instant updates</p>
                  </div>
                  <Switch id="real-time" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inventory-sync">Inventory Sync</Label>
                    <p className="text-sm text-gray-600">Sync inventory levels with POS systems</p>
                  </div>
                  <Switch id="inventory-sync" defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sync-interval">Sync Interval</Label>
                  <Select defaultValue="1hour">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15min">Every 15 minutes</SelectItem>
                      <SelectItem value="30min">Every 30 minutes</SelectItem>
                      <SelectItem value="1hour">Every hour</SelectItem>
                      <SelectItem value="4hours">Every 4 hours</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://your-app.com/webhooks/pos"
                    defaultValue="https://your-app.com/webhooks/pos"
                  />
                  <p className="text-sm text-gray-600">URL to receive real-time notifications from POS systems</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button>Save Settings</Button>
                <Button variant="outline">Test Webhook</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Configuration Dialog */}
      {selectedPOS && (
        <Dialog open={!!selectedPOS} onOpenChange={() => setSelectedPOS(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Configure {selectedPOS.name}</DialogTitle>
              <DialogDescription>Set up API credentials and connection settings</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  defaultValue={selectedPOS.credentials?.apiKey}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secret-key">Secret Key</Label>
                <Input
                  id="secret-key"
                  type="password"
                  placeholder="Enter your secret key"
                  defaultValue={selectedPOS.credentials?.secretKey}
                />
              </div>

              {selectedPOS.id === "square" && (
                <div className="space-y-2">
                  <Label htmlFor="location-id">Location ID</Label>
                  <Input
                    id="location-id"
                    placeholder="Enter your location ID"
                    defaultValue={selectedPOS.credentials?.locationId}
                  />
                </div>
              )}

              {selectedPOS.id === "clover" && (
                <div className="space-y-2">
                  <Label htmlFor="merchant-id">Merchant ID</Label>
                  <Input
                    id="merchant-id"
                    placeholder="Enter your merchant ID"
                    defaultValue={selectedPOS.credentials?.merchantId}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://your-app.com/webhooks/pos"
                  defaultValue={selectedPOS.webhookUrl}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setSelectedPOS(null)}>Save Configuration</Button>
                <Button variant="outline" onClick={() => setSelectedPOS(null)}>
                  Cancel
                </Button>
                <Button variant="outline">Test Connection</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
