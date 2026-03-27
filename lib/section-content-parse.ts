import { z } from "zod"

export const heroContentSchema = z.object({
  backgroundColor: z.string().nullable().optional(),
  paddingPercent: z.number().nullable().optional(),
  eyebrow: z.string().optional(),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  supportingLine: z.string().optional(),
  headlineTag: z.enum(["h1", "h2"]).optional(),
  contentAlignment: z.enum(["left", "center"]).optional(),
  visualPosition: z.enum(["left", "right"]).optional(),
  primaryCtaText: z.string().optional(),
  primaryCtaLink: z.string().optional(),
  primaryCtaVisible: z.boolean().optional(),
  secondaryCtaText: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  secondaryCtaVisible: z.boolean().optional(),
  heroImage: z.string().optional(),
  heroImageAlt: z.string().optional(),
  accentColor: z.string().optional(),
  textColor: z.string().optional(),
  subTextColor: z.string().optional(),
})

export const headingParagraphContentSchema = z.object({
  backgroundColor: z.string().nullable().optional(),
  paddingPercent: z.number().nullable().optional(),
  layout: z.enum(["simple", "split"]).optional(),
  heading: z.string().optional(),
  paragraphs: z.array(z.string()).optional(),
  eyebrow: z.string().optional(),
  subheadline: z.string().optional(),
  body: z.string().optional(),
  headlineTag: z.enum(["h1", "h2"]).optional(),
  contentAlignment: z.enum(["left", "center"]).optional(),
  visualPosition: z.enum(["left", "right"]).optional(),
  primaryCtaText: z.string().optional(),
  primaryCtaLink: z.string().optional(),
  primaryCtaVisible: z.boolean().optional(),
  secondaryCtaText: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  secondaryCtaVisible: z.boolean().optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  accentColor: z.string().optional(),
  textColor: z.string().optional(),
  subTextColor: z.string().optional(),
  valuePoints: z.array(z.string()).optional(),
  trustPoints: z.array(z.string()).optional(),
  badgeText: z.string().optional(),
  showTimeline: z.boolean().optional(),
  timelineLabels: z.array(z.string()).optional(),
})

export function parseSectionContent(type: string, content: unknown): object {
  const normalized = (content ?? {}) as object
  if (type === "hero") {
    return heroContentSchema.parse(normalized)
  }
  if (type === "headingParagraph") {
    return headingParagraphContentSchema.parse(normalized)
  }
  return normalized as object
}
