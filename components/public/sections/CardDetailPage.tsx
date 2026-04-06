import Image from "next/image"
import Link from "next/link"
import type { CardItem, CardServiceItem } from "@/types/cms"
import { hasMeaningfulHtml, sanitizeRichHtml } from "@/lib/sanitize-html"

interface CardDetailPageProps {
  card: CardItem
  customTypeName: string
  customTypeSlug: string
}

function getServices(card: CardItem): CardServiceItem[] {
  if (card.services && card.services.length > 0) return card.services
  const legacy = (card as { technologies?: string[] }).technologies
  if (Array.isArray(legacy) && legacy.length > 0) {
    return legacy.map((title) => ({ title, description: "" }))
  }
  return []
}

export default function CardDetailPage({
  card,
  customTypeName,
  customTypeSlug,
}: CardDetailPageProps) {
  const services = getServices(card)
  const detailSafe =
    hasMeaningfulHtml(card.detailHtml) ? sanitizeRichHtml(card.detailHtml!) : ""

  return (
    <>
      <div className="container mx-auto px-4 pt-6 pb-6 md:pt-8 md:pb-8">
        <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${customTypeSlug}`} className="hover:text-brand-primary">
            {customTypeName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{card.heading}</span>
        </nav>
      </div>

      {card.image ? (
        <div className="relative w-full min-h-[220px] sm:min-h-[300px] md:min-h-[380px] h-[38vh] max-h-[520px]">
          sssss
          <Image
            src={card.image}
            alt={card.heading}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-slate-950/40" aria-hidden />
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="container mx-auto px-4 pb-8 md:pb-12 w-full">
              <div className="max-w-4xl rounded-xl bg-slate-950/55 px-5 py-4 md:px-8 md:py-5 backdrop-blur-[2px] border border-white/10">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  {card.heading}
                </h1>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="container mx-auto px-4 py-8 pb-16">
        <article>
          {!card.image && (
            <h1 className="text-3xl md:text-4xl font-bold text-brand-header mb-6">
              {card.heading}
            </h1>
          )}
          {card.overview && (
            <div className="mb-8">
              <p className="text-gray-700 whitespace-pre-line text-lg">{card.overview}</p>
            </div>
          )}
          {detailSafe ? (
            <div
              className="prose max-w-none mb-8 text-gray-800 [&_img]:max-w-full [&_video]:max-w-full [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:aspect-video"
              dangerouslySetInnerHTML={{ __html: detailSafe }}
            />
          ) : null}
          {services.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-brand-header mb-4">Services</h2>
              <div className="space-y-3">
                {services.map((svc, i) => (
                  <div key={i} className="border-l-2 border-amber-200 pl-4 py-1">
                    <h3 className="font-medium text-brand-header">{svc.title}</h3>
                    {svc.description && (
                      <p className="text-gray-600 mt-0.5">{svc.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3 flex-wrap">
            {card.liveDemoUrl && (
              <a
                href={card.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 rounded-xl bg-brand-primary text-white font-medium hover:bg-brand-hover transition"
              >
                View Live Demo
              </a>
            )}
            {card.sourceCodeUrl && (
              <a
                href={card.sourceCodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 rounded-xl bg-brand-primary text-white font-medium hover:bg-brand-hover transition"
              >
                View Source Code
              </a>
            )}
          </div>
        </article>
      </div>
    </>
  )
}
