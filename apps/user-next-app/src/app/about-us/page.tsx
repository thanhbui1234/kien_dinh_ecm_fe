import Link from 'next/link';
import { Building2, History, Factory } from 'lucide-react';
import { api } from '@/lib/api';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Về chúng tôi | Kiến Đỉnh',
  description: 'Tìm hiểu về Kiến Đỉnh — lịch sử, sứ mệnh và các cơ sở sản xuất trên toàn thế giới.',
};

const subPages = [
  {
    href: '/about-us/company-outline/',
    icon: Building2,
    label: 'Sơ lược về công ty',
    desc: 'Thông tin tổng quan, cơ cấu tổ chức và các công ty thuộc tập đoàn.',
  },
  {
    href: '/about-us/company-history/',
    icon: History,
    label: 'Lịch sử công ty',
    desc: 'Hành trình phát triển từ năm 1919 đến nay.',
  },
  {
    href: '/about-us/production-facilities/',
    icon: Factory,
    label: 'Cơ sở sản xuất',
    desc: 'Hệ thống nhà máy và trung tâm kỹ thuật trên toàn cầu.',
  },
];

function sanitizeHtml(html: string): string {
  return html.replace(/&nbsp;/g, ' ').replace(/ /g, ' ');
}

export default async function AboutUsPage() {
  const settings = await api.settings.getSystemSettings({ next: { revalidate: 3600 } } as RequestInit);
  const introHtml = settings?.find((s) => s.key === 'ABOUT_INTRO_HTML')?.value ?? '';

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-3 flex items-center gap-2 text-[12px] text-gray-400">
          <Link href="/" className="hover:text-[#ff5901] transition-colors no-underline">Trang chủ</Link>
          <span>/</span>
          <span className="text-[#111]">Về chúng tôi</span>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-12 md:py-16">
        {/* Page title */}
        <div className="mb-12">
          <h1 className="text-[32px] md:text-[48px] font-light text-[#111] leading-tight tracking-[-0.02em] m-0">
            Về chúng tôi
          </h1>
          <div className="mt-4 w-12 h-[3px] bg-[#ff5901]" />
        </div>

        {/* Rich text intro — only render when content exists */}
        {introHtml && (
          <div className="mb-16 max-w-[860px]">
            <div
              className="project-article-body"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(introHtml) }}
            />
          </div>
        )}

        {/* Sub-page navigation cards */}
        <div>
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-6 m-0">
            Khám phá thêm
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {subPages.map(({ href, icon: Icon, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col gap-4 border border-gray-100 rounded-2xl p-6 no-underline hover:border-[#ff5901]/30 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div className="w-10 h-10 rounded-xl bg-[#ff5901]/[0.08] flex items-center justify-center shrink-0 group-hover:bg-[#ff5901] transition-colors duration-300">
                  <Icon className="w-5 h-5 text-[#ff5901] group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-[#111] m-0 group-hover:text-[#ff5901] transition-colors duration-200">
                    {label}
                  </p>
                  <p className="text-[13px] text-gray-500 leading-relaxed m-0 mt-1.5">
                    {desc}
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-1.5 text-[12px] font-medium text-gray-400 group-hover:text-[#ff5901] transition-colors duration-200">
                  Xem chi tiết
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M2.33 7H11.67M11.67 7L7.58 3M11.67 7L7.58 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
