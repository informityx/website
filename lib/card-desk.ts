import type { CardItem, SectionContent } from "@/types/cms"

/** Minimal section shape for resolving the card desk target. */
export type CardDeskSectionLike = {
  id: string
  customTypeId: string | null
  type: string
  order: number
  content: unknown
}

export type CardDeskCustomTypeLike = {
  id: string
  cardDeskSectionId: string | null
}

export function resolveCardDeskSection(
  customType: CardDeskCustomTypeLike,
  sections: CardDeskSectionLike[]
): CardDeskSectionLike | null {
  if (customType.cardDeskSectionId) {
    const s = sections.find((x) => x.id === customType.cardDeskSectionId)
    if (s && s.customTypeId === customType.id && s.type === "cards") {
      return s
    }
    return null
  }
  const cardsSections = sections
    .filter((s) => s.customTypeId === customType.id && s.type === "cards")
    .sort((a, b) => a.order - b.order)
  return cardsSections[0] ?? null
}

export function parseCardsFromSectionContent(content: unknown): CardItem[] {
  const c = content as SectionContent | null
  if (!c || !Array.isArray(c.cards)) return []
  return c.cards as CardItem[]
}

/** Assign UUIDs to cards missing `id`. */
export function ensureCardIds(cards: CardItem[]): { cards: CardItem[]; changed: boolean } {
  let changed = false
  const next = cards.map((card) => {
    if (card.id) return card
    changed = true
    return { ...card, id: crypto.randomUUID() }
  })
  return { cards: next, changed }
}

export function findCardIndexById(cards: CardItem[], cardId: string): number {
  return cards.findIndex((c) => c.id === cardId)
}

export function filterCardsByQuery(cards: CardItem[], q: string): CardItem[] {
  const needle = q.trim().toLowerCase()
  if (!needle) return cards
  return cards.filter((card) => {
    const h = (card.heading || "").toLowerCase()
    const d = (card.description || "").toLowerCase()
    const slug = (card.cardSlug || "").toLowerCase()
    return h.includes(needle) || d.includes(needle) || slug.includes(needle)
  })
}

export function paginateCards<T>(items: T[], page: number, pageSize: number): { slice: T[]; total: number; page: number; pageSize: number } {
  const safeSize = Math.min(Math.max(pageSize, 1), 100)
  const safePage = Math.max(page, 1)
  const total = items.length
  const start = (safePage - 1) * safeSize
  const slice = items.slice(start, start + safeSize)
  return { slice, total, page: safePage, pageSize: safeSize }
}
