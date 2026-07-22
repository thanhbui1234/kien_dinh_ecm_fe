import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProjectDetailClient from './ProjectDetailClient';
import { api } from '@/lib/api';
import type { Metadata } from 'next';
import { buildProjectMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  const res = await api.projects.getProjects({ limit: '100' }).catch(() => null);
  return (res?.items ?? []).map((p) => ({ slug: p.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await api.projects.getProjectDetail(slug, {
    next: { revalidate: 3600 },
  });

  if (!project) {
    return { title: 'Dự án không tồn tại' };
  }

  return buildProjectMetadata({
    name: project.name,
    description: project.description,
    slug,
    coverImage: project.coverImage,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;

  const [project, flatCategoriesResponse] = await Promise.all([
    api.projects.getProjectDetail(slug, {
      next: { revalidate: 3600 },
    }),
    api.categories.getCategories({
      next: { revalidate: 3600 },
    }),
  ]);

  if (!project) notFound();

  const flatCategories = flatCategoriesResponse ?? [];

  const galleryImages = project.images ?? [];
  const relatedProducts = project.relatedProducts ?? [];
  const relatedCategories = flatCategories.filter(c => project.categoryIds?.includes(c.id));

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="pt-[80px] border-b border-gray-100">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-3 flex items-center gap-2 text-[12px] text-gray-400">
          <Link href="/" className="hover:text-[#5e8dd1] transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href="/projects/" className="hover:text-[#5e8dd1] transition-colors">Dự án</Link>
          <span>/</span>
          <span className="text-[#111] truncate max-w-[260px]">{project.name}</span>
        </div>
      </div>

      <ProjectDetailClient
        project={project}
        relatedProducts={relatedProducts}
        relatedCategories={relatedCategories}
        galleryImages={galleryImages}
      />
    </div>
  );
}
