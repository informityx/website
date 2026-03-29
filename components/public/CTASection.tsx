import OpenContactModalButton from "@/components/public/OpenContactModalButton"

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
    <section className="py-16 px-4 bg-gray-100/80">
      <div className="container mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-10 md:p-14 shadow-lg text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-header mb-4">
            Ready to Discuss Your Project?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Let&apos;s have a discovery call to explore your requirements and see
            how we can help bring your vision to life.
          </p>
          <OpenContactModalButton className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-hover transition-colors">
            <IconCalendar className="h-5 w-5 shrink-0" />
            Schedule a Discovery Call
          </OpenContactModalButton>
        </div>
      </div>
    </section>
  )
}
