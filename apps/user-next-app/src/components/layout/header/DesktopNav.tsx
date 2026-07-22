import React from 'react';
import Link from 'next/link';
import { NavItem } from '@/constants/navigation';

interface DesktopNavProps {
  navItems: NavItem[];
  activeDropdown: string | null;
  navTextClass: string;
  onOpenDropdown: (label: string) => void;
  onScheduleClose: () => void;
}

export const DesktopNav = ({
  navItems,
  activeDropdown,
  navTextClass,
  onOpenDropdown,
  onScheduleClose,
}: DesktopNavProps) => {
  return (
    <nav className="hidden lg:flex items-center gap-0">
      {navItems.map((item) => {
        const isActive = activeDropdown === item.label;
        const textClass = isActive ? 'text-[#5e8dd1]' : navTextClass;
        const borderClass = isActive ? 'border-[#5e8dd1]' : 'border-transparent';

        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => item.children && onOpenDropdown(item.label)}
            onMouseLeave={() => item.children && onScheduleClose()}
          >
            <Link
              href={item.href}
              className={`flex items-center gap-1 px-[10px] h-[80px] text-[15px] font-semibold no-underline whitespace-nowrap border-b-2 transition-colors duration-200 box-border hover:text-[#5e8dd1] ${textClass} ${
                item.children ? borderClass : 'border-transparent'
              }`}
            >
              {item.label}
            </Link>
          </div>
        );
      })}
    </nav>
  );
};
