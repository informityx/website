/** Site-wide fallbacks when CMS fields omit SEO or social preview data. */

export const SITE_BRAND_NAME = "InforMityx"

export const DEFAULT_META_TITLE =
  "Build Intelligent Digital Products That Scale"

/**
 * Browser `<title>` and matching OG/Twitter titles: `A | B | … | InforMityx`.
 * Empty segments are skipped; if none remain, uses {@link DEFAULT_META_TITLE} as the only segment before the brand.
 */
export function documentTitle(
  ...segments: (string | null | undefined)[]
): string {
  const parts = segments.map((s) => s?.trim()).filter(Boolean) as string[]
  const core =
    parts.length > 0 ? parts.join(" | ") : DEFAULT_META_TITLE
  return `${core} | ${SITE_BRAND_NAME}`
}

export const DEFAULT_META_DESCRIPTION =
  "We partner with ambitious businesses to transform ideas into AI-powered, scalable digital solutions — combining strategy, engineering, and cutting-edge technology to drive real growth."

export const DEFAULT_OG_IMAGE_URL =
  "https://67urebutdkgdnnmw.public.blob.vercel-storage.com/page-banner-image/final-logo-v-1773093965921-8AtGUPnAGGPvnJRBaJSHp1uWKIxZzz.png"

export function withDefaultMetaTitle(
  value: string | null | undefined
): string {
  const t = value?.trim()
  return t || DEFAULT_META_TITLE
}

export function withDefaultMetaDescription(
  value: string | null | undefined
): string {
  const d = value?.trim()
  return d || DEFAULT_META_DESCRIPTION
}

/** Use when no page-specific image was resolved (relative or absolute). */
export function withDefaultOgImageUrl(
  resolvedAbsolute: string | null | undefined
): string {
  const u = resolvedAbsolute?.trim()
  return u || DEFAULT_OG_IMAGE_URL
}
