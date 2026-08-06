export interface NavChild {
  label: string;
  href: string;
  imageUrl?: string | null;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const NAV_HREFS = {
  home: '/',
  products: '/products/',
  projects: '/projects/',
  about_us: '/about-us/',
  contact: '/contact/',
  categories: {
    multitasking: '/products/#integrex',
    five_axis: '/products/#five-axis',
    cnc_lathe: '/products/#cnc',
    vertical: '/products/#vertical',
    horizontal: '/products/#horizontal',
    fsw: '/products/fsw/',
    tool_holder: '/products/mazak-tool-holder/',
    automation: '/products/#automation-machine-tool',
    by_industry: '/products/#industry',
  },
} as const;
