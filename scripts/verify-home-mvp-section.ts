/**
 * Verifies home page MVP content block (headingParagraph @ order 1) matches expected shape.
 * Run: npx tsx scripts/verify-home-mvp-section.ts
 */

import { PrismaClient } from "@prisma/client"
import { getDefaultSectionContent } from "../lib/section-defaults"
import { parseSectionContent } from "../lib/section-content-parse"

const prisma = new PrismaClient()

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`ASSERT: ${msg}`)
}

async function main() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } })
  assert(!!settings?.homePageId, "SiteSettings.homePageId must be set")

  const sections = await prisma.section.findMany({
    where: { pageId: settings.homePageId! },
    orderBy: { order: "asc" },
  })

  const mvp = sections.find((s) => s.order === 1 && s.type === "headingParagraph")
  assert(!!mvp, "Expected headingParagraph section at order 1 on home page")

  const c = mvp!.content as Record<string, unknown>
  assert(c.layout === "split", "content.layout must be 'split'")
  assert(
    typeof c.heading === "string" && c.heading.includes("Enterprise MVP"),
    "heading must mention Enterprise MVP"
  )
  assert(
    typeof c.eyebrow === "string" && c.eyebrow.includes("USP"),
    "eyebrow must contain USP label"
  )
  assert(Array.isArray(c.valuePoints) && c.valuePoints.length === 6, "valuePoints must have 6 items")
  assert(Array.isArray(c.trustPoints) && c.trustPoints.length === 4, "trustPoints must have 4 items")
  assert(c.badgeText === "40 Days", "badgeText must be '40 Days'")
  assert(c.showTimeline === true, "showTimeline must be true")
  assert(
    Array.isArray(c.timelineLabels) && c.timelineLabels.length === 6,
    "timelineLabels must have 6 entries"
  )
  assert(c.headlineTag === "h2", "headlineTag should be h2 for section below hero")

  const expected = parseSectionContent(
    "headingParagraph",
    getDefaultSectionContent("headingParagraph")
  ) as Record<string, unknown>
  assert(
    c.heading === expected.heading && c.body === expected.body,
    "stored copy should match getDefaultSectionContent (PDF Section 2)"
  )

  console.log("verify-home-mvp-section: all checks passed")
  console.log("  homePageId:", settings.homePageId)
  console.log("  section id:", mvp!.id, "order:", mvp!.order, "visible:", mvp!.isVisible)
}

main()
  .catch((e) => {
    console.error("verify-home-mvp-section: FAILED", e instanceof Error ? e.message : e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
