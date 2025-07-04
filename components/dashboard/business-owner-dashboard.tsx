"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductBrowser } from "./business/product-browser"
import { OrderTracking } from "./business/order-tracking"
import { InventoryMonitor } from "./business/inventory-monitor"
import { MyProductManagement } from "./business/my-product-management"
import { DashboardAnalytics } from "./analytics/dashboard-analytics"
import { ActivityLog } from "./activity-log/activity-log"
import { POSIntegration } from "./pos-integration/pos-integration"
import { LocationManagement } from "./multi-location/location-management"
import { LocationAnalytics } from "./multi-location/location-analytics"
import { LocationInventorySync } from "./multi-location/location-inventory-sync"
import { Search, ShoppingCart, BarChart3, Package, PieChart, Activity, Zap, Building, MapPin } from "lucide-react"

export function BusinessOwnerDashboard() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-10">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Locations
          </TabsTrigger>
          <TabsTrigger value="location-analytics" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location Analytics
          </TabsTrigger>
          <TabsTrigger value="multi-inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Multi-Inventory
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Browse
          </TabsTrigger>
          <TabsTrigger value="my-products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            My Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="pos" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            POS
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-6">
          <DashboardAnalytics userRole="business_owner" />
        </TabsContent>

        <TabsContent value="locations" className="mt-6">
          <LocationManagement />
        </TabsContent>

        <TabsContent value="location-analytics" className="mt-6">
          <LocationAnalytics />
        </TabsContent>

        <TabsContent value="multi-inventory" className="mt-6">
          <LocationInventorySync />
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <ProductBrowser />
        </TabsContent>

        <TabsContent value="my-products" className="mt-6">
          <MyProductManagement />
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <OrderTracking />
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          <InventoryMonitor />
        </TabsContent>

        <TabsContent value="pos" className="mt-6">
          <POSIntegration />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityLog />
        </TabsContent>
      </Tabs>
    </div>
  )
}
