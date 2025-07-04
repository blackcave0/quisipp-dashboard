"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Filter, Eye, ShoppingCart } from "lucide-react"

interface Product {
  id: string
  name: string
  brand: string
  category: string
  description: string
  price: number
  weights: string[]
  quantity: number
  image: string
  availability: "in_stock" | "low_stock" | "out_of_stock"
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Organic Bananas",
    brand: "Fresh Farm",
    category: "Fruits",
    description: "Fresh organic bananas from local farms. Rich in potassium and perfect for smoothies or snacking.",
    price: 2.99,
    weights: ["1 lb", "2 lb", "5 lb"],
    quantity: 150,
    image: "/placeholder.svg?height=200&width=200",
    availability: "in_stock",
  },
  {
    id: "2",
    name: "Whole Wheat Bread",
    brand: "Baker's Choice",
    category: "Bakery",
    description: "Freshly baked whole wheat bread made with organic flour and natural ingredients.",
    price: 3.49,
    weights: ["1 loaf", "2 loaves"],
    quantity: 25,
    image: "/placeholder.svg?height=200&width=200",
    availability: "low_stock",
  },
  {
    id: "3",
    name: "Organic Milk",
    brand: "Pure Dairy",
    category: "Dairy",
    description: "Fresh organic milk from grass-fed cows. Rich in calcium and protein.",
    price: 4.99,
    weights: ["1 gallon", "0.5 gallon"],
    quantity: 0,
    image: "/placeholder.svg?height=200&width=200",
    availability: "out_of_stock",
  },
  {
    id: "4",
    name: "Fresh Eggs",
    brand: "Farm Fresh",
    category: "Dairy",
    description: "Free-range eggs from happy hens. Perfect for baking and cooking.",
    price: 3.99,
    weights: ["12 count", "18 count", "24 count"],
    quantity: 89,
    image: "/placeholder.svg?height=200&width=200",
    availability: "in_stock",
  },
  {
    id: "5",
    name: "Chicken Breast",
    brand: "Premium Poultry",
    category: "Meat",
    description: "Fresh, boneless chicken breast. High in protein and perfect for healthy meals.",
    price: 8.99,
    weights: ["1 lb", "2 lb", "5 lb"],
    quantity: 45,
    image: "/placeholder.svg?height=200&width=200",
    availability: "in_stock",
  },
  {
    id: "6",
    name: "Organic Apples",
    brand: "Orchard Select",
    category: "Fruits",
    description: "Crisp organic apples perfect for snacking or baking. Grown without pesticides.",
    price: 4.49,
    weights: ["1 lb", "3 lb", "5 lb"],
    quantity: 120,
    image: "/placeholder.svg?height=200&width=200",
    availability: "in_stock",
  },
]

const categories = ["All", "Fruits", "Vegetables", "Dairy", "Meat", "Bakery", "Beverages", "Snacks"]
const brands = ["All", "Fresh Farm", "Baker's Choice", "Pure Dairy", "Farm Fresh", "Premium Poultry", "Orchard Select"]

export function ProductBrowser() {
  const [products] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedBrand, setSelectedBrand] = useState("All")
  const [selectedWeight, setSelectedWeight] = useState("All")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesBrand = selectedBrand === "All" || product.brand === selectedBrand
    const matchesWeight = selectedWeight === "All" || product.weights.includes(selectedWeight)

    return matchesSearch && matchesCategory && matchesBrand && matchesWeight
  })

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
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

  const allWeights = Array.from(new Set(products.flatMap((p) => p.weights)))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Product Browser</h2>
        <p className="text-gray-600">Browse and search our product catalog</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find products using various filters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedWeight} onValueChange={setSelectedWeight}>
              <SelectTrigger>
                <SelectValue placeholder="Weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Weights</SelectItem>
                {allWeights.map((weight) => (
                  <SelectItem key={weight} value={weight}>
                    {weight}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
                setSelectedBrand("All")
                setSelectedWeight("All")
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-2 right-2" variant={getAvailabilityColor(product.availability) as any}>
                {product.availability.replace("_", " ")}
              </Badge>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.brand}</p>
                </div>

                <Badge variant="outline">{product.category}</Badge>

                <p className="text-sm text-gray-700 line-clamp-2">{product.description}</p>

                <div className="flex flex-wrap gap-1">
                  {product.weights.map((weight) => (
                    <Badge key={weight} variant="secondary" className="text-xs">
                      {weight}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">
                    {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{product.name}</DialogTitle>
                        <DialogDescription>Complete product information</DialogDescription>
                      </DialogHeader>
                      {selectedProduct && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <img
                              src={selectedProduct.image || "/placeholder.svg"}
                              alt={selectedProduct.name}
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                              <p className="text-gray-600">{selectedProduct.brand}</p>
                            </div>

                            <div className="flex gap-2">
                              <Badge>{selectedProduct.category}</Badge>
                              <Badge variant={getAvailabilityColor(selectedProduct.availability) as any}>
                                {selectedProduct.availability.replace("_", " ")}
                              </Badge>
                            </div>

                            <p className="text-gray-700">{selectedProduct.description}</p>

                            <div>
                              <h4 className="font-medium mb-2">Available Weights:</h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedProduct.weights.map((weight) => (
                                  <Badge key={weight} variant="outline">
                                    {weight}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="font-medium">Price:</span>
                                <span className="text-xl font-bold">${selectedProduct.price.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Stock:</span>
                                <span>{selectedProduct.quantity} units</span>
                              </div>
                            </div>

                            <Button className="w-full" disabled={selectedProduct.availability === "out_of_stock"}>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {selectedProduct.availability === "out_of_stock" ? "Out of Stock" : "Add to Cart"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button size="sm" disabled={product.availability === "out_of_stock"} className="flex-1">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.availability === "out_of_stock" ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No products found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
                setSelectedBrand("All")
                setSelectedWeight("All")
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
