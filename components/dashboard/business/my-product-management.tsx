"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Upload, Search, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BusinessProduct {
  id: string
  name: string
  brand: string
  category: string
  description: string
  price: number
  weights: string[]
  quantity: number
  image: string
  inStock: boolean
  status: "active" | "inactive"
  createdAt: string
}

// Admin-defined options that business owners can choose from
const adminCategories = ["Fruits", "Vegetables", "Dairy", "Meat", "Bakery", "Beverages", "Snacks"]
const adminBrands = [
  "Fresh Farm",
  "Baker's Choice",
  "Pure Dairy",
  "Farm Fresh",
  "Premium Poultry",
  "Orchard Select",
  "Local Harvest",
  "Organic Plus",
]
const adminWeightOptions = [
  "1 lb",
  "2 lb",
  "5 lb",
  "10 lb",
  "1 loaf",
  "2 loaves",
  "500g",
  "1kg",
  "2kg",
  "12 count",
  "18 count",
  "24 count",
  "1 gallon",
  "0.5 gallon",
]

// Admin products that business owners can reference
const adminProducts = [
  { id: "admin-1", name: "Organic Bananas", image: "/placeholder.svg?height=100&width=100" },
  { id: "admin-2", name: "Whole Wheat Bread", image: "/placeholder.svg?height=100&width=100" },
  { id: "admin-3", name: "Organic Milk", image: "/placeholder.svg?height=100&width=100" },
  { id: "admin-4", name: "Fresh Eggs", image: "/placeholder.svg?height=100&width=100" },
  { id: "admin-5", name: "Chicken Breast", image: "/placeholder.svg?height=100&width=100" },
  { id: "admin-6", name: "Organic Apples", image: "/placeholder.svg?height=100&width=100" },
]

const mockBusinessProducts: BusinessProduct[] = [
  {
    id: "bp-1",
    name: "Organic Bananas",
    brand: "Fresh Farm",
    category: "Fruits",
    description: "Premium organic bananas from my local supplier",
    price: 3.49,
    weights: ["1 lb", "2 lb"],
    quantity: 50,
    image: "/placeholder.svg?height=100&width=100",
    inStock: true,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "bp-2",
    name: "Fresh Eggs",
    brand: "Farm Fresh",
    category: "Dairy",
    description: "Free-range eggs from local farms",
    price: 4.99,
    weights: ["12 count", "18 count"],
    quantity: 0,
    image: "/placeholder.svg?height=100&width=100",
    inStock: false,
    status: "active",
    createdAt: "2024-01-16",
  },
]

