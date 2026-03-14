import Link from "next/link"
import OpenContactModalButton from "@/components/public/OpenContactModalButton"

export interface NavPage {
  id: string
  slug: string
  title: string
  isHome: boolean
}

export type HeaderBrand =
  | { type: "text"; text: string }
  | { type: "logo"; logoUrl: string }

interface HeaderProps {
  brand: HeaderBrand
  navPages: NavPage[]
  showServicesLink: boolean
}

export default function Header({
  brand,
  navPages,
  showServicesLink,
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
          <div className="flex gap-6 justify-center flex-1">
            {navPages.map((page) => (
              <Link
                key={page.id}
                href={page.isHome ? "/" : `/${page.slug}`}
                className="text-white hover:text-brand-hover transition-colors"
              >
                {page.title}
              </Link>
            ))}
            {showServicesLink && (
              <Link
                href="/services"
                className="text-white hover:text-brand-hover transition-colors"
              >
                Services
              </Link>
            )}
          </div>
          <OpenContactModalButton className="shrink-0 px-5 py-2 rounded-lg bg-white text-brand-primary font-semibold hover:bg-brand-hover hover:text-white transition-colors">
            Start project
          </OpenContactModalButton>
        </nav>
      </div>
    </header>
  )
}
