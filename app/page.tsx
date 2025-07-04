import { LoginForm } from "@/components/auth/login-form"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Grocery Store Dashboard</h1>
          <p className="mt-2 text-gray-600">Sign in to access your dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
