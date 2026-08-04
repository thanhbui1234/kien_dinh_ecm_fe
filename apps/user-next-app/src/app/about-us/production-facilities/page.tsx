import Link from 'next/link';
import { PageWrapper, PageBreadcrumb, PageContent, PageTitle } from 'shared-ui';
import { api } from '@/lib/api';
import type { Facility } from 'shared-api';
import type { Metadata } from 'next';
import { FacilityCard } from './FacilityCard';
import { getTranslations } from 'next-intl/server';
import { buildBaseMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return buildBaseMetadata({
    title: t('about.facilities_title'),
    description: 'Hệ thống cơ sở sản xuất và kho hàng của Thanh Bằng trên toàn quốc — đảm bảo cung ứng nhanh chóng và chất lượng.',
    path: '/about-us/production-facilities/',
  });
}

function groupFacilities(facilities: Facility[]) {
  const map = new Map<string, Facility[]>();
  for (const f of facilities) {
    if (!map.has(f.country)) map.set(f.country, []);
    map.get(f.country)!.push(f);
  }
  return map;
}

export default async function ProductionFacilitiesPage() {
  const t = await getTranslations();
  const facilities = await api.about.getFacilities({ next: { revalidate: 3600 } } as RequestInit);
  const grouped = groupFacilities(facilities ?? []);

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('about.parent_breadcrumb'), href: '/about-us/' },
    { label: t('about.facilities_breadcrumb') },
  ];

  return (
    <PageWrapper>
      <PageBreadcrumb items={breadcrumbs} LinkComponent={Link} />
      <PageContent>
        <PageTitle>{t('about.facilities_title')}</PageTitle>

        {grouped.size === 0 && (
          <p className="text-[14px] text-gray-400">{t('about.facilities_empty')}</p>
        )}

        {Array.from(grouped.entries()).map(([country, items]) => (
          <div key={country}>
            <h2 className="m-0 mt-10 border-b-2 border-[#5e8dd1] pb-2 text-[26px] font-light text-[#111]">
              {country}
            </h2>

            <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
              {items.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          </div>
        ))}
      </PageContent>
    </PageWrapper>
  );
}
