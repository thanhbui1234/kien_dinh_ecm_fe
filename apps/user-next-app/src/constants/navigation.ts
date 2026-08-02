import { Locale } from '@/lib/locale';
import { getDictionary } from '@/lib/dictionary';

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

export function getNavItems(locale: Locale = 'vi'): NavItem[] {
  const dict = getDictionary(locale);

  return [
    {
      label: dict.nav.home,
      href: '/',
    },
    {
      label: dict.nav.products,
      href: '/products/',
      children: [
        { label: dict.nav.categories.multitasking, href: '/products/#integrex' },
        { label: dict.nav.categories.five_axis, href: '/products/#five-axis' },
        { label: dict.nav.categories.cnc_lathe, href: '/products/#cnc' },
        { label: dict.nav.categories.vertical, href: '/products/#vertical' },
        { label: dict.nav.categories.horizontal, href: '/products/#horizontal' },
        { label: dict.nav.categories.fsw, href: '/products/fsw/' },
        { label: dict.nav.categories.tool_holder, href: '/products/mazak-tool-holder/' },
        { label: dict.nav.categories.automation, href: '/products/#automation-machine-tool' },
        { label: dict.nav.categories.by_industry, href: '/products/#industry' },
      ],
    },
    {
      label: dict.nav.projects,
      href: '/projects/',
    },
    {
      label: dict.nav.about_us,
      href: '/about-us/',
    },
    {
      label: dict.nav.contact,
      href: '/contact/',
    },
  ];
}

export const NAV_ITEMS = getNavItems('vi');
