import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageBreadcrumb } from 'shared-ui';
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
      <div className="pt-[80px]">
        <PageBreadcrumb
          variant="light"
          LinkComponent={Link}
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Dự án', href: '/projects/' },
            { label: project.name },
          ]}
        />
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
