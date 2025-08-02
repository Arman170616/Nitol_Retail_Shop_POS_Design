"use client"

import { useState } from "react"
import { Package, Edit, Trash2, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  id: string
  name: string
  barcode: string
  price: number
  category: string
  size: string
  color: string
  stock: number
  image: string
}

interface InventoryManagementProps {
  products: Product[]
  setProducts: (products: Product[]) => void
}

export default function InventoryManagement({ products, setProducts }: InventoryManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showEditProduct, setShowEditProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    barcode: "",
    price: "",
    category: "Shirts",
    size: "M",
    color: "",
    stock: "",
    image: "",
  })

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.color.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addNewProduct = () => {
    if (!newProduct.name || !newProduct.barcode || !newProduct.price || !newProduct.color || !newProduct.stock) {
      alert("Please fill in all required fields")
      return
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      barcode: newProduct.barcode,
      price: Number.parseFloat(newProduct.price),
      category: newProduct.category,
      size: newProduct.size,
      color: newProduct.color,
      stock: Number.parseInt(newProduct.stock),
      image: newProduct.image || "/placeholder.svg?height=200&width=200",
    }

    setProducts([...products, product])
    setNewProduct({
      name: "",
      barcode: "",
      price: "",
      category: "Shirts",
      size: "M",
      color: "",
      stock: "",
      image: "",
    })
    setShowAddProduct(false)
    alert("Product added successfully!")
  }

  const updateProduct = () => {
    if (!editingProduct) return

    const updatedProducts = products.map((product) => (product.id === editingProduct.id ? editingProduct : product))
    setProducts(updatedProducts)
    setShowEditProduct(false)
    setEditingProduct(null)
    alert("Product updated successfully!")
  }

  const deleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== productId))
      alert("Product deleted successfully!")
    }
  }

  const updateStock = (productId: string, newStock: number) => {
    const updatedProducts = products.map((product) =>
      product.id === productId ? { ...product, stock: Math.max(0, newStock) } : product,
    )
    setProducts(updatedProducts)
  }

  return (
    <Card className="border-pink-200 shadow-lg">
      <CardHeader className="bg-pink-100">
        <CardTitle className="flex items-center gap-2 text-pink-900">
          <Package className="h-5 w-5" />
          Inventory Management
        </CardTitle>
        <CardDescription>Manage your product inventory</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-pink-600" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-pink-300 focus:border-pink-500"
            />
          </div>
          <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
            <DialogTrigger asChild>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Add a new item to your inventory</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <label className="text-sm font-medium mb-1 block">Product Name *</label>
                  <Input
                    placeholder="e.g., Cotton T-Shirt"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="border-pink-300 focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Barcode *</label>
                  <Input
                    placeholder="e.g., 1234567890123"
                    value={newProduct.barcode}
                    onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                    className="border-pink-300 focus:border-pink-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Price *</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="25.99"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="border-pink-300 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Stock *</label>
                    <Input
                      type="number"
                      placeholder="15"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="border-pink-300 focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  >
                    <SelectTrigger className="border-pink-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Shirts">Shirts</SelectItem>
                      <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                      <SelectItem value="Polo">Polo</SelectItem>
                      <SelectItem value="Dress Shirts">Dress Shirts</SelectItem>
                      <SelectItem value="Casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Size</label>
                    <Select
                      value={newProduct.size}
                      onValueChange={(value) => setNewProduct({ ...newProduct, size: value })}
                    >
                      <SelectTrigger className="border-pink-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XS">XS</SelectItem>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                        <SelectItem value="XXL">XXL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Color *</label>
                    <Input
                      placeholder="e.g., Blue"
                      value={newProduct.color}
                      onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                      className="border-pink-300 focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Image URL (Optional)</label>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="border-pink-300 focus:border-pink-500"
                  />
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white" onClick={addNewProduct}>
                    Add Product
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-pink-300 bg-transparent"
                    onClick={() => setShowAddProduct(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="border-pink-200">
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md bg-gray-100"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm text-pink-900">{product.name}</h3>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingProduct(product)
                            setShowEditProduct(true)
                          }}
                          className="h-6 w-6 p-0 border-pink-300"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteProduct(product.id)}
                          className="h-6 w-6 p-0 border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-pink-700 mb-1">
                      {product.category} • {product.size} • {product.color}
                    </p>
                    <p className="text-xs text-pink-600 mb-2">Barcode: {product.barcode}</p>
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-pink-900">${product.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStock(product.id, product.stock - 1)}
                          className="h-6 w-6 p-0 border-pink-300"
                          disabled={product.stock <= 0}
                        >
                          <Plus className="h-3 w-3 rotate-45" />
                        </Button>
                        <Badge variant={product.stock > 5 ? "default" : "destructive"} className="text-xs">
                          {product.stock} in stock
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStock(product.id, product.stock + 1)}
                          className="h-6 w-6 p-0 border-pink-300"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Product Dialog */}
        <Dialog open={showEditProduct} onOpenChange={setShowEditProduct}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>Update product information</DialogDescription>
            </DialogHeader>
            {editingProduct && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <label className="text-sm font-medium mb-1 block">Product Name</label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="border-pink-300 focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Barcode</label>
                  <Input
                    value={editingProduct.barcode}
                    onChange={(e) => setEditingProduct({ ...editingProduct, barcode: e.target.value })}
                    className="border-pink-300 focus:border-pink-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: Number.parseFloat(e.target.value) })
                      }
                      className="border-pink-300 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Stock</label>
                    <Input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number.parseInt(e.target.value) })}
                      className="border-pink-300 focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <Select
                    value={editingProduct.category}
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                  >
                    <SelectTrigger className="border-pink-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Shirts">Shirts</SelectItem>
                      <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                      <SelectItem value="Polo">Polo</SelectItem>
                      <SelectItem value="Dress Shirts">Dress Shirts</SelectItem>
                      <SelectItem value="Casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Size</label>
                    <Select
                      value={editingProduct.size}
                      onValueChange={(value) => setEditingProduct({ ...editingProduct, size: value })}
                    >
                      <SelectTrigger className="border-pink-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XS">XS</SelectItem>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                        <SelectItem value="XXL">XXL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Color</label>
                    <Input
                      value={editingProduct.color}
                      onChange={(e) => setEditingProduct({ ...editingProduct, color: e.target.value })}
                      className="border-pink-300 focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Image URL</label>
                  <Input
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className="border-pink-300 focus:border-pink-500"
                  />
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white" onClick={updateProduct}>
                    Update Product
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-pink-300 bg-transparent"
                    onClick={() => setShowEditProduct(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
