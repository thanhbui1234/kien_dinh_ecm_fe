import { MapPin, Navigation } from 'lucide-react';
import { COMPANY_ADDRESS } from '@/constants/footer';
import { getMapsEmbedSrc, getMapsDirectionsHref } from '@/lib/googleMaps';

const MAPS_EMBED_SRC = getMapsEmbedSrc(COMPANY_ADDRESS);
const MAPS_DIRECTIONS_HREF = getMapsDirectionsHref(COMPANY_ADDRESS);

export function LocationSection() {
  return (
    <div className="bg-[#fafbfd]">
      <section className="max-w-[1300px] mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5e8dd1]">04 — Vị trí</span>
          <h2 className="text-[36px] md:text-[52px] font-light text-[#111] tracking-[-0.03em] m-0 mt-3 leading-tight">
            Vị trí nhà máy
          </h2>
          <div className="mt-4 w-12 h-[3px] bg-[#5e8dd1]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: address + directions */}
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-400">
              Địa chỉ nhà máy
            </span>
            <div className="mt-3 flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#5e8dd1]" />
              <p className="m-0 text-[16px] md:text-[18px] leading-relaxed text-[#111]">
                {COMPANY_ADDRESS}
              </p>
            </div>
            <a
              href={MAPS_DIRECTIONS_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-[#5e8dd1] no-underline hover:underline"
            >
              <Navigation className="h-4 w-4 shrink-0" />
              Chỉ đường trên Google Maps
            </a>
          </div>

          {/* Right: embedded map */}
          <div className="aspect-[4/3] md:aspect-[16/10] w-full overflow-hidden">
            <iframe
              src={MAPS_EMBED_SRC}
              title={`Bản đồ vị trí nhà máy Thanh Bằng — ${COMPANY_ADDRESS}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </div>
  );
}
