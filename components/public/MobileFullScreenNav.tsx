"use client"

import { useEffect, useId, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import type { CustomTypeNavItem, NavPage } from "@/components/public/layout/Header"

const linkClass =
  "text-brand-primary font-semibold text-base py-3 border-b border-gray-100 hover:text-brand-hover block w-full text-left"

const subLinkClass =
  "text-sm text-gray-700 py-2 pl-4 border-b border-gray-50 hover:text-brand-primary block w-full text-left"

interface MobileFullScreenNavProps {
  navPages: NavPage[]
  customTypesInHeader: CustomTypeNavItem[]
}

export default function MobileFullScreenNav({
  navPages,
  customTypesInHeader,
}: MobileFullScreenNavProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        className="md:hidden p-2 -ml-2 rounded-lg text-brand-primary hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="w-6 h-6" aria-hidden /> : <Menu className="w-6 h-6" aria-hidden />}
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="md:hidden fixed inset-0 z-[60] flex flex-col bg-white"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-gray-100 shrink-0">
            <span className="text-lg font-bold text-gray-900">Menu</span>
            <button
              type="button"
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X className="w-6 h-6" aria-hidden />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-2 pb-8">
            {navPages.map((page) => (
              <Link
                key={page.id}
                href={page.isHome ? "/" : `/${page.slug}`}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {page.title}
              </Link>
            ))}
            {customTypesInHeader.map((ct) => (
              <div key={ct.slug} className="border-b border-gray-100 pb-1 mb-1">
                <Link
                  href={`/${ct.slug}`}
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  {ct.name}
                </Link>
                {ct.cardLinks.length > 0 && (
                  <ul className="flex flex-col">
                    {ct.cardLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={subLinkClass}
                          onClick={() => setOpen(false)}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
