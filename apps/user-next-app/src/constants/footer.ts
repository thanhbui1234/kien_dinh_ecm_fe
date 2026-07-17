export interface FooterNavLink {
  label: string;
  href: string;
  indent?: boolean;
}

export const PRODUCTS_COL: { heading: string; headingHref: string; links: FooterNavLink[] } = {
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

export const TECHNOLOGY_GROUPS: { heading: string; headingHref: string; links: FooterNavLink[] }[] = [
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

export const SERVICE_GROUPS: { heading: string; headingHref: string; links: FooterNavLink[] }[] = [
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
