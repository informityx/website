import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"

const clientOnboardingSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  mainPointOfContact: z.string().min(1, "Main point of contact is required"),
  budgetRange: z.string().min(1, "Budget range is required"),
}).passthrough()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = clientOnboardingSchema.parse(body)

    const submission = await prisma.clientOnboardingSubmission.create({
      data: {
        data: validated as object,
      },
    })

    return NextResponse.json({ id: submission.id }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
