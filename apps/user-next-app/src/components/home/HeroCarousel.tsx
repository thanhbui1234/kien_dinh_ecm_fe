"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Banner } from "shared-api";
import { Slide, AUTO_ADVANCE_MS } from "@/constants/hero";
import { SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { useTranslations } from "next-intl";
import { HeroSlideBg } from "./hero/HeroSlideBg";
import { HeroSlideContent } from "./hero/HeroSlideContent";
import { HeroControls } from "./hero/HeroControls";

export default function HeroCarousel({
  banners,
}: {
  banners?: Banner[] | null;
}) {
  const [current, setCurrent] = useState(0);
  const t = useTranslations();

  const FALLBACK_LOGO_SLIDE: Slide = useMemo(
    () => ({
      type: "product",
      image: DEFAULT_OG_IMAGE,
      title: SITE_NAME,
      description: t('hero.fallback_description'),
      link: "/products/",
      linkText: t('hero.fallback_link_text'),
      darkText: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  );

  const displaySlides: Slide[] = useMemo(() => {
    if (banners && banners.length > 0) {
      return banners.map((b) => ({
        type: "fullscreen",
        image: b.imageUrl,
        title: b.title || "",
        description: b.description || "",
        link: b.link || "#",
        linkText: t('hero.read_more'),
        darkText: false,
      }));
    }

    return [FALLBACK_LOGO_SLIDE];
  }, [banners, FALLBACK_LOGO_SLIDE, t]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 }, [
    Autoplay({ delay: AUTO_ADVANCE_MS, stopOnInteraction: false, stopOnMouseEnter: false }),
  ]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setCurrent(index);
    const slide = displaySlides[index];
    document.dispatchEvent(
      new CustomEvent("hero-slide-change", { detail: { darkText: !!slide.darkText } })
    );
  }, [emblaApi, displaySlides]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(); // Trigger once on mount
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const goNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const goPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const goTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);

      // Restart autoplay when user clicks manually to prevent immediate skip
      const autoplay = emblaApi.plugins().autoplay;
      if (autoplay) {
        autoplay.reset();
      }
    },
    [emblaApi]
  );

  const activeSlide = displaySlides[current] || displaySlides[0];
  const isDark = !!activeSlide.darkText;

  return (
    <section
      aria-label="Hero carousel"
      className="relative w-full h-[100vh] h-[100dvh] min-h-[600px] md:h-[100vh] md:min-h-[720px] md:max-h-[1080px] bg-[#0a0a0a] overflow-hidden"
    >
      <div className="overflow-hidden w-full h-full" ref={emblaRef}>
        <div className="flex h-full">
          {displaySlides.map((s, i) => {
            const active = i === current;
            return (
              <div
                key={s.image}
                className="relative flex-[0_0_100%] h-full min-w-0"
                aria-hidden={!active}
              >
                <HeroSlideBg
                  type={s.type}
                  image={s.image}
                  title={s.title}
                  isFirst={i === 0}
                  darkText={!!s.darkText}
                  active={active}
                />

                {/* Content — only rendered for active slide so stagger animation replays cleanly */}
                {active && (
                  <HeroSlideContent
                    title={s.title}
                    subtitle={s.subtitle}
                    description={s.description}
                    link={s.link}
                    linkText={s.linkText}
                    isDark={isDark}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls — buttons + progressive dashes (left), slide counter (right) */}
      <HeroControls
        current={current}
        total={displaySlides.length}
        goPrev={goPrev}
        goNext={goNext}
        goTo={goTo}
        isDark={isDark}
      />

      {/* Scroll Down Indicator button (Mobile only) */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: window.innerHeight - 30, behavior: 'smooth' })}
        aria-label={t('hero.scroll_down')}
        className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors cursor-pointer group"
      >
        <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-[0.2em] opacity-80 group-hover:opacity-100 drop-shadow-sm">
          {t('hero.explore_more')}
        </span>
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center animate-bounce shadow-md">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>
    </section>
  );
}
