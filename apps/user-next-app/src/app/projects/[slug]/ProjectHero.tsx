'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar } from 'lucide-react';
import type { Project } from 'shared-api';

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

interface ProjectHeroProps {
  project: Project;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  const formatted = new Date(project.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      ref={heroRef}
      className="relative w-full min-h-[460px] md:h-[72vh] md:min-h-[560px] overflow-hidden bg-[#111]"
    >
      {/* Parallax image */}
      {project.coverImage && (
        <motion.div className="absolute inset-0 will-change-transform" style={{ y: imgY }}>
          <Image
            src={project.coverImage}
            alt={project.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      {/* Bottom accent — blue line expands on load */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#5e8dd1] via-[#5e8dd1]/60 to-transparent"
        initial={{ width: '0%' }}
        animate={{ width: '45%' }}
        transition={{ duration: 1.2, ease: EASE_EXPO, delay: 0.7 }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end px-6 md:px-10 pt-24 pb-8 md:pb-16 max-w-[1300px] mx-auto min-h-[460px] md:min-h-[560px] h-full">
        {project.isFeatured && (
          <motion.p
            className="text-[#5e8dd1] text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.22em] mb-2 md:mb-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.1 }}
          >
            Dự án tiêu biểu
          </motion.p>
        )}

        <motion.h1
          className="text-white text-[24px] sm:text-[32px] md:text-[52px] lg:text-[60px] font-light leading-[1.2] md:leading-[1.1] tracking-[-0.02em] max-w-[800px] m-0"
          style={{ textWrap: 'balance' } as React.CSSProperties}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE_EXPO, delay: 0.2 }}
        >
          {project.name}
        </motion.h1>

        {project.description && (
          <motion.p
            className="text-white/80 text-[14px] md:text-[17px] leading-relaxed mt-3 md:mt-4 max-w-[600px] m-0 line-clamp-3 md:line-clamp-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.35 }}
          >
            {project.description}
          </motion.p>
        )}

        <motion.div
          className="flex items-center gap-4 mt-6 text-white/50 text-[13px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatted}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
