/**
 * Verifies our-services CPT, cards section, and home customPostType wiring.
 * Run: npx tsx scripts/verify-home-services-cpt.ts
 */

import { PrismaClient } from "@prisma/client"
import {
  EXPECTED_SERVICE_CARD_HEADINGS,
  SERVICES_CPT_NAME,
  SERVICES_CPT_SLUG,
  SERVICES_ITEMS_TO_SHOW,
  SERVICES_CARDS_SECTION_ORDER,
} from "./services-cpt-content"

const prisma = new PrismaClient()

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`ASSERT: ${msg}`)
}

async function main() {
  const ct = await prisma.customType.findUnique({
    where: { slug: SERVICES_CPT_SLUG },
    include: {
      sections: { orderBy: { order: "asc" } },
    },
  })
  assert(!!ct, `CustomType slug "${SERVICES_CPT_SLUG}" must exist`)
  assert(ct!.isPublished === true, "CustomType must be published")
  assert(ct!.name === SERVICES_CPT_NAME, `CustomType name should be "${SERVICES_CPT_NAME}"`)

  const cardsSection = ct!.sections.find(
    (s) => s.type === "cards" && s.order === SERVICES_CARDS_SECTION_ORDER
  )
  assert(!!cardsSection, `Expected cards section at order ${SERVICES_CARDS_SECTION_ORDER} on CPT`)

  const content = cardsSection!.content as { cards?: { heading?: string; image?: string }[] }
  assert(Array.isArray(content.cards) && content.cards.length >= 6, "cards array must have at least 6 items")

  for (const heading of EXPECTED_SERVICE_CARD_HEADINGS) {
    const card = content.cards!.find((c) => c.heading === heading)
    assert(!!card, `Missing card heading: ${heading}`)
    assert(
      typeof card!.image === "string" && card!.image.startsWith("https://"),
      `Each service card must have an https image URL: ${heading}`
    )
  }

  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } })
  const homePageId = settings?.homePageId
  assert(!!homePageId, "SiteSettings.homePageId must be set")

  const homeCpt = await prisma.section.findFirst({
    where: {
      pageId: homePageId,
      type: "customPostType",
      content: {
        path: ["customTypeId"],
        equals: ct!.id,
      },
    },
  })
  assert(!!homeCpt, "Home page must have customPostType section pointing at our-services CPT")

  const homeContent = homeCpt!.content as { itemsToShow?: number; customTypeId?: string }
  assert(homeContent.customTypeId === ct!.id, "home customPostType.customTypeId must match CPT id")
  assert(
    homeContent.itemsToShow === SERVICES_ITEMS_TO_SHOW,
    `home customPostType itemsToShow must be ${SERVICES_ITEMS_TO_SHOW}`
  )

  console.log("verify-home-services-cpt: all checks passed")
  console.log("  CPT:", ct!.id, ct!.slug)
  console.log("  cards section:", cardsSection!.id, "card count:", content.cards!.length)
  console.log("  home section:", homeCpt!.id, "order:", homeCpt!.order)
}

main()
  .catch((e) => {
    console.error("verify-home-services-cpt: FAILED", e instanceof Error ? e.message : e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
