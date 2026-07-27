import { Navigation } from 'lucide-react';
import { footerHeadingClass } from './FooterNavColumn';
import { COMPANY_ADDRESS } from '@/constants/footer';
import { getMapsEmbedSrc, getMapsDirectionsHref } from '@/lib/googleMaps';

const MAPS_EMBED_SRC = getMapsEmbedSrc(COMPANY_ADDRESS);
const MAPS_DIRECTIONS_HREF = getMapsDirectionsHref(COMPANY_ADDRESS);

export const FooterContactColumn = () => {
  return (
    <div>
      <h3 className={footerHeadingClass}>HỖ TRỢ TƯ VẤN</h3>
      <div className="text-[14px] text-[#aaa] space-y-2.5 leading-[1.4]">
        <p><strong className="text-white font-medium">Địa chỉ:</strong> {COMPANY_ADDRESS}</p>
        <p><strong className="text-white font-medium">Liên hệ mua hàng:</strong> 0943.67.68.69</p>
        <p><strong className="text-white font-medium">Đóng góp ý kiến:</strong> 0914 161 122</p>
        <p><strong className="text-white font-medium">Bảo hành:</strong> 0912 01 77 55</p>
        <p><strong className="text-white font-medium">Email:</strong> maygachbetongtb@gmail.com</p>
      </div>

      {/* Map thumbnail */}
      <div className="mt-4 h-[130px] w-full overflow-hidden border border-white/10">
        <iframe
          src={MAPS_EMBED_SRC}
          title={`Bản đồ vị trí Thanh Bằng — ${COMPANY_ADDRESS}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0 grayscale-[15%]"
        />
      </div>
      <a
        href={MAPS_DIRECTIONS_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5e8dd1] no-underline hover:underline"
      >
        <Navigation className="h-3.5 w-3.5 shrink-0" />
        Chỉ đường
      </a>
    </div>
  );
};
