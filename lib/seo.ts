export function getBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_URL || "http://localhost:9000"
  // Next's metadata expects absolute URLs; keep it stable + no trailing slash.
  return raw.replace(/\/$/, "")
}

export function canonicalUrl(pathname: string): string {
  const baseUrl = getBaseUrl()
  const normalized =
    pathname === "/" ? "/" : pathname.startsWith("/") ? pathname : `/${pathname}`
  return normalized === "/" ? baseUrl + "/" : baseUrl + normalized
}

export function canonicalFromSlug(slugParts: string[]): string {
  return canonicalUrl("/" + slugParts.join("/"))
}

