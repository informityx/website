import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const authDebug = process.env.AUTH_DEBUG === "true"

export default auth((request) => {
  const pathname = request.nextUrl.pathname
  const isLoggedIn = !!request.auth

  if (authDebug) {
    console.log("[auth-middleware]", {
      pathname,
      isLoggedIn,
      hasAuth: !!request.auth,
      userEmail: request.auth?.user?.email ?? null,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasAuthSecret: !!process.env.AUTH_SECRET,
    })
  }

  // Don't protect login page
  if (pathname === "/admin-login") {
    // If already logged in and trying to access login, redirect to admin
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return NextResponse.next()
  }

  // Protect all admin routes
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin-login", request.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/admin-login"],
}
