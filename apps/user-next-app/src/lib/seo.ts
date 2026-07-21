import type { Metadata } from 'next';

export const SITE_NAME = 'Thanh Bằng';
export const SITE_URL = 'https://thanhbang.com';
export const DEFAULT_OG_IMAGE = '/images/logo_thanh_bang.png';

export function buildTitle(page: string): string {
  return `${page} | ${SITE_NAME}`;
}

export function buildCanonical(path: string): string {
  return `${SITE_URL}${path}`;
}

export function buildBaseMetadata(opts: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}): Metadata {
  const { title, description, path, ogImage = DEFAULT_OG_IMAGE } = opts;
  const url = buildCanonical(path);
  const fullTitle = buildTitle(title);

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'vi_VN',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export function buildProductMetadata(opts: {
  name?: string;
  description?: string;
  slug: string;
  thumbnailUrl?: string;
  seoMeta?: Record<string, string>;
}): Metadata {
  const { name, description, slug, thumbnailUrl, seoMeta } = opts;

  const title = seoMeta?.metaTitle ?? (name ? name : 'Sản phẩm');
  const desc =
    seoMeta?.metaDescription ??
    description ??
    (name ? `Chi tiết sản phẩm ${name} tại ${SITE_NAME}` : '');
  const image = seoMeta?.ogImage ?? thumbnailUrl ?? DEFAULT_OG_IMAGE;

  return buildBaseMetadata({
    title,
    description: desc,
    path: `/products/${slug}`,
    ogImage: image,
  });
}

export function buildProjectMetadata(opts: {
  name?: string;
  description?: string;
  slug: string;
  coverImage?: string;
}): Metadata {
  const { name, description, slug, coverImage } = opts;

  return buildBaseMetadata({
    title: name ?? 'Dự án',
    description: description ?? `Xem chi tiết dự án ${name ?? ''} tại ${SITE_NAME}`,
    path: `/projects/${slug}`,
    ogImage: coverImage ?? DEFAULT_OG_IMAGE,
  });
}
