'use client';

import type { RefObject } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const E = [0.16, 1, 0.3, 1] as const;

interface Props {
  ctaRef: RefObject<HTMLDivElement | null>;
}

export default function ProjectBottomCTA({ ctaRef }: Props) {
  const t = useTranslations();
  return (
    <motion.div
      ref={ctaRef}
      className="relative mt-4 mb-4 md:mt-16 md:mb-16 bg-[#0f0f0f] rounded-xl px-8 md:px-12 py-10 md:py-14 overflow-hidden"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, ease: E }}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#5e8dd1]/[0.08] blur-[72px]" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-[#5e8dd1]/[0.04] blur-[60px]" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-[460px]">
          <p className="text-white text-[24px] md:text-[28px] font-light leading-tight m-0">
            {t('projects.bottom_cta_heading')}
          </p>
          <p className="text-white/50 text-[14px] mt-3 m-0 leading-relaxed">
            {t('projects.bottom_cta_sub')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link
            href="/contact/"
            className="inline-flex items-center justify-center gap-2 bg-[#5e8dd1] text-white text-[14px] font-semibold px-8 py-3.5 rounded-full hover:bg-[#356098] active:scale-[0.98] transition-all no-underline"
          >
            {t('common.contact_consult')}
          </Link>
          <a
            href="https://zalo.me/0943676869"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white/[0.05] border border-white/[0.12] text-white text-[14px] font-semibold px-8 py-3.5 rounded-full hover:bg-white/[0.10] active:scale-[0.98] transition-all no-underline"
          >
            {t('common.chat_zalo')}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
