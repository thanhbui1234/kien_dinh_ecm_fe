'use client';

import type { RefObject } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const E = [0.16, 1, 0.3, 1] as const;

interface Props {
  ctaRef: RefObject<HTMLDivElement | null>;
}

export default function ProjectBottomCTA({ ctaRef }: Props) {
  return (
    <motion.div
      ref={ctaRef}
      className="relative mt-16 mb-16 bg-[#0f0f0f] rounded-xl px-8 md:px-12 py-10 md:py-14 overflow-hidden"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, ease: E }}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#ff5901]/[0.08] blur-[72px]" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-[#ff5901]/[0.04] blur-[60px]" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-[460px]">
          <p className="text-white text-[24px] md:text-[28px] font-light leading-tight m-0">
            Quan tâm đến dự án tương tự?
          </p>
          <p className="text-white/50 text-[14px] mt-3 m-0 leading-relaxed">
            Đội ngũ kỹ sư Thanh Bằng sẵn sàng tư vấn, lên phương án và báo giá miễn phí.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link
            href="/contact/"
            className="inline-flex items-center justify-center gap-2 bg-[#ff5901] text-white text-[14px] font-semibold px-8 py-3.5 rounded-full hover:bg-[#e04f00] active:scale-[0.98] transition-all no-underline"
          >
            Liên hệ tư vấn
          </Link>
          <a
            href="https://zalo.me/0374864110"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white/[0.05] border border-white/[0.12] text-white text-[14px] font-semibold px-8 py-3.5 rounded-full hover:bg-white/[0.10] active:scale-[0.98] transition-all no-underline"
          >
            Chat Zalo
          </a>
        </div>
      </div>
    </motion.div>
  );
}
