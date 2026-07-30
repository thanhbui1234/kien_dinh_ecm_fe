'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from 'framer-motion';
import 'yet-another-react-lightbox/styles.css';
import type { Product, Category } from 'shared-api';
import ProductViewTracker from './ProductViewTracker';
import StickyContactBar from './StickyContactBar';

const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false });

interface Props {
  product: Product;
  category?: Category;
  relatedProducts?: Product[];
}

// Accepts watch?v=, youtu.be/, embed/, shorts/ links, with or without extra
// query params (?si=, &list=, &t=...) — admins paste whatever YouTube gives them.
function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

type MediaItem =
  | { type: 'image'; src: string }
  | { type: 'video'; src: string; youtubeId: string | null; directUrl: string };

function ImageGallery({ images, thumbnail, name, videoUrls }: { images?: Product['images']; thumbnail: string; name: string; videoUrls?: string[] }) {
  const sorted = (images && images.length > 0)
    ? [...images].sort((a, b) => {
      if (a.isMain && !b.isMain) return -1;
      if (!a.isMain && b.isMain) return 1;
      return a.orderIndex - b.orderIndex;
    })
    : [];

  const hasMain = sorted.some((img) => img.isMain);
  const imageUrls = sorted.map((img) => img.imageUrl);
  // Always keep thumbnail: prepend it if no isMain exists in images[], or if images[] is empty
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

  const [[activeIndex, direction], setActive] = useState<[number, number]>([0, 0]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const lastDragOffsetX = useRef(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = mediaItems[activeIndex];
  const slides = mediaItems.map((item) =>
    item.type === 'video' ? { src: item.src, youtubeId: item.youtubeId, directUrl: item.directUrl } : { src: item.src }
  );

  useEffect(() => {
    thumbRefs.current[activeIndex]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeIndex]);

  const goTo = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= mediaItems.length || nextIndex === activeIndex) return;
    setActive([nextIndex, nextIndex > activeIndex ? 1 : -1]);
  };

  const openLightbox = () => {
    setLightboxIndex(activeIndex);
    setLightboxOpen(true);
  };

  const handleDragEnd = (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    lastDragOffsetX.current = info.offset.x;
    const swipePower = Math.abs(info.offset.x) * info.velocity.x;
    if (swipePower < -6000) goTo(activeIndex + 1);
    else if (swipePower > 6000) goTo(activeIndex - 1);
  };

  const handleMediaClick = () => {
    // Suppress the tap-to-zoom click that follows a drag gesture.
    if (Math.abs(lastDragOffsetX.current) > 5) {
      lastDragOffsetX.current = 0;
      return;
    }
    openLightbox();
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: shouldReduceMotion ? 0 : `${dir > 0 ? 100 : -100}%`, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: shouldReduceMotion ? 0 : `${dir > 0 ? -100 : 100}%`, opacity: 0 }),
  };

  return (
    <div className="flex flex-col gap-3 lg:sticky lg:top-[100px]">
      {/* Main media — drag/swipe between items, click to open lightbox */}
      <div
        className="relative aspect-square bg-[#f5f5f5] rounded-2xl overflow-hidden group/zoom w-full"
        role="group"
        aria-roledescription="carousel"
        aria-label={name}
      >
        {active ? (
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: 'spring', stiffness: 420, damping: 42 }, opacity: { duration: 0.15 } }}
              drag={mediaItems.length > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={handleDragEnd}
              onClick={handleMediaClick}
              className="absolute inset-0 cursor-zoom-in touch-pan-y"
              aria-label={active.type === 'video' ? 'Phát video sản phẩm' : 'Xem ảnh lớn'}
            >
              <Image
                src={active.src}
                alt={name}
                fill
                draggable={false}
                className="object-contain p-8 transition-transform duration-300 pointer-events-none select-none group-hover/zoom:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={activeIndex === 0}
              />
              {/* Video play affordance */}
              {active.type === 'video' && (
                <div className="absolute inset-0 bg-black/10 group-hover/zoom:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 group-hover/zoom:bg-[#5e8dd1] flex items-center justify-center transition-colors duration-300 shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M8 5v14l11-7z" className="fill-[#111] group-hover/zoom:fill-white transition-colors duration-300" />
                    </svg>
                  </div>
                </div>
              )}
              {/* Zoom hint */}
              {active.type === 'image' && (
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-200">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    <path d="M11 8v6M8 11h6" />
                  </svg>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </div>
        )}

        {/* Prev/next arrows — desktop pointer users; touch users swipe */}
        {mediaItems.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Ảnh/video trước"
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/90 shadow-sm text-[#111] opacity-0 group-hover/zoom:opacity-100 disabled:opacity-0 transition-opacity duration-200 hover:bg-white hover:text-[#5e8dd1] cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === mediaItems.length - 1}
              aria-label="Ảnh/video tiếp theo"
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/90 shadow-sm text-[#111] opacity-0 group-hover/zoom:opacity-100 disabled:opacity-0 transition-opacity duration-200 hover:bg-white hover:text-[#5e8dd1] cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Position indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/20 backdrop-blur-sm">
              {mediaItems.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-4 bg-white' : 'w-1 bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {mediaItems.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {mediaItems.map((item, i) => (
            <button
              key={i}
              ref={(el) => { thumbRefs.current[i] = el; }}
              onClick={() => goTo(i)}
              className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 bg-[#f5f5f5] ${activeIndex === i ? 'border-[#5e8dd1]' : 'border-transparent hover:border-gray-200'
                }`}
            >
              <Image src={item.src} alt="" width={64} height={64} className="object-contain w-full h-full p-1.5" />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides as any}
        index={lightboxIndex}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
        render={{
          slide: ({ slide }: any) => {
            if (slide.youtubeId === undefined) return undefined;
            return slide.youtubeId ? (
              <div className="w-full h-full flex items-center justify-center p-4 md:p-10">
                <div className="w-full max-w-4xl aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${slide.youtubeId}?autoplay=1&rel=0`}
                    title="Video sản phẩm"
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4 md:p-10">
                <video src={slide.directUrl} controls autoPlay className="max-w-4xl w-full max-h-full rounded-lg" />
              </div>
            );
          },
        }}
      />
    </div>
  );
}

function SpecificationsTable({ specs }: { specs: object }) {
  const entries = Object.entries(specs).filter(([, v]) => v !== null && v !== undefined && v !== '');
  if (entries.length === 0) return null;

  // Split into rows of 4 columns for readability
  const chunkSize = 4;
  const chunks: [string, unknown][][] = [];
  for (let i = 0; i < entries.length; i += chunkSize) {
    chunks.push(entries.slice(i, i + chunkSize));
  }

  return (
    <>
      {/* Mobile — stacked key-value rows; a 4-column table is unreadable at this width */}
      <div className="md:hidden flex flex-col rounded-xl border border-gray-100 overflow-hidden">
        {entries.map(([key, value], i) => (
          <div
            key={key}
            className={`flex items-baseline justify-between gap-4 px-4 py-3 ${i % 2 === 1 ? 'bg-gray-50/60' : ''
              } ${i < entries.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 shrink-0">
              {key}
            </span>
            <span className="text-[13px] text-[#111] font-medium text-right">
              {String(value)}
            </span>
          </div>
        ))}
      </div>

      {/* Desktop — unchanged 4-column chunked table */}
      <div className="hidden md:flex flex-col gap-0 rounded-xl border border-gray-100 overflow-hidden">
        {chunks.map((chunk, ci) => (
          <table key={ci} className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {chunk.map(([key]) => (
                  <th key={key} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 border-b border-gray-100 border-r last:border-r-0">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className={ci < chunks.length - 1 ? 'border-b border-gray-100' : ''}>
                {chunk.map(([key, value]) => (
                  <td key={key} className="px-4 py-3.5 text-[#111] font-medium border-r border-gray-50 last:border-r-0 align-top">
                    {String(value)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    </>
  );
}

function FeaturesSection({ features }: { features: object }) {
  const entries = Object.entries(features).filter(([, v]) => v !== null && v !== undefined && v !== '');
  if (entries.length === 0) return null;
  return (
    <div className="mt-16 pt-12 border-t border-gray-100">
      <h2 className="text-[22px] font-light text-[#111] mb-8">Tính năng nổi bật</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {entries.map(([key, value]) => (
          <div key={key} className="flex gap-4 p-5 rounded-xl bg-[#fafafa] border border-gray-100 hover:border-[#5e8dd1]/30 hover:bg-[#f8fafd] transition-all duration-200">
            <div className="shrink-0 w-7 h-7 rounded-full bg-[#5e8dd1]/10 flex items-center justify-center mt-0.5">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 4.5" stroke="#5e8dd1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#111] mb-0.5 m-0">{key}</p>
              <p className="text-[13px] text-gray-400 m-0 leading-snug">{String(value)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductDetailClient({ product, category, relatedProducts = [] }: Props) {
  const bottomSectionRef = useRef<HTMLDivElement>(null);
  const hasPrice = product.price != null && product.price > 0;

  return (
    <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-12">
      <ProductViewTracker productId={product.id} />
      <StickyContactBar
        productId={product.id}
        productName={product.name}
        hasPrice={hasPrice}
        bottomSectionRef={bottomSectionRef}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <ImageGallery images={product.images} thumbnail={product.thumbnailUrl} name={product.name} videoUrls={product.detail?.videoUrls} />

        <div className="flex flex-col gap-6">
          {category && (
            <Link
              href={`/products/?category=${category.slug}`}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5e8dd1] no-underline hover:opacity-70 transition-opacity w-fit"
            >
              {category.name}
            </Link>
          )}

          <h1 className="text-[30px] md:text-[38px] font-light text-[#111] leading-tight m-0">
            {product.name}
          </h1>

          {hasPrice ? (
            <p className="text-[20px] font-semibold text-[#5e8dd1] m-0">
              {product.price!.toLocaleString('vi-VN')} ₫
            </p>
          ) : (
            <Link
              href={`/contact/?productId=${product.id}`}
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#5e8dd1] bg-[#f2f6fb] border border-[#5e8dd1]/20 px-4 py-2 rounded-full hover:bg-[#e5edf7] hover:border-[#5e8dd1]/40 transition-colors no-underline w-fit"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Giá: Liên hệ báo giá
            </Link>
          )}

          {product.detail?.specifications &&
            Object.keys(product.detail.specifications).length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-4">
                  Thông số kỹ thuật
                </h3>
                <SpecificationsTable specs={product.detail.specifications} />
              </div>
            )}
        </div>
      </div>

      {product.detail?.features && Object.keys(product.detail.features).length > 0 && (
        <FeaturesSection features={product.detail.features} />
      )}

      {product.detail?.contentDetail && (
        <div className="mt-16 pt-12 border-t border-gray-100">
          <h2 className="text-[22px] font-light text-[#111] mb-8">Mô tả sản phẩm</h2>
          <div
            className="prose prose-sm max-w-none break-words text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{
              // CMS content stores &nbsp; in place of regular spaces, which blocks line-breaking
              // at every word boundary and forces the wrap to land mid-word instead.
              __html: product.detail.contentDetail.replace(/&nbsp;|\u00A0/gi, ' '),
            }}
          />
        </div>
      )}

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-gray-100">
          <h2 className="text-[22px] font-light text-[#111] mb-8">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedProducts.slice(0, 6).map((related) => (
              <Link
                key={related.id}
                href={`/products/${related.slug}`}
                className="group block no-underline"
              >
                <div className="relative aspect-square bg-[#f5f5f5] rounded-xl overflow-hidden mb-2.5 transition-shadow duration-300 group-hover:shadow-[0_6px_20px_rgba(0,0,0,0.10)]">
                  {related.thumbnailUrl ? (
                    <Image
                      src={related.thumbnailUrl}
                      alt={related.name}
                      fill
                      className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#5e8dd1] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
                <p className="text-[12px] text-[#111] leading-snug line-clamp-2 group-hover:text-[#5e8dd1] transition-colors duration-200">
                  {related.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div ref={bottomSectionRef} className="mt-16 bg-[#111] rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-[#5e8dd1] text-[11px] font-semibold uppercase tracking-[0.22em] mb-2 m-0">
            Liên hệ với chúng tôi
          </p>
          <p className="text-white text-[22px] font-light m-0">
            Cần tư vấn về <span className="font-semibold">{product.name}</span>?
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link
            href={`/contact/?productId=${product.id}`}
            className="inline-flex items-center justify-center gap-2 bg-[#5e8dd1] text-white text-[14px] font-semibold px-8 py-3.5 rounded-full hover:bg-[#356098] transition-colors no-underline"
          >
            {hasPrice ? 'Liên hệ tư vấn' : 'Báo giá ngay'}
          </Link>
          <a
            href="https://zalo.me/0374864110"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#0068FF] text-white text-[14px] font-semibold px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity no-underline"
          >
            Chat Zalo
          </a>
        </div>
      </div>
    </div>
  );
}
