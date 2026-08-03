import { DEFAULT_SUPPORT_LINKS } from '@/constants/footer';
import { FooterSocial } from './footer/FooterSocial';
import { FooterCopyright } from './footer/FooterCopyright';
import { FooterNavColumn } from './footer/FooterNavColumn';
import { FooterContactColumn } from './footer/FooterContactColumn';
import { api } from '@/lib/api';
import { getTranslations } from 'next-intl/server';

export default async function Footer() {
  const [res, footerSetting, t] = await Promise.all([
    api.products.getProducts({ isFeatured: 'true', limit: '10' }).catch(() => null),
    api.settings.getFooterSetting().catch(() => null),
    getTranslations(),
  ]);

  const featuredProducts = res?.items || [];

  const productsGroup = {
    heading: t('footer.products_heading'),
    headingHref: '/products',
    links: featuredProducts.map((p: any) => ({
      label: p.name,
      href: `/products/${p.slug}`,
    })),
  };

  const defaultSupportLinks = DEFAULT_SUPPORT_LINKS.map((l) => ({
    label: t(l.label_key as Parameters<typeof t>[0]),
    href: l.href,
  }));

  const customerSupportGroup = {
    heading: footerSetting?.customerSupportTitle || t('footer.customer_support'),
    headingHref: '#',
    links:
      footerSetting?.customerSupportLinks && footerSetting.customerSupportLinks.length > 0
        ? footerSetting.customerSupportLinks
        : defaultSupportLinks,
  };

  return (
    <footer className="relative overflow-hidden text-[#cccccc] bg-gradient-to-b from-[#1a1a1a] from-0% via-[#1a1a1a] via-70% via-[#0a1b31] via-88% to-[#356098] to-100%">
      <div className="relative z-[1] max-w-[1400px] mx-auto pt-[60px] px-10 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[220px_1fr_1fr_1fr] gap-10">
          <FooterSocial
            introText={footerSetting?.introText}
            facebookUrl={footerSetting?.facebookUrl}
            youtubeUrl={footerSetting?.youtubeUrl}
            email={footerSetting?.email}
            phone={footerSetting?.phone}
          />

          <FooterNavColumn groups={[productsGroup]} />

          <FooterContactColumn
            address={footerSetting?.address}
            salesPhone={footerSetting?.salesPhone}
            feedbackPhone={footerSetting?.feedbackPhone}
            warrantyPhone={footerSetting?.warrantyPhone}
            email={footerSetting?.email}
          />

          <FooterNavColumn groups={[customerSupportGroup]} />
        </div>
      </div>

      <FooterCopyright />
    </footer>
  );
}
