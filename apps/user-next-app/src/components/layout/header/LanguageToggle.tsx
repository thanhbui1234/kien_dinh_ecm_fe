'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

type Locale = 'vi' | 'en';
const COOKIE_NAME = 'NEXT_LOCALE';

function getLocaleCookie(): Locale {
  if (typeof document === 'undefined') return 'vi';
  const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
  const val = match?.[2];
  return val === 'en' ? 'en' : 'vi';
}

export function LanguageToggle({ textClass }: { textClass?: string }) {
  const [locale, setLocale] = useState<Locale>('vi');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLocale(getLocaleCookie());
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-[68px] h-[32px]"></div>;

  const toggleLocale = () => {
    const newLocale: Locale = locale === 'vi' ? 'en' : 'vi';
    document.cookie = `${COOKIE_NAME}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    setLocale(newLocale);
    router.refresh();
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
        animate={{ left: isVi ? '4px' : '34px' }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      <div className="relative z-10 flex w-full justify-between px-[7px] text-[11px] font-bold tracking-wider">
        <span className={`w-1/2 text-center transition-colors ${isVi ? 'text-white' : !isDarkText ? 'text-white/60' : 'text-gray-400'}`}>VN</span>
        <span className={`w-1/2 text-center transition-colors ${!isVi ? 'text-white' : !isDarkText ? 'text-white/60' : 'text-gray-400'}`}>EN</span>
      </div>
    </button>
  );
}
