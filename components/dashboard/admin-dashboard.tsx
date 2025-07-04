"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductManagement } from "./admin/product-management"
import { InventoryManagement } from "./admin/inventory-management"
import { OrderTracking } from "./admin/order-tracking"
import { DashboardAnalytics } from "./analytics/dashboard-analytics"
import { ActivityLog } from "./activity-log/activity-log"
import { POSIntegration } from "./pos-integration/pos-integration"
import { LocationManagement } from "./multi-location/location-management"
import { LocationAnalytics } from "./multi-location/location-analytics"
import { LocationInventorySync } from "./multi-location/location-inventory-sync"
import { DeliveryZoneManagement } from "./delivery/delivery-zone-management"
import { RouteOptimization } from "./delivery/route-optimization"
import { DeliveryAnalytics } from "./delivery/delivery-analytics"
import {
  Package,
  BarChart3,
  ShoppingCart,
  Activity,
  PieChart,
  Zap,
  MapPin,
  Building,
  Truck,
  Route,
  TrendingUp,
} from "lucide-react"

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full h-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2  border">
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
          <TabsTrigger value="delivery-zones" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Delivery Zones
          </TabsTrigger>
          <TabsTrigger value="route-optimization" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Route Optimization
          </TabsTrigger>
          <TabsTrigger value="delivery-analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Delivery Analytics
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Orders
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

        <TabsContent value="analytics" className="mt-10">
          <DashboardAnalytics userRole="admin" />
        </TabsContent>

        <TabsContent value="locations" className="mt-10">
          <LocationManagement />
        </TabsContent>

        <TabsContent value="location-analytics" className="mt-10">
          <LocationAnalytics />
        </TabsContent>

        <TabsContent value="multi-inventory" className="mt-10">
          <LocationInventorySync />
        </TabsContent>

        <TabsContent value="delivery-zones" className="mt-10">
          <DeliveryZoneManagement />
        </TabsContent>

        <TabsContent value="route-optimization" className="mt-10">
          <RouteOptimization />
        </TabsContent>

        <TabsContent value="delivery-analytics" className="mt-10">
          <DeliveryAnalytics />
        </TabsContent>

        <TabsContent value="products" className="mt-10">
          <ProductManagement />
        </TabsContent>

        <TabsContent value="inventory" className="mt-10">
          <InventoryManagement />
        </TabsContent>

        <TabsContent value="orders" className="mt-10">
          <OrderTracking />
        </TabsContent>

        <TabsContent value="pos" className="mt-10">
          <POSIntegration />
        </TabsContent>

        <TabsContent value="activity" className="mt-10">
          <ActivityLog />
        </TabsContent>
      </Tabs>
    </div>
  )
}
