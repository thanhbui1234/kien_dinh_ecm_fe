import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { api } from '@/lib/api';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/products/`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/projects/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/about-us/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/about-us/company-outline/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/about-us/company-history/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/about-us/production-facilities/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/tuyen-dung/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ];

  const [productsRes, projectsRes, jobsRes] = await Promise.allSettled([
    api.products.getProducts({ limit: '500' }),
    api.projects.getProjects({ limit: '500' }),
    api.jobs.getJobs({ limit: '500' }),
  ]);

  const productRoutes: MetadataRoute.Sitemap =
    productsRes.status === 'fulfilled'
      ? (productsRes.value?.items ?? []).map((p) => ({
          url: `${SITE_URL}/products/${p.slug}/`,
          lastModified: new Date(p.createdAt),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }))
      : [];

  const projectRoutes: MetadataRoute.Sitemap =
    projectsRes.status === 'fulfilled'
      ? (projectsRes.value?.items ?? []).map((p) => ({
          url: `${SITE_URL}/projects/${p.slug}/`,
          lastModified: new Date(p.createdAt),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }))
      : [];

  const jobRoutes: MetadataRoute.Sitemap =
    jobsRes.status === 'fulfilled'
      ? (jobsRes.value?.items ?? []).map((j) => ({
          url: `${SITE_URL}/tuyen-dung/${j.slug}/`,
          lastModified: new Date(j.createdAt),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        }))
      : [];

  return [...staticRoutes, ...productRoutes, ...projectRoutes, ...jobRoutes];
}
