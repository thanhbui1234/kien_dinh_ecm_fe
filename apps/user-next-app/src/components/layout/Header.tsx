'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { NAV_HREFS, NavItem } from '@/constants/navigation';
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
  const t = useTranslations();
  const isHomePage = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [heroSlideLight, setHeroSlideLight] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.setProperty('--site-header-height', '80px');
  }, []);

  const closeMenu = () => {
    clearCloseTimer();
    setActiveDropdown(null);
    setMobileOpen(false);
  };

  const isTransparent = isHomePage && !scrolled;

  const navTextClass = isTransparent
    ? heroSlideLight ? 'text-[#111111]' : 'text-white'
    : 'text-black';
  const headerBgClass = isTransparent
    ? heroSlideLight ? 'bg-white/85' : 'bg-transparent'
    : 'bg-white/85 backdrop-blur-md';
  const headerShadowClass =
    isTransparent && !heroSlideLight ? 'shadow-none' : 'shadow-[0_2px_8px_rgba(0,0,0,0.1)]';

  const defaultCategoryChildren = [
    { label: t('nav.categories.multitasking'), href: NAV_HREFS.categories.multitasking },
    { label: t('nav.categories.five_axis'), href: NAV_HREFS.categories.five_axis },
    { label: t('nav.categories.cnc_lathe'), href: NAV_HREFS.categories.cnc_lathe },
    { label: t('nav.categories.vertical'), href: NAV_HREFS.categories.vertical },
    { label: t('nav.categories.horizontal'), href: NAV_HREFS.categories.horizontal },
    { label: t('nav.categories.fsw'), href: NAV_HREFS.categories.fsw },
    { label: t('nav.categories.tool_holder'), href: NAV_HREFS.categories.tool_holder },
    { label: t('nav.categories.automation'), href: NAV_HREFS.categories.automation },
    { label: t('nav.categories.by_industry'), href: NAV_HREFS.categories.by_industry },
  ];

  const categoryChildren = categories.length > 0
    ? categories.map((cat) => ({
        label: (cat as any).translations?.find((tr: any) => tr.lang === 'EN')?.name || cat.name,
        href: `/products/?category=${cat.slug}`,
        imageUrl: cat.imageUrl,
      }))
    : defaultCategoryChildren;

  const navItems: NavItem[] = [
    { label: t('nav.home'), href: NAV_HREFS.home },
    { label: t('nav.products'), href: NAV_HREFS.products, children: categoryChildren },
    { label: t('nav.projects'), href: NAV_HREFS.projects },
    { label: t('nav.about_us'), href: NAV_HREFS.about_us },
    { label: t('nav.contact'), href: NAV_HREFS.contact },
  ];

  const activeNavItem = navItems.find((item) => item.label === activeDropdown);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[1000] transition-[background-color,box-shadow] duration-300 ease-in-out ${headerBgClass} ${headerShadowClass}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-[80px] flex items-center justify-between">
          <Link href="/" className="flex items-center shrink-0" aria-label="Trang chủ Thanh Bằng">
            <Image
              src="/images/logo_thanh_bang.png"
              alt="logo_thanh_bang"
              width={60}
              height={20}
              className="object-contain"
              priority
            />
          </Link>

          <DesktopNav
            navItems={navItems}
            activeDropdown={activeDropdown}
            navTextClass={navTextClass}
            onOpenDropdown={openDropdown}
            onScheduleClose={scheduleCloseDropdown}
          />

          <HamburgerButton
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            isTransparent={isTransparent}
            heroSlideLight={heroSlideLight}
          />
        </div>

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

      {mobileOpen && <MobileMenu navItems={navItems} closeMenu={closeMenu} />}
    </>
  );
}
