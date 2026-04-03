import fs from "fs"
import path from "path"
import Image from "next/image"
import OpenContactModalButton from "@/components/public/OpenContactModalButton"
import CTAInlineProjectForm from "@/components/public/CTAInlineProjectForm"

const ctaBgPath = path.join(process.cwd(), "public", "images", "cta-section-bg.jpg")
const hasCtaBackgroundImage = fs.existsSync(ctaBgPath)

const IconCalendar = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

export default function CTASection() {
  return (
    <section className="relative py-16 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
      <div className="absolute inset-0 border-y border-blue-500/20 pointer-events-none" />

      {hasCtaBackgroundImage && (
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/cta-section-bg.jpg"
            alt=""
            fill
            className="object-cover opacity-25"
            sizes="100vw"
            priority={false}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-900/80" />
        </div>
      )}

      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-blue-500 blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 h-80 w-80 rounded-full bg-violet-600 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="relative rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-xl px-6 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14 shadow-2xl">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-500/20 via-transparent to-violet-500/15 blur-xl opacity-70 pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-14 items-start">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                Let&apos;s Build Something That Actually Scales
              </h2>
              <p className="text-slate-300 text-base md:text-lg mb-4 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Whether you&apos;re starting from scratch or scaling an existing product, we
                help you move faster with the right strategy, technology, and execution.
              </p>
              <p className="text-slate-400 text-sm md:text-base mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Tell us your idea — we&apos;ll help you turn it into a real, working product.
              </p>

              <div className="flex flex-col items-center lg:items-start gap-3">
                <OpenContactModalButton className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-blue-400/60 text-blue-100 font-semibold hover:bg-white/10 hover:border-blue-300/80 transition-colors w-full sm:w-auto">
                  <IconCalendar className="h-5 w-5 shrink-0" />
                  Book a Free Discovery Call
                </OpenContactModalButton>
                <p className="text-slate-500 text-sm max-w-md mx-auto lg:mx-0">
                  No commitment. Just a focused conversation about your idea.
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10 xl:pl-12">
              <CTAInlineProjectForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
