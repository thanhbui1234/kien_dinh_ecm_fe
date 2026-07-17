import React from 'react';
import Link from 'next/link';
import { NavItem } from '@/constants/navigation';
import { ChevronDownIcon } from '@/components/icons';

interface MegaMenuProps {
  activeNavItem: NavItem;
  closeMenu: () => void;
}

export const MegaMenu = ({ activeNavItem, closeMenu }: MegaMenuProps) => {
  if (!activeNavItem?.children) return null;

  const halfLength = Math.ceil(activeNavItem.children.length / 2);
  const firstHalf = activeNavItem.children.slice(0, halfLength);
  const secondHalf = activeNavItem.children.slice(halfLength);

  return (
    <div
      className="absolute top-full left-0 right-0 px-6 pb-6 z-[999]"
      style={{ animation: 'megaFadeIn 0.3s ease-out' }}
    >
      <div className="max-w-[1352px] mx-auto rounded-[30px] shadow-[rgba(0,0,0,0.3)_0px_0px_40px] grid grid-cols-[23%_32%_auto] p-10 text-white bg-gradient-to-br from-black from-55% to-[#ff5901]">
        {/* Col 1: Category title + "Hơn" link */}
        <div className="pr-8">
          <h5 className="text-[20px] font-bold text-white mb-4 mt-0 leading-tight">
            {activeNavItem.label}
          </h5>
          <Link
            href={activeNavItem.href}
            onClick={closeMenu}
            className="flex items-center gap-[6px] text-[14px] font-normal text-white/75 no-underline transition-colors duration-200 hover:text-[#ff5901]"
          >
            Hơn
            <div className="-rotate-90">
              <ChevronDownIcon color="currentColor" />
            </div>
          </Link>
        </div>

        {/* Col 2: First half of child links */}
        <div className="border-l border-white/25 pl-10">
          {firstHalf.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={closeMenu}
              className="block text-[15px] font-medium text-white mb-3 no-underline transition-colors duration-200 hover:text-[#ff5901]"
            >
              {child.label}
            </Link>
          ))}
        </div>

        {/* Col 3: Second half of child links */}
        <div className="border-l border-white/25 pl-10">
          {secondHalf.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={closeMenu}
              className="block text-[15px] font-medium text-white mb-3 no-underline transition-colors duration-200 hover:text-[#ff5901]"
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
