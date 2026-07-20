import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCachedCategories } from "@/lib/cached-api";
import { notoSans, notoSansJP } from "@/lib/fonts";
import MotionProvider from "@/components/ui/MotionProvider";

export const metadata: Metadata = {
  title: "MAZAK VIETNAM",
  description: "Yamazaki Mazak Vietnam - Máy công cụ CNC chuyên nghiệp",
  openGraph: {
    title: "MAZAK VIETNAM",
    description: "Yamazaki Mazak Vietnam - Máy công cụ CNC chuyên nghiệp",
    locale: "vi_VN",
    type: "website",
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
