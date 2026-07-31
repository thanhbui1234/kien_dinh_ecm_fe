'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import useEmblaCarousel from 'embla-carousel-react';
import type { Product } from 'shared-api';

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
  const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const thumbsContainerRef = useRef<HTMLDivElement | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    duration: 25,
    skipSnaps: false,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const newIndex = emblaApi.selectedScrollSnap();
    setActiveIndex(newIndex);
  }, [emblaApi]);

  useEffect(() => {
    setPlayingVideoIndex(null);
  }, [activeIndex]);

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

  useEffect(() => {
    thumbRefs.current[activeIndex]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeIndex]);

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
      {/* Main Viewport Slider (Exact CellphoneS 16:9 Ratio + Instagram Touch) */}
      <div className="relative group/zoom w-full overflow-hidden rounded-2xl bg-[#f8f9fa] shadow-xs border border-gray-100/80 aspect-[16/9] md:aspect-[4/3] lg:aspect-[16/9]">
        <div ref={emblaRef} className="h-full overflow-hidden cursor-grab active:cursor-grabbing select-none">
          <div className="flex h-full touch-pan-y" style={{ backfaceVisibility: 'hidden' }}>
            {mediaItems.map((item, index) => (
              <div
                key={index}
                className="relative flex-[0_0_100%] min-w-0 h-full bg-[#f8f9fa] flex items-center justify-center overflow-hidden"
              >
                {item.type === 'video' ? (
                  playingVideoIndex === index ? (
                    <div className="relative w-full h-full">
                      {item.youtubeId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&controls=1&rel=0&enablejsapi=1`}
                          title={name}
                          className="w-full h-full border-0 relative z-20"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <video src={item.directUrl} autoPlay controls className="w-full h-full object-contain bg-black relative z-20" />
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingVideoIndex(null);
                        }}
                        className="absolute top-2 right-2 z-30 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-bold shadow-md hover:bg-black transition-all flex items-center gap-1 cursor-pointer"
                      >
                        ✕ Thu nhỏ
                      </button>
                    </div>
                  ) : (
                    <div
                      className="relative w-full h-full flex items-center justify-center bg-black group/play cursor-pointer overflow-hidden"
                      onClick={() => setPlayingVideoIndex(index)}
                    >
                      <Image
                        src={item.src}
                        alt={name}
                        fill
                        draggable={false}
                        className="object-cover opacity-85 group-hover/play:opacity-95 transition-opacity duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-600/90 shadow-xl flex items-center justify-center text-white transition-transform duration-300 group-hover/play:scale-110 group-hover/play:bg-red-600">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1.5 pointer-events-none">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Chạm để phát Video
                      </div>
                    </div>
                  )
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
              aria-label="Ảnh/video trước"
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
              aria-label="Ảnh/video tiếp theo"
              className="flex absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-10 md:h-10 items-center justify-center rounded-full bg-white/90 shadow-md text-gray-800 disabled:opacity-0 disabled:pointer-events-none transition-all duration-200 hover:bg-white hover:text-[#5e8dd1] cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Navigation (Exact CellphoneS Style) */}
      {mediaItems.length > 1 && (
        <div className="w-full">
          <div ref={thumbsContainerRef} className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-0.5">
            {mediaItems.map((item, i) => (
              <button
                key={i}
                ref={(el) => { thumbRefs.current[i] = el; }}
                onClick={() => goTo(i)}
                className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 bg-white flex flex-col items-center justify-center cursor-pointer ${
                  activeIndex === i
                    ? item.type === 'video'
                      ? 'border-red-600 ring-2 ring-red-500/20 shadow-xs scale-[1.02]'
                      : 'border-[#5e8dd1] ring-2 ring-[#5e8dd1]/20 shadow-xs scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 opacity-90 hover:opacity-100'
                }`}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-white p-1 text-center select-none">
                    <div className="w-6 h-6 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-0.5 group-hover:scale-110 transition-transform">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-gray-800 tracking-tight leading-none uppercase">Video</span>
                  </div>
                ) : (
                  <Image
                    src={item.src}
                    alt=""
                    width={64}
                    height={64}
                    className="w-full h-full object-contain p-1"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal with Thumbnails, Zoom & Counter plugins */}
      {lightboxOpen && (
        <LightboxModal
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={lightboxIndex}
          onView={(newIndex) => {
            setLightboxIndex(newIndex);
            goTo(newIndex);
          }}
        />
      )}
    </div>
  );
}
