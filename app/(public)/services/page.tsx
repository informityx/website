import { prisma } from "@/lib/db/prisma"
import ServiceList from "@/components/public/services/ServiceList"
import type { Metadata } from "next"
import { canonicalUrl, getBaseUrl } from "@/lib/seo"
import {
  DEFAULT_META_TITLE,
  DEFAULT_OG_IMAGE_URL,
  documentTitle,
} from "@/lib/site-seo-defaults"
import { getOrCreateSettings } from "@/lib/db/settings"
import SeoJsonLd from "@/components/seo/SeoJsonLd"

export const revalidate = 60

const servicesPageTitle = documentTitle("Services")

export const metadata: Metadata = {
  title: servicesPageTitle,
  description: "Our services and offerings",
  alternates: {
    canonical: canonicalUrl("/services"),
  },
  openGraph: {
    type: "website",
    url: canonicalUrl("/services"),
    title: servicesPageTitle,
    description: "Our services and offerings",
    images: [{ url: DEFAULT_OG_IMAGE_URL, alt: DEFAULT_META_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: servicesPageTitle,
    description: "Our services and offerings",
    images: [DEFAULT_OG_IMAGE_URL],
  },
}

export default async function ServicesPage() {
  const settings = await getOrCreateSettings()
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  })

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

  const canonical = canonicalUrl("/services")

  return (
    <div className="container mx-auto px-4 py-16">
      <SeoJsonLd
        canonicalUrl={canonical}
        title="Services"
        description="Our services and offerings"
        siteName={siteName}
        siteUrl={siteUrl}
        logoUrl={logoUrl}
        socialUrls={socialUrls}
        contactEmail={footerContactJson?.email || null}
        contactPhone={footerContactJson?.phone1 || footerContactJson?.phone2 || null}
        contactAddress={footerContactJson?.address || null}
      />
      <h1 className="text-4xl font-bold mb-12 text-center text-brand-header">Our Services</h1>
      <ServiceList services={services} />
    </div>
  )
}
