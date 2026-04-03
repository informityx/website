import Header from "@/components/public/layout/Header"
import Footer from "@/components/public/layout/Footer"
import CTASection from "@/components/public/CTASection"
import { GetInTouchModalProvider } from "@/components/public/GetInTouchModal"
import { ClientOnboardingModalProvider } from "@/components/public/ClientOnboardingModal"
import { Toaster } from "react-hot-toast"
import { prisma } from "@/lib/db/prisma"
import { getOrCreateSettings } from "@/lib/db/settings"
import MobileBottomNav from "@/components/public/layout/MobileBottomNav"
import type { MobileMenuIconKey } from "@/lib/mobileMenuIcons"
import { getCardNavLinksFromSections } from "@/lib/cpt-card-nav"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [settings, publishedPages, customTypesForNav] = await Promise.all([
    getOrCreateSettings(),
    prisma.page.findMany({
      where: { isPublished: true },
      orderBy: { updatedAt: "asc" },
      select: { id: true, slug: true, title: true, mobileMenuIcon: true },
    }),
    prisma.customType.findMany({
      where: { isPublished: true },
      orderBy: [{ order: "asc" }, { updatedAt: "asc" }],
      include: {
        sections: {
          where: { isVisible: true, type: "cards" },
          orderBy: { order: "asc" },
          select: { type: true, content: true },
        },
      },
    }),
  ])

  const headerCustomTypes = customTypesForNav
    .filter((ct) => ct.showInHeader)
    .map((ct) => ({
      slug: ct.slug,
      name: ct.name,
      cardLinks: ct.showCardsInNav
        ? getCardNavLinksFromSections(ct.slug, ct.sections)
        : [],
    }))
  const footerCustomTypes = customTypesForNav
    .filter((ct) => ct.showInFooter)
    .map((ct) => ({
      slug: ct.slug,
      name: ct.name,
      cardLinks: ct.showCardsInNav
        ? getCardNavLinksFromSections(ct.slug, ct.sections)
        : [],
    }))

  const homePageId = settings.homePageId ?? null
  const navPages = publishedPages.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    isHome: p.id === homePageId,
  }))

  const mobileNavItems = [
    ...publishedPages.map((p) => ({
      id: p.id,
      label: p.title,
      href: p.id === homePageId ? "/" : `/${p.slug}`,
      icon: (p.mobileMenuIcon as MobileMenuIconKey | null) ?? null,
    })),
    ...customTypesForNav
      .filter((ct) => ct.showInHeader)
      .map((ct) => ({
        id: ct.slug,
        label: ct.name,
        href: `/${ct.slug}`,
        icon: (ct.mobileMenuIcon as MobileMenuIconKey | null) ?? null,
      })),
  ]

  const footerSettings = {
    footerAboutVisible: settings.footerAboutVisible,
    footerAboutText: settings.footerAboutText ?? null,
    footerMenuVisible: settings.footerMenuVisible,
    footerSocialVisible: settings.footerSocialVisible,
    footerSubscribeVisible: settings.footerSubscribeVisible,
    footerSocialJson: (settings.footerSocialJson ?? null) as {
      fb?: { url?: string; text?: string }
      insta?: { url?: string }
      twitter?: { url?: string }
      linkedin?: { url?: string }
      website?: { url?: string }
    } | null,
    footerContactJson: (settings.footerContactJson ?? null) as {
      name?: string
      email?: string
      phone1?: string
      phone2?: string
      address?: string
    } | null,
  }

  const footerNavPages = publishedPages.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    isHome: p.id === homePageId,
  }))

  const footerContact = footerSettings.footerContactJson
  const footerPhoneRaw =
    footerContact?.phone1?.trim() || footerContact?.phone2?.trim() || ""
  const mobileBottomNavCallHref = footerPhoneRaw
    ? `tel:${footerPhoneRaw.replace(/\s/g, "")}`
    : null

  const headerBrand =
    settings.headerBrandType === "logo" && settings.headerLogoUrl
      ? { type: "logo" as const, logoUrl: settings.headerLogoUrl }
      : {
          type: "text" as const,
          text: settings.headerBrandText?.trim() || "InforMityx",
        }

  return (
    <GetInTouchModalProvider>
      <ClientOnboardingModalProvider>
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        <div className="public-site flex flex-col min-h-screen pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
          <Header
            brand={headerBrand}
            navPages={navPages}
            customTypesInHeader={headerCustomTypes}
          />
          <main className="flex-grow pt-16 md:pt-20">
            {children}
            <CTASection />
          </main>
          <Footer
            footerSettings={footerSettings}
            menuPages={footerNavPages}
            customTypesInFooter={footerCustomTypes}
          />
          <MobileBottomNav items={mobileNavItems} callHref={mobileBottomNavCallHref} />
        </div>
      </ClientOnboardingModalProvider>
    </GetInTouchModalProvider>
  )
}
