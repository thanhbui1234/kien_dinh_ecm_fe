import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageBreadcrumb } from 'shared-ui';
import { api } from '@/lib/api';
import { getCachedCategories } from '@/lib/cached-api';
import ProductDetailClient from './ProductDetailClient';
import type { Metadata } from 'next';
import { buildProductMetadata, generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo';
import { getTranslations, getLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';


interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [product, categories] = await Promise.all([
    api.products.getProductDetail(slug),
    getCachedCategories(),
  ]);

  if (!product) {
    return { title: 'Sản phẩm' };
  }

  const category = (categories ?? []).find((c) => c.id === product.categoryId);

  return buildProductMetadata({
    name: product.name,
    slug,
    thumbnailUrl: product.thumbnailUrl,
    seoMeta: product.detail?.seoMeta as Record<string, string> | undefined,
    categoryName: category?.name,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const [t, locale] = await Promise.all([getTranslations(), getLocale()]);
  const lang = locale.toUpperCase();

  let product = await api.products.getProductDetail(slug, lang);

  if (!product) {
    const listResult = await api.products.getProducts({ search: slug, limit: '20', lang });
    product = listResult?.items?.find((p) => p.slug === slug) ?? null;
  }

  if (!product) notFound();

  const [fullProduct, categoriesResponse, relatedResponse] = await Promise.all([
    product.detail ? Promise.resolve(product) : api.products.getProductDetail(product.id, lang).then((d) => d ?? product),
    getCachedCategories(),
    api.products.getRelatedProducts(product.id),
  ]);

  let relatedProducts: typeof relatedResponse = relatedResponse?.length ? relatedResponse : null;

  if (!relatedProducts?.length) {
    const sameCat = await api.products.getProducts({ categoryId: product.categoryId, limit: '7' });
    relatedProducts = sameCat?.items?.filter((p) => p.id !== product.id) ?? [];
  }

  if (!relatedProducts?.length) {
    const general = await api.products.getProducts({ limit: '6' });
    relatedProducts = general?.items?.filter((p) => p.id !== product.id) ?? [];
  }

  const categories = categoriesResponse ?? [];
  const category = categories.find((c) => c.id === product.categoryId);

  const breadcrumbItems = [
    { label: t('products.breadcrumb_home'), href: '/' },
    { label: t('products.breadcrumb_products'), href: '/products/' },
    ...(category ? [{ label: category.name, href: `/products/?category=${category.slug}` }] : []),
    { label: product.name },
  ];

  const imagesList = (fullProduct.images || []).map((img) => img.imageUrl);
  const productSchema = generateProductSchema({
    name: fullProduct.name,
    description: fullProduct.detail?.contentDetail || fullProduct.name,
    slug,
    thumbnailUrl: fullProduct.thumbnailUrl,
    images: imagesList,
    sku: fullProduct.id,
    categoryName: category?.name,
  });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageBreadcrumb
        variant="light"
        LinkComponent={Link}
        items={breadcrumbItems}
      />

      <ProductDetailClient product={fullProduct} category={category} relatedProducts={relatedProducts} />
    </div>
  );
}

