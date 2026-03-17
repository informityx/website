import { MetadataRoute } from "next"
import { prisma } from "@/lib/db/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:9000"

  const [pages, services, customTypes] = await Promise.all([
    prisma.page.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.service.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.customType.findMany({
      where: { isPublished: true },
      include: {
        sections: {
          where: { type: "cards" },
          select: { content: true, updatedAt: true },
        },
      },
    }),
  ])

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]

  const dynamicPages = pages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  const servicePages = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: service.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const customTypeEntries: MetadataRoute.Sitemap = []
  for (const ct of customTypes) {
    customTypeEntries.push({
      url: `${baseUrl}/${ct.slug}`,
      lastModified: ct.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
    for (const section of ct.sections) {
      const content = section.content as { cards?: Array<{ openInModal?: boolean; cardSlug?: string }> }
      const cards = content?.cards ?? []
      for (const card of cards) {
        if (card.openInModal === false && card.cardSlug) {
          customTypeEntries.push({
            url: `${baseUrl}/${ct.slug}/${card.cardSlug}`,
            lastModified: section.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.5,
          })
        }
      }
    }
  }

  return [...staticRoutes, ...dynamicPages, ...servicePages, ...customTypeEntries]
}
