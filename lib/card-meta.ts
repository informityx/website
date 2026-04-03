import type { CardItem } from "@/types/cms"
import { hasMeaningfulHtml, plainTextFromHtml } from "@/lib/sanitize-html"

export function cardMetaDescription(card: CardItem): string | undefined {
  const d = card.description?.trim()
  if (d) return d
  const o = card.overview?.trim()
  if (o) return o
  if (hasMeaningfulHtml(card.detailHtml)) {
    const t = plainTextFromHtml(card.detailHtml!)
    return t.length <= 160 ? t : `${t.slice(0, 157)}…`
  }
  return undefined
}
