import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import { parseSectionContent } from "@/lib/section-content-parse"
import { resolveCardDeskSection, parseCardsFromSectionContent, ensureCardIds } from "@/lib/card-desk"
import CardDeskCardForm from "@/components/admin/CardDeskCardForm"
import CardDeskInitSection from "@/components/admin/CardDeskInitSection"

export default async function CardDeskNewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

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

  if (!deskSection) {
    const nextOrder =
      customType.sections.length === 0
        ? 0
        : Math.max(...customType.sections.map((s) => s.order)) + 1
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">New card — {customType.name}</h1>
        <p className="text-gray-600 mb-4">Add a cards section first.</p>
        <CardDeskInitSection customTypeId={id} nextOrder={nextOrder} />
        <div className="mt-4">
          <Link href={`/admin/custom-types/${id}/cards`} className="text-blue-600 hover:text-blue-800">
            Back to list
          </Link>
        </div>
      </div>
    )
  }

  const content = deskSection.content as Record<string, unknown>
  let cards = parseCardsFromSectionContent(content)
  const { cards: withIds, changed } = ensureCardIds(cards)
  if (changed) {
    const merged = { ...content, cards: withIds }
    await prisma.section.update({
      where: { id: deskSection.id },
      data: { content: parseSectionContent("cards", merged) as object },
    })
  }
  const fullContent = changed
    ? { ...content, cards: withIds }
    : { ...content, cards }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href={`/admin/custom-types/${id}/cards`}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          ← Back to cards
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">New card — {customType.name}</h1>
      </div>
      <CardDeskCardForm
        mode="new"
        sectionId={deskSection.id}
        customTypeId={id}
        customTypeSlug={customType.slug}
        fullContent={fullContent}
      />
    </div>
  )
}
