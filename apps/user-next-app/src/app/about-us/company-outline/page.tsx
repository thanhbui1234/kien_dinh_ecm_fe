import Link from 'next/link';
import { PageWrapper, PageBreadcrumb, PageTitle } from 'shared-ui';
import { api } from '@/lib/api';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sơ lược về công ty | Kiến Đỉnh',
};

const breadcrumbs = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Trang giới thiệu', href: '/about-us/' },
  { label: 'Sơ lược về công ty' },
];

function sanitizeHtml(html: string): string {
  return html.replace(/&nbsp;/g, ' ').replace(/ /g, ' ');
}

export default async function CompanyOutlinePage() {
  const [companyInfo, settings] = await Promise.all([
    api.about.getCompanyInfo({ next: { revalidate: 3600 } } as RequestInit),
    api.settings.getSystemSettings({ next: { revalidate: 3600 } } as RequestInit),
  ]);

  const introHtml = settings?.find((s) => s.key === 'ABOUT_INTRO_HTML')?.value ?? '';

  return (
    <PageWrapper>
      <PageBreadcrumb items={breadcrumbs} LinkComponent={Link} />
      <div className="page-content">
        <PageTitle>Sơ lược về công ty</PageTitle>

        {/* Bảng thông tin công ty từ API */}
        {(companyInfo ?? []).length > 0 && (
          <table className="info-table" aria-label="Thông tin công ty">
            <tbody>
              {(companyInfo ?? []).map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.label}</th>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Nội dung giới thiệu HTML từ settings */}
        {introHtml && (
          <div
            className="project-article-body mt-8"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(introHtml) }}
          />
        )}
      </div>
    </PageWrapper>
  );
}
