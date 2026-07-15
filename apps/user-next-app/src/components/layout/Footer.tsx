'use client';

import Link from 'next/link';

const MazakLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="120"
    height="32"
    viewBox="0 0 148 39.58"
    role="img"
    aria-label="Yamazaki Mazak Corporation"
  >
    <g transform="translate(0 0)">
      <path d="M32.487,14.224,41.6,0h9.265V39.58H43.5V10.887L38.51,18.135a3.591,3.591,0,0,1-6.024-3.911" transform="translate(-11.28)" fill="#ff5901" />
      <path d="M71.174,43.892h8.782l-.022-6.558H72.6V29.616h9.783V43.892h7.54V19.333c0-3.491-1.805-6.7-5.833-6.7H66.2l-.02,6.719h16.2v3.87H70.992c-3.046,0-5.755,3.207-5.755,4.992V38.761c0,2.783,3.591,5.131,5.937,5.131" transform="translate(-23.061 -4.466)" fill="#ff5901" />
      <path d="M114.45,37.461l14.229-17.173c2.476-2.78,1.936-7.655-3.694-7.655H105.912v6.729h14.437l-13.41,16.059h0c-3.369,3.982-.54,8.452,3.268,8.452h18.945l-.01-6.426Z" transform="translate(-37.27 -4.466)" fill="#ff5901" />
      <path d="M213.936,39.58,201.274,22.662,212.006,8.168h-8.723l-9.045,12.207V0H186.53v39.57h7.708V25.47L204.8,39.58Z" transform="translate(-65.936)" fill="#ff5901" />
      <path d="M28.646,31.057a3.593,3.593,0,0,0-3.591,3.591v15.91h7.183V34.648a3.593,3.593,0,0,0-3.591-3.591" transform="translate(-8.857 -10.979)" fill="#ff5901" />
      <path d="M18.373,14.224,9.266,0H0V39.58H7.357V10.887l4.992,7.247a3.591,3.591,0,0,0,6.024-3.911" fill="#ff5901" />
      <path d="M150.307,43.892h8.784l-.021-6.558h-7.339V29.616h9.781V43.892h7.539V19.333c0-3.491-1.8-6.7-5.833-6.7H145.336l-.023,6.719h16.2v3.87H150.1c-3.046,0-5.753,3.207-5.753,4.992V38.761c0,2.783,3.589,5.131,5.935,5.131" transform="translate(-51.034 -4.466)" fill="#ff5901" />
    </g>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-label="Facebook">
    <circle cx="20" cy="20" r="19" stroke="#333" strokeWidth="1" />
    <path d="M21.5 14.5H23V12H21C18.8 12 17.5 13.3 17.5 15.5V17H15.5V19.5H17.5V28H20V19.5H22L22.5 17H20V15.5C20 14.9 20.3 14.5 21.5 14.5Z" fill="white" />
  </svg>
);

const YouTubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-label="YouTube">
    <circle cx="20" cy="20" r="19" stroke="#333" strokeWidth="1" />
    <path d="M29.5 15.5C29.2 14.4 28.3 13.6 27.2 13.3C25.2 12.8 20 12.8 20 12.8C20 12.8 14.8 12.8 12.8 13.3C11.7 13.6 10.8 14.4 10.5 15.5C10 17.5 10 21.5 10 21.5C10 21.5 10 25.5 10.5 27.5C10.8 28.6 11.7 29.4 12.8 29.7C14.8 30.2 20 30.2 20 30.2C20 30.2 25.2 30.2 27.2 29.7C28.3 29.4 29.2 28.6 29.5 27.5C30 25.5 30 21.5 30 21.5C30 21.5 30 17.5 29.5 15.5ZM18 25V18L24 21.5L18 25Z" fill="white" />
  </svg>
);

interface FooterNavLink {
  label: string;
  href: string;
  indent?: boolean;
}

