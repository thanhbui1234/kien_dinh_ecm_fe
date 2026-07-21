import Link from 'next/link';
import type { Metadata } from 'next';
import type { Job } from 'shared-api';
import { api } from '@/lib/api';
import { buildBaseMetadata } from '@/lib/seo';

export const metadata: Metadata = buildBaseMetadata({
  title: 'Tuyển dụng',
  description: 'Cơ hội việc làm tại Thanh Bằng — chuyên cung cấp phụ tùng, dụng cụ cắt gọt và máy công cụ CNC tại Việt Nam.',
  path: '/tuyen-dung/',
});

export const revalidate = 3600;

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full ${
        active
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-gray-100 text-gray-400'
      }`}
    >
      {active && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
      )}
      {active ? 'Đang tuyển' : 'Đã đóng'}
    </span>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/tuyen-dung/${job.slug}/`}
      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border rounded-2xl no-underline transition-all duration-200 ${
        job.status
          ? 'border-gray-100 hover:border-[#ff5901]/40 hover:shadow-lg hover:shadow-[#ff5901]/[0.06]'
          : 'border-gray-100 opacity-60 hover:opacity-80'
      }`}
    >
      <div className="flex flex-col gap-2 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <StatusBadge active={job.status} />
        </div>
        <h2 className="text-[17px] font-medium text-[#111] leading-snug m-0 group-hover:text-[#ff5901] transition-colors duration-200">
          {job.title}
        </h2>
        {job.salary && (
          <p className="text-[13px] text-gray-500 m-0">
            <span className="font-medium text-[#111]">Mức lương:</span> {job.salary}
          </p>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-2 text-[13px] font-medium text-gray-400 group-hover:text-[#ff5901] transition-colors duration-200">
        Xem chi tiết
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
          <path d="M2.33 7H11.67M11.67 7L7.58 3M11.67 7L7.58 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-4 0v2M8 7V5a2 2 0 0 1 4 0" />
        </svg>
      </div>
      <p className="text-gray-400 text-[14px]">Hiện chưa có vị trí tuyển dụng nào.</p>
    </div>
  );
}

export default async function JobsPage() {
  const response = await api.jobs.getJobs(
    { limit: '100' },
    { next: { revalidate: 3600 } },
  );

  const items = response?.items ?? [];
  const activeJobs = items.filter((j) => j.status);
  const closedJobs = items.filter((j) => !j.status);

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-3 flex items-center gap-2 text-[12px] text-gray-400">
          <Link href="/" className="hover:text-[#ff5901] transition-colors no-underline">Trang chủ</Link>
          <span>/</span>
          <span className="text-[#111]">Tuyển dụng</span>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 pt-12 pb-10 border-b border-gray-100">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ff5901]">
          Cơ hội việc làm
        </span>
        <h1 className="text-[32px] md:text-[48px] font-light text-[#111] leading-tight tracking-[-0.02em] m-0 mt-3">
          Tuyển dụng
        </h1>
        <p className="text-gray-500 text-[15px] leading-relaxed mt-4 max-w-[560px] m-0">
          Tham gia đội ngũ Thanh Bằng — nơi kỹ sư và chuyên gia cùng nhau phát triển trong ngành công nghiệp máy công cụ CNC.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-12">
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-14">
            {/* Active jobs */}
            {activeJobs.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#111] m-0">
                    Đang tuyển dụng
                  </h2>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {activeJobs.length} vị trí
                  </span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <div className="flex flex-col gap-3">
                  {activeJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>
            )}

            {/* Closed jobs */}
            {closedJobs.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-gray-400 m-0">
                    Đã đóng tuyển
                  </h2>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <div className="flex flex-col gap-3">
                  {closedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 pb-16">
        <div className="bg-[#0f0f0f] rounded-2xl px-8 md:px-12 py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-[460px]">
            <p className="text-white text-[22px] md:text-[26px] font-light leading-tight m-0">
              Không tìm thấy vị trí phù hợp?
            </p>
            <p className="text-white/50 text-[14px] mt-3 m-0 leading-relaxed">
              Hãy liên hệ với chúng tôi — Thanh Bằng luôn chào đón những ứng viên xuất sắc.
            </p>
          </div>
          <Link
            href="/contact/"
            className="inline-flex items-center justify-center gap-2 bg-[#ff5901] text-white text-[14px] font-semibold px-8 py-3.5 rounded-full hover:bg-[#e04f00] active:scale-[0.98] transition-all no-underline shrink-0"
          >
            Liên hệ ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
