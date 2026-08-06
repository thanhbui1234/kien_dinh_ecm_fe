'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import useEmblaCarousel from 'embla-carousel-react';
import type { Product } from 'shared-api';
import { useTranslations } from 'next-intl';

const LightboxModal = dynamic(() => import('./LightboxModal'), { ssr: false });

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export type MediaItem =
  | { type: 'image'; src: string }
  | { type: 'video'; src: string; youtubeId: string | null; directUrl: string };

interface ProductMediaGalleryProps {
  images?: Product['images'];
  thumbnail: string;
  name: string;
  videoUrls?: string[];
}

export default function ProductMediaGallery({ images, thumbnail, name, videoUrls }: ProductMediaGalleryProps) {
  const t = useTranslations();
  const sorted = (images && images.length > 0)
    ? [...images].sort((a, b) => {
      if (a.isMain && !b.isMain) return -1;
      if (!a.isMain && b.isMain) return 1;
      return a.orderIndex - b.orderIndex;
    })
    : [];

  const hasMain = sorted.some((img) => img.isMain);
  const imageUrls = sorted.map((img) => img.imageUrl);
  const thumbList = sorted.length > 0
    ? (hasMain ? imageUrls : [thumbnail, ...imageUrls])
    : (thumbnail ? [thumbnail] : []);

  const mediaItems: MediaItem[] = [
    ...thumbList.map((src): MediaItem => ({ type: 'image', src })),
    ...(videoUrls ?? []).map((url): MediaItem => {
      const youtubeId = getYoutubeId(url);
      return {
        type: 'video',
        src: youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : url,
        youtubeId,
        directUrl: url,
      };
    }),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const thumbsContainerRef = useRef<HTMLDivElement | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    duration: 25,
    skipSnaps: false,
  });

  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi || !emblaThumbsApi) return;
    const newIndex = emblaApi.selectedScrollSnap();
    setActiveIndex(newIndex);
    emblaThumbsApi.scrollTo(newIndex);
  }, [emblaApi, emblaThumbsApi]);

  // No longer need to reset playing state since videos render directly

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-scroll thumb list is handled by emblaThumbsApi.scrollTo in onSelect
  // We can remove the old manual scrollIntoView logic

  const goTo = (index: number) => {
    if (index < 0 || index >= mediaItems.length) return;
    emblaApi?.scrollTo(index);
  };

  const scrollPrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const slides = mediaItems.map((item) =>
    item.type === 'video' ? { src: item.src, youtubeId: item.youtubeId, directUrl: item.directUrl } : { src: item.src }
  );

  return (
    <div className="flex flex-col gap-3 lg:sticky lg:top-[100px]">
      {/* Main Viewport Slider */}
      <div className="relative group/zoom w-full overflow-hidden rounded-2xl bg-[#f8f9fa] shadow-xs border border-gray-100/80 aspect-square">
        <div ref={emblaRef} className="h-full overflow-hidden cursor-grab active:cursor-grabbing select-none">
          <div className="flex h-full touch-pan-y" style={{ backfaceVisibility: 'hidden' }}>
            {mediaItems.map((item, index) => (
              <div
                key={index}
                className="relative flex-[0_0_100%] min-w-0 h-full bg-[#f8f9fa] flex items-center justify-center overflow-hidden"
              >
                {item.type === 'video' ? (
                  <div className="relative w-full h-full bg-black flex items-center justify-center pointer-events-auto">
                    {item.youtubeId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=0&controls=1&rel=0`}
                        title={name}
                        className="w-full h-full border-0 relative z-20"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <video src={item.directUrl} controls preload="metadata" className="w-full h-full object-contain relative z-20" />
                    )}
                  </div>
                ) : (
                  <div className="relative w-full h-full cursor-zoom-in" onClick={() => openLightbox(index)}>
                    <Image
                      src={item.src}
                      alt={name}
                      fill
                      draggable={false}
                      className="object-contain p-4 md:p-6 transition-transform duration-300 group-hover/zoom:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                    />
                    {/* Zoom hint */}
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                        <path d="M11 8v6M8 11h6" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Prev/Next Navigation Arrows for Mobile and Desktop */}
        {mediaItems.length > 1 && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              disabled={activeIndex === 0}
              aria-label={t('products.gallery_prev')}
              className="flex absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-10 md:h-10 items-center justify-center rounded-full bg-white/90 shadow-md text-gray-800 disabled:opacity-0 disabled:pointer-events-none transition-all duration-200 hover:bg-white hover:text-[#5e8dd1] cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={activeIndex === mediaItems.length - 1}
              aria-label={t('products.gallery_next')}
              className="flex absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-10 md:h-10 items-center justify-center rounded-full bg-white/90 shadow-md text-gray-800 disabled:opacity-0 disabled:pointer-events-none transition-all duration-200 hover:bg-white hover:text-[#5e8dd1] cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Navigation (Slider) */}
      <div className="w-full relative mt-2">
        <div ref={emblaThumbsRef} className="overflow-hidden">
          <div className="flex gap-2.5 py-1 px-1 touch-pan-x" style={{ backfaceVisibility: 'hidden' }}>
            {mediaItems.map((item, i) => (
              <div key={i} className="flex-[0_0_72px] min-w-0">
                <button
                  onClick={() => goTo(i)}
                  className={`relative w-full h-[72px] rounded-xl overflow-hidden border-2 transition-all duration-200 bg-white flex flex-col items-center justify-center cursor-pointer ${
                    activeIndex === i
                      ? item.type === 'video'
                        ? 'border-red-600 shadow-sm scale-[1.02] ring-2 ring-red-100'
                        : 'border-red-600 shadow-sm scale-[1.02] ring-2 ring-red-100'
                      : 'border-gray-200 hover:border-gray-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white p-1 text-center select-none">
                      <div className="w-[30px] h-[30px] rounded-[10px] border border-gray-300 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5 text-gray-800">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                      <span className="text-[11px] font-bold text-gray-700 tracking-tight leading-none">Video</span>
                    </div>
                  ) : (
                    <Image
                      src={item.src}
                      alt=""
                      width={72}
                      height={72}
                      className="w-full h-full object-contain p-1.5"
                    />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal with Thumbnails, Zoom & Counter plugins */}
      {lightboxOpen && (
        <LightboxModal
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={lightboxIndex}
          videoTitle={t('products.video_product_title')}
          onView={(newIndex) => {
            setLightboxIndex(newIndex);
            goTo(newIndex);
          }}
        />
      )}
    </div>
  );
}
