import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import CategorySidebar from './CategorySidebar';

interface SearchParams {
  category?: string;
  page?: string;
  search?: string;
}

function ProductRow({
  product,
  categoryName,
}: {
  product: { id: string; name: string; slug: string; thumbnailUrl: string };
  categoryName?: string;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex gap-6 md:gap-10 py-6 border-b border-gray-100 no-underline hover:bg-[#fafafa] -mx-4 px-4 rounded-xl transition-colors duration-200"
    >
      {/* Image */}
      <div className="relative shrink-0 w-[160px] h-[120px] sm:w-[220px] sm:h-[160px] md:w-[280px] md:h-[200px] bg-[#f5f5f5] rounded-xl overflow-hidden">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 160px, (max-width: 768px) 220px, 280px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center gap-2 min-w-0 py-1">
        {categoryName && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff5901] m-0">
            {categoryName}
          </p>
        )}
        <h3 className="text-[16px] sm:text-[18px] md:text-[20px] font-light text-[#111] leading-snug m-0 group-hover:text-[#ff5901] transition-colors duration-200">
          {product.name}
        </h3>
        <span className="inline-flex items-center gap-1.5 text-[13px] text-gray-400 group-hover:text-[#ff5901] transition-colors duration-200 mt-1 w-fit">
          Xem chi tiết
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="transition-transform duration-200 group-hover:translate-x-0.5">
            <path d="M2.33 7H11.67M11.67 7L7.58 3M11.67 7L7.58 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <p className="text-gray-400 text-[14px]">Không tìm thấy sản phẩm phù hợp.</p>
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
        <Link href={buildHref(page - 1)} className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-[#ff5901] hover:text-[#ff5901] no-underline transition-all text-sm">←</Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link key={p} href={buildHref(p)} className={`w-9 h-9 flex items-center justify-center rounded-full text-[13px] no-underline transition-all ${p === page ? 'bg-[#ff5901] text-white' : 'border border-gray-200 text-gray-500 hover:border-[#ff5901] hover:text-[#ff5901]'}`}>{p}</Link>
      ))}
      {page < totalPages && (
        <Link href={buildHref(page + 1)} className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-[#ff5901] hover:text-[#ff5901] no-underline transition-all text-sm">→</Link>
      )}
    </div>
  );
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const categorySlug = params.category;
  const page = Number(params.page ?? 1);
  const search = params.search;

  const [categoriesResponse, productsResponse] = await Promise.all([
    api.categories.getCategories(),
    api.products.getProducts({ page: String(page), limit: '20', ...(search ? { search } : {}) }),
  ]);

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
        limit: '20',
        categoryId: activeCategoryId,
        ...(search ? { search } : {}),
      })
    : productsResponse;

  const items = filteredProducts?.items ?? [];
  const meta = filteredProducts?.meta;
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      {/* Page header */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-6">
          <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#ff5901] no-underline transition-colors">Trang chủ</Link>
            <span>/</span>
            {activeCategoryName ? (
              <>
                <Link href="/products/" className="hover:text-[#ff5901] no-underline transition-colors">Sản phẩm</Link>
                <span>/</span>
                <span className="text-[#111]">{activeCategoryName}</span>
              </>
            ) : (
              <span className="text-[#111]">Sản phẩm</span>
            )}
          </div>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-[30px] md:text-[40px] font-light text-[#111] leading-none m-0">
              {activeCategoryName ?? 'Tất cả sản phẩm'}
            </h1>
            {meta && <p className="text-gray-400 text-[13px] shrink-0 m-0">{meta.totalItems} sản phẩm</p>}
          </div>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-10 flex gap-12">
        {/* Sidebar — desktop only, client component handles collapse */}
        <CategorySidebar
          categories={categories}
          activeSlug={categorySlug}
        />

        {/* Product list */}
        <main className="flex-1 min-w-0">
          {items.length === 0 ? (
            <EmptyState />
          ) : (
            <div>
              {items.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  categoryName={categoryMap[product.categoryId]}
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
