import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import Image from "next/image"
import type { Metadata } from "next"
import { canonicalUrl, getBaseUrl } from "@/lib/seo"
import { getOrCreateSettings } from "@/lib/db/settings"
import SeoJsonLd from "@/components/seo/SeoJsonLd"

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await prisma.service.findUnique({
    where: { slug },
  })

  if (!service || !service.isPublished) {
    return {
      title: "Service Not Found",
      robots: { index: false, follow: false },
    }
  }

  const canonical = canonicalUrl(`/services/${service.slug}`)
  const title = service.title
  const description = service.description || service.shortDescription || undefined

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: service.image ? [{ url: service.image, alt: title }] : undefined,
    },
    twitter: {
      card: service.image ? "summary_large_image" : "summary",
      title,
      description,
      images: service.image ? [service.image] : undefined,
    },
  }
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params

  const service = await prisma.service.findUnique({
    where: { slug },
  })

  if (!service || !service.isPublished) {
    notFound()
  }

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

  const canonical = canonicalUrl(`/services/${service.slug}`)
  const title = service.title
  const description = service.description || service.shortDescription || undefined

  return (
    <div className="container mx-auto px-4 py-16">
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
        mainEntity={{
          type: "Service",
          name: title,
          description: description || undefined,
        }}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-brand-header">{service.title}</h1>
        {service.image && (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        {service.description && (
          <div className="prose max-w-none mb-6">
            <p className="text-lg text-gray-700 whitespace-pre-line">
              {service.description}
            </p>
          </div>
        )}
        {service.content && typeof service.content === "string" ? (
          // `service.content` is expected to be HTML when stored as a string.
          // Rendering anything else as HTML would produce broken markup.
          <div className="prose max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: service.content,
              }}
            />
          </div>
        ) : null}
        {service.content && typeof service.content !== "string" ? (
          // Fallback for non-HTML JSON content so the page still contains indexable text.
          <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(service.content, null, 2)}
          </pre>
        ) : null}
      </div>
    </div>
  )
}
