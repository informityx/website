import sanitizeHtml from "sanitize-html"

const richOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "ul",
    "ol",
    "li",
    "a",
    "h1",
    "h2",
    "h3",
    "h4",
    "blockquote",
    "code",
    "pre",
    "img",
    "video",
    "div",
    "iframe",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    code: ["class"],
    pre: ["class"],
    img: ["src", "alt", "title", "width", "height", "class", "loading"],
    video: ["src", "controls", "class", "width", "height", "playsinline"],
    div: ["data-youtube-video", "class"],
    iframe: [
      "src",
      "width",
      "height",
      "allow",
      "allowfullscreen",
      "frameborder",
      "class",
      "title",
      "referrerpolicy",
    ],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: {
    img: ["http", "https"],
    video: ["http", "https"],
    iframe: ["http", "https"],
  },
  allowedIframeHostnames: [
    "www.youtube.com",
    "www.youtube-nocookie.com",
    "youtube.com",
    "player.vimeo.com",
  ],
  allowedIframeDomains: ["youtube.com", "youtube-nocookie.com", "vimeo.com"],
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        rel: attribs.target === "_blank" ? "noopener noreferrer" : attribs.rel,
      },
    }),
  },
}

export function sanitizeRichHtml(html: string): string {
  return sanitizeHtml(html || "", richOptions)
}

/** Strip tags for meta descriptions / plain previews. */
export function plainTextFromHtml(html: string): string {
  return sanitizeHtml(html || "", { allowedTags: [], allowedAttributes: {} }).trim()
}

/** True when HTML has visible text (ignores empty paragraphs from editors). */
export function hasMeaningfulHtml(html?: string | null): boolean {
  if (!html?.trim()) return false
  return plainTextFromHtml(html).length > 0
}
