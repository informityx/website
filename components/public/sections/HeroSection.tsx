import Link from "next/link"
import type { SectionContent } from "@/types/cms"

interface HeroSectionProps {
  content: SectionContent
}

export default function HeroSection({ content }: HeroSectionProps) {
  const eyebrow = content.eyebrow?.trim()
  const headline = content.headline?.trim()
  const subheadline = content.subheadline?.trim()
  const supportingLine = content.supportingLine?.trim()
  const contentAlignment = content.contentAlignment === "center" ? "center" : "left"
  const visualPosition = content.visualPosition === "left" ? "left" : "right"
  const accentColor = content.accentColor || "#3b82f6"
  const textColor = content.textColor || "#ffffff"
  const subTextColor = content.subTextColor || "#cbd5e1"
  const primaryCtaVisible = content.primaryCtaVisible ?? true
  const secondaryCtaVisible = content.secondaryCtaVisible ?? true
  const showPrimary = primaryCtaVisible && !!content.primaryCtaText
  const showSecondary = secondaryCtaVisible && !!content.secondaryCtaText
  const heroImage = content.heroImage?.trim()
  const heroImageAlt = content.heroImageAlt?.trim() || "Hero visual"
  const HeadlineTag = content.headlineTag === "h2" ? "h2" : "h1"

  return (
    <section className="relative rounded-3xl border border-blue-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-12 md:px-10 md:py-16 overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute -top-20 -right-10 h-56 w-56 rounded-full blur-3xl"
          style={{ backgroundColor: accentColor }}
        />
      </div>
      <div
        className={`relative z-10 grid gap-10 items-center ${
          heroImage ? "md:grid-cols-2" : "md:grid-cols-1"
        }`}
      >
        <div className={visualPosition === "left" && heroImage ? "md:order-2" : ""}>
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>
              {eyebrow}
            </p>
          )}
          {headline && (
            <HeadlineTag
              className={`text-4xl md:text-6xl font-bold leading-tight ${
                contentAlignment === "center" ? "text-center" : "text-left"
              }`}
              style={{ color: textColor }}
            >
              {headline}
            </HeadlineTag>
          )}
          {subheadline && (
            <p
              className={`mt-5 text-lg md:text-xl ${
                contentAlignment === "center" ? "text-center" : "text-left"
              }`}
              style={{ color: subTextColor }}
            >
              {subheadline}
            </p>
          )}
          {supportingLine && (
            <p
              className={`mt-4 text-base ${
                contentAlignment === "center" ? "text-center" : "text-left"
              }`}
              style={{ color: subTextColor }}
            >
              {supportingLine}
            </p>
          )}
          {(showPrimary || showSecondary) && (
            <div
              className={`mt-8 flex flex-wrap gap-4 ${
                contentAlignment === "center" ? "justify-center" : "justify-start"
              }`}
            >
              {showPrimary && (
                <Link
                  href={content.primaryCtaLink || "#"}
                  className="inline-flex items-center rounded-xl px-6 py-3 font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: accentColor }}
                >
                  {content.primaryCtaText}
                </Link>
              )}
              {showSecondary && (
                <Link
                  href={content.secondaryCtaLink || "#"}
                  className="inline-flex items-center rounded-xl px-6 py-3 font-semibold text-white border border-white/30 hover:bg-white/10 transition"
                >
                  {content.secondaryCtaText}
                </Link>
              )}
            </div>
          )}
        </div>
        {heroImage && (
          <div className={visualPosition === "left" ? "md:order-1" : ""}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt={heroImageAlt}
              className="w-full rounded-2xl border border-white/10 shadow-2xl object-cover max-h-[460px]"
            />
          </div>
        )}
      </div>
    </section>
  )
}
