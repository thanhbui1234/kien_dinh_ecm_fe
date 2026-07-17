export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
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
