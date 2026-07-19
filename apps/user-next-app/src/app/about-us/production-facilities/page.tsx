import Link from 'next/link';
import { PageWrapper, PageBreadcrumb, PageContent, PageTitle } from 'shared-ui';
import { api } from '@/lib/api';
import type { Facility } from 'shared-api';
import type { Metadata } from 'next';
import { FacilityCard } from './FacilityCard';

export const metadata: Metadata = {
  title: 'Cơ sở sản xuất | Kiến Đỉnh',
};

const breadcrumbs = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Trang giới thiệu', href: '/about-us/' },
  { label: 'Cơ sở sản xuất' },
];

function groupFacilities(facilities: Facility[]) {
  const map = new Map<string, Map<string, Facility[]>>();
  for (const f of facilities) {
    if (!map.has(f.region)) map.set(f.region, new Map());
    const countryMap = map.get(f.region)!;
    if (!countryMap.has(f.country)) countryMap.set(f.country, []);
    countryMap.get(f.country)!.push(f);
  }
  return map;
}

export default async function ProductionFacilitiesPage() {
  const facilities = await api.about.getFacilities({ next: { revalidate: 3600 } } as RequestInit);
  const grouped = groupFacilities(facilities ?? []);

  return (
    <PageWrapper>
      <PageBreadcrumb items={breadcrumbs} LinkComponent={Link} />
      <PageContent>
        <PageTitle>Cơ sở sản xuất</PageTitle>

        {grouped.size === 0 && (
          <p className="text-[14px] text-gray-400">Chưa có dữ liệu cơ sở sản xuất.</p>
        )}

        {Array.from(grouped.entries()).map(([region, countryMap]) => (
          <div key={region}>
            <h2 className="m-0 mt-10 border-b-2 border-[#ff5901] pb-2 text-[26px] font-light text-[#111]">
              {region}
            </h2>

            {Array.from(countryMap.entries()).map(([country, items]) => (
              <div key={country}>
                <h3 className="m-0 mb-4 mt-6 text-[18px] font-light text-[#ff5901]">
                  {country}
                </h3>

                <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
                  {items.map((facility) => (
                    <FacilityCard key={facility.id} facility={facility} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </PageContent>
    </PageWrapper>
  );
}
