"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Users,
  Package,
  DollarSign,
  Clock,
  Phone,
  Mail,
  Globe,
  Eye,
  Building,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"

interface StoreLocation {
  id: string
  name: string
  code: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  contact: {
    phone: string
    email: string
    website?: string
  }
  manager: {
    name: string
    email: string
    phone: string
  }
  operatingHours: {
    [key: string]: {
      open: string
      close: string
      isOpen: boolean
    }
  }
  timezone: string
  status: "active" | "inactive" | "maintenance"
  type: "flagship" | "standard" | "express" | "warehouse"
  size: number // square feet
  employeeCount: number
  openDate: string
  settings: {
    allowOnlineOrders: boolean
    allowPickup: boolean
    allowDelivery: boolean
    deliveryRadius: number // miles
    taxRate: number
    currency: string
  }
  metrics: {
    dailyRevenue: number
    monthlyRevenue: number
    totalOrders: number
    activeProducts: number
    inventoryValue: number
    customerCount: number
  }
  integrations: {
    posSystem?: string
    paymentProcessor?: string
    inventorySystem?: string
  }
}

const mockLocations: StoreLocation[] = [
  {
    id: "loc-001",
    name: "Downtown Flagship Store",
    code: "DT001",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    contact: {
      phone: "(555) 123-4567",
      email: "downtown@grocery.com",
      website: "https://grocery.com/downtown",
    },
    manager: {
      name: "John Smith",
      email: "john.smith@grocery.com",
      phone: "(555) 123-4568",
    },
    operatingHours: {
      monday: { open: "07:00", close: "22:00", isOpen: true },
      tuesday: { open: "07:00", close: "22:00", isOpen: true },
      wednesday: { open: "07:00", close: "22:00", isOpen: true },
      thursday: { open: "07:00", close: "22:00", isOpen: true },
      friday: { open: "07:00", close: "23:00", isOpen: true },
      saturday: { open: "08:00", close: "23:00", isOpen: true },
      sunday: { open: "09:00", close: "21:00", isOpen: true },
    },
    timezone: "America/New_York",
    status: "active",
    type: "flagship",
    size: 15000,
    employeeCount: 45,
    openDate: "2020-01-15",
    settings: {
      allowOnlineOrders: true,
      allowPickup: true,
      allowDelivery: true,
      deliveryRadius: 10,
      taxRate: 8.25,
      currency: "USD",
    },
    metrics: {
      dailyRevenue: 12500,
      monthlyRevenue: 375000,
      totalOrders: 1250,
      activeProducts: 2500,
      inventoryValue: 125000,
      customerCount: 3500,
    },
    integrations: {
      posSystem: "square",
      paymentProcessor: "stripe",
      inventorySystem: "internal",
    },
  },
  {
    id: "loc-002",
    name: "Westside Market",
    code: "WS002",
    address: {
      street: "456 Oak Avenue",
      city: "New York",
      state: "NY",
      zipCode: "10025",
      country: "USA",
    },
    contact: {
      phone: "(555) 234-5678",
      email: "westside@grocery.com",
    },
    manager: {
      name: "Sarah Johnson",
      email: "sarah.johnson@grocery.com",
      phone: "(555) 234-5679",
    },
    operatingHours: {
      monday: { open: "08:00", close: "21:00", isOpen: true },
      tuesday: { open: "08:00", close: "21:00", isOpen: true },
      wednesday: { open: "08:00", close: "21:00", isOpen: true },
      thursday: { open: "08:00", close: "21:00", isOpen: true },
      friday: { open: "08:00", close: "22:00", isOpen: true },
      saturday: { open: "08:00", close: "22:00", isOpen: true },
      sunday: { open: "09:00", close: "20:00", isOpen: true },
    },
    timezone: "America/New_York",
    status: "active",
    type: "standard",
    size: 8000,
    employeeCount: 25,
    openDate: "2021-03-20",
    settings: {
      allowOnlineOrders: true,
      allowPickup: true,
      allowDelivery: false,
      deliveryRadius: 0,
      taxRate: 8.25,
      currency: "USD",
    },
    metrics: {
      dailyRevenue: 8500,
      monthlyRevenue: 255000,
      totalOrders: 850,
      activeProducts: 1800,
      inventoryValue: 85000,
      customerCount: 2200,
    },
    integrations: {
      posSystem: "shopify",
      paymentProcessor: "square",
      inventorySystem: "internal",
    },
  },
  {
    id: "loc-003",
    name: "Express Pickup Center",
    code: "EP003",
    address: {
      street: "789 Business Park Drive",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201",
      country: "USA",
    },
    contact: {
      phone: "(555) 345-6789",
      email: "express@grocery.com",
    },
    manager: {
      name: "Mike Davis",
      email: "mike.davis@grocery.com",
      phone: "(555) 345-6790",
    },
    operatingHours: {
      monday: { open: "06:00", close: "20:00", isOpen: true },
      tuesday: { open: "06:00", close: "20:00", isOpen: true },
      wednesday: { open: "06:00", close: "20:00", isOpen: true },
      thursday: { open: "06:00", close: "20:00", isOpen: true },
      friday: { open: "06:00", close: "20:00", isOpen: true },
      saturday: { open: "07:00", close: "18:00", isOpen: true },
      sunday: { open: "08:00", close: "18:00", isOpen: true },
    },
    timezone: "America/New_York",
    status: "active",
    type: "express",
    size: 3000,
    employeeCount: 12,
    openDate: "2022-06-01",
    settings: {
      allowOnlineOrders: true,
      allowPickup: true,
      allowDelivery: true,
      deliveryRadius: 15,
      taxRate: 8.25,
      currency: "USD",
    },
    metrics: {
      dailyRevenue: 5500,
      monthlyRevenue: 165000,
      totalOrders: 650,
      activeProducts: 800,
      inventoryValue: 45000,
      customerCount: 1800,
    },
    integrations: {
      posSystem: "clover",
      paymentProcessor: "stripe",
      inventorySystem: "internal",
    },
  },
]

