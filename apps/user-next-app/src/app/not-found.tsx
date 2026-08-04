'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('not_found_page');

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-[#fafbfd] overflow-hidden">
      {/* Blueprint Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#5e8dd1 1px, transparent 1px), linear-gradient(90deg, #5e8dd1 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5e8dd1] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#356098] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Gear Icon with subtle spin */}
        <div className="relative flex items-center justify-center mb-6">
          <svg 
            className="w-32 h-32 sm:w-40 sm:h-40 text-[#5e8dd1]/20 animate-[spin_12s_linear_infinite]" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
             <h1 className="text-[55px] sm:text-[75px] font-black text-transparent bg-clip-text bg-gradient-to-b from-[#111] to-[#555] tracking-tighter m-0 leading-none">
              404
             </h1>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5e8dd1]/10 text-[#5e8dd1] text-[11px] font-semibold uppercase tracking-[0.2em] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5e8dd1] animate-pulse" />
          System Error
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#111] mb-5 m-0 tracking-tight">
          {t('title')}
        </h2>
        
        <p className="text-base sm:text-lg text-gray-500 mb-10 max-w-[500px] mx-auto leading-relaxed">
          {t('description')}
        </p>
        
        <Link
          href="/"
          className="group relative inline-flex items-center justify-center gap-2 bg-[#111] text-white text-[14px] font-semibold px-8 py-4 rounded-full overflow-hidden transition-transform hover:scale-[1.02] no-underline"
        >
          {/* Subtle button hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#5e8dd1] to-[#356098] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <span className="relative z-10 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {t('back_home')}
          </span>
        </Link>
      </div>
    </div>
  );
}
