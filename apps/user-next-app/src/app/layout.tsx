import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { api } from "@/lib/api";

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
  const categoriesResponse = await api.categories.getCategories().catch(() => []);
  const categories = (categoriesResponse || []).filter((c) => !c.parentId);

  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <Header categories={categories} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
