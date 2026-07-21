'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { NAV_ITEMS, NavItem } from '@/constants/navigation';
import { UtilityBar } from './header/UtilityBar';
import { DesktopNav } from './header/DesktopNav';
import { HamburgerButton } from './header/HamburgerButton';
import { MegaMenu } from './header/MegaMenu';
import { MobileMenu } from './header/MobileMenu';
import type { Category } from 'shared-api';

interface HeaderProps {
  categories?: Category[];
}

export default function Header({ categories = [] }: HeaderProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [heroSlideLight, setHeroSlideLight] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleSlideChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { darkText: boolean };
      setHeroSlideLight(detail.darkText);
    };
    document.addEventListener('hero-slide-change', handleSlideChange);
    return () => document.removeEventListener('hero-slide-change', handleSlideChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close megamenu when clicking outside header
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close megamenu and mobile on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  const handleNavClick = (label: string) => {
    setActiveDropdown((prev) => (prev === label ? null : label));
  };

  const closeMenu = () => {
    setActiveDropdown(null);
    setMobileOpen(false);
  };

  const isTransparent = isHomePage && !scrolled;

  // Sync --mazak-header-height: 120px with utility bar, 80px compact
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--mazak-header-height',
      isTransparent ? '120px' : '80px'
    );
  }, [isTransparent]);

  const navTextClass = isTransparent
    ? heroSlideLight
      ? 'text-[#111111]'
      : 'text-white'
    : 'text-black';
  const utilityTextClass = isTransparent
    ? heroSlideLight
      ? 'text-black/70'
      : 'text-white/80'
    : 'text-black/70';
  const headerBgClass = isTransparent
    ? heroSlideLight
      ? 'bg-white/85'
      : 'bg-transparent'
    : 'bg-white/85 backdrop-blur-md';
  const headerShadowClass =
    isTransparent && !heroSlideLight ? 'shadow-none' : 'shadow-[0_2px_8px_rgba(0,0,0,0.1)]';

  const navItems: NavItem[] = NAV_ITEMS.map((item) => {
    if (item.label === 'Các sản phẩm' && categories.length > 0) {
      return {
        ...item,
        children: categories.map((cat) => ({
          label: cat.name,
          href: `/products/?category=${cat.slug}`,
        })),
      };
    }
    return item;
  });

  const activeNavItem = navItems.find((item) => item.label === activeDropdown);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[1000] transition-[background-color,box-shadow] duration-300 ease-in-out ${headerBgClass} ${headerShadowClass}`}
      >
        {/* Utility bar — only visible when header is transparent (homepage at top) */}

        {/* Main nav row */}
        <div className="max-w-[1400px] mx-auto px-6 h-[80px] flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0"
            aria-label="Trang chủ Thanh Bằng"
          >
            <Image
              src="/images/logo_thanh_bang.png"
              alt="logo_thanh_bang"
              width={60}
              height={20}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav
            navItems={navItems}
            activeDropdown={activeDropdown}
            navTextClass={navTextClass}
            handleNavClick={handleNavClick}
          />

          {/* Mobile Hamburger */}
          <HamburgerButton
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            isTransparent={isTransparent}
            heroSlideLight={heroSlideLight}
          />
        </div>

        {/* Megamenu — gradient black, click-triggered, full-width below header */}
        {activeDropdown && activeNavItem && (
          <MegaMenu activeNavItem={activeNavItem} closeMenu={closeMenu} />
        )}
      </header>

      {/* Mobile Menu */}
      {mobileOpen && <MobileMenu navItems={navItems} closeMenu={closeMenu} />}

      <style>{`
        @keyframes megaFadeIn {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1024px) {
          .mazak-desktop-nav { display: none !important; }
          .mazak-mobile-btn { display: flex !important; }
          .utility-bar { display: none !important; }
        }
        @media (min-width: 1025px) {
          .mazak-mobile-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
