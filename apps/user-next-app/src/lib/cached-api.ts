import { cache } from "react";
import { api } from "./api";

// React.cache deduplicates identical calls within the same render tree.
// getCategories is called in layout + page.tsx + products/page.tsx + products/[slug]/page.tsx —
// all in the same request, so they share one network call instead of four.
export const getCachedCategories = cache(async () => {
  return api.categories.getCategories().catch(() => []);
});

// getBanners is called in layout (if any future use) and page.tsx HeroSection.
export const getCachedBanners = cache(async () => {
  return api.settings.getBanners({ next: { tags: ['banners'] } } as RequestInit).catch(() => []);
});

// getFeaturedProducts is called in page.tsx HeroSection (hero fallback) and FeaturedProductsSection —
// both in the same request, so they share one network call instead of two.
export const getCachedFeaturedProducts = cache(async () => {
  const res = await api.products
    .getProducts(
      { isFeatured: "true", limit: "6" },
      { next: { revalidate: 300, tags: ["products"] } }
    )
    .catch(() => null);
  return res?.items ?? [];
});
