'use client';

import { useRef } from 'react';
import Link from 'next/link';
import type { Product, Category } from 'shared-api';
import ProductViewTracker from './ProductViewTracker';
import StickyContactBar from './StickyContactBar';
import ProductMediaGallery from './components/ProductMediaGallery';
import SpecificationsTable from './components/SpecificationsTable';
import FeaturesSection from './components/FeaturesSection';
import RelatedProductsSection from './components/RelatedProductsSection';

interface Props {
  product: Product;
  category?: Category;
  relatedProducts?: Product[];
}

export default function ProductDetailClient({ product, category, relatedProducts = [] }: Props) {
  const bottomSectionRef = useRef<HTMLDivElement>(null);
  const hasPrice = product.price != null && product.price > 0;

  return (
    <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-12">
      <ProductViewTracker productId={product.id} />
      <StickyContactBar
        productId={product.id}
        productName={product.name}
        hasPrice={hasPrice}
        bottomSectionRef={bottomSectionRef}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
        <ProductMediaGallery images={product.images} thumbnail={product.thumbnailUrl} name={product.name} videoUrls={product.detail?.videoUrls} />

        <div className="flex flex-col gap-5 sm:gap-6">
          {category && (
            <Link
              href={`/products/?category=${category.slug}`}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5e8dd1] no-underline hover:opacity-70 transition-opacity w-fit"
            >
              {category.name}
            </Link>
          )}

          <h1 className="text-[26px] sm:text-[30px] md:text-[38px] font-light text-[#111] leading-tight m-0">
            {product.name}
          </h1>

          {hasPrice ? (
            <p className="text-[20px] font-semibold text-[#5e8dd1] m-0">
              {product.price!.toLocaleString('vi-VN')} ₫
            </p>
          ) : (
            <Link
              href={`/contact/?productId=${product.id}`}
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#5e8dd1] bg-[#f2f6fb] border border-[#5e8dd1]/20 px-4 py-2 rounded-full hover:bg-[#e5edf7] hover:border-[#5e8dd1]/40 transition-colors no-underline w-fit"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Giá: Liên hệ báo giá
            </Link>
          )}

          {product.detail?.specifications &&
            Object.keys(product.detail.specifications).length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-4">
                  Thông số kỹ thuật
                </h3>
                <SpecificationsTable specs={product.detail.specifications} />
              </div>
            )}
        </div>
      </div>

      {product.detail?.features && Object.keys(product.detail.features).length > 0 && (
        <FeaturesSection features={product.detail.features} />
      )}

      {product.detail?.contentDetail && (
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-100">
          <h2 className="text-[20px] sm:text-[22px] font-light text-[#111] mb-6 sm:mb-8">Mô tả sản phẩm</h2>
          <div
            className="prose prose-sm max-w-none break-words text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: product.detail.contentDetail.replace(/&nbsp;|\u00A0/gi, ' '),
            }}
          />
        </div>
      )}

      <RelatedProductsSection products={relatedProducts} />

      <div ref={bottomSectionRef} className="mt-12 sm:mt-16 bg-[#111] rounded-2xl px-6 sm:px-8 py-8 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-[#5e8dd1] text-[11px] font-semibold uppercase tracking-[0.22em] mb-2 m-0">
            Liên hệ với chúng tôi
          </p>
          <p className="text-white text-[18px] sm:text-[22px] font-light m-0">
            Cần tư vấn về <span className="font-semibold">{product.name}</span>?
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
          <Link
            href={`/contact/?productId=${product.id}`}
            className="inline-flex items-center justify-center gap-2 bg-[#5e8dd1] text-white text-[14px] font-semibold px-8 py-3.5 rounded-full hover:bg-[#356098] transition-colors no-underline w-full sm:w-auto"
          >
            {hasPrice ? 'Liên hệ tư vấn' : 'Báo giá ngay'}
          </Link>
          <a
            href="https://zalo.me/0943 676869"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#0068FF] text-white text-[14px] font-semibold px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity no-underline w-full sm:w-auto"
          >
            Chat Zalo
          </a>
        </div>
      </div>
    </div>
  );
}
