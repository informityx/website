/**
 * Converts a string to a URL-safe slug.
 * e.g. "Who we are" → "who-we-are"
 */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-") // collapse multiple dashes
    .replace(/^-|-$/g, "") // trim leading/trailing dash
}
