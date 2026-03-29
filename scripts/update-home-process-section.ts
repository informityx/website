/**
 * Applies Section 5 (How We Work / Process) from docs/inforMityx.ai.pdf to the home page
 * `projectLifeCycle` section — same structure as lib/section-defaults `projectLifeCycle`.
 *
 * 1) If CMS_ADMIN_PASSWORD is set, signs in and PUTs /api/sections/:id.
 * 2) Otherwise updates via Prisma.
 *
 * Usage: npx tsx scripts/update-home-process-section.ts
 */

import { PrismaClient } from "@prisma/client"
import { parseSectionContent } from "../lib/section-content-parse"
import { getDefaultSectionContent } from "../lib/section-defaults"

const prisma = new PrismaClient()

function processSectionContent(): object {
  const raw = getDefaultSectionContent("projectLifeCycle")
  return parseSectionContent("projectLifeCycle", raw)
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

  const content = processSectionContent()
  const listRes = await fetch(
    `${baseUrl}/api/sections?pageId=${encodeURIComponent(settings.homePageId)}`
  )
  const sections = (await listRes.json()) as Array<{ id: string; type: string; order: number }>

  const plc = sections.find((s) => s.type === "projectLifeCycle")
  if (plc) {
    const put = await fetch(`${baseUrl}/api/sections/${plc.id}`, {
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
    console.log("API: updated projectLifeCycle section (id %s)", plc.id)
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
      type: "projectLifeCycle",
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
  console.log("API: created projectLifeCycle section (id %s)", created.id)
  return true
}

async function viaPrisma(): Promise<void> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } })
  const homePageId = settings?.homePageId
  if (!homePageId) {
    throw new Error("No homePageId in SiteSettings. Set a home page in admin first.")
  }

  const content = processSectionContent()
  const sections = await prisma.section.findMany({
    where: { pageId: homePageId },
    orderBy: { order: "asc" },
  })

  const plc = sections.find((s) => s.type === "projectLifeCycle")
  if (plc) {
    await prisma.section.update({
      where: { id: plc.id },
      data: { content: content as object, isVisible: true },
    })
    console.log("Prisma: updated projectLifeCycle (id %s)", plc.id)
    return
  }

  const maxOrder = sections.length ? Math.max(...sections.map((s) => s.order)) : 0
  const created = await prisma.section.create({
    data: {
      pageId: homePageId,
      type: "projectLifeCycle",
      order: maxOrder + 1,
      content: content as object,
      isVisible: true,
    },
  })
  console.log("Prisma: created projectLifeCycle (id %s, order %s)", created.id, maxOrder + 1)
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
