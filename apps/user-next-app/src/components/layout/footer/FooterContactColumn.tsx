'use client';

import { Navigation } from 'lucide-react';
import { footerHeadingClass } from './FooterNavColumn';
import { getMapsEmbedSrc, getMapsDirectionsHref } from '@/lib/googleMaps';
import { useTranslations } from 'next-intl';

const DEFAULT_ADDRESS = 'Công Ty Cổ Phần Thanh Bằng, Xuân Trường, Ninh Bình 420000, Việt Nam';

interface FooterContactColumnProps {
  address?: string;
  salesPhone?: string;
  feedbackPhone?: string;
  warrantyPhone?: string;
  email?: string;
}

export const FooterContactColumn = ({
  address = DEFAULT_ADDRESS,
  salesPhone = '0943.67.68.69',
  feedbackPhone = '0914 161 122',
  warrantyPhone = '0912 01 77 55',
  email = 'maygachbetongtb@gmail.com',
}: FooterContactColumnProps) => {
  const t = useTranslations();
  const mapsEmbedSrc = getMapsEmbedSrc(address);
  const mapsDirectionsHref = getMapsDirectionsHref(address);

  return (
    <div>
      <h3 className={footerHeadingClass}>{t('footer.support_heading')}</h3>
      <div className="text-[14px] text-[#aaa] space-y-2.5 leading-[1.4]">
        <p><strong className="text-white font-medium">{t('footer.address_label')}</strong> {address}</p>
        {salesPhone && (
          <p>
            <strong className="text-white font-medium">{t('footer.sales_contact_label')}</strong>{' '}
            <a href={`tel:${salesPhone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">{salesPhone}</a>
          </p>
        )}
        {feedbackPhone && (
          <p>
            <strong className="text-white font-medium">{t('footer.feedback_label')}</strong>{' '}
            <a href={`tel:${feedbackPhone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">{feedbackPhone}</a>
          </p>
        )}
        {warrantyPhone && (
          <p>
            <strong className="text-white font-medium">{t('footer.warranty_label')}</strong>{' '}
            <a href={`tel:${warrantyPhone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">{warrantyPhone}</a>
          </p>
        )}
        {email && (
          <p>
            <strong className="text-white font-medium">{t('footer.email_label')}</strong>{' '}
            <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
          </p>
        )}
      </div>

      <div className="mt-4 h-[130px] w-full overflow-hidden border border-white/10">
        <iframe
          src={mapsEmbedSrc}
          title={`${t('footer.map_title')} — ${address}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0 grayscale-[15%]"
        />
      </div>
      <a
        href={mapsDirectionsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5e8dd1] no-underline hover:underline"
      >
        <Navigation className="h-3.5 w-3.5 shrink-0" />
        {t('footer.directions')}
      </a>
    </div>
  );
};
