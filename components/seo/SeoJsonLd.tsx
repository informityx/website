export type SeoJsonLdMainEntity = {
  type: "Service"
  name: string
  description?: string
}

export interface SeoJsonLdProps {
  canonicalUrl: string
  title: string
  description?: string
  siteName: string
  siteUrl: string
  logoUrl?: string | null
  socialUrls?: string[]
  contactEmail?: string | null
  contactPhone?: string | null
  contactAddress?: string | null
  mainEntity?: SeoJsonLdMainEntity
}

export default function SeoJsonLd({
  canonicalUrl,
  title,
  description,
  siteName,
  siteUrl,
  logoUrl,
  socialUrls = [],
  contactEmail,
  contactPhone,
  contactAddress,
  mainEntity,
}: SeoJsonLdProps) {
  const organization: Record<string, unknown> = {
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
  }

  if (logoUrl) {
    organization["logo"] = logoUrl
  }

  if (socialUrls.length > 0) {
    organization["sameAs"] = socialUrls
  }

  if (contactEmail || contactPhone || contactAddress) {
    // Keep it simple: schema.org allows either phone/email or address fields.
    const contactPoint: Record<string, unknown> = {
      "@type": "ContactPoint",
    }
    if (contactEmail) contactPoint["email"] = contactEmail
    if (contactPhone) contactPoint["telephone"] = contactPhone
    if (contactAddress) contactPoint["address"] = contactAddress
    organization["contactPoint"] = [contactPoint]
  }

  const webSite = {
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
  }

  const webPage: Record<string, unknown> = {
    "@type": "WebPage",
    name: title,
    url: canonicalUrl,
    description: description || undefined,
    isPartOf: webSite,
  }

  if (mainEntity) {
    webPage["mainEntity"] = {
      "@type": mainEntity.type,
      name: mainEntity.name,
      description: mainEntity.description || undefined,
    }
  }

  const graph = [organization, webSite, webPage]

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

