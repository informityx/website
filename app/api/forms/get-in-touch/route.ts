import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getInTouchPayloadSchema } from "@/lib/forms/getInTouchSchema"
import { z } from "zod"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = getInTouchPayloadSchema.parse(body)

    const subject =
      data.subject ||
      `Get in touch${data.inquiryType ? ` — ${data.inquiryType}` : ""}`

    const submission = await prisma.getInTouchSubmission.create({
      data: {
        fullName: data.fullName,
        email: data.email ?? null,
        phone: data.phone?.trim() || null,
        company: data.company ?? null,
        inquiryType: data.inquiryType || "",
        budget: data.budget ?? null,
        timeline: data.timeline ?? null,
        subject,
        message: data.message || "",
      },
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