export function MyProductManagement() {
  const [products, setProducts] = useState<BusinessProduct[]>(mockBusinessProducts)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<BusinessProduct | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAdminProduct, setSelectedAdminProduct] = useState<string>("")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    price: "",
    weights: [] as string[],
    quantity: "",
    image: "",
    inStock: true,
  })

  // Filter admin products based on search
  const filteredAdminProducts = adminProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newProduct: BusinessProduct = {
      id: editingProduct?.id || `bp-${Date.now()}`,
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      weights: formData.weights,
      quantity: Number.parseInt(formData.quantity),
      image: formData.image || "/placeholder.svg?height=100&width=100",
      inStock: formData.inStock && Number.parseInt(formData.quantity) > 0,
      status: "active",
      createdAt: editingProduct?.createdAt || new Date().toISOString().split("T")[0],
    }

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? newProduct : p)))
      toast({ title: "Product updated successfully" })
    } else {
      setProducts([...products, newProduct])
      toast({ title: "Product added successfully" })
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      category: "",
      description: "",
      price: "",
      weights: [],
      quantity: "",
      image: "",
      inStock: true,
    })
    setSelectedAdminProduct("")
    setSearchTerm("")
    setIsAddDialogOpen(false)
    setEditingProduct(null)
  }

  const handleEdit = (product: BusinessProduct) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      weights: product.weights,
      quantity: product.quantity.toString(),
      image: product.image,
      inStock: product.inStock,
    })
  }

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
    toast({ title: "Product deleted successfully" })
  }

  const handleWeightChange = (weight: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, weights: [...formData.weights, weight] })
    } else {
      setFormData({ ...formData, weights: formData.weights.filter((w) => w !== weight) })
    }
  }

  const handleAdminProductSelect = (productName: string) => {
    const adminProduct = adminProducts.find((p) => p.name === productName)
    if (adminProduct) {
      setFormData({
        ...formData,
        name: adminProduct.name,
        image: adminProduct.image,
      })
      setSelectedAdminProduct(productName)
    }
  }

  const toggleStock = (id: string) => {
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          const newInStock = !product.inStock
          return {
            ...product,
            inStock: newInStock,
            quantity: newInStock ? product.quantity : 0,
          }
        }
        return product
      }),
    )
    toast({ title: "Stock status updated" })
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    setProducts(
      products.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            quantity: newQuantity,
            inStock: newQuantity > 0,
          }
        }
        return product
      }),
    )
  }

  const activeProducts = products.filter((p) => p.status === "active")
  const inStockProducts = products.filter((p) => p.inStock && p.quantity > 0)
  const outOfStockProducts = products.filter((p) => !p.inStock || p.quantity === 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Product Management</h2>
          <p className="text-gray-600">Manage your own product listings and inventory</p>
        </div>
        <Dialog
          open={isAddDialogOpen || !!editingProduct}
          onOpenChange={(open) => {
            if (!open) resetForm()
            setIsAddDialogOpen(open)
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add My Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit My Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Update your product information"
                  : "Add a new product to your inventory using admin-defined options"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Admin Product Reference Section */}
              {!editingProduct && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reference Admin Products</CardTitle>
                    <CardDescription>
                      Search and select from admin-uploaded products to get the exact image and name
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search admin products by name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      {searchTerm && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
                          {filteredAdminProducts.map((product) => (
                            <div
                              key={product.id}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedAdminProduct === product.name
                                  ? "border-blue-500 bg-blue-50"
                                  : "hover:bg-gray-50"
                              }`}
                              onClick={() => handleAdminProductSelect(product.name)}
                            >
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-16 object-cover rounded mb-2"
                              />
                              <p className="text-sm font-medium text-center">{product.name}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Product Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Enter product name or select from admin products"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand (Admin Defined)</Label>
                    <Select
                      value={formData.brand}
                      onValueChange={(value) => setFormData({ ...formData, brand: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {adminBrands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category (Admin Defined)</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {adminCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Your Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      placeholder="Set your own price"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Available Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="inStock"
                      checked={formData.inStock}
                      onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                    />
                    <Label htmlFor="inStock">In Stock</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Weight Options (Admin Defined)</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                      {adminWeightOptions.map((weight) => (
                        <div key={weight} className="flex items-center space-x-2">
                          <Checkbox
                            id={weight}
                            checked={formData.weights.includes(weight)}
                            onCheckedChange={(checked) => handleWeightChange(weight, checked as boolean)}
                          />
                          <Label htmlFor={weight} className="text-sm">
                            {weight}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Product Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      placeholder="Describe your product..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Product Image</Label>
                    <div className="flex gap-2">
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="Image URL (auto-filled from admin products)"
                      />
                      <Button type="button" variant="outline">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.image && (
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded border"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingProduct ? "Update Product" : "Add Product"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{inStockProducts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{outOfStockProducts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              ${products.reduce((sum, p) => sum + p.price * p.quantity, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Products</CardTitle>
          <CardDescription>Manage your product listings and inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>My Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Stock Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.weights.join(", ")}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.category}</Badge>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => updateQuantity(product.id, Number.parseInt(e.target.value) || 0)}
                      className="w-20"
                      min="0"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={product.inStock} onCheckedChange={() => toggleStock(product.id)} />
                      <Badge variant={product.inStock ? "default" : "destructive"}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
