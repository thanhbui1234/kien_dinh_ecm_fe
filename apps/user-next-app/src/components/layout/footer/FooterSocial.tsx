import Link from 'next/link';
import Image from 'next/image';
import { FacebookIcon, YouTubeIcon } from '@/components/icons';
import { Mail, Phone } from 'lucide-react';
import { footerHeadingClass } from './FooterNavColumn';

export const FooterSocial = () => {
  return (
    <div>
      <Link href="/" aria-label="Trang chủ Thanh Bằng" className="inline-block mb-6">
        <Image
          src="/images/logo_thanh_bang.png"
          alt="Thanh Bằng"
          width={150}
          height={40}
          className="object-contain"
        />
      </Link>

      <p className="text-[13px] text-[#aaa] leading-[1.6] mb-8">
        Công ty Cổ Phần Thanh Bằng tự hào là một trong những công ty uy tín nhất hiện nay và sẵn sàng cam kết với khách hàng về các vấn đề chất lượng, nguồn gốc xuất xứ của sản phẩm cũng như các dịch vụ đi kèm khác.
      </p>

      <div>
        <h3 className={footerHeadingClass + " uppercase"}>Kết nối với chúng tôi</h3>
        <div className="flex gap-3 items-center mb-3">
          <a
            href="https://www.facebook.com/ThanhBangNamDinh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook Thanh Bằng"
            className="hover:opacity-80 transition-opacity"
          >
            <FacebookIcon />
          </a>
          <a
            href="https://www.youtube.com/@congtythanhbang1735"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube Thanh Bằng"
            className="hover:opacity-80 transition-opacity"
          >
            <YouTubeIcon />
          </a>
          <a
            href="mailto:maygachbetongtb@gmail.com"
            aria-label="Gửi email"
            className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center text-white hover:bg-[#333] transition-colors"
          >
            <Mail className="w-[18px] h-[18px]" />
          </a>
          <a
            href="tel:0943676869"
            aria-label="Gọi điện thoại"
            className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center text-white hover:bg-[#333] transition-colors"
          >
            <Phone className="w-[18px] h-[18px]" />
          </a>
        </div>
        
        <Link 
          href="/contact" 
          className="inline-block text-[13px] text-[#aaa] hover:text-[#5e8dd1] underline underline-offset-4 transition-colors"
        >
          Liên hệ ngay →
        </Link>
      </div>
    </div>
  );
};
