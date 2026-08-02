import { Locale } from '@/lib/locale';
import { getDictionary } from '@/lib/dictionary';

export interface FooterNavLink {
  label: string;
  href: string;
  indent?: boolean;
}

export function getFooterContent(locale: Locale = 'vi') {
  const dict = getDictionary(locale);

  return {
    companyAddress: dict.footer.address,
    customerSupportGroup: {
      heading: dict.footer.customer_support,
      headingHref: '#',
      links: [
        { label: dict.footer.consultation, href: '/contact' },
        { label: dict.footer.warranty_policy, href: '/warranty-policy' },
        { label: dict.footer.shopping_guide, href: '/shopping-guide' },
        { label: dict.footer.payment_guide, href: '/payment-guide' },
        { label: dict.footer.partners, href: '/partners' },
        { label: dict.footer.about_us, href: '/about-us' },
      ],
    },
  };
}

export const COMPANY_ADDRESS = 'Công Ty Cổ Phần Thanh Bằng, Xuân Trường, Ninh Bình 420000, Việt Nam';
export const CUSTOMER_SUPPORT_GROUP = getFooterContent('vi').customerSupportGroup;
