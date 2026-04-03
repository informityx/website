import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"

const RESERVED_SLUGS = ["services", "admin", "admin-login", "api", "media"]

const customTypeSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  showInHeader: z.boolean().optional(),
  showInFooter: z.boolean().optional(),
  showCardsInNav: z.boolean().optional(),
  showCardDeskInNav: z.boolean().optional(),
  cardDeskSectionId: z.string().min(1).optional().nullable(),
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get("slug")

  if (slug) {
    const customType = await prisma.customType.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
      },
    })
    return NextResponse.json(customType)
  }

  const customTypes = await prisma.customType.findMany({
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
  })
  return NextResponse.json(customTypes)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = customTypeSchema.parse(body)

    if (isSlugReserved(data.slug)) {
      return NextResponse.json(
        { error: `Slug "${data.slug}" is reserved.` },
        { status: 400 }
      )
    }

    const existing = await prisma.customType.findUnique({
      where: { slug: data.slug },
    })
    if (existing) {
      return NextResponse.json(
        { error: "A custom type with this slug already exists." },
        { status: 400 }
      )
    }

    const customType = await prisma.customType.create({
      data: {
        ...data,
        showInHeader: data.showInHeader ?? true,
        showInFooter: data.showInFooter ?? true,
        showCardsInNav: data.showCardsInNav ?? true,
        showCardDeskInNav: data.showCardDeskInNav ?? false,
        cardDeskSectionId: data.cardDeskSectionId ?? null,
        isPublished: data.isPublished ?? false,
        order: data.order ?? 0,
      },
    })

    return NextResponse.json(customType, { status: 201 })
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
