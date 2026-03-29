import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"

const RESERVED_SLUGS = ["services", "admin", "admin-login", "api", "media"]

const customTypeUpdateSchema = z.object({
  slug: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  showInHeader: z.boolean().optional(),
  showInFooter: z.boolean().optional(),
  showCardsInNav: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  order: z.number().optional(),
  mobileMenuIcon: z.string().optional().nullable(),
  bannerBackgroundImage: z.string().optional().nullable(),
  bannerOverlayColor: z.string().optional().nullable(),
  bannerOverlayOpacity: z.number().min(0).max(1).optional().nullable(),
  bannerTitle: z.string().optional().nullable(),
  bannerText: z.string().optional().nullable(),
  bannerButtonText: z.string().optional().nullable(),
  bannerButtonLink: z.string().optional().nullable(),
  bannerButtonVisible: z.boolean().optional().nullable(),
  bannerImage: z.string().optional().nullable(),
  bannerHeightPercent: z.number().min(0).max(100).optional().nullable(),
})

function isSlugReserved(slug: string): boolean {
  const lower = slug.toLowerCase().trim()
  return RESERVED_SLUGS.includes(lower)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const customType = await prisma.customType.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { order: "asc" },
      },
    },
  })

  if (!customType) {
    return NextResponse.json({ error: "Custom type not found" }, { status: 404 })
  }

  return NextResponse.json(customType)
}

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
    const data = customTypeUpdateSchema.parse(body)

    if (data.slug !== undefined && isSlugReserved(data.slug)) {
      return NextResponse.json(
        { error: `Slug "${data.slug}" is reserved.` },
        { status: 400 }
      )
    }

    if (data.slug !== undefined) {
      const existing = await prisma.customType.findFirst({
        where: {
          slug: data.slug,
          NOT: { id },
        },
      })
      if (existing) {
        return NextResponse.json(
          { error: "A custom type with this slug already exists." },
          { status: 400 }
        )
      }
    }

    const customType = await prisma.customType.update({
      where: { id },
      data,
    })

    return NextResponse.json(customType)
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
    await prisma.customType.delete({
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
