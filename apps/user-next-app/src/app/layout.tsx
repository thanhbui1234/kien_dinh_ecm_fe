import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCachedCategories } from "@/lib/cached-api";
import { notoSans, notoSansJP } from "@/lib/fonts";
import MotionProvider from "@/components/ui/MotionProvider";
import AIChatWidget from "@/components/common/AIChatWidget";
import JsonLd from "@/components/seo/JsonLd";
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_OG_IMAGE,
  DEFAULT_KEYWORDS,
  generateWebSiteSearchSchema,
} from "@/lib/seo";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - Phụ Tùng & Dụng Cụ Cắt Gọt Máy CNC`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Thanh Bằng — Chuyên cung cấp phụ tùng, dụng cụ cắt gọt và máy công cụ CNC chất lượng cao tại Việt Nam.",
  keywords: DEFAULT_KEYWORDS,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "zWFWsnXX4PdKzZ3hvXo1Uig7xPxDv_7VWqXmVrg7UuE",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: `${SITE_NAME} - Phụ Tùng & Dụng Cụ Cắt Gọt Máy CNC`,
    description: "Thanh Bằng — Chuyên cung cấp phụ tùng, dụng cụ cắt gọt và máy công cụ CNC chất lượng cao tại Việt Nam.",
    siteName: SITE_NAME,
    url: SITE_URL,
    locale: "vi_VN",
    type: "website",
    images: [{ url: `${SITE_URL}${DEFAULT_OG_IMAGE}`, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Phụ Tùng & Dụng Cụ Cắt Gọt Máy CNC`,
    description: "Thanh Bằng — Chuyên cung cấp phụ tùng, dụng cụ cắt gọt và máy công cụ CNC chất lượng cao tại Việt Nam.",
    images: [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
  },
  icons: {
    icon: [
      { url: '/images/logo_thanh_bang.png', type: 'image/png' },
    ],
    apple: [
      { url: '/images/logo_thanh_bang.png', type: 'image/png' },
    ],
    shortcut: '/images/logo_thanh_bang.png',
  },
};

import { Suspense } from 'react';
import RouteHistoryTracker from "@/components/layout/RouteHistoryTracker";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categoriesResponse = await getCachedCategories();
  const categories = (categoriesResponse || []).filter((c) => !c.parentId);

  const searchSchema = generateWebSiteSearchSchema();
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={`${notoSans.variable} ${notoSansJP.variable}`}>
      <head>
        <JsonLd />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(searchSchema) }}
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <RouteHistoryTracker />
        </Suspense>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MotionProvider>
            <Header categories={categories} />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <AIChatWidget />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
