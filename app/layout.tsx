import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { getBaseUrl } from "@/lib/seo";
import {
  DEFAULT_META_DESCRIPTION,
  DEFAULT_META_TITLE,
  DEFAULT_OG_IMAGE_URL,
  documentTitle,
} from "@/lib/site-seo-defaults";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = getBaseUrl();
const defaultDocumentTitle = documentTitle();

export const metadata: Metadata = {
  title: defaultDocumentTitle,
  description: DEFAULT_META_DESCRIPTION,
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    title: defaultDocumentTitle,
    description: DEFAULT_META_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE_URL, alt: DEFAULT_META_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultDocumentTitle,
    description: DEFAULT_META_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchAtlasDynamicOptimizationSrc =
    "data:text/javascript;base64,dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInNjcmlwdCIpO3NjcmlwdC5zZXRBdHRyaWJ1dGUoIm5vd3Byb2NrZXQiLCAiIik7c2NyaXB0LnNldEF0dHJpYnV0ZSgibml0cm8tZXhjbHVkZSIsICIiKTtzY3JpcHQuc3JjID0gImh0dHBzOi8vZGFzaGJvYXJkLnNlYXJjaGF0bGFzLmNvbS9zY3JpcHRzL2R5bmFtaWNfb3B0aW1pemF0aW9uLmpzIjtzY3JpcHQuZGF0YXNldC51dWlkID0gIjFkYTI2NzE1LWY3MzctNDhlMy05MzY5LWI2MGFlNDVhMTBkNiI7c2NyaXB0LmlkID0gInNhLWR5bmFtaWMtb3B0aW1pemF0aW9uLWxvYWRlciI7ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpOw==";

  return (
    <html lang="en">
      <head>
        <script
          type="text/javascript"
          id="sa-dynamic-optimization"
          data-uuid="1da26715-f737-48e3-9369-b60ae45a10d6"
          src={searchAtlasDynamicOptimizationSrc}
          {...{ nowprocket: "", "nitro-exclude": "" }}
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
