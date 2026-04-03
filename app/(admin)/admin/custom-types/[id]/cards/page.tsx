import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import { parseSectionContent } from "@/lib/section-content-parse"
import {
  resolveCardDeskSection,
  parseCardsFromSectionContent,
  ensureCardIds,
  filterCardsByQuery,
  paginateCards,
} from "@/lib/card-desk"
import type { CardItem } from "@/types/cms"
import CardDeskDeleteButton from "@/components/admin/CardDeskDeleteButton"
import CardDeskInitSection from "@/components/admin/CardDeskInitSection"

export default async function CardDeskListPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1)
  const q = (sp.q || "").trim()

  const customType = await prisma.customType.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { order: "asc" },
      },
    },
  })

  if (!customType) {
    notFound()
  }

  const deskLike = {
    id: customType.id,
    cardDeskSectionId: customType.cardDeskSectionId,
  }
  let deskSection = resolveCardDeskSection(deskLike, customType.sections)

  if (customType.cardDeskSectionId && !deskSection) {
    return (
      <div className="p-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{customType.name} — Card desk</h1>
        <p className="text-gray-600 mb-4">
          The selected card list section is missing or is not a cards section for this custom type.
          Open full settings and pick a valid &quot;Card list section&quot;, or clear the selection to use
          the first cards section.
        </p>
        <Link
          href={`/admin/custom-types/${id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          Full layout &amp; settings
        </Link>
      </div>
    )
  }

  if (!deskSection) {
    const nextOrder =
      customType.sections.length === 0
        ? 0
        : Math.max(...customType.sections.map((s) => s.order)) + 1
    return (
      <div className="p-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{customType.name} — Card desk</h1>
          <Link
            href={`/admin/custom-types/${id}`}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Full layout &amp; settings
          </Link>
        </div>
        <p className="text-gray-600 mb-4">
          No cards section yet. Create one to start adding cards from this view, or add a Cards block in
          the full editor.
        </p>
        <CardDeskInitSection customTypeId={id} nextOrder={nextOrder} />
      </div>
    )
  }

  const rawContent = deskSection.content as Record<string, unknown>
  let cards = parseCardsFromSectionContent(rawContent)
  const { cards: withIds, changed } = ensureCardIds(cards)
  if (changed) {
    const merged = { ...rawContent, cards: withIds }
    await prisma.section.update({
      where: { id: deskSection.id },
      data: { content: parseSectionContent("cards", merged) as object },
    })
    cards = withIds
  }
  const content = { ...rawContent, cards }

  const filtered = filterCardsByQuery(cards, q)
  const { slice, total, page: curPage, pageSize } = paginateCards(filtered, page, 20)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const buildPageLink = (p: number) => {
    const usp = new URLSearchParams()
    if (q) usp.set("q", q)
    if (p > 1) usp.set("page", String(p))
    const qs = usp.toString()
    return `/admin/custom-types/${id}/cards${qs ? `?${qs}` : ""}`
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{customType.name} — Card desk</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <Link
            href={`/admin/custom-types/${id}/cards/new`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create new
          </Link>
          <Link
            href={`/admin/custom-types/${id}`}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Full layout &amp; settings
          </Link>
        </div>
      </div>

      <form method="get" className="flex flex-wrap gap-2 mb-4">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search heading, description, slug…"
          className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 min-w-[220px]"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Search
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Heading
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                URL slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {slice.map((card: CardItem) => (
              <tr key={card.id}>
                <td className="px-6 py-4 text-gray-900">{card.heading || "(no title)"}</td>
                <td className="px-6 py-4 text-gray-500">
                  {card.openInModal === false && card.cardSlug
                    ? `/${customType.slug}/${card.cardSlug}`
                    : "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-3">
                  <Link
                    href={`/admin/custom-types/${id}/cards/${card.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  <CardDeskDeleteButton sectionId={deskSection.id} cardId={card.id!} content={content} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {slice.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {q ? "No cards match your search." : "No cards yet. Create one to get started."}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex gap-2 items-center text-sm text-gray-600">
          <span>
            Page {curPage} of {totalPages} ({total} items)
          </span>
          {curPage > 1 && (
            <Link href={buildPageLink(curPage - 1)} className="text-blue-600 hover:text-blue-800">
              Previous
            </Link>
          )}
          {curPage < totalPages && (
            <Link href={buildPageLink(curPage + 1)} className="text-blue-600 hover:text-blue-800">
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
