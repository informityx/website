"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { MobileMenuIconKey } from "@/lib/mobileMenuIcons"
import { MobileMenuIcon } from "@/lib/mobileMenuIcons"

export interface MobileBottomNavItem {
  id: string
  href: string
  label: string
  icon?: MobileMenuIconKey | null
}

export default function MobileBottomNav({
  items,
}: {
  items: MobileBottomNavItem[]
}) {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-hover border-t border-white/10">
      <div className="flex items-center overflow-x-auto">
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={item.label}
              className={[
                "flex flex-col items-center justify-center min-w-[56px] h-[56px] transition",
                isActive
                  ? "bg-white text-brand-primary"
                  : "hover:text-brand-primary hover:bg-white",
              ].join(" ")}
            >
              <MobileMenuIcon icon={item.icon} className="w-6 h-6" />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

