'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Tag } from 'lucide-react';
import type { Product } from 'shared-api';

const E = [0.16, 1, 0.3, 1] as const;

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  if (!products.length) return null;
  const shown = products.slice(0, 6);

  return (
    <div ref={ref} className="mt-16 pt-12 border-t border-gray-100">
      {/* Section header */}
      <motion.div
        className="flex items-end justify-between mb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: E }}
      >
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-[2px] bg-[#ff5901]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ff5901]">
              Sản phẩm liên quan
            </span>
          </div>
          <h2 className="text-[22px] font-light text-[#111] m-0">Thiết bị được sử dụng</h2>
        </div>
        <Link
          href="/products/"
          className="hidden md:flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-[#111] transition-colors no-underline"
        >
          Tất cả sản phẩm <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>

      {/* Product grid — staggered */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {shown.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: E, delay: i * 0.09 }}
          >
            <Link href={`/products/${p.slug}`} className="group block no-underline">
              <div className="relative aspect-square bg-[#f5f5f5] rounded-xl overflow-hidden mb-2.5 transition-shadow duration-300 group-hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)]">
                {p.thumbnailUrl ? (
                  <Image
                    src={p.thumbnailUrl}
                    alt={p.name}
                    fill
                    className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.07]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    <Tag className="w-6 h-6" />
                  </div>
                )}
                {/* Orange reveal underline */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff5901] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
              <p className="text-[12px] text-[#111] leading-snug line-clamp-2 group-hover:text-[#ff5901] transition-colors duration-200 m-0">
                {p.name}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
