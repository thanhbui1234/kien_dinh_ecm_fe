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
    label: 'Trang chủ',
    href: '/',
  },
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
    label: 'Dự án',
    href: '/projects/',
  },
  {
    label: 'Về chúng tôi',
    href: '/about-us/',
  },
  {
    label: 'Tuyển dụng',
    href: '/tuyen-dung/',
  },
  {
    label: 'Liên hệ chúng tôi',
    href: '/contact/',
  },
];
