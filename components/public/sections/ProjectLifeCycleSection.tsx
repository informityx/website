"use client"

import { useRef, useState } from "react"

export interface LifeCyclePhaseItem {
  heading: string
  bullets: string[]
}

export interface LifeCyclePhase {
  number: string
  title: string
  description: string
  color: "blue" | "green" | "purple" | "orange" | "red" | "grey"
  icon: "document" | "chart" | "gear" | "cog" | "check" | "rocket" | "graduation" | "wrench"
  items: LifeCyclePhaseItem[]
}

interface ProjectLifeCycleSectionProps {
  content: {
    title?: string
    description?: string
    hint?: string
    phases?: LifeCyclePhase[]
  }
}

const COLOR_CLASSES: Record<string, string> = {
  blue: "bg-blue-600",
  green: "bg-emerald-600",
  purple: "bg-purple-600",
  orange: "bg-orange-500",
  red: "bg-red-600",
  grey: "bg-gray-600",
}

const ICON_SVG = {
  document: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  ),
  chart: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  ),
  gear: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 2.31.826 1.37 1.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 2.31-1.37 1.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-2.31-.826-1.37-1.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-2.31 1.37-1.37.996.608 2.296.07 2.572-1.065z"
    />
  ),
  cog: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 2.31.826 1.37 1.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 2.31-1.37 1.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-2.31-.826-1.37-1.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-2.31 1.37-1.37.996.608 2.296.07 2.572-1.065z"
    />
  ),
  check: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  ),
  rocket: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
    />
  ),
  graduation: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </>
  ),
  wrench: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 2.31.826 1.37 1.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 2.31-1.37 1.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-2.31-.826-1.37-1.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-2.31 1.37-1.37.996.608 2.296.07 2.572-1.065z"
    />
  ),
}

function PhaseIcon({
  icon,
  color,
}: {
  icon: keyof typeof ICON_SVG
  color: string
}) {
  const bgClass = COLOR_CLASSES[color] || "bg-gray-600"
  return (
    <div
      className={`flex-shrink-0 w-10 h-10 rounded-full ${bgClass} flex items-center justify-center text-white`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {ICON_SVG[icon] || ICON_SVG.gear}
      </svg>
    </div>
  )
}

export default function ProjectLifeCycleSection({ content }: ProjectLifeCycleSectionProps) {
  const {
    title = "Project Delivery Life Cycle",
    description = "A transparent, structured approach to bringing your ideas to life. Each phase ensures quality, communication, and successful project delivery from concept to completion.",
    hint = "Use arrow buttons, scroll horizontally, or drag to explore all phases.",
    phases = [],
  } = content

  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(
      el.scrollLeft < el.scrollWidth - el.clientWidth - 1
    )
  }

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
    setTimeout(updateScrollState, 300)
  }

  if (phases.length === 0) return null

  return (
    <section className="py-16">
      <div className="w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-header mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
              {description}
            </p>
          )}
          {hint && (
            <p className="text-sm text-gray-500">{hint}</p>
          )}
        </div>

        <div className="relative">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory project-lifecycle-scroll"
            style={{ scrollbarWidth: "thin" }}
          >
            {phases.map((phase, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-[320px] md:w-[360px] snap-start rounded-xl overflow-hidden bg-white shadow-md flex flex-col"
              >
                <div
                  className={`px-4 py-3 text-white flex items-center justify-between ${COLOR_CLASSES[phase.color] || "bg-gray-600"}`}
                >
                  <span className="font-semibold text-lg">{phase.title}</span>
                  <span className="text-sm opacity-90">{phase.number}</span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-gray-600 text-sm mb-4">{phase.description}</p>
                  <div className="space-y-4 flex-1">
                    {phase.items.map((item, i) => (
                      <div key={i}>
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">
                          {item.heading}
                        </h4>
                        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                          {item.bullets.map((b, j) => (
                            <li key={j}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {phases.slice(0, Math.min(8, phases.length)).map((_, idx) => (
              <PhaseIcon
                key={idx}
                icon={phases[idx]?.icon || "gear"}
                color={phases[idx]?.color || "grey"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
