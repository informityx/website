import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"

const sectionSchema = z.object({
  pageId: z.string().optional(),
  customTypeId: z.string().optional(),
  type: z.string().min(1),
  order: z.number().optional(),
  content: z.any(),
  isVisible: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const pageId = searchParams.get("pageId")
  const customTypeId = searchParams.get("customTypeId")

  if (pageId) {
    const sections = await prisma.section.findMany({
      where: { pageId },
      orderBy: { order: "asc" },
    })
    return NextResponse.json(sections)
  }

  if (customTypeId) {
    const sections = await prisma.section.findMany({
      where: { customTypeId },
      orderBy: { order: "asc" },
    })
    return NextResponse.json(sections)
  }

  const sections = await prisma.section.findMany({
    orderBy: { updatedAt: "desc" },
  })
  return NextResponse.json(sections)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = sectionSchema.parse(body)

    const hasPageId = !!data.pageId
    const hasCustomTypeId = !!data.customTypeId
    if (hasPageId === hasCustomTypeId) {
      return NextResponse.json(
        { error: "Exactly one of pageId or customTypeId is required." },
        { status: 400 }
      )
    }

    const section = await prisma.section.create({
      data: hasPageId
        ? {
            pageId: data.pageId!,
            type: data.type,
            order: data.order ?? 0,
            content: (data.content ?? {}) as object,
            isVisible: data.isVisible ?? true,
          }
        : {
            customTypeId: data.customTypeId!,
            type: data.type,
            order: data.order ?? 0,
            content: (data.content ?? {}) as object,
            isVisible: data.isVisible ?? true,
          },
    })

    return NextResponse.json(section, { status: 201 })
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
