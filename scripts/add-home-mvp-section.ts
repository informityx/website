/**
 * Applies Section 2 (Enterprise MVP) content to the home page as a `headingParagraph`
 * content block with `layout: "split"` (same copy as docs/inforMityx.ai.pdf).
 *
 * 1) If CMS_ADMIN_PASSWORD is set (and optional CMS_ADMIN_EMAIL), signs in via Auth.js
 *    and uses POST /api/sections or PUT /api/sections/:id.
 * 2) Otherwise uses Prisma directly (same persistence as the API after parseSectionContent).
 *
 * Usage: npx tsx scripts/add-home-mvp-section.ts
 * Optional: CMS_ADMIN_EMAIL=admin@example.com CMS_ADMIN_PASSWORD='Admin@123' NEXT_PUBLIC_APP_URL=http://localhost:9000
 * (password matches prisma seed default unless you changed it)
 */

import { PrismaClient } from "@prisma/client"
import { parseSectionContent } from "../lib/section-content-parse"
import { getDefaultSectionContent } from "../lib/section-defaults"

const prisma = new PrismaClient()

function section2Content(): object {
  const raw = getDefaultSectionContent("headingParagraph")
  return parseSectionContent("headingParagraph", raw)
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

  const content = section2Content()
  const listRes = await fetch(
    `${baseUrl}/api/sections?pageId=${encodeURIComponent(settings.homePageId)}`
  )
  const sections = (await listRes.json()) as Array<{ id: string; type: string; order: number }>

  const at1 = sections.find((s) => s.order === 1 && s.type === "headingParagraph")
  if (at1) {
    const put = await fetch(`${baseUrl}/api/sections/${at1.id}`, {
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
    console.log("API: updated content block at order 1 (section id %s)", at1.id)
    return true
  }

  const post = await fetch(`${baseUrl}/api/sections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader(),
    },
    body: JSON.stringify({
      pageId: settings.homePageId,
      type: "headingParagraph",
      order: 1,
      content,
      isVisible: true,
    }),
  })
  if (!post.ok) {
    console.error("POST section failed", await post.text())
    return false
  }
  const created = (await post.json()) as { id: string }
  console.log("API: created content block at order 1 (section id %s)", created.id)
  return true
}

async function viaPrisma(): Promise<void> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } })
  const homePageId = settings?.homePageId
  if (!homePageId) {
    throw new Error("No homePageId in SiteSettings. Set a home page in admin first.")
  }

  const content = section2Content()
  const sections = await prisma.section.findMany({
    where: { pageId: homePageId },
    orderBy: { order: "asc" },
  })

  const at1 = sections.find((s) => s.order === 1 && s.type === "headingParagraph")
  if (at1) {
    await prisma.section.update({
      where: { id: at1.id },
      data: { content: content as object, isVisible: true },
    })
    console.log("Prisma: updated content block at order 1 (id %s)", at1.id)
    return
  }

  const anyHp = sections.find((s) => s.type === "headingParagraph")
  if (anyHp) {
    await prisma.section.update({
      where: { id: anyHp.id },
      data: { content: content as object, order: 1, isVisible: true },
    })
    console.log("Prisma: updated headingParagraph section, set order 1 (id %s)", anyHp.id)
    return
  }

  const hasOrder1 = sections.some((s) => s.order === 1)
  const order = hasOrder1 ? Math.max(0, ...sections.map((s) => s.order)) + 1 : 1

  const created = await prisma.section.create({
    data: {
      pageId: homePageId,
      type: "headingParagraph",
      order,
      content: content as object,
      isVisible: true,
    },
  })
  console.log(
    "Prisma: created content block (id %s, order %s).%s",
    created.id,
    order,
    hasOrder1
      ? " Order was bumped because another section already uses order 1; reorder in admin if needed."
      : ""
  )
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
    console.log("CMS_ADMIN_PASSWORD not set; using Prisma (set it to use POST/PUT /api/sections).")
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
