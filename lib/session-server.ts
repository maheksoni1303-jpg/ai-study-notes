"use server"

import { cookies } from "next/headers"
import { sessionOptions, type SessionData } from "./session"

export async function getSession(): Promise<SessionData> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(sessionOptions.cookieName)
  
  if (!cookie) {
    return {
      userId: "",
      email: "",
      name: "",
      isAdmin: false,
      isLoggedIn: false,
    }
  }

  try {
    const value = cookie.value
    const data = JSON.parse(Buffer.from(value, "base64").toString()) as SessionData
    return data
  } catch {
    return {
      userId: "",
      email: "",
      name: "",
      isAdmin: false,
      isLoggedIn: false,
    }
  }
}

export async function setSession(data: SessionData): Promise<void> {
  const cookieStore = await cookies()
  const value = Buffer.from(JSON.stringify(data)).toString("base64")
  cookieStore.set(sessionOptions.cookieName, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(sessionOptions.cookieName)
}