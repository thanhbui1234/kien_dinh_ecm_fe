import React from 'react';

interface HamburgerButtonProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isTransparent: boolean;
  heroSlideLight: boolean;
}

export const HamburgerButton = ({
  mobileOpen,
  setMobileOpen,
  isTransparent,
  heroSlideLight,
}: HamburgerButtonProps) => {
  const bgColorClass = isTransparent
    ? heroSlideLight
      ? 'bg-[#111111]'
      : 'bg-white'
    : 'bg-black';

  return (
    <button
      onClick={() => setMobileOpen(!mobileOpen)}
      className="flex lg:hidden flex-col justify-center items-center gap-[5px] w-10 h-10 bg-transparent border-none cursor-pointer p-1"
      aria-label="Toggle navigation menu"
      aria-expanded={mobileOpen}
    >
      {[0, 1, 2].map((i) => {
        let transformClass = 'transform-none';
        let opacityClass = 'opacity-100';

        if (mobileOpen) {
          if (i === 0) transformClass = 'translate-y-[7px] rotate-45';
          if (i === 1) opacityClass = 'opacity-0';
          if (i === 2) transformClass = '-translate-y-[7px] -rotate-45';
        }

        return (
          <span
            key={i}
            className={`block w-[24px] h-[2px] transition-all duration-300 ${bgColorClass} ${transformClass} ${opacityClass}`}
          />
        );
      })}
    </button>
  );
};
