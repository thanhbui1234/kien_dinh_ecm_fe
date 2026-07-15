import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
