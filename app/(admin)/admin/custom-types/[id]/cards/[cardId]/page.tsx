import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import { parseSectionContent } from "@/lib/section-content-parse"
import {
  resolveCardDeskSection,
  parseCardsFromSectionContent,
  ensureCardIds,
  findCardIndexById,
} from "@/lib/card-desk"
import type { CardItem } from "@/types/cms"
import CardDeskCardForm from "@/components/admin/CardDeskCardForm"

export default async function CardDeskEditPage({
  params,
}: {
  params: Promise<{ id: string; cardId: string }>
}) {
  const { id, cardId } = await params

  const customType = await prisma.customType.findUnique({
    where: { id },
    include: {
      sections: { orderBy: { order: "asc" } },
    },
  })

  if (!customType) notFound()

  const deskSection = resolveCardDeskSection(
    { id: customType.id, cardDeskSectionId: customType.cardDeskSectionId },
    customType.sections
  )

  if (!deskSection) notFound()

  const content = deskSection.content as Record<string, unknown>
  let cards = parseCardsFromSectionContent(content)
  const { cards: withIds, changed } = ensureCardIds(cards)
  if (changed) {
    const merged = { ...content, cards: withIds }
    await prisma.section.update({
      where: { id: deskSection.id },
      data: { content: parseSectionContent("cards", merged) as object },
    })
    cards = withIds
  }

  const idx = findCardIndexById(cards, cardId)
  if (idx < 0) notFound()

  const card = cards[idx] as CardItem
  const fullContent = { ...content, cards }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href={`/admin/custom-types/${id}/cards`}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          ← Back to cards
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">Edit card — {customType.name}</h1>
      </div>
      <CardDeskCardForm
        mode="edit"
        sectionId={deskSection.id}
        customTypeId={id}
        customTypeSlug={customType.slug}
        fullContent={fullContent}
        initialCard={card}
      />
    </div>
  )
}
