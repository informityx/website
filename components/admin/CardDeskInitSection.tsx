"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { getDefaultSectionContent } from "@/lib/section-defaults"

export default function CardDeskInitSection({
  customTypeId,
  nextOrder,
}: {
  customTypeId: string
  nextOrder: number
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function createCardsSection() {
    setLoading(true)
    try {
      const res = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customTypeId,
          type: "cards",
          order: nextOrder,
          content: getDefaultSectionContent("cards"),
          isVisible: true,
        }),
      })
      if (!res.ok) throw new Error("Failed to create section")
      router.refresh()
    } catch (e) {
      console.error(e)
      alert("Failed to create cards section")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={createCardsSection}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
    >
      {loading ? "Creating…" : "Create cards section"}
    </button>
  )
}
