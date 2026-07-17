import React from 'react';
import Link from 'next/link';
import { GlobeIcon, ChevronDownIcon } from '@/components/icons';

interface UtilityBarProps {
  utilityTextClass: string;
}

export const UtilityBar = ({ utilityTextClass }: UtilityBarProps) => {
  return (
    <div className="hidden lg:flex justify-end items-center px-6 h-[40px] border-b border-white/15 gap-5">
      <Link
        href="/careers/"
        className={`text-[11px] font-semibold no-underline tracking-[0.5px] uppercase transition-colors duration-200 hover:text-[#ff5901] ${utilityTextClass}`}
      >
        TUYỂN DỤNG
      </Link>
      <div className={`flex items-center gap-[6px] text-[11px] cursor-pointer ${utilityTextClass}`}>
        <span>Language</span>
        <ChevronDownIcon />
      </div>
      <div className={`cursor-pointer ${utilityTextClass}`}>
        <GlobeIcon />
      </div>
    </div>
  );
};
