import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:9000"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/admin-login", "/admin-login/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
