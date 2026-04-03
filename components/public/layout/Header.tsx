import Link from "next/link"
import OpenContactModalButton from "@/components/public/OpenContactModalButton"
import OpenClientOnboardingModalButton from "@/components/public/OpenClientOnboardingModalButton"
import MobileFullScreenNav from "@/components/public/MobileFullScreenNav"
import { List, Workflow } from "lucide-react"

export interface NavPage {
  id: string
  slug: string
  title: string
  isHome: boolean
}

export type HeaderBrand =
  | { type: "text"; text: string }
  | { type: "logo"; logoUrl: string }

export interface CustomTypeNavItem {
  slug: string
  name: string
  /** Links to each card (`/cpt-slug/card-segment`), from visible `cards` sections. */
  cardLinks: { href: string; label: string }[]
}

const navLinkClass =
  "text-brand-primary font-bold hover:text-brand-hover transition-colors"

function CustomTypeDesktopItem({ ct }: { ct: CustomTypeNavItem }) {
  if (ct.cardLinks.length === 0) {
    return (
      <Link href={`/${ct.slug}`} className={navLinkClass}>
        {ct.name}
      </Link>
    )
  }

  return (
    <div className="relative group">
      <span className="inline-flex items-center gap-0.5">
        <Link href={`/${ct.slug}`} className={navLinkClass}>
          {ct.name}
        </Link>
        <span className="text-brand-primary text-xs select-none opacity-70" aria-hidden>
          ▾
        </span>
      </span>
      <div
        className="absolute left-0 top-full z-50 pt-1 w-max min-w-[14rem] opacity-0 invisible pointer-events-none transition-[opacity,visibility] duration-150 group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto"
        role="menu"
        aria-label={`${ct.name} submenu`}
      >
        <ul className="rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <li>
            <Link
              href={`/${ct.slug}`}
              className="block px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              role="menuitem"
            >
              Overview
            </Link>
          </li>
          {ct.cardLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-brand-primary hover:text-white"
                role="menuitem"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

interface HeaderProps {
  brand: HeaderBrand
  navPages: NavPage[]
  customTypesInHeader?: CustomTypeNavItem[]
}

export default function Header({
  brand,
  navPages,
  customTypesInHeader = [],
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 min-w-0 shrink">
              <MobileFullScreenNav
                navPages={navPages}
                customTypesInHeader={customTypesInHeader}
              />
              <Link
                href="/"
                className="flex items-center gap-2 text-2xl font-bold text-white hover:text-brand-hover transition-colors min-w-0"
              >
                {brand.type === "logo" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.logoUrl}
                    alt="Logo"
                    className="lg:h-12 h-9 w-auto max-w-[min(450px,70vw)] object-contain object-left"
                  />
                ) : (
                  brand.text
                )}
              </Link>
            </div>
            <div className="hidden md:flex gap-6 justify-center flex-1 items-center">
              {navPages.map((page) => (
                <Link
                  key={page.id}
                  href={page.isHome ? "/" : `/${page.slug}`}
                  className={navLinkClass}
                >
                  {page.title}
                </Link>
              ))}
              {customTypesInHeader.map((ct) => (
                <CustomTypeDesktopItem key={ct.slug} ct={ct} />
              ))}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <OpenContactModalButton className="px-5 py-2 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-hover transition-colors">
                <List className="w-5 h-5 md:hidden" aria-hidden />
                <span className="hidden md:inline">Contact</span>
              </OpenContactModalButton>
              <OpenClientOnboardingModalButton className="px-5 py-2 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-hover transition-colors">
                <Workflow className="w-5 h-5 md:hidden" aria-hidden />
                <span className="hidden md:inline">Start project</span>
              </OpenClientOnboardingModalButton>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
