/**
 * Section 7 — Staff Augmentation / Dedicated Teams (Team Extension): adds or updates
 * a split `headingParagraph` (intro, benefits, CTAs) plus a `cards` section (four offerings)
 * on the home page.
 *
 * Usage: npx tsx scripts/add-home-staff-augmentation-sections.ts
 * API: CMS_ADMIN_PASSWORD (+ optional CMS_ADMIN_EMAIL, NEXT_PUBLIC_APP_URL)
 * Prisma: omit CMS_ADMIN_PASSWORD
 */

import { PrismaClient } from "@prisma/client"
import { parseSectionContent } from "../lib/section-content-parse"
import type { CardItem } from "../types/cms"

const prisma = new PrismaClient()

/** Idempotent match for the intro block */
export const STAFF_AUGMENTATION_HEADING = "Scale Your Team with World-Class Talent"

/** Idempotent match for the offerings grid */
export const CORE_OFFERINGS_CARDS_TITLE = "Core Offerings"

function staffAugmentationCards(): CardItem[] {
  return [
    {
      heading: "Build Your Dedicated Development Team",
      description:
        "We assemble a team tailored to your needs — working as an extension of your company, fully aligned with your goals and processes.",
      overview:
        "We assemble a team tailored to your needs — working as an extension of your company, fully aligned with your goals and processes.",
    },
    {
      heading: "Access Specialized Talent Instantly",
      description:
        "Get immediate access to skilled professionals across AI, backend, frontend, DevOps, and cloud — without long recruitment cycles.",
      overview:
        "Get immediate access to skilled professionals across AI, backend, frontend, DevOps, and cloud — without long recruitment cycles.",
    },
    {
      heading: "Scale Up or Down Anytime",
      description:
        "Quickly adjust your team size based on project requirements, timelines, and business needs — without long-term commitments.",
      overview:
        "Quickly adjust your team size based on project requirements, timelines, and business needs — without long-term commitments.",
    },
    {
      heading: "We Handle Operations — You Focus on Growth",
      description:
        "From hiring and onboarding to payroll and HR, we manage everything — ensuring smooth collaboration and reduced operational burden.",
      overview:
        "From hiring and onboarding to payroll and HR, we manage everything — ensuring smooth collaboration and reduced operational burden.",
    },
  ]
}

export function buildStaffAugmentationHeadingContent(): object {
  return parseSectionContent("headingParagraph", {
    backgroundColor: null,
    paddingPercent: 6,
    layout: "split",
    eyebrow: "Team Extension / Staff Augmentation",
    heading: STAFF_AUGMENTATION_HEADING,
    subheadline:
      "Extend your in-house team with experienced engineers, AI specialists, and product experts — without the overhead of hiring and management.",
    body: "Whether you need to accelerate development, fill skill gaps, or scale quickly, we provide highly skilled professionals who integrate seamlessly into your workflows — delivering results from day one.",
    headlineTag: "h2",
    contentAlignment: "left",
    visualPosition: "right",
    primaryCtaText: "Hire Dedicated Team",
    primaryCtaLink: "/contact",
    primaryCtaVisible: true,
    secondaryCtaText: "Talk to Our Experts",
    secondaryCtaLink: "/contact",
    secondaryCtaVisible: true,
    image: "",
    imageAlt:
      "Global remote tech team collaboration — developers connected digitally, modern collaborative workspace",
    accentColor: "#3b82f6",
    textColor: "#ffffff",
    subTextColor: "#cbd5e1",
    trustPoints: [
      "Immediate onboarding with zero hiring delays",
      "Reduced operational and HR overhead",
      "Access to top-tier, pre-vetted talent",
      "Seamless integration with your existing team",
      "Faster delivery and improved efficiency",
    ],
    showTimeline: false,
    paragraphs: [],
  })
}

export function buildCoreOfferingsCardsContent(): object {
  return parseSectionContent("cards", {
    backgroundColor: null,
    paddingPercent: 5,
    title: CORE_OFFERINGS_CARDS_TITLE,
    subText: "",
    cardsPerRow: 2,
    cards: staffAugmentationCards(),
  })
}

