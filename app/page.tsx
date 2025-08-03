"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Scan, CreditCard, Printer, Package, History, Search, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import InventoryManagement from "@/components/inventory-management"
import LoginForm from "@/components/login-form"
import UserProfile from "@/components/user-profile"

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

interface CartItem extends Product {
  quantity: number
}

interface Transaction {
  id: string
  items: CartItem[]
  subtotal: number
  vat: number
  total: number
  paymentMethod: string
  timestamp: Date
  cashier: string
}

interface User {
  username: string
  role: string
  fullName: string
}

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Cotton T-Shirt",
    barcode: "1234567890123",
    price: 25.99,
    category: "Shirts",
    size: "M",
    color: "Blue",
    stock: 15,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Polo Shirt",
    barcode: "1234567890124",
    price: 35.99,
    category: "Shirts",
    size: "L",
    color: "White",
    stock: 8,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Dress Shirt",
    barcode: "1234567890125",
    price: 45.99,
    category: "Shirts",
    size: "M",
    color: "Black",
    stock: 12,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "4",
    name: "Casual Shirt",
    barcode: "1234567890126",
    price: 29.99,
    category: "Shirts",
    size: "S",
    color: "Red",
    stock: 20,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "5",
    name: "Flannel Shirt",
    barcode: "1234567890127",
    price: 39.99,
    category: "Shirts",
    size: "L",
    color: "Plaid",
    stock: 6,
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function POSSystem() {
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showPayment, setShowPayment] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [currentReceipt, setCurrentReceipt] = useState<Transaction | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
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

  const VAT_RATE = 0.05
  const [activeTab, setActiveTab] = useState("pos")

  // Check for existing session on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("pos_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem("pos_user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("pos_user")
    setCart([])
    setActiveTab("pos")
  }

  const hasPermission = (permission: string) => {
    if (!user) return false

    const permissions: Record<string, string[]> = {
      "Super Admin": ["pos", "inventory", "reports", "users", "settings"],
      Manager: ["pos", "inventory", "reports"],
      Cashier: ["pos", "basic_inventory"],
    }

    return permissions[user.role]?.includes(permission) || false
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return

    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    const product = products.find((p) => p.id === id)
    if (!product) return

    if (newQuantity <= 0) {
      removeFromCart(id)
    } else if (newQuantity <= product.stock) {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const calculateVAT = () => {
    return calculateSubtotal() * VAT_RATE
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT()
  }

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

  const processPayment = async () => {
    if (cart.length === 0) return

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const transaction: Transaction = {
      id: `TXN-${Date.now()}`,
      items: [...cart],
      subtotal: calculateSubtotal(),
      vat: calculateVAT(),
      total: calculateTotal(),
      paymentMethod,
      timestamp: new Date(),
      cashier: user?.fullName || "Unknown",
    }

    // Update inventory
    const updatedProducts = products.map((product) => {
      const cartItem = cart.find((item) => item.id === product.id)
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity }
      }
      return product
    })

    setProducts(updatedProducts)
    setTransactions([transaction, ...transactions])
    setCurrentReceipt(transaction)
    setCart([])
    setShowPayment(false)
    setShowReceipt(true)
    setIsProcessing(false)
  }

  const printReceipt = () => {
    window.print()
  }

  // Show login form if user is not authenticated
  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="container mx-auto p-4">
        {/* Enhanced Welcome Header */}
        <div className="bg-gradient-to-r from-pink-200 to-pink-300 rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-pink-900 flex items-center gap-2 mb-2">
                <Package className="h-8 w-8" />
                Welcome, {user.fullName}
              </h1>
              <p className="text-pink-700 text-lg font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-pink-600 mt-1">Nitol Fashion House - Professional Point of Sale Solution</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="bg-pink-100 rounded-lg p-3 border border-pink-300">
                  <p className="text-sm text-pink-700 font-medium">Total Products</p>
                  <p className="text-2xl font-bold text-pink-900">{products.length}</p>
                </div>
              </div>
              <UserProfile user={user} onLogout={handleLogout} />
            </div>
          </div>
        </div>

        {/* Category Overview */}
        <div className="mb-6">
          <Card className="border-pink-200 shadow-lg">
            <CardHeader className="bg-pink-100">
              <CardTitle className="text-pink-900">Product Categories</CardTitle>
              <CardDescription>Overview of your inventory by category</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {(() => {
                  const categories = products.reduce(
                    (acc, product) => {
                      acc[product.category] = (acc[product.category] || 0) + 1
                      return acc
                    },
                    {} as Record<string, number>,
                  )

                  return Object.entries(categories).map(([category, count]) => (
                    <div
                      key={category}
                      className="bg-pink-50 rounded-lg p-3 text-center border border-pink-200 hover:bg-pink-100 transition-colors"
                    >
                      <p className="font-semibold text-pink-900 text-sm">{category}</p>
                      <p className="text-pink-700 text-xs">{count} items</p>
                      <div className="mt-2">
                        <div className="w-full bg-pink-200 rounded-full h-2">
                          <div
                            className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((count / Math.max(...Object.values(categories))) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                })()}
              </div>
              {products.length === 0 && (
                <div className="text-center py-8 text-pink-600">
                  <Package className="h-12 w-12 mx-auto mb-3 text-pink-400" />
                  <p>No products in inventory yet</p>
                  <p className="text-sm">Add products to see category overview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 mb-6 items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "pos" ? "default" : "outline"}
              onClick={() => setActiveTab("pos")}
              className={activeTab === "pos" ? "bg-pink-500 hover:bg-pink-600 text-white" : "border-pink-300"}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Point of Sale
            </Button>
            {hasPermission("inventory") && (
              <Button
                variant={activeTab === "inventory" ? "default" : "outline"}
                onClick={() => setActiveTab("inventory")}
                className={activeTab === "inventory" ? "bg-pink-500 hover:bg-pink-600 text-white" : "border-pink-300"}
              >
                <Package className="h-4 w-4 mr-2" />
                Inventory Management
              </Button>
            )}
          </div>

          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <p className="text-pink-700 font-medium">Low Stock</p>
              <p className="text-pink-900 font-bold">{products.filter((p) => p.stock <= 5).length}</p>
            </div>
            <div className="text-center">
              <p className="text-pink-700 font-medium">Out of Stock</p>
              <p className="text-pink-900 font-bold">{products.filter((p) => p.stock === 0).length}</p>
            </div>
            <div className="text-center">
              <p className="text-pink-700 font-medium">Total Value</p>
              <p className="text-pink-900 font-bold">
                ${products.reduce((sum, p) => sum + p.price * p.stock, 0).toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {activeTab === "pos" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Scanner & Search */}
            <div className="lg:col-span-2">
              <Card className="border-pink-200 shadow-lg">
                <CardHeader className="bg-pink-100">
                  <CardTitle className="flex items-center gap-2 text-pink-900">
                    <Scan className="h-5 w-5" />
                    Product Scanner
                  </CardTitle>
                  <CardDescription>Scan barcode or search for products</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-pink-600" />
                      <Input
                        placeholder="Scan barcode or search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-pink-300 focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className={`cursor-pointer transition-all hover:shadow-md border-pink-200 ${
                          product.stock <= 0 ? "opacity-50" : "hover:border-pink-400"
                        }`}
                        onClick={() => addToCart(product)}
                      >
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
                                <Badge variant={product.stock > 5 ? "default" : "destructive"} className="text-xs">
                                  {product.stock} left
                                </Badge>
                              </div>
                              <p className="text-xs text-pink-700 mb-1">
                                {product.category} • {product.size} • {product.color}
                              </p>
                              <p className="text-xs text-pink-600 mb-2">Barcode: {product.barcode}</p>
                              <p className="font-bold text-pink-900">${product.price.toFixed(2)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shopping Cart */}
            <div>
              <Card className="border-pink-200 shadow-lg">
                <CardHeader className="bg-pink-100">
                  <CardTitle className="flex items-center gap-2 text-pink-900">
                    <ShoppingCart className="h-5 w-5" />
                    Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {cart.length === 0 ? (
                    <p className="text-pink-600 text-center py-8">Cart is empty</p>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center gap-2 p-2 bg-pink-50 rounded">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-md bg-gray-100"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm text-pink-900">{item.name}</p>
                              <p className="text-xs text-pink-700">
                                {item.size} • {item.color}
                              </p>
                              <p className="text-sm font-bold text-pink-900">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-6 w-6 p-0 border-pink-300"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-6 w-6 p-0 border-pink-300"
                                disabled={item.quantity >= item.stock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromCart(item.id)}
                                className="h-6 w-6 p-0 border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-pink-700">Subtotal:</span>
                          <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-pink-700">VAT (5%):</span>
                          <span className="font-medium">${calculateVAT().toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold text-pink-900">
                          <span>Total:</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>

                      <Button
                        className="w-full mt-4 bg-pink-500 hover:bg-pink-600 text-white"
                        onClick={() => setShowPayment(true)}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Process Payment
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-4 border-pink-200 shadow-lg">
                <CardHeader className="bg-pink-100">
                  <CardTitle className="text-pink-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-pink-300 bg-transparent">
                          <History className="h-4 w-4 mr-1" />
                          History
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Transaction History</DialogTitle>
                          <DialogDescription>Recent transactions</DialogDescription>
                        </DialogHeader>
                        <div className="max-h-96 overflow-y-auto">
                          {transactions.length === 0 ? (
                            <p className="text-center py-8 text-gray-500">No transactions yet</p>
                          ) : (
                            <div className="space-y-3">
                              {transactions.map((transaction) => (
                                <Card key={transaction.id} className="border-pink-200">
                                  <CardContent className="p-3">
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="font-medium">{transaction.id}</span>
                                      <span className="text-sm text-gray-500">
                                        {transaction.timestamp.toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">
                                      {transaction.items.length} items • {transaction.paymentMethod} •{" "}
                                      {transaction.cashier}
                                    </p>
                                    <p className="font-bold">${transaction.total.toFixed(2)}</p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {hasPermission("inventory") && (
                      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="border-pink-300 bg-transparent">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Product
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                            <DialogDescription>Add a new item to your inventory</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
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
                              <Button
                                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
                                onClick={addNewProduct}
                              >
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
                    )}

                    <Button variant="outline" size="sm" onClick={() => setCart([])} className="border-pink-300">
                      Clear Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : hasPermission("inventory") ? (
          <InventoryManagement products={products} setProducts={setProducts} />
        ) : (
          <div className="text-center py-12">
            <p className="text-pink-600">You don't have permission to access this section.</p>
          </div>
        )}

        {/* Payment Dialog */}
        <Dialog open={showPayment} onOpenChange={setShowPayment}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Process Payment</DialogTitle>
              <DialogDescription>Complete the transaction</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-pink-50 p-4 rounded-lg">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Payment Method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="contactless">Contactless</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                onClick={processPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Complete Payment
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Receipt Dialog */}
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Transaction Complete</DialogTitle>
              <DialogDescription>Receipt generated successfully</DialogDescription>
            </DialogHeader>
            {currentReceipt && (
              <div className="space-y-4" id="receipt">
                <div className="text-center border-b pb-4">
                  <h2 className="font-bold text-lg">Fashion Store</h2>
                  <p className="text-sm text-gray-600">123 Fashion Street</p>
                  <p className="text-sm text-gray-600">City, State 12345</p>
                  <p className="text-sm text-gray-600">Tel: (555) 123-4567</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Transaction ID:</span>
                    <span>{currentReceipt.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Date:</span>
                    <span>{currentReceipt.timestamp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cashier:</span>
                    <span>{currentReceipt.cashier}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payment:</span>
                    <span className="capitalize">{currentReceipt.paymentMethod}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-1">
                  {currentReceipt.items.map((item, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between">
                        <span>{item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-gray-500 ml-2">
                        {item.quantity} x ${item.price.toFixed(2)} ({item.size}, {item.color})
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${currentReceipt.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (5%):</span>
                    <span>${currentReceipt.vat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${currentReceipt.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-center text-xs text-gray-500 border-t pt-4">
                  <p>Thank you for shopping with us!</p>
                  <p>Return policy: 30 days with receipt</p>
                </div>

                <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white" onClick={printReceipt}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Receipt
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
