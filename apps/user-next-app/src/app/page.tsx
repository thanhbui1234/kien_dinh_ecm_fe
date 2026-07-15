import HeroCarousel from "@/components/home/HeroCarousel";
import PickupSection from "@/components/home/PickupSection";
import ProductsSection from "@/components/home/ProductsSection";
import NewsSection from "@/components/home/NewsSection";
import TechnologySection from "@/components/home/TechnologySection";
import GoGreenSection from "@/components/home/GoGreenSection";
import ShowroomCTA from "@/components/home/ShowroomCTA";
import { api } from "@/lib/api";

export default async function HomePage() {
  const settings = await api.settings.getSystemSettings();

  return (
    <main>
      <HeroCarousel />
      <PickupSection />
      <ProductsSection />
      <NewsSection />
      <TechnologySection />
      <GoGreenSection />
      <ShowroomCTA />
    </main>
  );
}
