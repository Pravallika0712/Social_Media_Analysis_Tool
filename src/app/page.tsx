import { AuthForm } from "@/components/auth-form"
import { ModeToggle } from "@/components/mode-toggle"

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <AuthForm />
    </div>
  )
}

