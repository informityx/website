import Link from "next/link"
import OpenContactModalButton from "@/components/public/OpenContactModalButton"
import OpenClientOnboardingModalButton from "@/components/public/OpenClientOnboardingModalButton"
import { Phone, Workflow } from "lucide-react"

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-primary">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-white hover:text-brand-hover transition-colors shrink-0"
          >
            {brand.type === "logo" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brand.logoUrl}
                alt="Logo"
                className="h-12 w-auto max-w-[500px] object-contain"
              />
            ) : (
              brand.text
            )}
          </Link>
          <div className="hidden md:flex gap-6 justify-center flex-1">
            {navPages.map((page) => (
              <Link
                key={page.id}
                href={page.isHome ? "/" : `/${page.slug}`}
                className="text-white hover:text-brand-hover transition-colors"
              >
                {page.title}
              </Link>
            ))}
            {customTypesInHeader.map((ct) => (
              <Link
                key={ct.slug}
                href={`/${ct.slug}`}
                className="text-white hover:text-brand-hover transition-colors"
              >
                {ct.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <OpenContactModalButton className="px-5 py-2 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-brand-primary transition-colors">
              <Phone className="w-5 h-5 md:hidden" aria-hidden />
              <span className="hidden md:inline">Contact</span>
            </OpenContactModalButton>
            <OpenClientOnboardingModalButton className="px-5 py-2 rounded-lg bg-white text-brand-primary font-semibold hover:bg-brand-hover hover:text-white transition-colors">
              <Workflow className="w-5 h-5 md:hidden" aria-hidden />
              <span className="hidden md:inline">Start project</span>
            </OpenClientOnboardingModalButton>
          </div>
        </nav>
      </div>
    </header>
  )
}
