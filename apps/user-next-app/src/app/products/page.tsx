import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { PageBreadcrumb } from 'shared-ui';
import { api } from '@/lib/api';
import { getCachedCategories } from '@/lib/cached-api';
import FilterDrawer from './FilterDrawer';
import SearchInput from './SearchInput';
import { buildBaseMetadata, generateItemListSchema, generateBreadcrumbSchema } from '@/lib/seo';
import { getTranslations } from 'next-intl/server';

interface SearchParams {
  category?: string;
  page?: string;
  search?: string;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
  const params = await searchParams;
  const { category: categorySlug, search } = params;

  let title = 'Sản phẩm — Phụ Tùng & Dụng Cụ CNC';
  let description = 'Danh mục sản phẩm phụ tùng, dụng cụ cắt gọt và máy công cụ CNC chính hãng tại Thanh Bằng. Tìm kiếm và lựa chọn sản phẩm phù hợp.';

  if (categorySlug) {
    const categories = await getCachedCategories();
    const matched = categories?.find((c) => c.slug === categorySlug);
    if (matched) {
      title = `${matched.name} — Phụ Tùng & Dụng Cụ CNC`;
      description = `Danh mục ${matched.name} chính hãng tại Thanh Bằng. Cung cấp phụ tùng máy CNC và dụng cụ cắt gọt chất lượng cao.`;
    }
  } else if (search) {
    title = `Tìm kiếm: "${search}" — Sản phẩm CNC`;
    description = `Kết quả tìm kiếm cho từ khóa "${search}" tại Thanh Bằng.`;
  }

  const queryPath = categorySlug
    ? `/products/?category=${categorySlug}`
    : search
      ? `/products/?search=${encodeURIComponent(search)}`
      : '/products/';

  return buildBaseMetadata({ title, description, path: queryPath });
}

function ProductCard({
  product,
  categoryName,
  viewDetailLabel,
}: {
  product: { id: string; name: string; slug: string; thumbnailUrl: string };
  categoryName?: string;
  viewDetailLabel: string;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col bg-white border border-gray-100 no-underline hover:shadow-xl hover:border-gray-200 rounded-2xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative w-full aspect-[4/3] bg-[#f8f8f8] overflow-hidden">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name}
            fill
            className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-110 mix-blend-multiply"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-col p-5 sm:p-6 grow">
        {categoryName && (
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5e8dd1] m-0 mb-2">
            {categoryName}
          </p>
        )}
        <h3 className="text-[15px] sm:text-[16px] font-medium text-[#111] leading-snug m-0 group-hover:text-[#5e8dd1] transition-colors duration-200 line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-auto pt-4">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-400 group-hover:text-[#5e8dd1] transition-colors duration-200 w-fit">
            {viewDetailLabel}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M2.33 7H11.67M11.67 7L7.58 3M11.67 7L7.58 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <p className="text-gray-400 text-[14px]">{label}</p>
    </div>
  );
}

function Pagination({ meta, searchParams }: { meta: { page: number; totalPages: number }; searchParams: SearchParams }) {
  const { page, totalPages } = meta;
  if (totalPages <= 1) return null;

  const buildHref = (p: number) => {
    const qs = new URLSearchParams();
    if (searchParams.category) qs.set('category', searchParams.category);
    if (searchParams.search) qs.set('search', searchParams.search);
    qs.set('page', String(p));
    return `/products/?${qs.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {page > 1 && (
        <Link href={buildHref(page - 1)} className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-[#5e8dd1] hover:text-[#5e8dd1] no-underline transition-all text-sm">←</Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link key={p} href={buildHref(p)} className={`w-9 h-9 flex items-center justify-center rounded-full text-[13px] no-underline transition-all ${p === page ? 'bg-[#5e8dd1] text-white' : 'border border-gray-200 text-gray-500 hover:border-[#5e8dd1] hover:text-[#5e8dd1]'}`}>{p}</Link>
      ))}
      {page < totalPages && (
        <Link href={buildHref(page + 1)} className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-[#5e8dd1] hover:text-[#5e8dd1] no-underline transition-all text-sm">→</Link>
      )}
    </div>
  );
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const categorySlug = params.category;
  const page = Number(params.page ?? 1);
  const search = params.search;

  const [t, categoriesResponse] = await Promise.all([
    getTranslations(),
    getCachedCategories(),
  ]);


  const productsResponse = await api.products.getProducts({
    page: String(page),
    limit: '12',
    ...(search ? { search } : {}),
  });

  const categories = (categoriesResponse ?? []).filter((c) => !c.parentId);

  let activeCategoryId: string | undefined;
  let activeCategoryName: string | undefined;
  if (categorySlug) {
    const matched = categories.find((c) => c.slug === categorySlug);
    activeCategoryId = matched?.id;
    activeCategoryName = matched?.name;
  }

  const filteredProducts = activeCategoryId
    ? await api.products.getProducts({
      page: String(page),
      limit: '12',
      categoryId: activeCategoryId,
      ...(search ? { search } : {}),
    })
    : productsResponse;

  const items = filteredProducts?.items ?? [];
  const meta = filteredProducts?.meta;
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const breadcrumbItems = activeCategoryName
    ? [
      { label: t('products.breadcrumb_home'), href: '/' },
      { label: t('products.breadcrumb_products'), href: '/products/' },
      { label: activeCategoryName },
    ]
    : [
      { label: t('products.breadcrumb_home'), href: '/' },
      { label: t('products.breadcrumb_products') },
    ];

  const itemListSchema = generateItemListSchema(items.map((i) => ({ name: i.name, slug: i.slug })));
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  const pageHeading = activeCategoryName
    ?? (search ? `${t('products.search_prefix')} "${search}"` : t('products.all_products'));

  return (
    <div className="min-h-screen bg-white pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <PageBreadcrumb variant="light" LinkComponent={Link} items={breadcrumbItems} />

      <div className="border-b border-gray-100">
        <div className="max-w-325 mx-auto px-6 md:px-10 py-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <h1 className="wrap-break-word text-[26px] sm:text-[30px] md:text-[40px] font-light text-[#111] leading-tight md:leading-none m-0">
              {pageHeading}
            </h1>
            {meta && <p className="text-gray-400 text-[13px] m-0">{meta.totalItems} {t('products.count_suffix')}</p>}
          </div>
        </div>
      </div>

      <div className="max-w-325 mx-auto px-6 md:px-10 py-8">
        {/* search row */}
        <div className="mb-5">
          <SearchInput categories={categories} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-gray-100">
          <p className="text-gray-500 text-[14px] m-0 shrink-0">
            {t('products.showing_prefix')} <strong className="text-[#111] font-medium">{items.length}</strong> {t('products.showing_suffix')}
          </p>
          <FilterDrawer categories={categories} activeSlug={categorySlug} />
        </div>

        <main className="w-full">
          {items.length === 0 ? (
            <EmptyState label={t('products.not_found')} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={categoryMap[product.categoryId]}
                  viewDetailLabel={t('products.view_detail')}
                />
              ))}
            </div>
          )}

          {meta && (
            <Pagination meta={{ page: meta.currentPage, totalPages: meta.totalPages }} searchParams={params} />
          )}
        </main>
      </div>
    </div>
  );
}
