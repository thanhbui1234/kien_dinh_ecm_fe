import Link from 'next/link';
import Image from 'next/image';
import { FacebookIcon, YouTubeIcon } from '@/components/icons';

export const FooterSocial = () => {
  return (
    <div>
      <Link href="/" aria-label="Trang chủ Thanh Bằng" className="inline-block mb-8">
        <Image
          src="/images/logo_thanh_bang.png"
          alt="Thanh Bằng"
          width={120}
          height={32}
          className="object-contain"
        />
      </Link>

      <p className="text-[12px] text-[#888] uppercase tracking-[0.5px] mb-4">
        Truyền thông xã hội
      </p>

      <div className="flex gap-2">
        <a
          href="https://www.facebook.com/profile.php?id=100063365610939"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook Thanh Bằng"
        >
          <FacebookIcon />
        </a>
        <a
          href="https://www.youtube.com/@yamazakimazakvietnam"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube Thanh Bằng"
        >
          <YouTubeIcon />
        </a>
      </div>
    </div>
  );
};
