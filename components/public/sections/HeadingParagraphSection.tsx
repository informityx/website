import Link from "next/link"
import type { SectionContent } from "@/types/cms"

interface HeadingParagraphSectionProps {
  content: SectionContent
}

function useRichSplitLayout(content: SectionContent): boolean {
  if (content.layout === "split") return true
  if (typeof content.image === "string" && content.image.trim().length > 0) return true
  return false
}

export default function HeadingParagraphSection({ content }: HeadingParagraphSectionProps) {
  if (!useRichSplitLayout(content)) {
    return <SimpleHeadingParagraph content={content} />
  }
  return <SplitMarketingBlock content={content} />
}

function SimpleHeadingParagraph({ content }: HeadingParagraphSectionProps) {
  const heading = content.heading?.trim() ?? ""
  const paragraphs = Array.isArray(content.paragraphs) ? content.paragraphs : []

  return (
    <section className="py-12">
      <div className="w-full">
        <div className="text-center mb-10 mx-auto max-w-3xl">
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold text-brand-header mb-6">{heading}</h2>
          )}
          <div className="space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-lg text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SplitMarketingBlock({ content }: HeadingParagraphSectionProps) {
  const eyebrow = content.eyebrow?.trim()
  const heading = content.heading?.trim() ?? ""
  const subheadline = content.subheadline?.trim()
  const body = content.body?.trim()
  const contentAlignment = content.contentAlignment === "center" ? "center" : "left"
  const visualPosition = content.visualPosition === "left" ? "left" : "right"
  const accentColor = content.accentColor || "#3b82f6"
  const textColor = content.textColor || "#ffffff"
  const subTextColor = content.subTextColor || "#cbd5e1"
  const primaryCtaVisible = content.primaryCtaVisible ?? true
  const secondaryCtaVisible = content.secondaryCtaVisible ?? true
  const showPrimary = primaryCtaVisible && !!content.primaryCtaText?.trim()
  const showSecondary = secondaryCtaVisible && !!content.secondaryCtaText?.trim()
  const image = content.image?.trim()
  const imageAlt = content.imageAlt?.trim() || "Section visual"
  const HeadlineTag = content.headlineTag === "h1" ? "h1" : "h2"
  const valuePoints = (content.valuePoints ?? []).filter((s) => s.trim())
  const trustPoints = (content.trustPoints ?? []).filter((s) => s.trim())
  const badgeText = content.badgeText?.trim()
  const showTimeline = content.showTimeline === true
  const timelineLabels = (content.timelineLabels ?? []).filter((s) => s.trim())
  const alignClass = contentAlignment === "center" ? "text-center" : "text-left"
  const flexJustify = contentAlignment === "center" ? "justify-center" : "justify-start"

  return (
    <section className="relative rounded-3xl border border-blue-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-12 md:px-10 md:py-16 overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute -top-20 -right-10 h-56 w-56 rounded-full blur-3xl"
          style={{ backgroundColor: accentColor }}
        />
      </div>
      <div
        className={`relative z-10 grid gap-10 items-start ${
          image ? "md:grid-cols-2 md:items-center" : "md:grid-cols-1"
        }`}
      >
        <div className={visualPosition === "left" && image ? "md:order-2" : ""}>
          {eyebrow && (
            <p
              className={`text-sm font-semibold uppercase tracking-[0.2em] mb-4 ${alignClass}`}
              style={{ color: accentColor }}
            >
              {eyebrow}
            </p>
          )}
          <div className={`flex flex-wrap items-start gap-4 ${contentAlignment === "center" ? "justify-center" : "justify-start"}`}>
            {badgeText && (
              <div
                className="shrink-0 rounded-2xl border border-white/20 px-4 py-3 text-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}33, transparent)`,
                  boxShadow: `0 0 24px ${accentColor}44`,
                }}
              >
                <p className="text-2xl md:text-3xl font-bold tabular-nums" style={{ color: textColor }}>
                  {badgeText}
                </p>
              </div>
            )}
            {heading && (
              <HeadlineTag
                className={`text-3xl md:text-5xl font-bold leading-tight flex-1 min-w-[12rem] ${alignClass}`}
                style={{ color: textColor }}
              >
                {heading}
              </HeadlineTag>
            )}
          </div>
          {subheadline && (
            <p className={`mt-5 text-lg md:text-xl ${alignClass}`} style={{ color: subTextColor }}>
              {subheadline}
            </p>
          )}
          {body && (
            <p
              className={`mt-4 text-base leading-relaxed max-w-2xl ${alignClass} ${
                contentAlignment === "center" ? "mx-auto" : ""
              }`}
              style={{ color: subTextColor }}
            >
              {body}
            </p>
          )}
          {valuePoints.length > 0 && (
            <div className={`mt-8 ${contentAlignment === "center" ? "mx-auto max-w-xl" : "max-w-xl"}`}>
              <p className={`text-sm font-semibold uppercase tracking-wider mb-3 ${alignClass}`} style={{ color: accentColor }}>
                What you get
              </p>
              <ul className={`space-y-2 ${alignClass === "text-center" ? "list-none" : "list-disc list-inside md:list-outside"}`}>
                {valuePoints.map((item, i) => (
                  <li key={i} className="text-base" style={{ color: subTextColor }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {trustPoints.length > 0 && (
            <div className={`mt-8 ${contentAlignment === "center" ? "mx-auto max-w-xl" : "max-w-xl"}`}>
              <p className={`text-sm font-semibold uppercase tracking-wider mb-3 ${alignClass}`} style={{ color: accentColor }}>
                Trust
              </p>
              <ul className={`space-y-2 ${alignClass === "text-center" ? "list-none" : "list-disc list-inside md:list-outside"}`}>
                {trustPoints.map((item, i) => (
                  <li key={i} className="text-sm opacity-95" style={{ color: subTextColor }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {showTimeline && timelineLabels.length > 0 && (
            <div className="mt-10 w-full max-w-2xl">
              <div
                className="h-2 rounded-full overflow-hidden bg-white/10"
                style={{ boxShadow: `inset 0 0 0 1px ${accentColor}33` }}
              >
                <div
                  className="h-full w-3/4 rounded-full opacity-90 animate-pulse"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                  }}
                />
              </div>
              <div
                className="mt-3 flex flex-wrap gap-2 justify-between text-xs md:text-sm"
                style={{ color: subTextColor }}
              >
                {timelineLabels.map((label, i) => (
                  <span key={i} className="font-medium whitespace-nowrap">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
          {(showPrimary || showSecondary) && (
            <div className={`mt-8 flex flex-wrap gap-4 ${flexJustify}`}>
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
        {image && (
          <div className={visualPosition === "left" ? "md:order-1" : ""}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={imageAlt}
              className="w-full rounded-2xl border border-white/10 shadow-2xl object-cover max-h-[460px]"
            />
          </div>
        )}
      </div>
    </section>
  )
}
