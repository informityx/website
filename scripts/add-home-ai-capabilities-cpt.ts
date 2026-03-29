/**
 * Creates or updates the `ai-capabilities` Custom Type (Section 4 PDF), a `cards` section
 * with six capabilities, and a `customPostType` section on the home page.
 *
 * Usage: npx tsx scripts/add-home-ai-capabilities-cpt.ts
 * Auth: CMS_ADMIN_PASSWORD + NEXT_PUBLIC_APP_URL (default http://localhost:9000)
 * DB fallback: omit CMS_ADMIN_PASSWORD (Prisma; same shapes as API).
 */

import { PrismaClient } from "@prisma/client"
import { parseSectionContent } from "../lib/section-content-parse"
import {
  AI_CAPABILITIES_CPT_SLUG,
  AI_CARDS_SECTION_ORDER,
  AI_HOME_SECTION_ORDER,
  AI_ITEMS_TO_SHOW,
  buildAiCapabilitiesCardsSectionContent,
  buildCustomPostTypeSectionContent,
  buildCustomTypeCreateBody,
} from "./ai-capabilities-cpt-content"

const prisma = new PrismaClient()

type CookieJar = Map<string, string>

function applySetCookie(res: Response, jar: CookieJar) {
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

function cookieHeader(jar: CookieJar) {
  return Array.from(jar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join("; ")
}

interface CustomTypeRow {
  id: string
  slug: string
  name: string
  isPublished: boolean
}

interface SectionRow {
  id: string
  type: string
  order: number
  content: unknown
}

async function signIn(baseUrl: string, email: string, password: string): Promise<CookieJar | null> {
  const jar: CookieJar = new Map()

  const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`, {
    headers: { Cookie: cookieHeader(jar) },
  })
  applySetCookie(csrfRes, jar)
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
      Cookie: cookieHeader(jar),
    },
    body: body.toString(),
    redirect: "manual",
  })
  applySetCookie(signRes, jar)

  if (signRes.status !== 200 && signRes.status !== 302) {
    console.error("Sign-in failed: HTTP", signRes.status)
    return null
  }
  if (signRes.headers.get("location")?.includes("error=")) {
    console.error("Sign-in failed: invalid CMS_ADMIN_EMAIL / CMS_ADMIN_PASSWORD")
    return null
  }

  return jar
}

async function tryApi(baseUrl: string, email: string, password: string): Promise<boolean> {
  const jar = await signIn(baseUrl, email, password)
  if (!jar) return false

  const authFetch = (input: string, init?: RequestInit) =>
    fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Cookie: cookieHeader(jar),
      },
    })

  const listCtRes = await authFetch(`${baseUrl}/api/custom-types`)
  if (!listCtRes.ok) {
    console.error("GET /api/custom-types failed", await listCtRes.text())
    return false
  }
  const allTypes = (await listCtRes.json()) as CustomTypeRow[]
  let ct = allTypes.find((t) => t.slug === AI_CAPABILITIES_CPT_SLUG)

  const createBody = buildCustomTypeCreateBody()

  if (!ct) {
    const postCt = await authFetch(`${baseUrl}/api/custom-types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createBody),
    })
    if (!postCt.ok) {
      console.error("POST /api/custom-types failed", await postCt.text())
      return false
    }
    ct = (await postCt.json()) as CustomTypeRow
    console.log("API: created CustomType", ct.id, ct.slug, {
      showInHeader: createBody.showInHeader,
      showInFooter: createBody.showInFooter,
    })
  } else {
    const putCt = await authFetch(`${baseUrl}/api/custom-types/${ct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: createBody.name,
        isPublished: true,
        showInHeader: createBody.showInHeader,
        showInFooter: createBody.showInFooter,
        showCardsInNav: createBody.showCardsInNav,
        order: createBody.order,
        bannerTitle: createBody.bannerTitle,
        bannerText: createBody.bannerText,
      }),
    })
    if (!putCt.ok) {
      console.error("PUT /api/custom-types failed", await putCt.text())
      return false
    }
    ct = (await putCt.json()) as CustomTypeRow
    console.log("API: updated CustomType", ct.id, ct.slug)
  }

  const cardsContent = buildAiCapabilitiesCardsSectionContent()
  const listSecRes = await authFetch(
    `${baseUrl}/api/sections?customTypeId=${encodeURIComponent(ct.id)}`
  )
  if (!listSecRes.ok) {
    console.error("GET sections (customType) failed", await listSecRes.text())
    return false
  }
  const cptSections = (await listSecRes.json()) as SectionRow[]
  const existingCards = cptSections.find(
    (s) => s.type === "cards" && s.order === AI_CARDS_SECTION_ORDER
  )

  if (existingCards) {
    const put = await authFetch(`${baseUrl}/api/sections/${existingCards.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: cardsContent,
        order: AI_CARDS_SECTION_ORDER,
        isVisible: true,
      }),
    })
    if (!put.ok) {
      console.error("PUT cards section failed", await put.text())
      return false
    }
    console.log("API: updated CPT cards section", existingCards.id)
  } else {
    const post = await authFetch(`${baseUrl}/api/sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customTypeId: ct.id,
        type: "cards",
        order: AI_CARDS_SECTION_ORDER,
        content: cardsContent,
        isVisible: true,
      }),
    })
    if (!post.ok) {
      console.error("POST cards section failed", await post.text())
      return false
    }
    const created = (await post.json()) as { id: string }
    console.log("API: created CPT cards section", created.id)
  }

  const settingsRes = await fetch(`${baseUrl}/api/settings`)
  const settings = (await settingsRes.json()) as { homePageId: string | null }
  if (!settings.homePageId) {
    console.error("No home page in site settings.")
    return false
  }

  const homeSectionsRes = await authFetch(
    `${baseUrl}/api/sections?pageId=${encodeURIComponent(settings.homePageId)}`
  )
  if (!homeSectionsRes.ok) {
    console.error("GET home sections failed", await homeSectionsRes.text())
    return false
  }
  const homeSections = (await homeSectionsRes.json()) as SectionRow[]
  const cptContent = buildCustomPostTypeSectionContent(ct.id)
  const existingHome = homeSections.find(
    (s) =>
      s.type === "customPostType" &&
      (s.content as { customTypeId?: string })?.customTypeId === ct.id
  )

  if (existingHome) {
    const put = await authFetch(`${baseUrl}/api/sections/${existingHome.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: cptContent,
        order: existingHome.order,
        isVisible: true,
      }),
    })
    if (!put.ok) {
      console.error("PUT home customPostType failed", await put.text())
      return false
    }
    console.log("API: updated home customPostType section", existingHome.id)
    return true
  }

  let order = AI_HOME_SECTION_ORDER
  const taken = homeSections.some((s) => s.order === order)
  if (taken) {
    const maxOrder = homeSections.reduce((m, s) => Math.max(m, s.order), 0)
    order = maxOrder + 1
    console.log(
      `Home order ${AI_HOME_SECTION_ORDER} taken; placing customPostType at order ${order}. Reorder in admin if needed.`
    )
  }

  const post = await authFetch(`${baseUrl}/api/sections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pageId: settings.homePageId,
      type: "customPostType",
      order,
      content: cptContent,
      isVisible: true,
    }),
  })
  if (!post.ok) {
    console.error("POST home customPostType failed", await post.text())
    return false
  }
  const created = (await post.json()) as { id: string }
  console.log("API: created home customPostType section", created.id, "order", order)
  console.log("  itemsToShow:", AI_ITEMS_TO_SHOW, "customTypeId:", ct.id)
  return true
}

async function viaPrisma(): Promise<void> {
  const body = buildCustomTypeCreateBody()

  let ct = await prisma.customType.findUnique({ where: { slug: AI_CAPABILITIES_CPT_SLUG } })
  if (!ct) {
    ct = await prisma.customType.create({
      data: {
        slug: body.slug,
        name: body.name,
        showInHeader: body.showInHeader,
        showInFooter: body.showInFooter,
        showCardsInNav: body.showCardsInNav,
        isPublished: body.isPublished,
        order: body.order,
        bannerTitle: body.bannerTitle,
        bannerText: body.bannerText,
      },
    })
    console.log("Prisma: created CustomType", ct.id, ct.slug)
  } else {
    ct = await prisma.customType.update({
      where: { id: ct.id },
      data: {
        name: body.name,
        isPublished: true,
        showInHeader: body.showInHeader,
        showInFooter: body.showInFooter,
        showCardsInNav: body.showCardsInNav,
        order: body.order,
        bannerTitle: body.bannerTitle,
        bannerText: body.bannerText,
      },
    })
    console.log("Prisma: updated CustomType", ct.id, ct.slug)
  }

  const cardsContent = buildAiCapabilitiesCardsSectionContent()
  const parsedCards = parseSectionContent("cards", cardsContent)

  const existingCards = await prisma.section.findFirst({
    where: {
      customTypeId: ct.id,
      type: "cards",
      order: AI_CARDS_SECTION_ORDER,
    },
  })

  if (existingCards) {
    await prisma.section.update({
      where: { id: existingCards.id },
      data: { content: parsedCards as object, isVisible: true },
    })
    console.log("Prisma: updated CPT cards section", existingCards.id)
  } else {
    const created = await prisma.section.create({
      data: {
        customTypeId: ct.id,
        type: "cards",
        order: AI_CARDS_SECTION_ORDER,
        content: parsedCards as object,
        isVisible: true,
      },
    })
    console.log("Prisma: created CPT cards section", created.id)
  }

  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } })
  const homePageId = settings?.homePageId
  if (!homePageId) {
    throw new Error("No homePageId in SiteSettings. Set a home page in admin first.")
  }

  const cptSectionContent = buildCustomPostTypeSectionContent(ct.id)
  const parsedCpt = parseSectionContent("customPostType", cptSectionContent)

  const existingHome = await prisma.section.findFirst({
    where: {
      pageId: homePageId,
      type: "customPostType",
      content: {
        path: ["customTypeId"],
        equals: ct.id,
      },
    },
  })

  if (existingHome) {
    await prisma.section.update({
      where: { id: existingHome.id },
      data: { content: parsedCpt as object, isVisible: true },
    })
    console.log("Prisma: updated home customPostType section", existingHome.id)
    return
  }

  const homeSections = await prisma.section.findMany({
    where: { pageId: homePageId },
    orderBy: { order: "asc" },
  })
  let order = AI_HOME_SECTION_ORDER
  if (homeSections.some((s) => s.order === order)) {
    const maxOrder = homeSections.reduce((m, s) => Math.max(m, s.order), 0)
    order = maxOrder + 1
    console.log(
      `Prisma: order ${AI_HOME_SECTION_ORDER} taken; using order ${order}. Reorder in admin if needed.`
    )
  }

  const created = await prisma.section.create({
    data: {
      pageId: homePageId,
      type: "customPostType",
      order,
      content: parsedCpt as object,
      isVisible: true,
    },
  })
  console.log("Prisma: created home customPostType section", created.id, "order", order)
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
