'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FacebookIcon, YouTubeIcon } from '@/components/icons';
import { Mail, Phone } from 'lucide-react';
import { footerHeadingClass } from './FooterNavColumn';
import { useTranslations } from 'next-intl';

interface FooterSocialProps {
  introText?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  email?: string;
  phone?: string;
}

export const FooterSocial = ({
  introText,
  facebookUrl = 'https://www.facebook.com/ThanhBangNamDinh',
  youtubeUrl = 'https://www.youtube.com/@congtythanhbang1735',
  email = 'maygachbetongtb@gmail.com',
  phone = '0943676869',
}: FooterSocialProps) => {
  const t = useTranslations();
  const displayIntro = introText || t('footer.company_intro_fallback');
  const cleanPhone = phone?.replace(/\s+/g, '');

  return (
    <div>
      <Link href="/" aria-label={t('footer.home_label')} className="inline-block mb-6">
        <Image
          src="/images/logo_thanh_bang.png"
          alt="Thanh Bằng"
          width={150}
          height={40}
          className="object-contain"
        />
      </Link>

      <p className="text-[13px] text-[#aaa] leading-[1.6] mb-8">
        {displayIntro}
      </p>

      <div>
        <h3 className={footerHeadingClass + " uppercase"}>{t('footer.connect_with_us')}</h3>
        <div className="flex gap-3 items-center mb-3">
          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('footer.facebook_label')}
              className="hover:opacity-80 transition-opacity"
            >
              <FacebookIcon />
            </a>
          )}
          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('footer.youtube_label')}
              className="hover:opacity-80 transition-opacity"
            >
              <YouTubeIcon />
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              aria-label={t('footer.email_icon_label')}
              className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center text-white hover:bg-[#333] transition-colors"
            >
              <Mail className="w-[18px] h-[18px]" />
            </a>
          )}
          {phone && (
            <a
              href={`tel:${cleanPhone}`}
              aria-label={t('footer.phone_label')}
              className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center text-white hover:bg-[#333] transition-colors"
            >
              <Phone className="w-[18px] h-[18px]" />
            </a>
          )}
        </div>

        <Link
          href="/contact"
          className="inline-block text-[13px] text-[#aaa] hover:text-[#5e8dd1] underline underline-offset-4 transition-colors"
        >
          {t('footer.contact_now_arrow')}
        </Link>
      </div>
    </div>
  );
};
