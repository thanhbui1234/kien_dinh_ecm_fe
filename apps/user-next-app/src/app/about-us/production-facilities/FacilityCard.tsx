import Image from 'next/image';
import { MapPin, Phone, Building2 } from 'lucide-react';
import type { Facility } from 'shared-api';

function FacilityImagePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#f5f5f5]">
      <Building2 className="h-12 w-12 text-gray-300" />
    </div>
  );
}

export function FacilityCard({ facility }: { facility: Facility }) {
  const telHref = `tel:${facility.phone.replace(/[\s()\-\.]/g, '')}`;

  return (
    <div className="group bg-white overflow-hidden transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-8px_rgba(0,0,0,0.12)]">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {facility.imageUrl ? (
          <Image
            src={facility.imageUrl}
            alt={facility.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06]"
          />
        ) : (
          <FacilityImagePlaceholder />
        )}

        {/* Orange accent bar slides in on hover */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#5e8dd1] transition-[width] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:w-full"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <h4 className="m-0 text-[15px] font-semibold leading-snug text-[#111] transition-colors duration-300 group-hover:text-[#5e8dd1]">
          {facility.name}
        </h4>

        <div className="mt-3 flex items-start gap-2">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
          <p className="m-0 line-clamp-2 text-[13px] leading-relaxed text-gray-500">
            {facility.address}
          </p>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <a
            href={telHref}
            className="flex items-center gap-2 text-[13px] font-medium text-[#5e8dd1] no-underline hover:underline"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" />
            {facility.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
