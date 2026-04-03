import type { SectionContent } from "@/types/cms"
import { getBaseUrl } from "@/lib/seo"

/** Absolute URL for Open Graph / Twitter (crawlers require absolute hrefs). */
export function toAbsoluteOgImageUrl(
  href: string | null | undefined
): string | undefined {
  const s = href?.trim()
  if (!s) return undefined
  if (/^https?:\/\//i.test(s)) return s
  const base = getBaseUrl().replace(/\/$/, "")
  const path = s.startsWith("/") ? s : `/${s}`
  return `${base}${path}`
}

type SectionRow = {
  type: string
  content: unknown
  isVisible: boolean
  order: number
}

function asContent(content: unknown): SectionContent {
  return content && typeof content === "object"
    ? (content as SectionContent)
    : {}
}

/** First image URL from visible sections, in layout order (hero, sliders, cards, etc.). */
export function firstImageFromVisibleSections(
  sections: SectionRow[]
): string | undefined {
  const sorted = [...sections]
    .filter((s) => s.isVisible)
    .sort((a, b) => a.order - b.order)

  for (const s of sorted) {
    const c = asContent(s.content)
    switch (s.type) {
      case "hero":
        if (c.heroImage?.trim()) return c.heroImage.trim()
        break
      case "textImage":
        if (c.image?.trim()) return c.image.trim()
        break
      case "imageSlider": {
        const first = c.images?.find((u) => u?.trim())
        if (first) return first.trim()
        break
      }
      case "headingParagraph":
        if (c.image?.trim()) return c.image.trim()
        break
      case "projectLifeCycle":
        for (const p of c.phases ?? []) {
          if (p.image?.trim()) return p.image.trim()
        }
        break
      case "cards":
        for (const card of c.cards ?? []) {
          if (card.image?.trim()) return card.image.trim()
        }
        break
      default:
        break
    }
  }
  return undefined
}

export function resolveBannerAndSectionOgImage(
  bannerImage: string | null | undefined,
  bannerBackgroundImage: string | null | undefined,
  sections: SectionRow[]
): string | undefined {
  const raw =
    bannerImage?.trim() ||
    firstImageFromVisibleSections(sections) ||
    bannerBackgroundImage?.trim()
  return toAbsoluteOgImageUrl(raw)
}

export function openGraphAndTwitterImages(
  absoluteImageUrl: string | undefined,
  imageAlt: string
): {
  openGraphImages?: { url: string; alt: string }[]
  twitterCard: "summary" | "summary_large_image"
  twitterImages?: string[]
} {
  if (!absoluteImageUrl) {
    return { twitterCard: "summary" }
  }
  return {
    openGraphImages: [{ url: absoluteImageUrl, alt: imageAlt }],
    twitterCard: "summary_large_image",
    twitterImages: [absoluteImageUrl],
  }
}
