"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Phone } from "lucide-react"
import type { MobileMenuIconKey } from "@/lib/mobileMenuIcons"
import { MobileMenuIcon } from "@/lib/mobileMenuIcons"

export interface MobileBottomNavItem {
  id: string
  href: string
  label: string
  icon?: MobileMenuIconKey | null
}

const slotClass =
  "flex flex-1 min-w-0 flex-col items-center justify-center h-14 min-h-[56px] transition-colors"

export default function MobileBottomNav({
  items,
  callHref,
}: {
  items: MobileBottomNavItem[]
  /** `tel:` URL from footer contact (phone1 or phone2); icon stays visible but disabled when null */
  callHref: string | null
}) {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] border-t border-black/40 text-zinc-100 pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Mobile navigation"
    >
      <div className="flex w-full items-stretch">
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
              aria-current={isActive ? "page" : undefined}
              className={[
                slotClass,
                isActive
                  ? "bg-white text-[#1a1a1a]"
                  : "text-zinc-300 hover:bg-white/10 hover:text-white active:bg-white/15",
              ].join(" ")}
            >
              <MobileMenuIcon
                icon={item.icon}
                className={["w-6 h-6 shrink-0", isActive ? "text-[#1a1a1a]" : ""].join(" ")}
              />
            </Link>
          )
        })}
        {callHref ? (
          <a
            href={callHref}
            className={`${slotClass} text-zinc-300 hover:bg-white/10 hover:text-white active:bg-white/15`}
            aria-label="Call us"
          >
            <Phone className="w-6 h-6 shrink-0" aria-hidden strokeWidth={2} />
          </a>
        ) : (
          <span
            className={`${slotClass} text-zinc-500 opacity-60 cursor-default`}
            aria-label="Phone number not configured"
            title="Add a phone number in Admin → Settings → Footer contact"
          >
            <Phone className="w-6 h-6 shrink-0" aria-hidden strokeWidth={2} />
          </span>
        )}
      </div>
    </nav>
  )
}

