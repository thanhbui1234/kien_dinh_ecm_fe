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
  return api.settings.getBanners().catch(() => []);
});
