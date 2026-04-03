import Link from "next/link"
import { prisma } from "@/lib/db/prisma"
import SectionRenderer from "@/components/public/sections/SectionRenderer"
import type { Metadata } from "next"
import { getOrCreateSettings } from "@/lib/db/settings"
import type { SectionData, PageData } from "@/types/cms"
import { canonicalUrl, getBaseUrl } from "@/lib/seo"
import {
  openGraphAndTwitterImages,
  resolveBannerAndSectionOgImage,
} from "@/lib/og-image"
import SeoJsonLd from "@/components/seo/SeoJsonLd"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getOrCreateSettings()
  if (!settings.homePageId) {
    const canonical = canonicalUrl("/")
    return {
      title: "Home",
      description: "Welcome to our CMS",
      alternates: { canonical },
      openGraph: {
        type: "website",
        url: canonical,
        title: "Home",
        description: "Welcome to our CMS",
      },
      twitter: {
        card: "summary",
        title: "Home",
        description: "Welcome to our CMS",
      },
    }
  }
  const page = await prisma.page.findUnique({
    where: { id: settings.homePageId },
    include: {
      sections: {
        where: { isVisible: true },
        orderBy: { order: "asc" },
      },
    },
  })
  if (page && page.isPublished) {
    const canonical = canonicalUrl("/")
    const title = page.metaTitle || page.title
    const description = page.metaDescription || undefined
    const ogAbs = resolveBannerAndSectionOgImage(
      page.bannerImage,
      page.bannerBackgroundImage,
      page.sections
    )
    const { openGraphImages, twitterCard, twitterImages } =
      openGraphAndTwitterImages(ogAbs, title)
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        type: "website",
        url: canonical,
        title,
        description,
        ...(openGraphImages ? { images: openGraphImages } : {}),
      },
      twitter: {
        card: twitterCard,
        title,
        description,
        ...(twitterImages ? { images: twitterImages } : {}),
      },
    }
  }
  const canonical = canonicalUrl("/")
  return {
    title: "Home",
    description: "Welcome to our CMS",
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: "Home",
      description: "Welcome to our CMS",
    },
    twitter: {
      card: "summary",
      title: "Home",
      description: "Welcome to our CMS",
    },
  }
}

export default async function HomePage() {
  const settings = await getOrCreateSettings()
  const homePageId = settings.homePageId

  const siteUrl = getBaseUrl()
  const siteName = settings.headerBrandText?.trim() || "InforMityx"
  const logoUrl = settings.headerLogoUrl || undefined
  const footerSocialJson = settings.footerSocialJson as
    | {
        fb?: { url?: string }
        insta?: { url?: string }
        twitter?: { url?: string }
        linkedin?: { url?: string }
        website?: { url?: string }
      }
    | null
  const socialUrls = [
    footerSocialJson?.fb?.url,
    footerSocialJson?.insta?.url,
    footerSocialJson?.twitter?.url,
    footerSocialJson?.linkedin?.url,
    footerSocialJson?.website?.url,
  ].filter(Boolean) as string[]

  const footerContactJson = settings.footerContactJson as
    | { email?: string; phone1?: string; phone2?: string; address?: string }
    | null

  if (homePageId) {
    const page = await prisma.page.findUnique({
      where: { id: homePageId },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { order: "asc" },
        },
      },
    })

    if (page && page.isPublished) {
      const p = page as PageData

      const canonical = canonicalUrl("/")
      const title = p.metaTitle || p.title
      const description = p.metaDescription || p.bannerText || undefined

      return (
        <>
          <SeoJsonLd
            canonicalUrl={canonical}
            title={title}
            description={description}
            siteName={siteName}
            siteUrl={siteUrl}
            logoUrl={logoUrl}
            socialUrls={socialUrls}
            contactEmail={footerContactJson?.email || null}
            contactPhone={footerContactJson?.phone1 || footerContactJson?.phone2 || null}
            contactAddress={footerContactJson?.address || null}
          />
          {/* Render homepage from sections only for now. */}
          {/* <PageBanner
            bannerBackgroundImage={p.bannerBackgroundImage}
            bannerOverlayColor={p.bannerOverlayColor}
            bannerOverlayOpacity={p.bannerOverlayOpacity}
            bannerTitle={p.bannerTitle}
            bannerText={p.bannerText}
            bannerButtonText={p.bannerButtonText}
            bannerButtonLink={p.bannerButtonLink}
            bannerButtonVisible={p.bannerButtonVisible}
            bannerImage={p.bannerImage}
            bannerHeightPercent={p.bannerHeightPercent}
          /> */}
          <div className="container mx-auto px-4 py-8">
            {/* Keep title fallback disabled; homepage should be section-driven. */}
            {/* {!showBanner && (
              <h1 className="text-4xl font-bold mb-8">{p.title}</h1>
            )} */}
            <div className="space-y-12">
              {page.sections.map((section) => (
                <SectionRenderer
                  key={section.id}
                  section={section as SectionData}
                />
              ))}
            </div>
          </div>
        </>
      )
    }
  }

  const canonical = canonicalUrl("/")
  const title = "Home"
  const description = "Welcome to our CMS"

  return (
    <div className="container mx-auto px-4 py-24">
      <SeoJsonLd
        canonicalUrl={canonical}
        title={title}
        description={description}
        siteName={siteName}
        siteUrl={siteUrl}
        logoUrl={logoUrl}
        socialUrls={socialUrls}
        contactEmail={footerContactJson?.email || null}
        contactPhone={footerContactJson?.phone1 || footerContactJson?.phone2 || null}
        contactAddress={footerContactJson?.address || null}
      />
      {/* Keep this empty-state temporarily until homepage sections are configured in admin. */}
      <div className="text-center max-w-lg mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-brand-header">
          Nothing is created
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Let&apos;s start building your site. Create your first page and set it
          as the home page from the admin.
        </p>
        <Link
          href="/admin"
          className="inline-block px-6 py-3 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-hover transition-colors"
        >
          Let&apos;s start building
        </Link>
      </div>
    </div>
  )
}
