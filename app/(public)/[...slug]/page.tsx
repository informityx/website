import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import SectionRenderer from "@/components/public/sections/SectionRenderer"
import PageBanner from "@/components/public/PageBanner"
import CardDetailPage from "@/components/public/sections/CardDetailPage"
import type { Metadata } from "next"
import type { SectionData, PageData, CardItem } from "@/types/cms"
import { canonicalFromSlug, getBaseUrl } from "@/lib/seo"
import { getOrCreateSettings } from "@/lib/db/settings"
import SeoJsonLd from "@/components/seo/SeoJsonLd"
import { findCardInCptSections } from "@/lib/cpt-card-nav"

const RESERVED_FIRST_SEGMENTS = ["services", "admin", "admin-login", "api", "media"]

interface DynamicPageProps {
  params: Promise<{ slug: string[] }>
}

export const revalidate = 60

export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params
  const slugString = slug.join("/")
  const canonical = canonicalFromSlug(slug)

  if (slug.length === 2) {
    const [first] = slug
    if (RESERVED_FIRST_SEGMENTS.includes(first)) {
      return { title: "Not Found", robots: { index: false, follow: false } }
    }
    const customType = await prisma.customType.findUnique({
      where: { slug: first, isPublished: true },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { order: "asc" },
        },
      },
    })
    if (customType) {
      const card = findCardInCptSections(customType.sections, slug[1])
      if (card) {
        const title = `${card.heading} | ${customType.name}`
        const description = card.description || card.overview || undefined
        return {
          title,
          description,
          alternates: { canonical },
          openGraph: {
            type: "website",
            url: canonical,
            title,
            description,
          },
          twitter: {
            card: "summary",
            title,
            description,
          },
        }
      }
    }
  }

  const page = await prisma.page.findUnique({
    where: { slug: slugString },
  })

  if (page?.isPublished) {
    const title = page.metaTitle || page.title
    const description = page.metaDescription || undefined
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        type: "website",
        url: canonical,
        title,
        description,
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
    }
  }

  if (slug.length === 1 && !RESERVED_FIRST_SEGMENTS.includes(slug[0])) {
    const customType = await prisma.customType.findUnique({
      where: { slug: slug[0], isPublished: true },
    })
    if (customType) {
      const title = customType.name
      const description = customType.bannerText || customType.bannerTitle || undefined
      return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
          type: "website",
          url: canonical,
          title,
          description,
        },
        twitter: {
          card: "summary",
          title,
          description,
        },
      }
    }
  }

  return { title: "Page Not Found", robots: { index: false, follow: false } }
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params
  const slugString = slug.join("/")
  const firstSegment = slug[0]
  const settings = await getOrCreateSettings()

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

  const canonical = canonicalFromSlug(slug)

  if (RESERVED_FIRST_SEGMENTS.includes(firstSegment)) {
    notFound()
  }

  // Two segments: try page by full slug, then custom type + card
  if (slug.length === 2) {
    const page = await prisma.page.findUnique({
      where: { slug: slugString },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { order: "asc" },
        },
      },
    })

    if (page?.isPublished) {
      const p = page as PageData
      const showBanner =
        p.bannerTitle ||
        p.bannerText ||
        p.bannerBackgroundImage ||
        p.bannerImage ||
        (p.bannerButtonVisible && p.bannerButtonText)
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
            contactPhone={
              footerContactJson?.phone1 || footerContactJson?.phone2 || null
            }
            contactAddress={footerContactJson?.address || null}
          />
          <PageBanner
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
          />
          <div className="container mx-auto px-4 py-8">
            {!showBanner && (
              <h1 className="text-4xl font-bold mb-8">{p.title}</h1>
            )}
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

    const customType = await prisma.customType.findUnique({
      where: { slug: firstSegment, isPublished: true },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { order: "asc" },
        },
      },
    })

    if (customType) {
      const card = findCardInCptSections(customType.sections, slug[1])
      if (card) {
        return (
          <>
            <SeoJsonLd
              canonicalUrl={canonical}
              title={`${card.heading} | ${customType.name}`}
              description={card.description || card.overview || undefined}
              siteName={siteName}
              siteUrl={siteUrl}
              logoUrl={logoUrl}
              socialUrls={socialUrls}
              contactEmail={footerContactJson?.email || null}
              contactPhone={
                footerContactJson?.phone1 || footerContactJson?.phone2 || null
              }
              contactAddress={footerContactJson?.address || null}
            />
            <CardDetailPage
              card={card}
              customTypeName={customType.name}
              customTypeSlug={customType.slug}
            />
          </>
        )
      }
    }

    notFound()
  }

  // Single segment: try page then custom type
  if (slug.length === 1) {
    const page = await prisma.page.findUnique({
      where: { slug: slugString },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { order: "asc" },
        },
      },
    })

    if (page?.isPublished) {
      const p = page as PageData
      const showBanner =
        p.bannerTitle ||
        p.bannerText ||
        p.bannerBackgroundImage ||
        p.bannerImage ||
        (p.bannerButtonVisible && p.bannerButtonText)
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
            contactPhone={
              footerContactJson?.phone1 || footerContactJson?.phone2 || null
            }
            contactAddress={footerContactJson?.address || null}
          />
          <PageBanner
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
          />
          <div className="container mx-auto px-4 py-8">
            {!showBanner && (
              <h1 className="text-4xl font-bold mb-8">{p.title}</h1>
            )}
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

    const customType = await prisma.customType.findUnique({
      where: { slug: slugString, isPublished: true },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { order: "asc" },
        },
      },
    })

    if (customType) {
      const ct = customType
      const showBanner =
        ct.bannerTitle ||
        ct.bannerText ||
        ct.bannerBackgroundImage ||
        ct.bannerImage ||
        (ct.bannerButtonVisible && ct.bannerButtonText)

      const title = ct.name
      const description = ct.bannerText || ct.bannerTitle || undefined
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
            contactPhone={
              footerContactJson?.phone1 || footerContactJson?.phone2 || null
            }
            contactAddress={footerContactJson?.address || null}
          />
          <PageBanner
            bannerBackgroundImage={ct.bannerBackgroundImage}
            bannerOverlayColor={ct.bannerOverlayColor}
            bannerOverlayOpacity={ct.bannerOverlayOpacity}
            bannerTitle={ct.bannerTitle}
            bannerText={ct.bannerText}
            bannerButtonText={ct.bannerButtonText}
            bannerButtonLink={ct.bannerButtonLink}
            bannerButtonVisible={ct.bannerButtonVisible}
            bannerImage={ct.bannerImage}
            bannerHeightPercent={ct.bannerHeightPercent}
          />
          <div className="container mx-auto px-4 py-8">
            {!showBanner && (
              <h1 className="text-4xl font-bold mb-8">{ct.name}</h1>
            )}
            <div className="space-y-12">
              {ct.sections.map((section) => (
                <SectionRenderer
                  key={section.id}
                  section={section as SectionData}
                  basePath={ct.slug}
                />
              ))}
            </div>
          </div>
        </>
      )
    }

    notFound()
  }

  // Three or more segments: only try page by full slug
  const page = await prisma.page.findUnique({
    where: { slug: slugString },
    include: {
      sections: {
        where: { isVisible: true },
        orderBy: { order: "asc" },
      },
    },
  })

  if (!page || !page.isPublished) {
    notFound()
  }

  const p = page as PageData
  const showBanner =
    p.bannerTitle ||
    p.bannerText ||
    p.bannerBackgroundImage ||
    p.bannerImage ||
    (p.bannerButtonVisible && p.bannerButtonText)

  return (
    <>
      <SeoJsonLd
        canonicalUrl={canonical}
        title={p.metaTitle || p.title}
        description={p.metaDescription || p.bannerText || undefined}
        siteName={siteName}
        siteUrl={siteUrl}
        logoUrl={logoUrl}
        socialUrls={socialUrls}
        contactEmail={footerContactJson?.email || null}
        contactPhone={footerContactJson?.phone1 || footerContactJson?.phone2 || null}
        contactAddress={footerContactJson?.address || null}
      />
      <PageBanner
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
      />
      <div className="container mx-auto px-4 py-8">
        {!showBanner && (
          <h1 className="text-4xl font-bold mb-8">{p.title}</h1>
        )}
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
