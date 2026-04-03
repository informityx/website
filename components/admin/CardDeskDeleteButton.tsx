"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import type { CardItem } from "@/types/cms"

export default function CardDeskDeleteButton({
  sectionId,
  cardId,
  content,
}: {
  sectionId: string
  cardId: string
  content: Record<string, unknown>
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm("Delete this card? This cannot be undone.")) return
    setLoading(true)
    try {
      const cards = (Array.isArray(content.cards) ? content.cards : []) as CardItem[]
      const nextCards = cards.filter((c) => c.id !== cardId)
      const res = await fetch(`/api/sections/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: { ...content, cards: nextCards },
        }),
      })
      if (!res.ok) throw new Error("Failed to delete")
      router.refresh()
    } catch (e) {
      console.error(e)
      alert("Failed to delete card")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {loading ? "…" : "Delete"}
    </button>
  )
}
