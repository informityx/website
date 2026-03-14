"use client"

import { CardItem, CardServiceItem } from "@/types/cms"
import Image from "next/image"
import { useMemo } from "react"
import ModalShell from "@/components/public/ui/ModalShell"

interface CardDetailModalProps {
  card: CardItem
  onClose: () => void
  allCards?: CardItem[]
  currentIndex?: number
  onNavigate?: (index: number) => void
}

export default function CardDetailModal({
  card,
  onClose,
  allCards = [],
  currentIndex = 0,
  onNavigate,
}: CardDetailModalProps) {
  const hasPrev = onNavigate && allCards.length > 0 && currentIndex > 0
  const hasNext =
    onNavigate && allCards.length > 0 && currentIndex < allCards.length - 1

  // Support both new services and legacy technologies (migration at render time)
  const services = useMemo((): CardServiceItem[] => {
    if (card.services && card.services.length > 0) {
      return card.services
    }
    const legacy = (card as { technologies?: string[] }).technologies
    if (Array.isArray(legacy) && legacy.length > 0) {
      return legacy.map((title) => ({ title, description: "" }))
    }
    return []
  }, [card])

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-4xl">
      <div className="pt-2">
        <div className="flex items-center gap-4 mb-6">
          {hasPrev && (
            <button
              type="button"
              onClick={() => onNavigate!(currentIndex - 1)}
              className="text-brand-primary hover:text-brand-hover font-medium transition-colors"
            >
              &larr; Previous
            </button>
          )}
          <h2 className="text-2xl font-bold text-brand-header flex-1">{card.heading}</h2>
          {hasNext && (
            <button
              type="button"
              onClick={() => onNavigate!(currentIndex + 1)}
              className="text-brand-primary hover:text-brand-hover font-medium transition-colors"
            >
              Next &rarr;
            </button>
          )}
        </div>
        {card.image && (
          <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden">
            <Image
              src={card.image}
              alt={card.heading}
              fill
              className="object-cover"
            />
          </div>
        )}
        {card.overview && (
          <div className="mb-6">
            <p className="text-gray-700 whitespace-pre-line">{card.overview}</p>
          </div>
        )}
        {services.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-brand-header mb-3">
              Services
            </h3>
            <div className="space-y-3">
              {services.map((svc, i) => (
                <div key={i} className="border-l-2 border-amber-200 pl-3 py-1">
                  <h4 className="font-medium text-brand-header">{svc.title}</h4>
                  {svc.description && (
                    <p className="text-sm text-gray-600 mt-0.5">
                      {svc.description}
                    </p>
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
      </div>
    </ModalShell>
  )
}
