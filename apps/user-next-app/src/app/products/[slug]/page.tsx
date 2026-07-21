import { notFound } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { getCachedCategories } from '@/lib/cached-api';
import ProductDetailClient from './ProductDetailClient';
import type { Metadata } from 'next';
import { buildProductMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  const res = await api.products.getProducts({ limit: '200' }).catch(() => null);
  return (res?.items ?? []).map((p) => ({ slug: p.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await api.products.getProductDetail(slug);
  if (!product) {
    return { title: 'Sản phẩm' };
  }
  return buildProductMetadata({
    name: product.name,
    slug,
    thumbnailUrl: product.thumbnailUrl,
    seoMeta: product.detail?.seoMeta as Record<string, string> | undefined,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  // Try slug directly at the detail endpoint first (backend often accepts slug at /{id})
  let product = await api.products.getProductDetail(slug);

  // Fallback: search by text and match slug exactly
  if (!product) {
    const listResult = await api.products.getProducts({ search: slug, limit: '20' });
    product = listResult?.items?.find((p) => p.slug === slug) ?? null;
  }

  if (!product) notFound();

  // If product came from list (no detail field), fetch full detail by ID
  const [fullProduct, categoriesResponse, relatedResponse] = await Promise.all([
    product.detail ? Promise.resolve(product) : api.products.getProductDetail(product.id).then((d) => d ?? product),
    getCachedCategories(),
    api.products.getRelatedProducts(product.id),
  ]);

  // Fallback chain: related API → same category → general list
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

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      <div className="border-b border-gray-100">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-3 flex items-center gap-2 text-[12px] text-gray-400">
          <Link href="/" className="hover:text-[#ff5901] no-underline transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href="/products/" className="hover:text-[#ff5901] no-underline transition-colors">Sản phẩm</Link>
          {category && (
            <>
              <span>/</span>
              <Link href={`/products/?category=${category.slug}`} className="hover:text-[#ff5901] no-underline transition-colors">
                {category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#111] truncate max-w-[220px]">{product.name}</span>
        </div>
      </div>

      <ProductDetailClient product={fullProduct} category={category} relatedProducts={relatedProducts} />
    </div>
  );
}
