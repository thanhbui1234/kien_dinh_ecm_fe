'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

interface StickyProjectBarProps {
  projectName: string;
  ctaRef: React.RefObject<HTMLDivElement | null>;
}

export default function StickyProjectBar({ projectName, ctaRef }: StickyProjectBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => {
      const scrolled = window.scrollY > 400;
      let ctaVisible = false;
      if (ctaRef.current) {
        ctaVisible = ctaRef.current.getBoundingClientRect().top < window.innerHeight;
      }
      setVisible(scrolled && !ctaVisible);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [ctaRef]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 380, damping: 38 }}
        >
          <div
            className="bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-[0_-8px_40px_rgba(0,0,0,0.07)] px-6 py-4"
            style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
          >
            <div className="max-w-[1300px] mx-auto flex items-center justify-between gap-4">
              <div className="hidden sm:block min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 m-0 mb-0.5">
                  Dự án
                </p>
                <p className="text-[15px] font-semibold text-[#111] m-0 truncate max-w-[340px]">
                  {projectName}
                </p>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <a
                  href="tel:0374864110"
                  className="inline-flex items-center gap-2 border border-gray-200 text-[#111] text-[13px] font-semibold px-5 py-2.5 rounded-full hover:border-[#ff5901] hover:text-[#ff5901] active:scale-[0.98] transition-all no-underline"
                >
                  Gọi ngay
                </a>
                <Link
                  href="/contact/"
                  className="inline-flex items-center gap-2 bg-[#ff5901] text-white text-[13px] font-semibold px-6 py-2.5 rounded-full hover:bg-[#e04f00] active:scale-[0.98] transition-all no-underline"
                >
                  Liên hệ tư vấn
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
