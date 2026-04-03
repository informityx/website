/**
 * Section 6 — Why Choose Us (docs/inforMityx.ai.pdf): adds or updates a `cards` section
 * on the home page with six differentiator cards + trust strip in subText.
 *
 * Usage: npx tsx scripts/add-home-why-choose-cards.ts
 * API: CMS_ADMIN_PASSWORD (+ optional CMS_ADMIN_EMAIL, NEXT_PUBLIC_APP_URL)
 * Prisma: omit CMS_ADMIN_PASSWORD
 */

import { PrismaClient } from "@prisma/client"
import { parseSectionContent } from "../lib/section-content-parse"
import type { CardItem } from "../types/cms"

const prisma = new PrismaClient()

/** Match existing section for idempotent updates */
export const WHY_CHOOSE_US_SECTION_TITLE =
  "Why Businesses Choose Us as Their Technology Partner"

const WHY_CHOOSE_US_SUBTEXT = [
  "We combine deep technical expertise with a product-first mindset to deliver solutions that are scalable, reliable, and built for real-world impact.",
  "",
  "✓ Transparent communication  ·  ✓ Dedicated team  ·  ✓ Agile & iterative delivery  ·  ✓ Business-focused solutions",
].join("\n")

function whyChooseCards(): CardItem[] {
  return [
    {
      heading: "Built Around AI — Not Added Later",
      description:
        "Unlike traditional agencies, we don't treat AI as an add-on. We design products with intelligence at their core — enabling automation, smarter workflows, and better decision-making from day one.",
      overview:
        "Unlike traditional agencies, we don't treat AI as an add-on. We design products with intelligence at their core — enabling automation, smarter workflows, and better decision-making from day one.",
    },
    {
      heading: "We Think Like Product Owners",
      description:
        "We go beyond writing code — we help shape your product, prioritize features, and ensure everything we build aligns with business outcomes and user needs.",
      overview:
        "We go beyond writing code — we help shape your product, prioritize features, and ensure everything we build aligns with business outcomes and user needs.",
    },
    {
      heading: "Scalable Architecture, Always",
      description:
        "We don't build quick fixes. Every system is designed with scalability, performance, and future growth in mind — so you don't have to rebuild later.",
      overview:
        "We don't build quick fixes. Every system is designed with scalability, performance, and future growth in mind — so you don't have to rebuild later.",
    },
    {
      heading: "Fast Execution. High Quality.",
      description:
        "Our streamlined processes and experienced team allow us to move quickly while maintaining high engineering standards and product quality.",
      overview:
        "Our streamlined processes and experienced team allow us to move quickly while maintaining high engineering standards and product quality.",
    },
    {
      heading: "From Idea to Launch — We Handle Everything",
      description:
        "From initial concept to deployment and beyond, we manage the full lifecycle — ensuring consistency, accountability, and smooth execution.",
      overview:
        "From initial concept to deployment and beyond, we manage the full lifecycle — ensuring consistency, accountability, and smooth execution.",
    },
    {
      heading: "We Grow With You",
      description:
        "We don't disappear after delivery. We partner with you long-term to optimize, scale, and evolve your product as your business grows.",
      overview:
        "We don't disappear after delivery. We partner with you long-term to optimize, scale, and evolve your product as your business grows.",
    },
  ]
}

export function buildWhyChooseUsCardsSectionContent(): object {
  return {
    backgroundColor: null,
    paddingPercent: 5,
    title: WHY_CHOOSE_US_SECTION_TITLE,
    subText: WHY_CHOOSE_US_SUBTEXT,
    cardsPerRow: 2,
    cards: whyChooseCards(),
  }
}

function sectionContent(): object {
  return parseSectionContent("cards", buildWhyChooseUsCardsSectionContent())
}

async function tryApi(baseUrl: string, email: string, password: string): Promise<boolean> {
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
    return false
  }
  if (signRes.headers.get("location")?.includes("error=")) {
    console.error("Sign-in failed: invalid CMS_ADMIN_EMAIL / CMS_ADMIN_PASSWORD")
    return false
  }

  const settingsRes = await fetch(`${baseUrl}/api/settings`)
  const settings = (await settingsRes.json()) as { homePageId: string | null }
  if (!settings.homePageId) {
    console.error("No home page in site settings.")
    return false
  }

  const content = sectionContent()
  const listRes = await fetch(
    `${baseUrl}/api/sections?pageId=${encodeURIComponent(settings.homePageId)}`
  )
  const sections = (await listRes.json()) as Array<{ id: string; type: string; order: number; content: unknown }>

  const existing = sections.find((s) => {
    if (s.type !== "cards") return false
    const c = s.content as { title?: string }
    return c?.title === WHY_CHOOSE_US_SECTION_TITLE
  })

  if (existing) {
    const put = await fetch(`${baseUrl}/api/sections/${existing.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader(),
      },
      body: JSON.stringify({ content }),
    })
    if (!put.ok) {
      console.error("PUT section failed", await put.text())
      return false
    }
    console.log("API: updated Why Choose Us cards section (id %s)", existing.id)
    return true
  }

  const maxOrder = sections.length ? Math.max(...sections.map((s) => s.order)) : 0
  const post = await fetch(`${baseUrl}/api/sections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader(),
    },
    body: JSON.stringify({
      pageId: settings.homePageId,
      type: "cards",
      order: maxOrder + 1,
      content,
      isVisible: true,
    }),
  })
  if (!post.ok) {
    console.error("POST section failed", await post.text())
    return false
  }
  const created = (await post.json()) as { id: string }
  console.log("API: created Why Choose Us cards section (id %s, order %s)", created.id, maxOrder + 1)
  return true
}

async function viaPrisma(): Promise<void> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } })
  const homePageId = settings?.homePageId
  if (!homePageId) {
    throw new Error("No homePageId in SiteSettings. Set a home page in admin first.")
  }

  const content = sectionContent()
  const sections = await prisma.section.findMany({
    where: { pageId: homePageId },
    orderBy: { order: "asc" },
  })

  const existing = sections.find((s) => {
    if (s.type !== "cards") return false
    const c = s.content as { title?: string }
    return c?.title === WHY_CHOOSE_US_SECTION_TITLE
  })

  if (existing) {
    await prisma.section.update({
      where: { id: existing.id },
      data: { content: content as object, isVisible: true },
    })
    console.log("Prisma: updated Why Choose Us cards (id %s)", existing.id)
    return
  }

  const maxOrder = sections.length ? Math.max(...sections.map((s) => s.order)) : 0
  const created = await prisma.section.create({
    data: {
      pageId: homePageId,
      type: "cards",
      order: maxOrder + 1,
      content: content as object,
      isVisible: true,
    },
  })
  console.log("Prisma: created Why Choose Us cards (id %s, order %s)", created.id, maxOrder + 1)
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
