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
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
