"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/** List view moved to /admin/pages; keep URL working for bookmarks. */
export default function CustomTypesListRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/admin/pages#custom-types")
  }, [router])
  return (
    <div className="p-8 text-gray-600 text-sm" role="status">
      Redirecting to Pages…
    </div>
  )
}
