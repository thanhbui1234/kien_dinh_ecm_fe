import React from 'react';
import Link from 'next/link';
import { NavItem } from '@/constants/navigation';

interface MobileMenuProps {
  navItems: NavItem[];
  closeMenu: () => void;
}

export const MobileMenu = ({ navItems, closeMenu }: MobileMenuProps) => {
  return (
    <div className="fixed top-[100px] left-0 right-0 bottom-0 bg-white z-[999] overflow-y-auto py-5">
      {navItems.map((item) => (
        <div key={item.label} className="border-b border-[#f0f0f0]">
          <Link
            href={item.href}
            onClick={closeMenu}
            className="block px-6 py-3.5 text-[14px] font-medium text-black no-underline"
          >
            {item.label}
          </Link>
          {item.children && (
            <div className="bg-[#fafafa]">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={closeMenu}
                  className="block px-10 py-2.5 text-[13px] text-[#555] no-underline border-l-[3px] border-[#5e8dd1]"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
