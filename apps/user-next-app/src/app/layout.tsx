import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCachedCategories } from "@/lib/cached-api";
import { notoSans, notoSansJP } from "@/lib/fonts";
import MotionProvider from "@/components/ui/MotionProvider";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Thanh Bằng — Chuyên cung cấp phụ tùng, dụng cụ cắt gọt và máy công cụ CNC tại Việt Nam.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: SITE_NAME,
    description: "Thanh Bằng — Chuyên cung cấp phụ tùng, dụng cụ cắt gọt và máy công cụ CNC tại Việt Nam.",
    siteName: SITE_NAME,
    locale: "vi_VN",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "Thanh Bằng — Chuyên cung cấp phụ tùng, dụng cụ cắt gọt và máy công cụ CNC tại Việt Nam.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categoriesResponse = await getCachedCategories();
  const categories = (categoriesResponse || []).filter((c) => !c.parentId);

  return (
    <html lang="vi" suppressHydrationWarning className={`${notoSans.variable} ${notoSansJP.variable}`}>
      <body>
        <MotionProvider>
          <Header categories={categories} />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