export function LocationManagement() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [locations, setLocations] = useState<StoreLocation[]>(mockLocations)
  const [selectedLocation, setSelectedLocation] = useState<StoreLocation | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<StoreLocation | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    phone: "",
    email: "",
    website: "",
    managerName: "",
    managerEmail: "",
    managerPhone: "",
    timezone: "America/New_York",
    type: "standard",
    size: "",
    employeeCount: "",
    taxRate: "8.25",
    currency: "USD",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newLocation: StoreLocation = {
      id: editingLocation?.id || `loc-${Date.now()}`,
      name: formData.name,
      code: formData.code,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
      contact: {
        phone: formData.phone,
        email: formData.email,
        website: formData.website || undefined,
      },
      manager: {
        name: formData.managerName,
        email: formData.managerEmail,
        phone: formData.managerPhone,
      },
      operatingHours: {
        monday: { open: "08:00", close: "21:00", isOpen: true },
        tuesday: { open: "08:00", close: "21:00", isOpen: true },
        wednesday: { open: "08:00", close: "21:00", isOpen: true },
        thursday: { open: "08:00", close: "21:00", isOpen: true },
        friday: { open: "08:00", close: "21:00", isOpen: true },
        saturday: { open: "08:00", close: "21:00", isOpen: true },
        sunday: { open: "09:00", close: "20:00", isOpen: true },
      },
      timezone: formData.timezone,
      status: "active",
      type: formData.type as any,
      size: Number.parseInt(formData.size),
      employeeCount: Number.parseInt(formData.employeeCount),
      openDate: new Date().toISOString().split("T")[0],
      settings: {
        allowOnlineOrders: true,
        allowPickup: true,
        allowDelivery: true,
        deliveryRadius: 10,
        taxRate: Number.parseFloat(formData.taxRate),
        currency: formData.currency,
      },
      metrics: {
        dailyRevenue: 0,
        monthlyRevenue: 0,
        totalOrders: 0,
        activeProducts: 0,
        inventoryValue: 0,
        customerCount: 0,
      },
      integrations: {},
    }

    if (editingLocation) {
      setLocations(locations.map((loc) => (loc.id === editingLocation.id ? newLocation : loc)))
      toast({ title: "Location updated successfully" })
    } else {
      setLocations([...locations, newLocation])
      toast({ title: "Location added successfully" })
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      phone: "",
      email: "",
      website: "",
      managerName: "",
      managerEmail: "",
      managerPhone: "",
      timezone: "America/New_York",
      type: "standard",
      size: "",
      employeeCount: "",
      taxRate: "8.25",
      currency: "USD",
    })
    setIsAddDialogOpen(false)
    setEditingLocation(null)
  }

  const handleEdit = (location: StoreLocation) => {
    setEditingLocation(location)
    setFormData({
      name: location.name,
      code: location.code,
      street: location.address.street,
      city: location.address.city,
      state: location.address.state,
      zipCode: location.address.zipCode,
      country: location.address.country,
      phone: location.contact.phone,
      email: location.contact.email,
      website: location.contact.website || "",
      managerName: location.manager.name,
      managerEmail: location.manager.email,
      managerPhone: location.manager.phone,
      timezone: location.timezone,
      type: location.type,
      size: location.size.toString(),
      employeeCount: location.employeeCount.toString(),
      taxRate: location.settings.taxRate.toString(),
      currency: location.settings.currency,
    })
  }

  const handleDelete = (id: string) => {
    setLocations(locations.filter((loc) => loc.id !== id))
    toast({ title: "Location deleted successfully" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "maintenance":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "flagship":
        return <Building className="h-4 w-4" />
      case "standard":
        return <MapPin className="h-4 w-4" />
      case "express":
        return <Clock className="h-4 w-4" />
      case "warehouse":
        return <Package className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const totalLocations = locations.length
  const activeLocations = locations.filter((loc) => loc.status === "active").length
  const totalRevenue = locations.reduce((sum, loc) => sum + loc.metrics.monthlyRevenue, 0)
  const totalEmployees = locations.reduce((sum, loc) => sum + loc.employeeCount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Location Management</h2>
          <p className="text-gray-600">Manage all your store locations from one central dashboard</p>
        </div>
        <Dialog
          open={isAddDialogOpen || !!editingLocation}
          onOpenChange={(open) => {
            if (!open) resetForm()
            setIsAddDialogOpen(open)
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLocation ? "Edit Location" : "Add New Location"}</DialogTitle>
              <DialogDescription>
                {editingLocation ? "Update location information" : "Add a new store location to your network"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="contact">Contact & Manager</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Store Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">Store Code</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        required
                        placeholder="e.g., DT001"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Store Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flagship">Flagship Store</SelectItem>
                          <SelectItem value="standard">Standard Store</SelectItem>
                          <SelectItem value="express">Express Store</SelectItem>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={formData.timezone}
                        onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="size">Store Size (sq ft)</Label>
                      <Input
                        id="size"
                        type="number"
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeCount">Employee Count</Label>
                      <Input
                        id="employeeCount"
                        type="number"
                        value={formData.employeeCount}
                        onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Store Manager</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="managerName">Manager Name</Label>
                        <Input
                          id="managerName"
                          value={formData.managerName}
                          onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="managerEmail">Manager Email</Label>
                        <Input
                          id="managerEmail"
                          type="email"
                          value={formData.managerEmail}
                          onChange={(e) => setFormData({ ...formData, managerEmail: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="managerPhone">Manager Phone</Label>
                      <Input
                        id="managerPhone"
                        value={formData.managerPhone}
                        onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        step="0.01"
                        value={formData.taxRate}
                        onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) => setFormData({ ...formData, currency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingLocation ? "Update Location" : "Add Location"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLocations}</div>
            <p className="text-xs text-muted-foreground">{activeLocations} active locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Across all locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Revenue/Location</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(totalRevenue / totalLocations).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Monthly average</p>
          </CardContent>
        </Card>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <Card key={location.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(location.type)}
                  <div>
                    <CardTitle className="text-lg">{location.name}</CardTitle>
                    <CardDescription>{location.code}</CardDescription>
                  </div>
                </div>
                <Badge variant={getStatusColor(location.status) as any}>{location.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {location.address.city}, {location.address.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{location.manager.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{location.contact.phone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Monthly Revenue:</span>
                    <p className="text-green-600">${location.metrics.monthlyRevenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Orders:</span>
                    <p>{location.metrics.totalOrders}</p>
                  </div>
                  <div>
                    <span className="font-medium">Employees:</span>
                    <p>{location.employeeCount}</p>
                  </div>
                  <div>
                    <span className="font-medium">Size:</span>
                    <p>{location.size.toLocaleString()} sq ft</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedLocation(location)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(location)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(location.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Location Details Dialog */}
      {selectedLocation && (
        <Dialog open={!!selectedLocation} onOpenChange={() => setSelectedLocation(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedLocation.name}</DialogTitle>
              <DialogDescription>Complete location information and metrics</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="hours">Hours</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Location Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Code:</span> {selectedLocation.code}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {selectedLocation.type}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span> {selectedLocation.size.toLocaleString()} sq ft
                      </div>
                      <div>
                        <span className="font-medium">Opened:</span> {selectedLocation.openDate}
                      </div>
                      <div>
                        <span className="font-medium">Timezone:</span> {selectedLocation.timezone}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Address</h4>
                    <div className="text-sm">
                      <p>{selectedLocation.address.street}</p>
                      <p>
                        {selectedLocation.address.city}, {selectedLocation.address.state}{" "}
                        {selectedLocation.address.zipCode}
                      </p>
                      <p>{selectedLocation.address.country}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{selectedLocation.contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{selectedLocation.contact.email}</span>
                      </div>
                      {selectedLocation.contact.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <span>{selectedLocation.contact.website}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Store Manager</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Name:</span> {selectedLocation.manager.name}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {selectedLocation.manager.email}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {selectedLocation.manager.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Daily Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${selectedLocation.metrics.dailyRevenue.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Monthly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${selectedLocation.metrics.monthlyRevenue.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedLocation.metrics.totalOrders}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Active Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedLocation.metrics.activeProducts}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Inventory Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${selectedLocation.metrics.inventoryValue.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Customer Count</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedLocation.metrics.customerCount}</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="hours" className="space-y-4">
                <h4 className="font-medium">Operating Hours</h4>
                <div className="space-y-3">
                  {Object.entries(selectedLocation.operatingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="font-medium capitalize w-20">{day}</span>
                        <Badge variant={hours.isOpen ? "default" : "secondary"}>
                          {hours.isOpen ? "Open" : "Closed"}
                        </Badge>
                      </div>
                      {hours.isOpen && (
                        <span className="text-sm">
                          {hours.open} - {hours.close}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Service Options</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Online Orders</span>
                        <Badge variant={selectedLocation.settings.allowOnlineOrders ? "default" : "secondary"}>
                          {selectedLocation.settings.allowOnlineOrders ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pickup</span>
                        <Badge variant={selectedLocation.settings.allowPickup ? "default" : "secondary"}>
                          {selectedLocation.settings.allowPickup ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Delivery</span>
                        <Badge variant={selectedLocation.settings.allowDelivery ? "default" : "secondary"}>
                          {selectedLocation.settings.allowDelivery ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Financial Settings</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Tax Rate:</span> {selectedLocation.settings.taxRate}%
                      </div>
                      <div>
                        <span className="font-medium">Currency:</span> {selectedLocation.settings.currency}
                      </div>
                      {selectedLocation.settings.allowDelivery && (
                        <div>
                          <span className="font-medium">Delivery Radius:</span>{" "}
                          {selectedLocation.settings.deliveryRadius} miles
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Integrations</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium">POS System:</span>
                      <p className="text-sm">{selectedLocation.integrations.posSystem || "Not configured"}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Payment Processor:</span>
                      <p className="text-sm">{selectedLocation.integrations.paymentProcessor || "Not configured"}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Inventory System:</span>
                      <p className="text-sm">{selectedLocation.integrations.inventorySystem || "Not configured"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
