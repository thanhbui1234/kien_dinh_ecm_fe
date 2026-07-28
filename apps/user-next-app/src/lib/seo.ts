import type { Metadata } from 'next';

export const SITE_NAME = 'Thanh Bằng';
export const SITE_URL = 'https://thanhbang.com';
export const DEFAULT_OG_IMAGE = '/images/logo_thanh_bang.png';
export const DEFAULT_KEYWORDS = [
  'Thanh Bằng',
  'thanhbang.com',
  'dụng cụ cắt gọt CNC',
  'phụ tùng máy CNC',
  'máy công cụ CNC',
  'đầu kẹp dao CNC',
  'mảnh tiện CNC',
  'dao phay CNC',
  'gia công cơ khí chính xác Việt Nam',
];

export function buildTitle(page: string): string {
  return `${page} | ${SITE_NAME}`;
}

export function buildCanonical(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

export function buildBaseMetadata(opts: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  keywords?: string[];
}): Metadata {
  const { title, description, path, ogImage = DEFAULT_OG_IMAGE, keywords = [] } = opts;
  const url = buildCanonical(path);
  const fullTitle = buildTitle(title);
  const combinedKeywords = Array.from(new Set([...keywords, ...DEFAULT_KEYWORDS]));
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

  return {
    title: fullTitle,
    description,
    keywords: combinedKeywords,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'vi_VN',
      type: 'website',
      images: [{ url: fullOgImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullOgImage],
    },
  };
}

export function buildProductMetadata(opts: {
  name?: string;
  description?: string;
  slug: string;
  thumbnailUrl?: string;
  seoMeta?: Record<string, string>;
  categoryName?: string;
}): Metadata {
  const { name, description, slug, thumbnailUrl, seoMeta, categoryName } = opts;

  const productName = name ? name : 'Sản phẩm';
  const title = seoMeta?.metaTitle ?? `${productName} - Phụ Tùng & Dụng Cụ CNC`;
  const desc =
    seoMeta?.metaDescription ??
    description ??
    `Mua ${productName} chính hãng tại ${SITE_NAME}. Chuyên cung cấp phụ tùng máy CNC, dụng cụ cắt gọt chất lượng cao, giao hàng toàn quốc.`;
  const image = seoMeta?.ogImage ?? thumbnailUrl ?? DEFAULT_OG_IMAGE;
  const keywords = [productName, categoryName || '', 'dụng cụ cắt gọt', 'phụ tùng CNC'].filter(Boolean);

  return buildBaseMetadata({
    title,
    description: desc,
    path: `/products/${slug}`,
    ogImage: image,
    keywords,
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

/* ==================== JSON-LD SCHEMA GENERATORS ==================== */

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    description: 'Thanh Bằng — Chuyên cung cấp phụ tùng, dụng cụ cắt gọt và máy công cụ CNC tại Việt Nam.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'VN',
    },
  };
}

export function generateWebSiteSearchSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/products/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateProductSchema(opts: {
  name: string;
  description?: string;
  slug: string;
  thumbnailUrl?: string;
  images?: string[];
  sku?: string;
  brandName?: string;
  categoryName?: string;
}) {
  const { name, description, slug, thumbnailUrl, images = [], sku, brandName = SITE_NAME, categoryName } = opts;
  const url = buildCanonical(`/products/${slug}`);
  const imgList = Array.from(new Set([thumbnailUrl, ...images].filter(Boolean) as string[])).map((img) =>
    img.startsWith('http') ? img : `${SITE_URL}${img.startsWith('/') ? img : `/${img}`}`
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}/#product`,
    name,
    image: imgList.length > 0 ? imgList : [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
    description: description || `Sản phẩm ${name} chính hãng tại ${SITE_NAME} - Dụng cụ cắt gọt & phụ tùng máy CNC.`,
    sku: sku || slug,
    url,
    category: categoryName,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
  };
}

export function generateBreadcrumbSchema(items: { label: string; href?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href.startsWith('http') ? item.href : buildCanonical(item.href) } : {}),
    })),
  };
}

export function generateItemListSchema(products: { name: string; slug: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: p.name,
      url: buildCanonical(`/products/${p.slug}`),
    })),
  };
}

