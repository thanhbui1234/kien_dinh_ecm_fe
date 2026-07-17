import HeroCarousel from "@/components/home/HeroCarousel";
import ProductsSection from "@/components/home/ProductsSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProjectsSection from "@/components/home/FeaturedProjectsSection";
import ContactCTA from "@/components/home/ContactCTA";
import ShowroomCTA from "@/components/home/ShowroomCTA";
import { api } from "@/lib/api";

export default async function HomePage() {
  const banners = await api.settings.getBanners();

  const [productsResponse, projectsResponse, categoriesResponse] = await Promise.all([
    api.products.getProducts({ isFeatured: 'true', limit: '6' }),
    api.projects.getProjects({ isFeatured: 'true', limit: '6' }),
    api.categories.getCategories(),
  ]);

  const featuredProducts = productsResponse?.items || [];
  const featuredProjects = projectsResponse?.items || [];
  const categories = (categoriesResponse || []).filter(c => !c.parentId);

  return (
    <main>
      <HeroCarousel banners={banners} />
      <ProductsSection products={featuredProducts} />
      <CategoriesSection categories={categories} />
      <FeaturedProjectsSection projects={featuredProjects} />
      <ContactCTA />
      <ShowroomCTA />
    </main>
  );
}
