"use client"

import { useMemo, useState, useTransition } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, EyeIcon, EyeOffIcon, Loader2, X } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { registerUser } from "./actions"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const requirements = useMemo(() => {
    return [
      {
        id: "length",
        label: "At least 8 characters",
        met: password.length >= 8,
      },
      {
        id: "uppercase",
        label: "At least 1 uppercase letter (A-Z)",
        met: /[A-Z]/.test(password),
      },
      {
        id: "lowercase",
        label: "At least 1 lowercase letter (a-z)",
        met: /[a-z]/.test(password),
      },
      {
        id: "number",
        label: "At least 1 number (0-9)",
        met: /[0-9]/.test(password),
      },
      {
        id: "special",
        label: "At least 1 special character (!@#$%^&*)",
        met: /[^A-Za-z0-9]/.test(password),
      },
    ]
  }, [password])

  const strengthScore = useMemo(() => {
    return requirements.filter((r) => r.met).length
  }, [requirements])

  const strengthMeta = useMemo(() => {
    if (!password) {
      return { label: "", colorClass: "bg-muted", textClass: "text-muted-foreground", width: "0%" }
    }
    switch (strengthScore) {
      case 1:
        return { label: "Very Weak", colorClass: "bg-red-500", textClass: "text-red-500", width: "20%" }
      case 2:
        return { label: "Weak", colorClass: "bg-orange-500", textClass: "text-orange-500", width: "40%" }
      case 3:
        return { label: "Fair", colorClass: "bg-amber-500", textClass: "text-amber-500", width: "60%" }
      case 4:
        return { label: "Good", colorClass: "bg-blue-500", textClass: "text-blue-500", width: "80%" }
      case 5:
        return { label: "Strong", colorClass: "bg-emerald-500", textClass: "text-emerald-500", width: "100%" }
      default:
        return { label: "", colorClass: "bg-muted", textClass: "text-muted-foreground", width: "0%" }
    }
  }, [password, strengthScore])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const email = (formData.get("email") as string)?.trim()

    if (strengthScore < 5) {
      toast.error("Please meet all password requirements before submitting.")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    startTransition(async () => {
      const res = await registerUser(formData)

      if (res.error) {
        toast.error(res.error)
        return
      }

      toast.success("Account created successfully! Logging you in...")

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (signInRes?.error) {
        toast.info("Please login with your new account.")
        router.push("/login")
      } else {
        router.push("/")
        router.refresh()
      }
    })
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Sign up to start booking clinic appointments
        </p>
      </div>

      <div className="grid gap-4">
        {/* Email Field */}
        <div className="grid gap-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            name="email"
            type="email"
            placeholder="student@example.com"
            required
            disabled={isPending}
          />
        </div>

        {/* Password Field */}
        <div className="grid gap-2">
          <Label htmlFor="register-password">Password</Label>
          <div className="relative">
            <Input
              id="register-password"
              className="pe-9"
              placeholder="Create a strong password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isPending}
            />
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOffIcon size={16} aria-hidden="true" />
              ) : (
                <EyeIcon size={16} aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Password Strength Progress Bar */}
          {password.length > 0 && (
            <div className="mt-1 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Password strength</span>
                <span className={cn("font-medium", strengthMeta.textClass)}>
                  {strengthMeta.label}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      step <= strengthScore ? strengthMeta.colorClass : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Password Requirements Checklist */}
          <div className="mt-2 rounded-lg border bg-muted/40 p-3 space-y-1.5 text-xs">
            <span className="font-medium text-foreground block mb-1">
              Password must contain:
            </span>
            {requirements.map((req) => (
              <div
                key={req.id}
                className={cn(
                  "flex items-center gap-2 transition-colors duration-200",
                  req.met
                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                    : "text-muted-foreground"
                )}
              >
                {req.met ? (
                  <Check className="size-3.5 shrink-0 stroke-[2.5]" />
                ) : (
                  <X className="size-3.5 shrink-0 text-muted-foreground/60" />
                )}
                <span>{req.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="grid gap-2">
          <Label htmlFor="register-confirm-password">Confirm Password</Label>
          <div className="relative">
            <Input
              id="register-confirm-password"
              className="pe-9"
              placeholder="Confirm your password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isPending}
            />
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOffIcon size={16} aria-hidden="true" />
              ) : (
                <EyeIcon size={16} aria-hidden="true" />
              )}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <span className="text-xs text-red-500 font-medium">
              Passwords do not match
            </span>
          )}
          {confirmPassword && password === confirmPassword && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <Check className="size-3" /> Passwords match
            </span>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full mt-2"
          disabled={isPending || strengthScore < 5 || password !== confirmPassword}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4 text-primary hover:opacity-80">
          Login
        </Link>
      </div>
    </form>
  )
}
