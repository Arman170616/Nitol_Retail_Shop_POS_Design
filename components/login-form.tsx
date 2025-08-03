"use client"

import type React from "react"

import { useState } from "react"
import { User, Lock, Eye, EyeOff, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface LoginFormProps {
  onLogin: (user: { username: string; role: string; fullName: string }) => void
}

const demoCredentials = [
  {
    username: "superadmin",
    password: "admin123",
    role: "Super Admin",
    fullName: "Wesley Adrian",
    permissions: ["pos", "inventory", "reports", "users", "settings"],
  },
  {
    username: "cashier1",
    password: "cash123",
    role: "Cashier",
    fullName: "Sarah Johnson",
    permissions: ["pos", "basic_inventory"],
  },
  {
    username: "cashier2",
    password: "cash123",
    role: "Cashier",
    fullName: "Mike Chen",
    permissions: ["pos", "basic_inventory"],
  },
  {
    username: "manager",
    password: "mgr123",
    role: "Manager",
    fullName: "Emma Davis",
    permissions: ["pos", "inventory", "reports"],
  },
]

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = demoCredentials.find((cred) => cred.username === username && cred.password === password)

    if (user) {
      onLogin({
        username: user.username,
        role: user.role,
        fullName: user.fullName,
      })
    } else {
      setError("Invalid username or password")
    }

    setIsLoading(false)
  }

  const handleDemoLogin = (cred: (typeof demoCredentials)[0]) => {
    setUsername(cred.username)
    setPassword(cred.password)
    onLogin({
      username: cred.username,
      role: cred.role,
      fullName: cred.fullName,
    })
  }

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Login Form */}
        <Card className="border-pink-200 shadow-lg">
          <CardHeader className="bg-pink-100 text-center">
            <CardTitle className="text-2xl font-bold text-pink-900">Fashion Store POS</CardTitle>
            <CardDescription>Sign in to access your point of sale system</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-pink-900">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-pink-600" />
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 border-pink-300 focus:border-pink-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-pink-900">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-pink-600" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-pink-300 focus:border-pink-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-pink-600 hover:text-pink-800"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}

              <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white" disabled={isLoading}>
                {isLoading ? (
                  <>Signing in...</>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-pink-600">
                Demo system - Use the credentials on the right to test different roles
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="border-pink-200 shadow-lg">
          <CardHeader className="bg-pink-100">
            <CardTitle className="text-pink-900">Demo Credentials</CardTitle>
            <CardDescription>Click on any credential below to login instantly</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {demoCredentials.map((cred, index) => (
                <Card
                  key={index}
                  className="border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => handleDemoLogin(cred)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-pink-900">{cred.fullName}</h3>
                        <p className="text-sm text-pink-700">@{cred.username}</p>
                      </div>
                      <Badge
                        variant={cred.role === "Super Admin" ? "default" : "secondary"}
                        className={cred.role === "Super Admin" ? "bg-pink-500" : ""}
                      >
                        {cred.role}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-pink-600 mb-3">
                      <div>
                        <span className="font-medium">Username:</span> {cred.username}
                      </div>
                      <div>
                        <span className="font-medium">Password:</span> {cred.password}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {cred.permissions.map((permission, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-pink-300">
                          {permission.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 border-pink-300 text-pink-700 hover:bg-pink-100 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDemoLogin(cred)
                      }}
                    >
                      Login as {cred.role}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
              <h4 className="font-medium text-pink-900 mb-2">Role Permissions:</h4>
              <div className="text-xs text-pink-700 space-y-1">
                <div>
                  <strong>Super Admin:</strong> Full access to all features
                </div>
                <div>
                  <strong>Manager:</strong> POS, Inventory, Reports
                </div>
                <div>
                  <strong>Cashier:</strong> POS operations and basic inventory view
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
