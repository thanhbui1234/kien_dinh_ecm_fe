'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Các sản phẩm',
    href: '/products/',
    children: [
      { label: 'Máy đa chức năng', href: '/products/#integrex' },
      { label: 'Trung tâm gia công 5 trục', href: '/products/#five-axis' },
      { label: 'Máy tiện CNC', href: '/products/#cnc' },
      { label: 'Trung tâm gia công đứng', href: '/products/#vertical' },
      { label: 'Trung tâm gia công ngang', href: '/products/#horizontal' },
      { label: 'Hàn khuấy ma sát (FSW)', href: '/products/fsw/' },
      { label: 'Đầu kẹp dao Mazak', href: '/products/mazak-tool-holder/' },
      { label: 'Tự động hóa', href: '/products/#automation-machine-tool' },
      { label: 'Theo Ngành', href: '/products/#industry' },
    ],
  },
  {
    label: 'Công nghệ & Giải pháp',
    href: '/technology/',
    children: [
      { label: 'Hệ thống CNC', href: '/technology/mazatrol-cnc/' },
      { label: 'Hỗ trợ lập trình và thiết lập', href: '/technology/productivity/' },
      { label: 'Công nghệ gia công', href: '/technology/machining-technology/' },
      { label: 'Sự chính xác', href: '/technology/accuracy/' },
      { label: 'Giám sát & Phân tích', href: '/technology/monitoring-analysis/' },
      { label: 'Nhà máy thông minh', href: '/technology/ismart-factory/' },
    ],
  },
  {
    label: 'Phương tiện truyền thông tin tức',
    href: '/news-media/',
    children: [
      { label: 'Tin tức', href: '/news-media/news/' },
      { label: 'Sự kiện sắp tới', href: '/news-media/upcoming-events/' },
      { label: 'CYBER WORLD', href: '/news-media/cyberworld-dl/' },
      { label: 'Báo cáo khách hàng', href: '/news-media/customer-report/' },
    ],
  },
  {
    label: 'Dịch vụ & Hỗ trợ',
    href: '/service-support/',
    children: [
      { label: 'Trung tâm phụ tùng', href: '/service-support/parts-supply/' },
      { label: 'Hỗ trợ khách hàng', href: '/service-support/customer-support/' },
      { label: 'Chương trình đào tạo', href: '/service-support/training/' },
    ],
  },
  {
    label: 'Về chúng tôi',
    href: '/about-us/',
    children: [
      { label: 'Sơ lược về công ty', href: '/about-us/company-outline/' },
      { label: 'Lịch sử công ty', href: '/about-us/company-history/' },
      { label: 'Cơ sở sản xuất', href: '/about-us/production-facilities/' },
    ],
  },
  {
    label: 'Liên hệ chúng tôi',
    href: '/contact/',
  },
];

