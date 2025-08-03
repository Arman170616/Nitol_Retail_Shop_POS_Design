"use client"

import { LogOut, User, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserProfileProps {
  user: {
    username: string
    role: string
    fullName: string
  }
  onLogout: () => void
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-pink-500 text-white"
      case "Manager":
        return "bg-blue-500 text-white"
      case "Cashier":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-pink-300 bg-white hover:bg-pink-50">
          <User className="h-4 w-4 mr-2" />
          {user.fullName}
          <Badge className={`ml-2 ${getRoleColor(user.role)}`}>{user.role}</Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.fullName}</p>
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Shield className="h-4 w-4 mr-2" />
          Role: {user.role}
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Clock className="h-4 w-4 mr-2" />
          Session: Active
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
