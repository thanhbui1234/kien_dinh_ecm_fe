import Link from 'next/link';
import { PageWrapper, PageBreadcrumb, PageTitle } from 'shared-ui';
import { api } from '@/lib/api';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildBaseMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return buildBaseMetadata({
    title: t('about.outline_title'),
    description: 'Thông tin tổng quan về công ty Thanh Bằng — tầm nhìn, sứ mệnh và các thông tin doanh nghiệp.',
    path: '/about-us/company-outline/',
  });
}

function sanitizeHtml(html: string): string {
  return html.replace(/&nbsp;/g, ' ').replace(/ /g, ' ');
}

export default async function CompanyOutlinePage() {
  const t = await getTranslations();

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('about.parent_breadcrumb'), href: '/about-us/' },
    { label: t('about.outline_breadcrumb') },
  ];

  const [companyInfo, settings] = await Promise.all([
    api.about.getCompanyInfo({ next: { revalidate: 3600 } } as RequestInit),
    api.settings.getSystemSettings({ next: { revalidate: 3600 } } as RequestInit),
  ]);

  const introHtml = settings?.find((s) => s.key === 'ABOUT_INTRO_HTML')?.value ?? '';

  return (
    <PageWrapper>
      <PageBreadcrumb items={breadcrumbs} LinkComponent={Link} />
      <div className="page-content">
        <PageTitle>{t('about.outline_title')}</PageTitle>

        {(companyInfo ?? []).length > 0 && (
          <table className="info-table" aria-label={t('about.outline_table_aria')}>
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
