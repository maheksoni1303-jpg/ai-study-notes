"use server"

import { prisma } from "@/lib/prisma"
import { registerSchema, loginSchema } from "@/lib/validations"
import bcrypt from "bcryptjs"
import { setSession, destroySession } from "@/lib/session-server"
import { redirect } from "next/navigation"

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  const result = registerSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
  })

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { success: false, error: "Email already registered" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    await setSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      isLoggedIn: true,
    })

    redirect("/dashboard")
  } catch (error) {
    console.error("Register error:", error)
    return { success: false, error: "Database error occurred" }
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const result = loginSchema.safeParse({ email, password })

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return { success: false, error: "Invalid email or password" }
    }

    await setSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      isLoggedIn: true,
    })

    redirect("/dashboard")
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Database error occurred" }
  }
}

export async function logoutUser() {
  await destroySession()
  redirect("/login")
}