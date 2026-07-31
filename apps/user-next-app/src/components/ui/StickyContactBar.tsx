'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface StickyContactBarProps {
  entityLabel: string;
  entityName: string;
  ctaLabel: string;
  ctaHref: string;
  bottomSectionRef: React.RefObject<HTMLDivElement | null>;
}

export default function StickyContactBar({
  entityLabel,
  entityName,
  ctaLabel,
  ctaHref,
  bottomSectionRef,
}: StickyContactBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      let isBottomSectionVisible = false;
      if (bottomSectionRef.current) {
        const rect = bottomSectionRef.current.getBoundingClientRect();
        isBottomSectionVisible = rect.top < window.innerHeight;
      }
      setVisible(!isBottomSectionVisible);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [bottomSectionRef]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div
        className="bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-4 py-3 sm:px-6 sm:py-4"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-[1300px] mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 m-0 mb-0.5">
              {entityLabel}
            </p>
            <p className="text-[15px] font-semibold text-[#111] m-0 truncate max-w-[340px]">
              {entityName}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto sm:ml-auto">
            <a
              href="tel:0374864110"
              aria-label="Gọi ngay"
              className="inline-flex items-center justify-center gap-2 shrink-0 w-11 h-11 sm:w-auto sm:h-auto border border-gray-200 text-[#111] text-[13px] font-semibold rounded-full sm:px-5 sm:py-2.5 hover:border-[#00B14F] hover:text-[#00B14F] transition-colors no-underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="hidden sm:inline">Gọi ngay</span>
            </a>
            <a
              href="https://zalo.me/0374864110"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat Zalo"
              className="inline-flex items-center justify-center gap-2 shrink-0 w-11 h-11 sm:w-auto sm:h-auto border border-[#0068FF]/30 bg-[#0068FF]/5 text-[#0068FF] text-[13px] font-semibold rounded-full sm:px-5 sm:py-2.5 hover:bg-[#0068FF] hover:text-white transition-colors no-underline"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span className="hidden sm:inline">Chat Zalo</span>
            </a>
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-2 flex-1 sm:flex-initial bg-[#5e8dd1] text-white text-[13px] font-semibold px-4 py-2.5 sm:px-6 rounded-full hover:bg-[#356098] transition-colors no-underline whitespace-nowrap"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
