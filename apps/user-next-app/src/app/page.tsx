import { Suspense } from "react";
import type { Metadata } from "next";
import HeroCarousel from "@/components/home/HeroCarousel";
import ProductsSection from "@/components/home/ProductsSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProjectsSection from "@/components/home/FeaturedProjectsSection";
import ContactCTA from "@/components/home/ContactCTA";
import ShowroomCTA from "@/components/home/ShowroomCTA";
import { getCachedCategories, getCachedBanners } from "@/lib/cached-api";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Thanh Bằng — Phụ tùng & Máy công cụ CNC",
  description: "Thanh Bằng chuyên cung cấp phụ tùng, dụng cụ cắt gọt và máy công cụ CNC chính hãng tại Việt Nam. Tư vấn kỹ thuật chuyên sâu, giao hàng toàn quốc.",
  alternates: { canonical: "https://thanhbang.com/" },
  openGraph: {
    title: "Thanh Bằng — Phụ tùng & Máy công cụ CNC",
    description: "Thanh Bằng chuyên cung cấp phụ tùng, dụng cụ cắt gọt và máy công cụ CNC chính hãng tại Việt Nam.",
    url: "https://thanhbang.com/",
    siteName: "Thanh Bằng",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thanh Bằng — Phụ tùng & Máy công cụ CNC",
    description: "Thanh Bằng chuyên cung cấp phụ tùng, dụng cụ cắt gọt và máy công cụ CNC chính hãng tại Việt Nam.",
  },
};

export const experimental_ppr = true;

async function HeroSection() {
  const banners = await getCachedBanners();
  return <HeroCarousel banners={banners ?? []} />;
}

async function FeaturedProductsSection() {
  const res = await api.products
    .getProducts(
      { isFeatured: "true", limit: "6" },
      { next: { revalidate: 3600, tags: ['products'] } }
    )
    .catch(() => null);
  console.log("res", res)
  return <ProductsSection products={res?.items ?? []} />;
}

async function FeaturedCategoriesSection() {
  const res = await getCachedCategories();
  const categories = (res ?? []).filter((c) => !c.parentId);
  return <CategoriesSection categories={categories} />;
}

async function FeaturedProjectsWrapper() {
  const res = await api.projects
    .getProjects(
      { isFeatured: "true", limit: "6" },
      { next: { revalidate: 3600, tags: ['projects'] } }
    )
    .catch(() => null);
  return <FeaturedProjectsSection projects={res?.items ?? []} />;
}

function HeroSkeleton() {
  return <Skeleton className="h-[60vh] w-full rounded-none" />;
}

function SectionSkeleton() {
  return (
    <div className="mx-auto max-w-[1300px] px-6 py-16 md:px-10">
      <Skeleton className="mb-8 h-8 w-48" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] w-full" />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <FeaturedProductsSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <FeaturedCategoriesSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <FeaturedProjectsWrapper />
      </Suspense>
      <ContactCTA />
      <ShowroomCTA />
    </>
  );
}