const PRODUCTS_COL: { heading: string; headingHref: string; links: FooterNavLink[] } = {
  heading: 'Các sản phẩm',
  headingHref: '/products/',
  links: [
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
};

const TECHNOLOGY_GROUPS: { heading: string; headingHref: string; links: FooterNavLink[] }[] = [
  {
    heading: 'Công nghệ & Giải pháp',
    headingHref: '/technology/',
    links: [
      { label: 'Công cụ máy móc', href: '/technology/', indent: false },
      { label: 'Hệ thống CNC', href: '/technology/mazatrol-cnc/', indent: true },
      { label: 'Hỗ trợ lập trình và thiết lập', href: '/technology/productivity/', indent: true },
      { label: 'Công nghệ gia công', href: '/technology/machining-technology/', indent: true },
      { label: 'Sự chính xác', href: '/technology/accuracy/', indent: true },
      { label: 'Giám sát & Phân tích', href: '/technology/monitoring-analysis/', indent: true },
      { label: 'Kế hoạch sản xuất', href: '/technology/production-planning/', indent: true },
      { label: 'Quản lý công cụ', href: '/technology/tool-management/', indent: true },
      { label: 'Nhà máy thông minh', href: '/technology/ismart-factory/', indent: true },
      { label: 'Phần mềm hỗ trợ sản xuất dùng thử miễn phí', href: '/technology/free-trial/', indent: true },
    ],
  },
  {
    heading: 'Phương tiện truyền thông tin tức',
    headingHref: '/news-media/',
    links: [
      { label: 'Tin tức', href: '/news-media/news/' },
      { label: 'sự kiện sắp tới', href: '/news-media/upcoming-events/' },
      { label: 'CYBER WORLD', href: '/news-media/cyberworld-dl/' },
      { label: 'Báo cáo khách hàng', href: '/news-media/customer-report/' },
    ] as FooterNavLink[],
  },
];

const SERVICE_GROUPS: { heading: string; headingHref: string; links: FooterNavLink[] }[] = [
  {
    heading: 'Dịch vụ & Hỗ trợ',
    headingHref: '/service-support/',
    links: [
      { label: 'Trung tâm phụ tùng', href: '/service-support/parts-supply/' },
      { label: 'HỖ TRỢ KHÁCH HÀNG', href: '/service-support/customer-support/' },
      { label: 'Chương trình Đào tạo', href: '/service-support/training/' },
    ],
  },
  {
    heading: 'Về chúng tôi',
    headingHref: '/about-us/',
    links: [
      { label: 'Thông điệp từ Chủ tịch & Tổng giám đốc', href: '/about-us/message/' },
      { label: 'Sơ lược về công ty', href: '/about-us/company-outline/' },
      { label: 'Lịch sử công ty', href: '/about-us/company-history/' },
      { label: 'Cơ sở sản xuất', href: '/about-us/production-facilities/' },
      { label: 'Cơ sở hỗ trợ', href: '/about-us/support-bases/' },
      { label: 'Hoạt động môi trường', href: '/about-us/environment/' },
    ],
  },
];

const footerLinkBase: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  color: '#ffffff',
  fontWeight: 400,
  textDecoration: 'none',
  marginBottom: '10px',
  lineHeight: 1.4,
  transition: 'color 0.2s',
};

const footerHeadingBase: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: '#ff5901',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '16px',
  lineHeight: 1.3,
};

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-link:hover { color: #ff5901 !important; }
        .footer-heading:hover { color: #ff5901 !important; }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <footer
        style={{
          backgroundColor: '#1a1a1a',
          color: '#cccccc',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Main footer content */}
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '60px 40px 40px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            className="footer-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '220px 1fr 1fr 1fr',
              gap: '40px',
            }}
          >
            {/* Column 1: Logo + Social */}
            <div>
              <Link href="/" aria-label="Trang chủ Mazak Vietnam" style={{ display: 'inline-block', marginBottom: '32px' }}>
                <MazakLogo />
              </Link>

              <p
                style={{
                  fontSize: '12px',
                  color: '#888',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '16px',
                }}
              >
                Truyền thông xã hội
              </p>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href="https://www.facebook.com/profile.php?id=100063365610939"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Yamazaki Mazak Vietnam"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="https://www.youtube.com/@yamazakimazakvietnam"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Yamazaki Mazak Vietnam"
                >
                  <YouTubeIcon />
                </a>
              </div>
            </div>

            {/* Column 2: Products */}
            <div>
              <Link href={PRODUCTS_COL.headingHref} className="footer-heading" style={footerHeadingBase}>
                {PRODUCTS_COL.heading}
              </Link>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {PRODUCTS_COL.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link" style={footerLinkBase}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Technology + News */}
            <div>
              {TECHNOLOGY_GROUPS.map((group, gi) => (
                <div key={gi} style={{ marginBottom: gi < TECHNOLOGY_GROUPS.length - 1 ? '28px' : 0 }}>
                  <Link href={group.headingHref} className="footer-heading" style={footerHeadingBase}>
                    {group.heading}
                  </Link>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="footer-link"
                          style={{
                            ...footerLinkBase,
                            paddingLeft: link.indent ? '12px' : '0',
                            fontSize: link.indent ? '13px' : '14px',
                            color: link.indent ? '#aaa' : '#ffffff',
                          }}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Column 4: Service + About */}
            <div>
              {SERVICE_GROUPS.map((group, gi) => (
                <div key={gi} style={{ marginBottom: gi < SERVICE_GROUPS.length - 1 ? '28px' : 0 }}>
                  <Link href={group.headingHref} className="footer-heading" style={footerHeadingBase}>
                    {group.heading}
                  </Link>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="footer-link" style={footerLinkBase}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div
          style={{
            borderTop: '1px solid #1a1a1a',
            padding: '16px 40px',
            fontSize: '12px',
            color: '#555',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/cookie-declaration/" style={{ color: '#555', textDecoration: 'none', fontSize: '12px' }}>Cookie Declaration</Link>
            <span style={{ color: '#333' }}>|</span>
            <span style={{ color: '#555' }}>Cẩn thận hàng giả!</span>
            <span style={{ color: '#333' }}>|</span>
            <Link href="/about-website/" style={{ color: '#555', textDecoration: 'none', fontSize: '12px' }}>Về trang web này</Link>
          </div>
          <span>Copyright (C) 2024 Yamazaki Mazak Vietnam Co., Ltd. All Rights Reserved.</span>
        </div>
      </footer>
    </>
  );
}
