import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { getBaseUrl } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: "CMS - Content Management System",
  description: "A modern CMS built with Next.js",
  metadataBase: new URL(baseUrl),
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
