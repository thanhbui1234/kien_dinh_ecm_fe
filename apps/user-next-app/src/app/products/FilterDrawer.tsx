'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Category } from 'shared-api';

interface Props {
  categories: Category[];
  activeSlug?: string;
}

const ITEMS_PER_PAGE = 10;

export default function FilterDrawer({ categories, activeSlug }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const activeCategory = categories.find((c) => c.slug === activeSlug);

  // Pagination Logic
  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const currentCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return categories.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [categories, currentPage]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-[14px] text-[#111] hover:border-[#5e8dd1] hover:text-[#5e8dd1] transition-all shadow-sm"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-medium">
          Bộ lọc {activeCategory ? `(${activeCategory.name})` : ''}
        </span>
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex justify-end">
          {/* Backdrop (Dark with slight blur) */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Panel (Glassmorphism) */}
          <div className="relative w-full max-w-[320px] h-full bg-white/80 backdrop-blur-xl flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200/50">
              <h2 className="text-[18px] font-semibold text-[#111] m-0">Bộ lọc danh mục</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/50 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
              {/* Special "All Products" Link - Always visible on top */}
              <Link
                href="/products/"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-[14px] no-underline transition-all ${
                  !activeSlug
                    ? 'bg-[#5e8dd1] text-white font-medium shadow-md shadow-[#5e8dd1]/20'
                    : 'text-gray-700 hover:text-[#111] hover:bg-white/60'
                }`}
              >
                Tất cả sản phẩm
                {!activeSlug && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </Link>

              <div className="my-2 border-b border-gray-200/50 mx-2" />

              {/* Paginated Categories */}
              {currentCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products/?category=${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-[14px] no-underline transition-all ${
                    activeSlug === cat.slug
                      ? 'bg-[#5e8dd1] text-white font-medium shadow-md shadow-[#5e8dd1]/20'
                      : 'text-gray-700 hover:text-[#111] hover:bg-white/60'
                  }`}
                >
                  {cat.name}
                  {activeSlug === cat.slug && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200/50 flex items-center justify-between bg-white/40 backdrop-blur-md">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-2 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#111] transition-colors bg-white/50 rounded-full hover:bg-white/80"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <span className="text-[13px] text-gray-600 font-medium bg-white/50 px-3 py-1 rounded-full">
                  Trang {currentPage} / {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-2 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#111] transition-colors bg-white/50 rounded-full hover:bg-white/80"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
