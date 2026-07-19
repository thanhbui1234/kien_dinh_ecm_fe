import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import type { Metadata } from 'next';
import type { Project } from 'shared-api';

export const metadata: Metadata = {
  title: 'Dự án | Kiến Đỉnh',
  description: 'Khám phá các dự án tiêu biểu của Kiến Đỉnh — từ lắp đặt máy CNC, hệ thống tự động hóa đến tích hợp dây chuyền sản xuất.',
};

interface SearchParams {
  page?: string;
}

function ProjectCard({ project }: { project: Project }) {
  const formattedDate = new Date(project.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden no-underline hover:shadow-xl hover:border-gray-200 transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative w-full aspect-[16/10] bg-[#111] overflow-hidden shrink-0">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        )}

        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {project.isFeatured && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-[#ff5901] text-white text-[10px] font-semibold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
            Tiêu biểu
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col p-5 grow">
        <p className="text-[11px] text-gray-400 m-0 mb-2 tabular-nums">{formattedDate}</p>
        <h3 className="text-[15px] font-medium text-[#111] leading-snug m-0 line-clamp-2 group-hover:text-[#ff5901] transition-colors duration-200">
          {project.name}
        </h3>
        {project.description && (
          <p className="text-[13px] text-gray-500 leading-relaxed m-0 mt-2 line-clamp-2">
            {project.description}
          </p>
        )}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-400 group-hover:text-[#ff5901] transition-colors duration-200">
            Xem dự án
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M2.33 7H11.67M11.67 7L7.58 3M11.67 7L7.58 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-4 0v2M8 7V5a2 2 0 0 1 4 0" />
        </svg>
      </div>
      <p className="text-gray-400 text-[14px]">Chưa có dự án nào.</p>
    </div>
  );
}

function Pagination({ meta, searchParams }: { meta: { page: number; totalPages: number }; searchParams: SearchParams }) {
  const { page, totalPages } = meta;
  if (totalPages <= 1) return null;

  const buildHref = (p: number) => {
    const qs = new URLSearchParams();
    qs.set('page', String(p));
    return `/projects/?${qs.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-14">
      {page > 1 && (
        <Link href={buildHref(page - 1)} className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-[#ff5901] hover:text-[#ff5901] no-underline transition-all text-sm">←</Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={`w-9 h-9 flex items-center justify-center rounded-full text-[13px] no-underline transition-all ${
            p === page
              ? 'bg-[#ff5901] text-white'
              : 'border border-gray-200 text-gray-500 hover:border-[#ff5901] hover:text-[#ff5901]'
          }`}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={buildHref(page + 1)} className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-[#ff5901] hover:text-[#ff5901] no-underline transition-all text-sm">→</Link>
      )}
    </div>
  );
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);

  const response = await api.projects.getProjects(
    { page: String(page), limit: '12' },
    { next: { revalidate: 3600 } },
  );

  const items = response?.items ?? [];
  const meta = response?.meta;

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      {/* Page header */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-6">
          <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#ff5901] no-underline transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-[#111]">Dự án</span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-[30px] md:text-[40px] font-light text-[#111] leading-none m-0">
              Tất cả dự án
            </h1>
            {meta && (
              <p className="text-gray-400 text-[13px] shrink-0 m-0">{meta.totalItems} dự án</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-10">
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {items.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {meta && (
          <Pagination
            meta={{ page: meta.currentPage, totalPages: meta.totalPages }}
            searchParams={params}
          />
        )}
      </div>
    </div>
  );
}
