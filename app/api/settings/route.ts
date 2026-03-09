import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/prisma"
import { getOrCreateSettings } from "@/lib/db/settings"
import { z } from "zod"

const socialEntrySchema = z.object({
  url: z.string().optional(),
  text: z.string().optional(),
})
const settingsUpdateSchema = z.object({
  homePageId: z.string().nullable().optional(),
  headerBrandType: z.enum(["text", "logo"]).nullable().optional(),
  headerBrandText: z.string().nullable().optional(),
  headerLogoUrl: z
    .union([z.string().url(), z.literal("")])
    .nullable()
    .optional(),
  footerAboutVisible: z.boolean().optional(),
  footerAboutText: z.string().nullable().optional(),
  footerMenuVisible: z.boolean().optional(),
  footerSocialVisible: z.boolean().optional(),
  footerSubscribeVisible: z.boolean().optional(),
  footerSocialJson: z
    .object({
      fb: socialEntrySchema.optional(),
      insta: socialEntrySchema.optional(),
      twitter: socialEntrySchema.optional(),
      linkedin: socialEntrySchema.optional(),
      website: socialEntrySchema.optional(),
    })
    .optional()
    .nullable(),
  footerContactJson: z
    .object({
      name: z.string().optional(),
      email: z.string().optional(),
      phone1: z.string().optional(),
      phone2: z.string().optional(),
      address: z.string().optional(),
    })
    .optional()
    .nullable(),
})

const SITE_SETTINGS_ID = "default"

export async function GET() {
  try {
    const settings = await getOrCreateSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = settingsUpdateSchema.parse(body)

    await getOrCreateSettings()
    const settings = await prisma.siteSettings.update({
      where: { id: SITE_SETTINGS_ID },
      data: {
        ...(data.homePageId !== undefined && { homePageId: data.homePageId }),
        ...(data.headerBrandType !== undefined && {
          headerBrandType: data.headerBrandType,
        }),
        ...(data.headerBrandText !== undefined && {
          headerBrandText: data.headerBrandText,
        }),
        ...(data.headerLogoUrl !== undefined && {
          headerLogoUrl: data.headerLogoUrl === "" ? null : data.headerLogoUrl,
        }),
        ...(data.footerAboutVisible !== undefined && {
          footerAboutVisible: data.footerAboutVisible,
        }),
        ...(data.footerAboutText !== undefined && {
          footerAboutText: data.footerAboutText,
        }),
        ...(data.footerMenuVisible !== undefined && {
          footerMenuVisible: data.footerMenuVisible,
        }),
        ...(data.footerSocialVisible !== undefined && {
          footerSocialVisible: data.footerSocialVisible,
        }),
        ...(data.footerSubscribeVisible !== undefined && {
          footerSubscribeVisible: data.footerSubscribeVisible,
        }),
        ...(data.footerSocialJson !== undefined && {
          footerSocialJson: data.footerSocialJson as object,
        }),
        ...(data.footerContactJson !== undefined && {
          footerContactJson: data.footerContactJson as object,
        }),
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Failed to update settings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
