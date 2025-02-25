"use client"

import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  const router = useRouter()

  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/")
  }

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
      <div className="font-semibold">Social Media Analytics</div>
        <nav className="ml-auto flex items-center space-x-4">
          <Button variant="ghost">Reports</Button>
          <Button variant="ghost">Settings</Button>
          {/* Trending Button using shadcn/ui */}
          <Button variant="default" onClick={() => router.push("/trending")}>
            Trending
          </Button>
          <ModeToggle />
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </nav>
      </div>
    </header>
  )
}

