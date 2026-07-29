import { MapPin, Navigation } from 'lucide-react';
import { COMPANY_ADDRESS } from '@/constants/footer';
import { getMapsEmbedSrc, getMapsDirectionsHref } from '@/lib/googleMaps';
import type { CompanyLocation } from 'shared-api';

interface LocationSectionProps {
  locations?: CompanyLocation[];
  address?: string;
  mapUrl?: string;
}

export function LocationSection({ locations, address, mapUrl }: LocationSectionProps) {
  const displayLocations: Array<{
    id?: string;
    title: string;
    addressLabel: string;
    address: string;
    directionsUrl?: string;
    mapUrl?: string;
  }> = locations && locations.length > 0
    ? locations
    : [
        {
          title: 'Vị trí nhà máy',
          addressLabel: 'ĐỊA CHỈ NHÀ MÁY',
          address: address || COMPANY_ADDRESS,
          mapUrl: mapUrl,
        },
      ];

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

        <div className="space-y-16">
          {displayLocations.map((loc, idx) => {
            const mapsEmbedSrc = getMapsEmbedSrc(loc.mapUrl || loc.address);
            const mapsDirectionsHref = loc.directionsUrl || getMapsDirectionsHref(loc.address);

            return (
              <div key={loc.id || idx} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                {/* Left: address + directions */}
                <div>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                    {loc.addressLabel || 'ĐỊA CHỈ NHÀ MÁY'}
                  </span>
                  <h3 className="text-[24px] font-medium text-[#111] mt-2 mb-4">{loc.title}</h3>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#5e8dd1]" />
                    <p className="m-0 text-[16px] md:text-[18px] leading-relaxed text-[#111]">
                      {loc.address}
                    </p>
                  </div>
                  <a
                    href={mapsDirectionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-[#5e8dd1] no-underline hover:underline"
                  >
                    <Navigation className="h-4 w-4 shrink-0" />
                    Chỉ đường trên Google Maps
                  </a>
                </div>

                {/* Right: embedded map */}
                <div className="aspect-[4/3] md:aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-sm border border-gray-100">
                  <iframe
                    src={mapsEmbedSrc}
                    title={`Bản đồ vị trí — ${loc.title} — ${loc.address}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                    allowFullScreen
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
