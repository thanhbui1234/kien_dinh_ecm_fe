import Link from 'next/link';
import Image from 'next/image';
import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { NavItem } from '@/constants/navigation';

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

interface MegaMenuProps {
  activeNavItem: NavItem;
  closeMenu: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const MegaMenu = ({ activeNavItem, closeMenu, onMouseEnter, onMouseLeave }: MegaMenuProps) => {
  if (!activeNavItem?.children) return null;

  return (
    <m.div
      className="absolute top-full left-0 right-0 z-[999] px-6 pb-6"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: EASE_EXPO }}
    >
      <div className="relative mx-auto grid max-w-[1352px] grid-cols-[minmax(220px,26%)_auto] items-start gap-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#141414] to-[#0a1b31] p-8 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.35)]">
        {/* Ambient glow accent */}
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#5e8dd1] opacity-[0.14] blur-3xl" />

        {/* Col 1: Category group title + CTA */}
        <div className="relative border-r border-white/10 pr-8">
          <h5 className="mb-4 mt-0 text-[20px] font-bold leading-tight text-white">
            {activeNavItem.label}
          </h5>
          <Link
            href={activeNavItem.href}
            onClick={closeMenu}
            className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-white/70 no-underline transition-colors duration-200 hover:text-[#5e8dd1]"
          >
            Xem tất cả
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Col 2: Category thumbnail grid */}
        <div className="relative flex flex-wrap gap-1">
          {activeNavItem.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={closeMenu}
              className="group flex w-[230px] items-center gap-3 rounded-xl p-2.5 no-underline transition-colors duration-200 hover:bg-white/8"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white/10">
                {child.imageUrl ? (
                  <Image
                    src={child.imageUrl}
                    alt={child.label}
                    fill
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                    sizes="56px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-white/50">
                    {child.label.slice(0, 1)}
                  </div>
                )}
              </div>
              <span className="text-[14px] font-medium leading-snug text-white transition-colors duration-200 group-hover:text-[#5e8dd1]">
                {child.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </m.div>
  );
};
