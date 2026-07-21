import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { buildBaseMetadata } from '@/lib/seo';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const res = await api.jobs.getJobs({ limit: '200' }).catch(() => null);
  return (res?.items ?? []).map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await api.jobs.getJobDetail(slug, { next: { revalidate: 3600 } });
  if (!job) return { title: 'Tuyển dụng' };
  return buildBaseMetadata({
    title: job.title,
    description: `Thanh Bằng tuyển dụng: ${job.title}${job.salary ? ` — Mức lương: ${job.salary}` : ''}.`,
    path: `/tuyen-dung/${slug}/`,
  });
}

function sanitizeHtml(html: string): string {
  return html.replace(/&nbsp;/g, ' ').replace(/ /g, ' ');
}

type Section = { title: string; content: string };

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;

  const job = await api.jobs.getJobDetail(slug, { next: { revalidate: 3600 } });
  if (!job) notFound();

  const sections = ((job as any).sections ?? (job.detail as any)?.sections ?? []) as Section[];

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-3 flex items-center gap-2 text-[12px] text-gray-400">
          <Link href="/" className="hover:text-[#ff5901] transition-colors no-underline">Trang chủ</Link>
          <span>/</span>
          <Link href="/tuyen-dung/" className="hover:text-[#ff5901] transition-colors no-underline">Tuyển dụng</Link>
          <span>/</span>
          <span className="text-[#111] truncate max-w-[260px]">{job.title}</span>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16 items-start">

          {/* Main content */}
          <div>
            {/* Job header */}
            <div className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full ${
                    job.status ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {job.status && (
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                  )}
                  {job.status ? 'Đang tuyển' : 'Đã đóng'}
                </span>
              </div>

              <h1 className="text-[28px] md:text-[38px] font-light text-[#111] leading-tight tracking-[-0.02em] m-0">
                {job.title}
              </h1>

              {job.salary && (
                <div className="flex items-center gap-2 mt-4">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff5901" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <span className="text-[15px] text-[#111]">
                    <span className="text-gray-400 font-medium">Mức lương:</span>{' '}
                    <span className="font-semibold text-[#ff5901]">{job.salary}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Sections */}
            {sections.length > 0 ? (
              <div className="flex flex-col gap-10">
                {sections.map((section, i) => (
                  <div key={i}>
                    <h2 className="text-[18px] font-semibold text-[#111] m-0 mb-4 pb-3 border-b border-gray-100">
                      {section.title}
                    </h2>
                    <div
                      className="project-article-body text-[15px] leading-[1.85]"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.content ?? '') }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-[15px]">Chưa có thông tin chi tiết.</p>
            )}
          </div>

          {/* Sidebar CTA */}
          <div className="lg:sticky lg:top-[100px]">
            <div className="bg-[#0f0f0f] rounded-2xl p-7 flex flex-col gap-5">
              <div>
                <p className="text-white text-[18px] font-light leading-snug m-0">
                  Quan tâm đến vị trí này?
                </p>
                <p className="text-white/50 text-[13px] mt-2 m-0 leading-relaxed">
                  Liên hệ với chúng tôi để tìm hiểu thêm về vị trí này.
                </p>
              </div>

              <div className="w-full h-px bg-white/10" />

              <div className="flex flex-col gap-3">
                <Link
                  href={`/contact/?jobId=${encodeURIComponent(job.id)}`}
                  className="inline-flex items-center justify-center gap-2 bg-[#ff5901] text-white text-[14px] font-semibold px-6 py-3 rounded-full hover:bg-[#e04f00] active:scale-[0.98] transition-all no-underline text-center"
                >
                  Liên hệ ứng tuyển
                </Link>
                <a
                  href="https://zalo.me/0374864110"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white/6 border border-white/12 text-white text-[14px] font-semibold px-6 py-3 rounded-full hover:bg-white/10 active:scale-[0.98] transition-all no-underline text-center"
                >
                  Chat Zalo
                </a>
              </div>

              <div className="w-full h-px bg-white/10" />

              <p className="text-white/30 text-[12px] m-0 leading-relaxed">
                Bạn sẽ được chuyển đến trang liên hệ để gửi thông tin.
              </p>
            </div>

            <Link
              href="/tuyen-dung/"
              className="flex items-center gap-2 mt-4 text-[13px] text-gray-400 hover:text-[#ff5901] transition-colors no-underline"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M11.67 7H2.33M2.33 7L6.42 3M2.33 7L6.42 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Xem tất cả vị trí
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
