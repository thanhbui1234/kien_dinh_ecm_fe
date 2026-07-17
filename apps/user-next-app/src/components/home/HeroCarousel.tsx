"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
// import Fade from "embla-carousel-fade";
import { Banner } from "shared-api";
import { defaultSlides, Slide, AUTO_ADVANCE_MS } from "@/constants/hero";
import { HeroSlideBg } from "./hero/HeroSlideBg";
import { HeroSlideContent } from "./hero/HeroSlideContent";
import { HeroControls } from "./hero/HeroControls";

export default function HeroCarousel({ banners }: { banners?: Banner[] | null }) {
  const [current, setCurrent] = useState(0);

  const displaySlides: Slide[] = useMemo(() => {
    return banners && banners.length > 0
      ? banners.map((b) => ({
          type: "fullscreen",
          image: b.imageUrl,
          title: b.title || "",
          description: b.description || "",
          link: b.link || "#",
          linkText: "Đọc thêm",
          darkText: false,
        }))
      : defaultSlides;
  }, [banners]);

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
      
      // We also restart the autoplay when user clicks manually to prevent immediate skip
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
      className="relative w-full h-[100vh] min-h-[720px] max-h-[1080px] bg-[#0a0a0a]"
    >
      <div className="overflow-hidden h-full" ref={emblaRef}>
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
    </section>
  );
}
