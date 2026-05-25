import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"
import { sessionOptions } from "./lib/session"

export default async function proxy(request: NextRequest) {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(sessionOptions.cookieName)
  
  let isLoggedIn = false
  let isAdmin = false

  if (cookie) {
    try {
      const data = JSON.parse(Buffer.from(cookie.value, "base64").toString())
      isLoggedIn = data.isLoggedIn || false
      isAdmin = data.isAdmin || false
    } catch {
      isLoggedIn = false
      isAdmin = false
    }
  }

  const protectedRoutes = ["/dashboard", "/upload", "/notes", "/bookmarks", "/profile", "/summary"]
  const adminRoutes = ["/admin"]

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )
  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = ["/login", "/register"].some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|uploads).*)",
  ],
}