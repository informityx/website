import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"

const resetPasswordSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is disabled in production" },
      { status: 403 }
    )
  }

  /*
  curl -X POST http://localhost:9000/api/dev/reset-user-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","newPassword":"NewStrongPass123!"}' \
  -b "next-auth.session-token=YOUR_SESSION_COOKIE"
  */

  // const session = await auth()
  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  // }

  // const userRole = (session.user as any)?.role
  // if (userRole !== "admin") {
  //   return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  // }

  try {
    const body = await request.json()
    const { email, newPassword } = resetPasswordSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
      user: user.email,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
