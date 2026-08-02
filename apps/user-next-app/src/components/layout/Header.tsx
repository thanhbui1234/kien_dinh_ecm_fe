'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';

import { getStoredLocale, Locale } from '@/lib/locale';
import { getNavItems, NavItem } from '@/constants/navigation';
import { DesktopNav } from './header/DesktopNav';
import { HamburgerButton } from './header/HamburgerButton';
import { MegaMenu } from './header/MegaMenu';
import { MobileMenu } from './header/MobileMenu';
import type { Category } from 'shared-api';

const DROPDOWN_CLOSE_DELAY = 150;

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
  const [locale, setLocale] = useState<Locale>('vi');
  const headerRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocale(getStoredLocale());
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openDropdown = useCallback(
    (label: string) => {
      clearCloseTimer();
      setActiveDropdown(label);
    },
    [clearCloseTimer]
  );

  const scheduleCloseDropdown = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, DROPDOWN_CLOSE_DELAY);
  }, [clearCloseTimer]);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

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

  const closeMenu = () => {
    clearCloseTimer();
    setActiveDropdown(null);
    setMobileOpen(false);
  };

  const isTransparent = isHomePage && !scrolled;

  // Sync --site-header-height: always 80px now since UtilityBar is removed
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--site-header-height',
      '80px'
    );
  }, []);

  const navTextClass = isTransparent
    ? heroSlideLight
      ? 'text-[#111111]'
      : 'text-white'
    : 'text-black';
  const headerBgClass = isTransparent
    ? heroSlideLight
      ? 'bg-white/85'
      : 'bg-transparent'
    : 'bg-white/85 backdrop-blur-md';
  const headerShadowClass =
    isTransparent && !heroSlideLight ? 'shadow-none' : 'shadow-[0_2px_8px_rgba(0,0,0,0.1)]';

  const rawNavItems = getNavItems(locale);
  const navItems: NavItem[] = rawNavItems.map((item) => {
    if (item.href === '/products/' && categories.length > 0) {
      return {
        ...item,
        children: categories.map((cat) => ({
          label: locale === 'en' ? ((cat as any).translations?.find((t: any) => t.lang === 'EN')?.name || cat.name) : cat.name,
          href: `/products/?category=${cat.slug}`,
          imageUrl: cat.imageUrl,
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
            onOpenDropdown={openDropdown}
            onScheduleClose={scheduleCloseDropdown}
          />

          {/* Mobile Hamburger */}
          <HamburgerButton
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            isTransparent={isTransparent}
            heroSlideLight={heroSlideLight}
          />
        </div>

        {/* Megamenu — hover-triggered, full-width below header */}
        <AnimatePresence>
          {activeDropdown && activeNavItem && (
            <MegaMenu
              activeNavItem={activeNavItem}
              closeMenu={closeMenu}
              onMouseEnter={clearCloseTimer}
              onMouseLeave={scheduleCloseDropdown}
            />
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && <MobileMenu navItems={navItems} closeMenu={closeMenu} />}
    </>
  );
}
