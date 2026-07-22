'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { m, useInView } from 'framer-motion';
import 'yet-another-react-lightbox/styles.css';

const Lightbox = dynamic(() => import('yet-another-react-lightbox'), { ssr: false });

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

interface ProjectGalleryProps {
  images: string[];
}

interface GalleryCellProps {
  src: string;
  index: number;
  isInView: boolean;
  onClick: () => void;
  className?: string;
  sizes: string;
  badge?: string;
}

function GalleryCell({ src, index, isInView, onClick, className = '', sizes, badge }: GalleryCellProps) {
  return (
    <m.button
      onClick={onClick}
      aria-label={`Xem ảnh ${index + 1}`}
      className={`group relative overflow-hidden bg-[#111] cursor-zoom-in rounded-lg ${className}`}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: EASE_EXPO, delay: index * 0.07 }}
    >
      <Image
        src={src}
        alt={`Hình ảnh dự án ${index + 1}`}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        sizes={sizes}
      />

      {/* Thin white inset border on hover — no dark overlay */}
      <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_0_0px_rgba(255,255,255,0)] group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] transition-shadow duration-500" />

      {/* Feature badge: count indicator */}
      {badge && (
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="w-4 h-[1px] bg-white/40" />
          <span className="text-[10px] font-medium text-white/50 tabular-nums tracking-[0.18em]">
            {badge}
          </span>
        </div>
      )}
    </m.button>
  );
}

export default function ProjectGallery({ images }: ProjectGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  if (!images.length) return null;

  const slides = images.map((src) => ({ src }));
  const total = images.length;

  const open = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const feature = images[0];
  const portrait = images[1];
  const row2 = images.slice(2, 5);

  return (
    <section ref={sectionRef} className="mt-16 pt-12 border-t border-gray-100">
      {/* Section header */}
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h2 className="text-[22px] font-light text-[#111] m-0">Hình ảnh dự án</h2>
          <div className="mt-2 w-10 h-[3px] bg-[#5e8dd1]" />
        </div>
        {total > 1 && (
          <button
            onClick={() => open(0)}
            className="text-[13px] text-gray-400 hover:text-[#111] transition-colors duration-200"
          >
            Xem tất cả {total} ảnh →
          </button>
        )}
      </div>

      {/* Row 1: Feature (landscape) + Portrait */}
      {(feature || portrait) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          {feature && (
            <GalleryCell
              src={feature}
              index={0}
              isInView={isInView}
              onClick={() => open(0)}
              className="aspect-[4/3] md:col-span-2 md:aspect-[16/9]"
              sizes="(max-width: 768px) 100vw, 66vw"
              badge={`1 / ${total}`}
            />
          )}
          {portrait && (
            <GalleryCell
              src={portrait}
              index={1}
              isInView={isInView}
              onClick={() => open(1)}
              className="aspect-[4/3] md:aspect-auto"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
        </div>
      )}

      {/* Row 2: up to 3 squares */}
      {row2.length > 0 && (
        <div
          className={`grid gap-2 ${
            row2.length === 1
              ? 'grid-cols-1'
              : row2.length === 2
              ? 'grid-cols-2'
              : 'grid-cols-3'
          }`}
        >
          {row2.map((src, i) => (
            <GalleryCell
              key={i + 2}
              src={src}
              index={i + 2}
              isInView={isInView}
              onClick={() => open(i + 2)}
              className="aspect-square"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          ))}
        </div>
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
      />
    </section>
  );
}
