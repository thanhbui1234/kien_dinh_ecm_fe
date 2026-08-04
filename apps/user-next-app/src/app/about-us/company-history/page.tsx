import Link from 'next/link';
import { PageWrapper, PageBreadcrumb, PageContent, PageTitle } from 'shared-ui';
import { api } from '@/lib/api';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildBaseMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return buildBaseMetadata({
    title: t('about.history_title'),
    description: 'Hành trình phát triển của Thanh Bằng qua các năm — từ những bước khởi đầu đến vị thế hàng đầu trong ngành máy công cụ CNC tại Việt Nam.',
    path: '/about-us/company-history/',
  });
}

export default async function CompanyHistoryPage() {
  const t = await getTranslations();
  const timelines = await api.settings.getTimelines({ next: { revalidate: 3600 } } as RequestInit);
  const sorted = [...(timelines ?? [])].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('about.parent_breadcrumb'), href: '/about-us/' },
    { label: t('about.history_breadcrumb') },
  ];

  return (
    <PageWrapper>
      <PageBreadcrumb items={breadcrumbs} LinkComponent={Link} />
      <PageContent>
        <PageTitle>{t('about.history_title')}</PageTitle>

        {sorted.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#999' }}>{t('about.history_empty')}</p>
        ) : (
          <div>
            {sorted.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '12px 0',
                  borderBottom: idx < sorted.length - 1 ? '1px dotted #ddd' : 'none',
                }}
              >
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#5e8dd1',
                    width: '60px',
                    flexShrink: 0,
                    paddingTop: '2px',
                  }}
                >
                  {item.year}
                </span>
                <div>
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: 500, color: '#111', lineHeight: 1.5 }}>
                    {item.title}
                  </p>
                  {item.description && (
                    <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#555', lineHeight: 1.7 }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContent>
    </PageWrapper>
  );
}
