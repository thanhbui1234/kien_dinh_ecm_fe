'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from 'shared-api';

interface RelatedProductsSectionProps {
  products: Product[];
}

export default function RelatedProductsSection({ products }: RelatedProductsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-100">
      <h2 className="text-[20px] sm:text-[22px] font-light text-[#111] mb-6 sm:mb-8">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {products.slice(0, 6).map((related) => (
          <Link
            key={related.id}
            href={`/products/${related.slug}`}
            className="group block no-underline"
          >
            <div className="relative aspect-square bg-[#f5f5f5] rounded-xl overflow-hidden mb-2.5 transition-shadow duration-300 group-hover:shadow-[0_6px_20px_rgba(0,0,0,0.10)]">
              {related.thumbnailUrl ? (
                <Image
                  src={related.thumbnailUrl}
                  alt={related.name}
                  fill
                  className="object-contain p-3 sm:p-4 transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                  </svg>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#5e8dd1] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
            <p className="text-[12px] text-[#111] leading-snug line-clamp-2 group-hover:text-[#5e8dd1] transition-colors duration-200">
              {related.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
