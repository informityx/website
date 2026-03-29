import type { CardItem } from "@/types/cms"
import { slugify } from "@/lib/slugify"

export type CptCardNavLink = { href: string; label: string }

/** URL segment for a card: explicit cardSlug or slugified heading. */
export function cardUrlSegment(card: CardItem): string {
  const fromSlug = card.cardSlug?.trim().toLowerCase()
  if (fromSlug) return fromSlug
  return slugify(card.heading || "").toLowerCase()
}

export function findCardInCptSections(
  sections: Array<{ type: string; content: unknown }>,
  urlSegment: string
): CardItem | null {
  const target = urlSegment.trim().toLowerCase()
  if (!target) return null

  for (const section of sections) {
    if (section.type !== "cards") continue
    const content = section.content as { cards?: CardItem[] }
    const cards = content?.cards ?? []
    const card = cards.find((c) => cardUrlSegment(c) === target)
    if (card) return card
  }
  return null
}

/** Ordered nav links for all cards in visible `cards` sections (deduped by segment). */
export function getCardNavLinksFromSections(
  customTypeSlug: string,
  sections: Array<{ type: string; content: unknown }>
): CptCardNavLink[] {
  const links: CptCardNavLink[] = []
  const seen = new Set<string>()

  for (const section of sections) {
    if (section.type !== "cards") continue
    const content = section.content as { cards?: CardItem[] }
    const cards = content?.cards ?? []
    for (const card of cards) {
      const heading = card.heading?.trim()
      if (!heading) continue
      const segment = cardUrlSegment(card)
      if (!segment || seen.has(segment)) continue
      seen.add(segment)
      links.push({
        href: `/${customTypeSlug}/${segment}`,
        label: heading,
      })
    }
  }

  return links
}
