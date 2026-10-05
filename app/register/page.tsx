import { RegisterForm } from "./form"
import LoginBg from "@/app/login-bg.jpg"
import Image from "next/image"
import { Suspense } from "react"
import Logo from "@/components/logo"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an account in Campus Care",
}

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/login" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Logo className="size-4 fill-white" />
            </div>
            Campus Care
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Suspense>
              <RegisterForm />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={LoginBg}
          alt="Campus Care Background"
          priority
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
