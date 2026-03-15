import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"

const getInTouchSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  inquiryType: z.string().min(1, "Inquiry type is required"),
  budget: z.string().optional().nullable(),
  timeline: z.string().optional().nullable(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = getInTouchSchema.parse(body)

    const submission = await prisma.getInTouchSubmission.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone ?? null,
        company: data.company ?? null,
        inquiryType: data.inquiryType,
        budget: data.budget ?? null,
        timeline: data.timeline ?? null,
        subject: data.subject,
        message: data.message,
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
