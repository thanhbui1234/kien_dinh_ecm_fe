'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getStoredLocale, setStoredLocale, Locale } from '@/lib/locale';

export function LanguageToggle({ textClass }: { textClass?: string }) {
  const [locale, setLocale] = useState<Locale>('vi');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocale(getStoredLocale());
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-[68px] h-[32px]"></div>;

  const toggleLocale = () => {
    const newLocale = locale === 'vi' ? 'en' : 'vi';
    setStoredLocale(newLocale);
    setLocale(newLocale);
    // Hard refresh to apply language changes server-side
    window.location.reload();
  };

  const isVi = locale === 'vi';
  const isDarkText = textClass?.includes('text-black') || textClass?.includes('text-[#111111]');

  return (
    <button
      onClick={toggleLocale}
      className={`relative flex items-center w-[68px] h-[32px] rounded-full p-1 cursor-pointer overflow-hidden border transition-colors ${
        !isDarkText ? 'border-white/30 bg-black/20 hover:bg-black/40' : 'border-gray-200 bg-gray-100 hover:bg-gray-200'
      }`}
      aria-label="Toggle language"
    >
      <motion.div
        className="absolute w-[28px] h-[24px] bg-[#5e8dd1] rounded-full shadow-sm"
        layout
        initial={false}
        animate={{
          left: isVi ? '4px' : '34px'
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      <div className="relative z-10 flex w-full justify-between px-[7px] text-[11px] font-bold tracking-wider">
        <span className={`w-1/2 text-center transition-colors ${isVi ? 'text-white' : !isDarkText ? 'text-white/60' : 'text-gray-400'}`}>VN</span>
        <span className={`w-1/2 text-center transition-colors ${!isVi ? 'text-white' : !isDarkText ? 'text-white/60' : 'text-gray-400'}`}>EN</span>
      </div>
    </button>
  );
}
