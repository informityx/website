"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { CardItem } from "@/types/cms"
import CardItemFields from "./CardItemFields"

const emptyCard = (): CardItem => ({
  heading: "",
  description: "",
  openInModal: true,
})

export default function CardDeskCardForm({
  mode,
  sectionId,
  customTypeId,
  customTypeSlug,
  fullContent,
  initialCard,
}: {
  mode: "new" | "edit"
  sectionId: string
  customTypeId: string
  customTypeSlug: string
  fullContent: Record<string, unknown>
  initialCard?: CardItem
}) {
  const router = useRouter()
  const [card, setCard] = useState<CardItem>(initialCard ?? emptyCard())
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    try {
      const existing = (Array.isArray(fullContent.cards) ? fullContent.cards : []) as CardItem[]
      let nextCards: CardItem[]
      if (mode === "new") {
        const id = crypto.randomUUID()
        nextCards = [...existing, { ...card, id }]
      } else {
        if (!card.id) {
          alert("Card is missing id")
          setSaving(false)
          return
        }
        nextCards = existing.map((c) => (c.id === card.id ? card : c))
      }
      const res = await fetch(`/api/sections/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: { ...fullContent, cards: nextCards },
        }),
      })
      if (!res.ok) throw new Error("Failed to save")
      router.push(`/admin/custom-types/${customTypeId}/cards`)
      router.refresh()
    } catch (e) {
      console.error(e)
      alert("Failed to save card")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <CardItemFields
        value={card}
        onChange={setCard}
        index={0}
        pathSlugHint={customTypeSlug}
      />
      <div className="flex gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/admin/custom-types/${customTypeId}/cards`)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
