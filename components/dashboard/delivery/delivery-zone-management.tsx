"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Plus, Edit, Trash2, Clock, DollarSign, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DeliveryZone {
  id: string
  name: string
  type: "standard" | "express" | "premium" | "restricted"
  status: "active" | "inactive" | "maintenance"
  coverage: {
    radius: number
    zipCodes: string[]
    neighborhoods: string[]
  }
  pricing: {
    baseFee: number
    freeDeliveryThreshold: number
    expressUpcharge: number
  }
  schedule: {
    timeSlots: string[]
    maxCapacity: number
    currentLoad: number
  }
  performance: {
    avgDeliveryTime: number
    successRate: number
    customerSatisfaction: number
  }
}

const mockZones: DeliveryZone[] = [
  {
    id: "zone-1",
    name: "Downtown Core",
    type: "express",
    status: "active",
    coverage: {
      radius: 5,
      zipCodes: ["10001", "10002", "10003"],
      neighborhoods: ["Financial District", "SoHo", "Tribeca"],
    },
    pricing: {
      baseFee: 4.99,
      freeDeliveryThreshold: 35,
      expressUpcharge: 2.99,
    },
    schedule: {
      timeSlots: ["9:00-11:00", "11:00-13:00", "13:00-15:00", "15:00-17:00", "17:00-19:00"],
      maxCapacity: 50,
      currentLoad: 32,
    },
    performance: {
      avgDeliveryTime: 28,
      successRate: 98.5,
      customerSatisfaction: 4.7,
    },
  },
  {
    id: "zone-2",
    name: "Westside Residential",
    type: "standard",
    status: "active",
    coverage: {
      radius: 8,
      zipCodes: ["10011", "10014", "10016"],
      neighborhoods: ["Chelsea", "Greenwich Village", "Union Square"],
    },
    pricing: {
      baseFee: 3.99,
      freeDeliveryThreshold: 50,
      expressUpcharge: 3.99,
    },
    schedule: {
      timeSlots: ["10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00"],
      maxCapacity: 40,
      currentLoad: 18,
    },
    performance: {
      avgDeliveryTime: 45,
      successRate: 96.2,
      customerSatisfaction: 4.5,
    },
  },
  {
    id: "zone-3",
    name: "Express Brooklyn",
    type: "premium",
    status: "maintenance",
    coverage: {
      radius: 12,
      zipCodes: ["11201", "11205", "11215"],
      neighborhoods: ["Brooklyn Heights", "Fort Greene", "Park Slope"],
    },
    pricing: {
      baseFee: 6.99,
      freeDeliveryThreshold: 75,
      expressUpcharge: 4.99,
    },
    schedule: {
      timeSlots: ["11:00-13:00", "13:00-15:00", "15:00-17:00"],
      maxCapacity: 30,
      currentLoad: 0,
    },
    performance: {
      avgDeliveryTime: 52,
      successRate: 94.8,
      customerSatisfaction: 4.3,
    },
  },
]

