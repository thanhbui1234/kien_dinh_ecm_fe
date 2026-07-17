'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Category } from 'shared-api';

interface Props {
  categories: Category[];
  activeSlug?: string;
}

export default function CategorySidebar({ categories, activeSlug }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCategory = categories.find((c) => c.slug === activeSlug);

  return (
    <>
      {/* Mobile trigger */}
      <div className="lg:hidden mb-4 w-full">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-between w-full px-4 py-3 border border-gray-200 rounded-xl text-[14px] text-[#111] bg-white"
        >
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M4 8h8M6 12h4" stroke="#111" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            {activeCategory ? activeCategory.name : 'Tất cả sản phẩm'}
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400">
            <path d="M3 5.5L7 9.5L11 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[999] flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />

          {/* Panel */}
          <div className="relative ml-auto w-[280px] h-full bg-white flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="text-[14px] font-semibold text-[#111]">Danh mục</span>
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-2">
              <Link
                href="/products/"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-5 py-3 text-[14px] no-underline transition-colors ${
                  !activeSlug ? 'text-[#ff5901] font-medium bg-[#fff5f0]' : 'text-gray-600 hover:text-[#111] hover:bg-gray-50'
                }`}
              >
                Tất cả sản phẩm
                {!activeSlug && <span className="w-1.5 h-1.5 rounded-full bg-[#ff5901]" />}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products/?category=${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-5 py-3 text-[14px] no-underline transition-colors ${
                    activeSlug === cat.slug
                      ? 'text-[#ff5901] font-medium bg-[#fff5f0]'
                      : 'text-gray-600 hover:text-[#111] hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                  {activeSlug === cat.slug && <span className="w-1.5 h-1.5 rounded-full bg-[#ff5901]" />}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col shrink-0 w-52 xl:w-60">
        <div className="sticky top-[100px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-3 px-3">
            Danh mục
          </p>

          {/* Scrollable list — handles any number of categories */}
          <nav className="flex flex-col gap-0.5 max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
            <Link
              href="/products/"
              className={`text-[13px] px-3 py-2.5 rounded-lg no-underline transition-all duration-150 flex items-center justify-between group ${
                !activeSlug
                  ? 'bg-[#ff5901] text-white font-medium'
                  : 'text-gray-500 hover:text-[#111] hover:bg-gray-50'
              }`}
            >
              Tất cả sản phẩm
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products/?category=${cat.slug}`}
                className={`text-[13px] px-3 py-2.5 rounded-lg no-underline transition-all duration-150 flex items-center justify-between ${
                  activeSlug === cat.slug
                    ? 'bg-[#ff5901] text-white font-medium'
                    : 'text-gray-500 hover:text-[#111] hover:bg-gray-50'
                }`}
              >
                <span className="leading-snug">{cat.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
