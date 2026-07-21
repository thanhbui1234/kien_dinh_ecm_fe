import Link from 'next/link';
import { PageWrapper, PageBreadcrumb, PageContent, PageTitle } from 'shared-ui';
import { api } from '@/lib/api';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Lịch sử công ty | Thanh Bằng',
  description: 'Hành trình phát triển của Thanh Bằng qua các năm — từ những bước khởi đầu đến vị thế hàng đầu trong ngành máy công cụ CNC tại Việt Nam.',
  alternates: { canonical: 'https://thanhbang.com/about-us/company-history/' },
};

const breadcrumbs = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Trang giới thiệu', href: '/about-us/' },
  { label: 'Lịch sử công ty' },
];

export default async function CompanyHistoryPage() {
  const timelines = await api.settings.getTimelines({ next: { revalidate: 3600 } } as RequestInit);
  const sorted = [...(timelines ?? [])].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  return (
    <PageWrapper>
      <PageBreadcrumb items={breadcrumbs} LinkComponent={Link} />
      <PageContent>
        <PageTitle>Lịch sử công ty</PageTitle>

        {sorted.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#999' }}>Chưa có dữ liệu lịch sử công ty.</p>
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
