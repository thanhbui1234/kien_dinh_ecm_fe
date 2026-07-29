import { CUSTOMER_SUPPORT_GROUP } from '@/constants/footer';
import { FooterSocial } from './footer/FooterSocial';
import { FooterCopyright } from './footer/FooterCopyright';
import { FooterNavColumn } from './footer/FooterNavColumn';
import { FooterContactColumn } from './footer/FooterContactColumn';
import { api } from '@/lib/api';

export default async function Footer() {
  const [res, footerSetting] = await Promise.all([
    api.products.getProducts({ isFeatured: 'true', limit: '10' }).catch(() => null),
    api.settings.getFooterSetting().catch(() => null),
  ]);

  const featuredProducts = res?.items || [];
  
  const productsGroup = {
    heading: 'Các sản phẩm',
    headingHref: '/products',
    links: featuredProducts.map((p: any) => ({
      label: p.name,
      href: `/products/${p.slug}`,
    })),
  };

  const customerSupportGroup = {
    heading: footerSetting?.customerSupportTitle || CUSTOMER_SUPPORT_GROUP.heading,
    headingHref: '#',
    links:
      footerSetting?.customerSupportLinks && footerSetting.customerSupportLinks.length > 0
        ? footerSetting.customerSupportLinks
        : CUSTOMER_SUPPORT_GROUP.links,
  };

  return (
    <footer className="relative overflow-hidden text-[#cccccc] bg-gradient-to-b from-[#1a1a1a] from-0% via-[#1a1a1a] via-70% via-[#0a1b31] via-88% to-[#356098] to-100%">
      {/* Main footer content */}
      <div className="relative z-[1] max-w-[1400px] mx-auto pt-[60px] px-10 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[220px_1fr_1fr_1fr] gap-10">
          {/* Column 1: Logo + Social */}
          <FooterSocial
            introText={footerSetting?.introText}
            facebookUrl={footerSetting?.facebookUrl}
            youtubeUrl={footerSetting?.youtubeUrl}
            email={footerSetting?.email}
            phone={footerSetting?.phone}
          />

          {/* Column 2: Products */}
          <FooterNavColumn groups={[productsGroup]} />

          {/* Column 3: Contact */}
          <FooterContactColumn
            address={footerSetting?.address}
            salesPhone={footerSetting?.salesPhone}
            feedbackPhone={footerSetting?.feedbackPhone}
            warrantyPhone={footerSetting?.warrantyPhone}
            email={footerSetting?.email}
          />

          {/* Column 4: Customer Support */}
          <FooterNavColumn groups={[customerSupportGroup]} />
        </div>
      </div>

      {/* Copyright bar */}
      <FooterCopyright />
    </footer>
  );
}
