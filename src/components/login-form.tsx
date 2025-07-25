'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/lib/auth"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  // @ts-nocheck
  const handleChange = (e: any) => {
    setPassword(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  }

  // @ts-nocheck
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(password);
      router.push('/dashboard/turf');
    } catch (error) {
      console.error("Failed to login!!", error);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="gap-10">
        <CardHeader>
          <CardTitle>Login to admin panel</CardTitle>
          <CardDescription>
            Enter admin password below to login to your admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  value={password}
                  onChange={handleChange}
                  id="password"
                  type="password"
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  disabled={!password || loading}
                  type="submit"
                  className="w-full text-white cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}