type SectionRow = { id: string; type: string; order: number; content: unknown }

async function signInAndGetHomePageId(
  baseUrl: string,
  email: string,
  password: string
): Promise<{ cookieHeader: () => string; homePageId: string } | null> {
  const jar = new Map<string, string>()

  const applySetCookie = (res: Response) => {
    const list =
      typeof (res.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie === "function"
        ? (res.headers as unknown as { getSetCookie: () => string[] }).getSetCookie()
        : []
    const single = res.headers.get("set-cookie")
    const parts = list.length > 0 ? list : single ? [single] : []
    for (const line of parts) {
      const [pair] = line.split(";")
      const eq = pair.indexOf("=")
      if (eq === -1) continue
      const name = pair.slice(0, eq).trim()
      const value = pair.slice(eq + 1).trim()
      jar.set(name, value)
    }
  }

  const cookieHeader = () =>
    Array.from(jar.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join("; ")

  const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`, {
    headers: { Cookie: cookieHeader() },
  })
  applySetCookie(csrfRes)
  const { csrfToken } = (await csrfRes.json()) as { csrfToken: string }

  const body = new URLSearchParams({
    csrfToken,
    email,
    password,
    redirect: "false",
    json: "true",
  })

  const signRes = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookieHeader(),
    },
    body: body.toString(),
    redirect: "manual",
  })
  applySetCookie(signRes)

  if (signRes.status !== 200 && signRes.status !== 302) {
    console.error("Sign-in failed: HTTP", signRes.status)
    return null
  }
  if (signRes.headers.get("location")?.includes("error=")) {
    console.error("Sign-in failed: invalid CMS_ADMIN_EMAIL / CMS_ADMIN_PASSWORD")
    return null
  }

  const settingsRes = await fetch(`${baseUrl}/api/settings`, {
    headers: { Cookie: cookieHeader() },
  })
  const settings = (await settingsRes.json()) as { homePageId: string | null }
  if (!settings.homePageId) {
    console.error("No home page in site settings.")
    return null
  }

  return { cookieHeader, homePageId: settings.homePageId }
}

async function fetchSectionsApi(
  baseUrl: string,
  homePageId: string,
  cookieHeader: () => string
): Promise<SectionRow[]> {
  const listRes = await fetch(
    `${baseUrl}/api/sections?pageId=${encodeURIComponent(homePageId)}`,
    { headers: { Cookie: cookieHeader() } }
  )
  return (await listRes.json()) as SectionRow[]
}

async function tryApi(baseUrl: string, email: string, password: string): Promise<boolean> {
  const session = await signInAndGetHomePageId(baseUrl, email, password)
  if (!session) return false

  const { cookieHeader, homePageId } = session
  const headingContent = buildStaffAugmentationHeadingContent()
  const cardsContent = buildCoreOfferingsCardsContent()

  let sections = await fetchSectionsApi(baseUrl, homePageId, cookieHeader)
  const maxOrder = (list: SectionRow[]) =>
    list.length ? Math.max(...list.map((s) => s.order)) : 0

  const existingHeading = sections.find((s) => {
    if (s.type !== "headingParagraph") return false
    const c = s.content as { heading?: string }
    return c?.heading === STAFF_AUGMENTATION_HEADING
  })

  if (existingHeading) {
    const put = await fetch(`${baseUrl}/api/sections/${existingHeading.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader(),
      },
      body: JSON.stringify({ content: headingContent }),
    })
    if (!put.ok) {
      console.error("PUT headingParagraph section failed", await put.text())
      return false
    }
    console.log("API: updated Staff Augmentation headingParagraph (id %s)", existingHeading.id)
  } else {
    const post = await fetch(`${baseUrl}/api/sections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader(),
      },
      body: JSON.stringify({
        pageId: homePageId,
        type: "headingParagraph",
        order: maxOrder(sections) + 1,
        content: headingContent,
        isVisible: true,
      }),
    })
    if (!post.ok) {
      console.error("POST headingParagraph section failed", await post.text())
      return false
    }
    console.log("API: created Staff Augmentation headingParagraph")
  }

  sections = await fetchSectionsApi(baseUrl, homePageId, cookieHeader)

  const existingCards = sections.find((s) => {
    if (s.type !== "cards") return false
    const c = s.content as { title?: string }
    return c?.title === CORE_OFFERINGS_CARDS_TITLE
  })

  if (existingCards) {
    const put = await fetch(`${baseUrl}/api/sections/${existingCards.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader(),
      },
      body: JSON.stringify({ content: cardsContent }),
    })
    if (!put.ok) {
      console.error("PUT cards section failed", await put.text())
      return false
    }
    console.log("API: updated Core Offerings cards (id %s)", existingCards.id)
    return true
  }

  const post = await fetch(`${baseUrl}/api/sections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader(),
    },
    body: JSON.stringify({
      pageId: homePageId,
      type: "cards",
      order: maxOrder(sections) + 1,
      content: cardsContent,
      isVisible: true,
    }),
  })
  if (!post.ok) {
    console.error("POST cards section failed", await post.text())
    return false
  }
  const created = (await post.json()) as { id: string }
  console.log("API: created Core Offerings cards (id %s)", created.id)
  return true
}

async function viaPrisma(): Promise<void> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } })
  const homePageId = settings?.homePageId
  if (!homePageId) {
    throw new Error("No homePageId in SiteSettings. Set a home page in admin first.")
  }

  const headingContent = buildStaffAugmentationHeadingContent()
  const cardsContent = buildCoreOfferingsCardsContent()

  let sections = await prisma.section.findMany({
    where: { pageId: homePageId },
    orderBy: { order: "asc" },
  })

  const maxOrder = (list: typeof sections) =>
    list.length ? Math.max(...list.map((s) => s.order)) : 0

  const existingHeading = sections.find((s) => {
    if (s.type !== "headingParagraph") return false
    const c = s.content as { heading?: string }
    return c?.heading === STAFF_AUGMENTATION_HEADING
  })

  if (existingHeading) {
    await prisma.section.update({
      where: { id: existingHeading.id },
      data: { content: headingContent as object, isVisible: true },
    })
    console.log("Prisma: updated Staff Augmentation headingParagraph (id %s)", existingHeading.id)
  } else {
    await prisma.section.create({
      data: {
        pageId: homePageId,
        type: "headingParagraph",
        order: maxOrder(sections) + 1,
        content: headingContent as object,
        isVisible: true,
      },
    })
    console.log("Prisma: created Staff Augmentation headingParagraph")
  }

  sections = await prisma.section.findMany({
    where: { pageId: homePageId },
    orderBy: { order: "asc" },
  })

  const existingCards = sections.find((s) => {
    if (s.type !== "cards") return false
    const c = s.content as { title?: string }
    return c?.title === CORE_OFFERINGS_CARDS_TITLE
  })

  if (existingCards) {
    await prisma.section.update({
      where: { id: existingCards.id },
      data: { content: cardsContent as object, isVisible: true },
    })
    console.log("Prisma: updated Core Offerings cards (id %s)", existingCards.id)
    return
  }

  const created = await prisma.section.create({
    data: {
      pageId: homePageId,
      type: "cards",
      order: maxOrder(sections) + 1,
      content: cardsContent as object,
      isVisible: true,
    },
  })
  console.log("Prisma: created Core Offerings cards (id %s, order %s)", created.id, created.order)
}

async function main() {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9000").replace(/\/$/, "")
  const email = process.env.CMS_ADMIN_EMAIL || "admin@example.com"
  const password = process.env.CMS_ADMIN_PASSWORD

  if (password) {
    const ok = await tryApi(baseUrl, email, password)
    if (ok) return
    console.log("Falling back to Prisma…")
  } else {
    console.log("CMS_ADMIN_PASSWORD not set; using Prisma.")
  }

  await viaPrisma()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
