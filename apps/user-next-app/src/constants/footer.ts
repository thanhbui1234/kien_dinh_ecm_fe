export interface FooterNavLink {
  label: string;
  href: string;
  indent?: boolean;
}

export const DEFAULT_SUPPORT_LINKS = [
  { label_key: 'footer.consultation', href: '/contact' },
  { label_key: 'footer.warranty_policy', href: '/warranty-policy' },
  { label_key: 'footer.shopping_guide', href: '/shopping-guide' },
  { label_key: 'footer.payment_guide', href: '/payment-guide' },
  { label_key: 'footer.partners', href: '/partners' },
  { label_key: 'footer.about_us', href: '/about-us' },
];
