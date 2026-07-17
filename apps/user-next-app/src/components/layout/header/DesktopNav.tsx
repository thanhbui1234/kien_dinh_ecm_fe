import React from 'react';
import Link from 'next/link';
import { NavItem } from '@/constants/navigation';

interface DesktopNavProps {
  navItems: NavItem[];
  activeDropdown: string | null;
  navTextClass: string;
  handleNavClick: (label: string) => void;
}

export const DesktopNav = ({ navItems, activeDropdown, navTextClass, handleNavClick }: DesktopNavProps) => {
  return (
    <nav className="hidden lg:flex items-center gap-0">
      {navItems.map((item) => {
        const isActive = activeDropdown === item.label;
        const textClass = isActive ? 'text-[#ff5901]' : navTextClass;
        const borderClass = isActive ? 'border-[#ff5901]' : 'border-transparent';

        return (
          <div key={item.label} className="relative">
            {item.children ? (
              <button
                onClick={() => handleNavClick(item.label)}
                className={`flex items-center gap-1 px-[10px] h-[80px] text-[13px] font-normal bg-transparent border-none border-b-2 cursor-pointer whitespace-nowrap transition-colors duration-200 box-border hover:text-[#ff5901] ${textClass} ${borderClass}`}
              >
                {item.label}
              </button>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center gap-1 px-[10px] h-[80px] text-[13px] font-normal no-underline whitespace-nowrap border-b-2 border-transparent transition-colors duration-200 box-border hover:text-[#ff5901] ${navTextClass}`}
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};
