export interface FooterNavLink {
  label: string;
  href: string;
  indent?: boolean;
}

export const CUSTOMER_SUPPORT_GROUP = {
  heading: 'HỖ TRỢ KHÁCH HÀNG',
  headingHref: '#',
  links: [
    { label: 'Tư vấn ngay', href: '/contact' },
    { label: 'Chính sách bảo hành', href: '/warranty-policy' },
    { label: 'Hướng dẫn mua hàng', href: '/shopping-guide' },
    { label: 'Hướng dẫn thanh toán', href: '/payment-guide' },
    { label: 'Đối tác và khách hàng', href: '/partners' },
    { label: 'Về chúng tôi', href: '/about-us' },
  ]
};
