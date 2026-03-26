import Link from "next/link"
import { prisma } from "@/lib/db/prisma"
import CardsSection from "./CardsSection"
import type { CardItem } from "@/types/cms"

interface CustomPostTypeSectionContent {
  customTypeId?: string
  itemsToShow?: number
  viewMoreMode?: "default" | "custom"
  viewMoreLink?: string
}

interface CustomPostTypeSectionProps {
  content: CustomPostTypeSectionContent
}

function getCardsFromSections(sections: Array<{ type: string; content: unknown }>): CardItem[] {
  const cards: CardItem[] = []
  for (const section of sections) {
    if (section.type !== "cards") continue
    const sectionContent = section.content as { cards?: CardItem[] }
    if (Array.isArray(sectionContent.cards)) {
      cards.push(...sectionContent.cards)
    }
  }
  return cards
}

export default async function CustomPostTypeSection({ content }: CustomPostTypeSectionProps) {
  if (!content.customTypeId) return null

  const customType = await prisma.customType.findUnique({
    where: { id: content.customTypeId, isPublished: true },
    include: {
      sections: {
        where: { isVisible: true },
        orderBy: { order: "asc" },
      },
    },
  })

  if (!customType) {
    return (
      <section className="py-8">
        <p className="text-sm text-gray-500">Selected custom post type is unavailable.</p>
      </section>
    )
  }

  const allCards = getCardsFromSections(customType.sections)
  const itemsToShow =
    typeof content.itemsToShow === "number" && content.itemsToShow > 0 ? content.itemsToShow : 3
  const cards = allCards.slice(0, itemsToShow)
  const defaultLink = `/${customType.slug}`
  const viewMoreHref =
    content.viewMoreMode === "custom" && content.viewMoreLink?.trim()
      ? content.viewMoreLink.trim()
      : defaultLink

  return (
    <section>
      <CardsSection
        content={{
          title: customType.name,
          cards,
          cardsPerRow: 3,
        }}
        basePath={customType.slug}
      />
      <div className="mt-2 text-center">
        <Link
          href={viewMoreHref}
          className="inline-flex items-center rounded-lg bg-brand-primary px-5 py-2 text-white hover:bg-brand-hover transition"
        >
          View more
        </Link>
      </div>
    </section>
  )
}