export function DeliveryZoneManagement() {
  const [zones, setZones] = useState<DeliveryZone[]>(mockZones)
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  const getZoneTypeColor = (type: string) => {
    switch (type) {
      case "express":
        return "bg-blue-100 text-blue-800"
      case "premium":
        return "bg-purple-100 text-purple-800"
      case "standard":
        return "bg-green-100 text-green-800"
      case "restricted":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "maintenance":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddZone = () => {
    toast({
      title: "Zone Added",
      description: "New delivery zone has been created successfully.",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditZone = () => {
    toast({
      title: "Zone Updated",
      description: "Delivery zone has been updated successfully.",
    })
    setIsEditDialogOpen(false)
  }

  const handleDeleteZone = (zoneId: string) => {
    setZones(zones.filter((zone) => zone.id !== zoneId))
    toast({
      title: "Zone Deleted",
      description: "Delivery zone has been removed successfully.",
    })
  }

  const totalZones = zones.length
  const activeZones = zones.filter((zone) => zone.status === "active").length
  const totalOrders = zones.reduce((sum, zone) => sum + zone.schedule.currentLoad, 0)
  const avgDeliveryTime = Math.round(
    zones.reduce((sum, zone) => sum + zone.performance.avgDeliveryTime, 0) / zones.length,
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Delivery Zone Management</h2>
          <p className="text-gray-600">Manage delivery zones and optimize routes across all locations</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Delivery Zone
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Delivery Zone</DialogTitle>
              <DialogDescription>Create a new delivery zone with custom settings</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zone-name">Zone Name</Label>
                  <Input id="zone-name" placeholder="Enter zone name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone-type">Zone Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="radius">Delivery Radius (miles)</Label>
                  <Input id="radius" type="number" placeholder="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="base-fee">Base Delivery Fee ($)</Label>
                  <Input id="base-fee" type="number" step="0.01" placeholder="4.99" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="free-threshold">Free Delivery Threshold ($)</Label>
                  <Input id="free-threshold" type="number" placeholder="35" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip-codes">ZIP Codes (comma-separated)</Label>
                <Input id="zip-codes" placeholder="10001, 10002, 10003" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhoods">Neighborhoods</Label>
                <Textarea id="neighborhoods" placeholder="Enter neighborhoods served by this zone" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddZone}>Create Zone</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Zones</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalZones}</div>
            <p className="text-xs text-muted-foreground">{activeZones} active zones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8.2%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDeliveryTime}min</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">-3min</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$31,000</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Zone Management Tabs */}
      <Tabs defaultValue="zones" className="w-full">
        <TabsList>
          <TabsTrigger value="zones">Active Zones</TabsTrigger>
          <TabsTrigger value="routes">Route Optimization</TabsTrigger>
          <TabsTrigger value="analytics">Zone Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="zones" className="space-y-4">
          <div className="grid gap-4">
            {zones.map((zone) => (
              <Card key={zone.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{zone.name}</CardTitle>
                        <Badge className={getZoneTypeColor(zone.type)}>{zone.type}</Badge>
                        <Badge className={getStatusColor(zone.status)}>{zone.status}</Badge>
                      </div>
                      <CardDescription>
                        {zone.coverage.neighborhoods.join(", ")} • {zone.coverage.zipCodes.join(", ")}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedZone(zone)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteZone(zone.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Coverage</p>
                      <p className="text-sm text-gray-600">{zone.coverage.radius} mile radius</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Base Fee</p>
                      <p className="text-sm text-gray-600">${zone.pricing.baseFee}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Current Load</p>
                      <p className="text-sm text-gray-600">
                        {zone.schedule.currentLoad}/{zone.schedule.maxCapacity} orders
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Success Rate</p>
                      <p className="text-sm text-gray-600">{zone.performance.successRate}%</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {zone.schedule.timeSlots.map((slot, index) => (
                      <Badge key={index} variant="outline">
                        {slot}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route Optimization</CardTitle>
              <CardDescription>Optimize delivery routes for maximum efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-optimization</h4>
                    <p className="text-sm text-gray-600">Automatically optimize routes every hour</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Traffic integration</h4>
                    <p className="text-sm text-gray-600">Consider real-time traffic data</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Eco-friendly routing</h4>
                    <p className="text-sm text-gray-600">Prioritize fuel-efficient routes</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {zones.map((zone) => (
              <Card key={zone.id}>
                <CardHeader>
                  <CardTitle className="text-base">{zone.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Delivery Time</span>
                      <span className="text-sm font-medium">{zone.performance.avgDeliveryTime}min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Success Rate</span>
                      <span className="text-sm font-medium">{zone.performance.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Customer Rating</span>
                      <span className="text-sm font-medium">{zone.performance.customerSatisfaction}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Current Load</span>
                      <span className="text-sm font-medium">
                        {Math.round((zone.schedule.currentLoad / zone.schedule.maxCapacity) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Zone Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Delivery Zone</DialogTitle>
            <DialogDescription>Update zone settings and configuration</DialogDescription>
          </DialogHeader>
          {selectedZone && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-zone-name">Zone Name</Label>
                  <Input id="edit-zone-name" defaultValue={selectedZone.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-zone-type">Zone Type</Label>
                  <Select defaultValue={selectedZone.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-radius">Delivery Radius (miles)</Label>
                  <Input id="edit-radius" type="number" defaultValue={selectedZone.coverage.radius} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-base-fee">Base Delivery Fee ($)</Label>
                  <Input id="edit-base-fee" type="number" step="0.01" defaultValue={selectedZone.pricing.baseFee} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-free-threshold">Free Delivery Threshold ($)</Label>
                  <Input
                    id="edit-free-threshold"
                    type="number"
                    defaultValue={selectedZone.pricing.freeDeliveryThreshold}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditZone}>Update Zone</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
