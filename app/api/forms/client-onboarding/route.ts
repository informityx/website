import { NextRequest, NextResponse } from "next/server"
import { notifyClientOnboardingSubmission } from "@/lib/email"
import { prisma } from "@/lib/db/prisma"
import { clientOnboardingPayloadSchema } from "@/lib/forms/clientOnboardingSchema"
import { z } from "zod"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = clientOnboardingPayloadSchema.parse(body)

    const submission = await prisma.clientOnboardingSubmission.create({
      data: {
        data: validated as object,
      },
    })

    await notifyClientOnboardingSubmission({
      submissionId: submission.id,
      data: validated as Record<string, unknown>,
    })

    return NextResponse.json({ id: submission.id }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
