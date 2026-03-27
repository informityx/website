import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { parseSectionContent } from "@/lib/section-content-parse"
import { z } from "zod"

const sectionUpdateSchema = z.object({
  type: z.string().min(1).optional(),
  order: z.number().optional(),
  content: z.any().optional(),
  isVisible: z.boolean().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const data = sectionUpdateSchema.parse(body)
    const existing = await prisma.section.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 })
    }

    const nextType = data.type ?? existing.type
    const updateData: {
      type?: string
      order?: number
      content?: object
      isVisible?: boolean
    } = {
      type: data.type,
      order: data.order,
      isVisible: data.isVisible,
    }
    if (data.content !== undefined) {
      updateData.content = parseSectionContent(nextType, data.content)
    }

    const section = await prisma.section.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(section)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    await prisma.section.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
