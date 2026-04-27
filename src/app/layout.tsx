import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SITE_NAME = "Chronotector";
const SITE_ABBREV = "CT";
const SITE_URL = "https://chronotector.com";
const SITE_DESCRIPTION = "Chrono Odyssey MMO News & Guides";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header siteName={SITE_NAME} siteAbbrev={SITE_ABBREV} />
        <main className="flex-1">{children}</main>
        <Footer siteName={SITE_NAME} siteAbbrev={SITE_ABBREV} />
      </body>
    </html>
  );
}
