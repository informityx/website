"use client"

import { CardItem, CardServiceItem } from "@/types/cms"
import Image from "next/image"
import type { TouchEvent } from "react"
import { useEffect, useMemo, useRef } from "react"
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
  const canNavigate = Boolean(onNavigate) && allCards.length > 1
  const nextIndex = (currentIndex + 1) % allCards.length
  const prevIndex = (currentIndex - 1 + allCards.length) % allCards.length
  const touchStartXRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)

  useEffect(() => {
    if (!onNavigate || !canNavigate) return

    const handleArrowNavigation = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault()
        onNavigate(nextIndex)
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault()
        onNavigate(prevIndex)
      }
    }

    document.addEventListener("keydown", handleArrowNavigation)
    return () => {
      document.removeEventListener("keydown", handleArrowNavigation)
    }
  }, [canNavigate, nextIndex, onNavigate, prevIndex])

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

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.changedTouches[0]
    touchStartXRef.current = touch.clientX
    touchStartYRef.current = touch.clientY
  }

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (!onNavigate || !canNavigate) return
    if (touchStartXRef.current === null || touchStartYRef.current === null) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartXRef.current
    const deltaY = touch.clientY - touchStartYRef.current
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    const swipeThreshold = 50

    // Only handle intentional horizontal swipes.
    if (absDeltaX > absDeltaY && absDeltaX >= swipeThreshold) {
      if (deltaX < 0) {
        onNavigate(nextIndex)
      } else if (deltaX > 0) {
        onNavigate(prevIndex)
      }
    }

    touchStartXRef.current = null
    touchStartYRef.current = null
  }

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-4xl">
      <div
        className="pt-2"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center gap-4 mb-6">
          {canNavigate && (
            <button
              type="button"
              onClick={() => onNavigate!(prevIndex)}
              className="text-brand-primary hover:text-brand-hover font-medium transition-colors"
            >
              &larr; Previous
            </button>
          )}
          <h2 className="text-2xl font-bold text-brand-header flex-1">{card.heading}</h2>
          {canNavigate && (
            <button
              type="button"
              onClick={() => onNavigate!(nextIndex)}
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
