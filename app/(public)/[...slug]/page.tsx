import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import SectionRenderer from "@/components/public/sections/SectionRenderer"
import PageBanner from "@/components/public/PageBanner"
import CardDetailPage from "@/components/public/sections/CardDetailPage"
import type { Metadata } from "next"
import type { SectionData, PageData, CardItem } from "@/types/cms"

const RESERVED_FIRST_SEGMENTS = ["services", "admin", "admin-login", "api", "media"]

interface DynamicPageProps {
  params: Promise<{ slug: string[] }>
}

export const revalidate = 60

function findCardInSections(
  sections: Array<{ type: string; content: unknown }>,
  cardSlug: string
): CardItem | null {
  for (const section of sections) {
    if (section.type !== "cards") continue
    const content = section.content as { cards?: CardItem[] }
    const cards = content?.cards ?? []
    const card = cards.find(
      (c) => (c.cardSlug ?? "").toLowerCase() === cardSlug.toLowerCase()
    )
    if (card) return card
  }
  return null
}

export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params
  const slugString = slug.join("/")

  if (slug.length === 2) {
    const [first] = slug
    if (RESERVED_FIRST_SEGMENTS.includes(first)) {
      return { title: "Not Found" }
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
      const card = findCardInSections(customType.sections, slug[1])
      if (card) {
        return {
          title: `${card.heading} | ${customType.name}`,
        }
      }
    }
  }

  const page = await prisma.page.findUnique({
    where: { slug: slugString },
  })

  if (page?.isPublished) {
    return {
      title: page.metaTitle || page.title,
      description: page.metaDescription || undefined,
    }
  }

  if (slug.length === 1 && !RESERVED_FIRST_SEGMENTS.includes(slug[0])) {
    const customType = await prisma.customType.findUnique({
      where: { slug: slug[0], isPublished: true },
    })
    if (customType) {
      return {
        title: customType.name,
      }
    }
  }

  return { title: "Page Not Found" }
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params
  const slugString = slug.join("/")
  const firstSegment = slug[0]

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
      return (
        <>
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
      const card = findCardInSections(customType.sections, slug[1])
      if (card) {
        return (
          <CardDetailPage
            card={card}
            customTypeName={customType.name}
            customTypeSlug={customType.slug}
          />
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
      return (
        <>
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
      return (
        <>
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