const MazakLogo = ({ color }: { color: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="120"
    height="32"
    viewBox="0 0 148 39.58"
    role="img"
    aria-label="Yamazaki Mazak Corporation"
  >
    <g transform="translate(0 0)">
      <path d="M32.487,14.224,41.6,0h9.265V39.58H43.5V10.887L38.51,18.135a3.591,3.591,0,0,1-6.024-3.911" transform="translate(-11.28)" fill={color} />
      <path d="M71.174,43.892h8.782l-.022-6.558H72.6V29.616h9.783V43.892h7.54V19.333c0-3.491-1.805-6.7-5.833-6.7H66.2l-.02,6.719h16.2v3.87H70.992c-3.046,0-5.755,3.207-5.755,4.992V38.761c0,2.783,3.591,5.131,5.937,5.131" transform="translate(-23.061 -4.466)" fill={color} />
      <path d="M114.45,37.461l14.229-17.173c2.476-2.78,1.936-7.655-3.694-7.655H105.912v6.729h14.437l-13.41,16.059h0c-3.369,3.982-.54,8.452,3.268,8.452h18.945l-.01-6.426Z" transform="translate(-37.27 -4.466)" fill={color} />
      <path d="M213.936,39.58,201.274,22.662,212.006,8.168h-8.723l-9.045,12.207V0H186.53v39.57h7.708V25.47L204.8,39.58Z" transform="translate(-65.936)" fill={color} />
      <path d="M28.646,31.057a3.593,3.593,0,0,0-3.591,3.591v15.91h7.183V34.648a3.593,3.593,0,0,0-3.591-3.591" transform="translate(-8.857 -10.979)" fill={color} />
      <path d="M18.373,14.224,9.266,0H0V39.58H7.357V10.887l4.992,7.247a3.591,3.591,0,0,0,6.024-3.911" fill={color} />
      <path d="M150.307,43.892h8.784l-.021-6.558h-7.339V29.616h9.781V43.892h7.539V19.333c0-3.491-1.8-6.7-5.833-6.7H145.336l-.023,6.719h16.2v3.87H150.1c-3.046,0-5.753,3.207-5.753,4.992V38.761c0,2.783,3.589,5.131,5.935,5.131" transform="translate(-51.034 -4.466)" fill={color} />
    </g>
  </svg>
);

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 2C12 2 16 6 16 12C16 18 12 22 12 22" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 12H22" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 7H21" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 17H21" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const ChevronDown = ({ color }: { color: string }) => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 3.5L5 6.5L8 3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Header() {
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
    return () => { document.body.style.overflow = ''; };
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

  const isTransparent = isHomePage && !scrolled;

  // Sync --mazak-header-height: 100px with utility bar, 60px compact
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--mazak-header-height',
      isTransparent ? '100px' : '60px'
    );
  }, [isTransparent]);

  const logoColor = '#ff5901';
  const navTextColor = isTransparent
    ? (heroSlideLight ? '#111111' : '#ffffff')
    : '#000000';
  const utilityTextColor = isTransparent
    ? (heroSlideLight ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)')
    : 'rgba(0,0,0,0.7)';
  const headerBg = isTransparent
    ? (heroSlideLight ? 'rgba(255,255,255,0.85)' : 'transparent')
    : '#ffffff';
  const borderShadow = isTransparent && !heroSlideLight ? 'none' : '0 2px 8px rgba(0,0,0,0.1)';

  const activeNavItem = NAV_ITEMS.find((item) => item.label === activeDropdown);

  return (
    <>
      <header
        ref={headerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: headerBg,
          boxShadow: borderShadow,
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        {/* Utility bar — only visible when header is transparent (homepage at top) */}
        {isTransparent && (
        <div
          className="utility-bar"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '0 24px',
            height: '40px',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
            gap: '20px',
          }}
        >
          <Link
            href="/careers/"
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: utilityTextColor,
              textDecoration: 'none',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = '#ff5901';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = utilityTextColor;
            }}
          >
            TUYỂN DỤNG
          </Link>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: utilityTextColor,
              cursor: 'pointer',
            }}
          >
            <span>Language</span>
            <ChevronDown color={utilityTextColor} />
          </div>
          <div
            style={{
              color: utilityTextColor,
              cursor: 'pointer',
            }}
          >
            <GlobeIcon />
          </div>
        </div>
        )}

        {/* Main nav row */}
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 24px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
            aria-label="Trang chủ Mazak Vietnam"
          >
            <MazakLogo color={logoColor} />
          </Link>

          {/* Desktop Navigation */}
          <nav
            style={{ display: 'flex', alignItems: 'center', gap: '0' }}
            className="mazak-desktop-nav"
          >
            {NAV_ITEMS.map((item) => (
              <div key={item.label} style={{ position: 'relative' }}>
                {item.children ? (
                  <button
                    onClick={() => handleNavClick(item.label)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '0 10px',
                      height: '60px',
                      fontSize: '13px',
                      fontWeight: 400,
                      color:
                        activeDropdown === item.label ? '#ff5901' : navTextColor,
                      background: 'none',
                      border: 'none',
                      borderBottom:
                        activeDropdown === item.label
                          ? '2px solid #ff5901'
                          : '2px solid transparent',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.2s, border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onMouseEnter={(e) => {
                      if (activeDropdown !== item.label) {
                        (e.currentTarget as HTMLButtonElement).style.color =
                          '#ff5901';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeDropdown !== item.label) {
                        (e.currentTarget as HTMLButtonElement).style.color =
                          navTextColor;
                      }
                    }}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '0 10px',
                      height: '60px',
                      fontSize: '13px',
                      fontWeight: 400,
                      color: navTextColor,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      borderBottom: '2px solid transparent',
                      transition: 'color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        '#ff5901';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        navTextColor;
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mazak-mobile-btn"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            style={{
              display: 'none',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px',
              width: '40px',
              height: '40px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: '24px',
                  height: '2px',
                  backgroundColor: isTransparent ? (heroSlideLight ? '#111111' : '#ffffff') : '#000000',
                  transition: 'transform 0.3s, opacity 0.3s',
                  transform: mobileOpen
                    ? i === 0
                      ? 'translateY(7px) rotate(45deg)'
                      : i === 2
                        ? 'translateY(-7px) rotate(-45deg)'
                        : 'none'
                    : 'none',
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>

        {/* Megamenu — gradient black, click-triggered, full-width below header */}
        {activeDropdown && activeNavItem?.children && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              padding: '0 24px 24px',
              zIndex: 999,
              animation: 'megaFadeIn 0.3s ease-out',
            }}
          >
            <div
              style={{
                maxWidth: '1352px',
                margin: '0 auto',
                background:
                  'linear-gradient(135deg, rgb(0,0,0) 55%, rgb(255,89,1))',
                borderRadius: '30px',
                boxShadow: 'rgba(0,0,0,0.3) 0px 0px 40px',
                display: 'grid',
                gridTemplateColumns: '23% 32% auto',
                padding: '40px',
                color: 'white',
              }}
            >
              {/* Col 1: Category title + "Hơn" link */}
              <div style={{ paddingRight: '32px' }}>
                <h5
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'white',
                    marginBottom: '16px',
                    marginTop: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {activeNavItem.label}
                </h5>
                <Link
                  href={activeNavItem.href}
                  onClick={() => setActiveDropdown(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.75)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#ff5901';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      'rgba(255,255,255,0.75)';
                  }}
                >
                  Hơn
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.5 3L7.5 6L4.5 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>

              {/* Col 2: First half of child links */}
              <div
                style={{
                  borderLeft: '1px solid rgba(255,255,255,0.25)',
                  paddingLeft: '40px',
                }}
              >
                {activeNavItem.children
                  .slice(0, Math.ceil(activeNavItem.children.length / 2))
                  .map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setActiveDropdown(null)}
                      style={{
                        display: 'block',
                        fontSize: '15px',
                        fontWeight: 500,
                        color: 'white',
                        marginBottom: '12px',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          '#ff5901';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          'white';
                      }}
                    >
                      {child.label}
                    </Link>
                  ))}
              </div>

              {/* Col 3: Second half of child links */}
              <div
                style={{
                  borderLeft: '1px solid rgba(255,255,255,0.25)',
                  paddingLeft: '40px',
                }}
              >
                {activeNavItem.children
                  .slice(Math.ceil(activeNavItem.children.length / 2))
                  .map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setActiveDropdown(null)}
                      style={{
                        display: 'block',
                        fontSize: '15px',
                        fontWeight: 500,
                        color: 'white',
                        marginBottom: '12px',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          '#ff5901';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          'white';
                      }}
                    >
                      {child.label}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: '100px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#ffffff',
            zIndex: 999,
            overflowY: 'auto',
            padding: '20px 0',
          }}
          className="mazak-mobile-menu"
        >
          {NAV_ITEMS.map((item) => (
            <div key={item.label} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block',
                  padding: '14px 24px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#000',
                  textDecoration: 'none',
                }}
              >
                {item.label}
              </Link>
              {item.children && (
                <div style={{ backgroundColor: '#fafafa' }}>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'block',
                        padding: '10px 40px',
                        fontSize: '13px',
                        color: '#555',
                        textDecoration: 'none',
                        borderLeft: '3px solid #ff5901',
                      }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

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
