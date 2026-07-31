'use client';

import * as React from 'react';
import { ArrowLeft } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
  LinkComponent?: React.ElementType;
  /** 'gray' = grey block, '>' separator (default, legacy about-us pages). 'light' = white bar, '/' separator, brand hover color. */
  variant?: 'gray' | 'light';
}

/** Native-app-style back button — mobile & tablet render a sleek back pill badge with parent label (e.g. ← Sản phẩm / ← Dự án). */
function MobileBackLink({ items, LinkComponent, className }: { items: BreadcrumbItem[]; LinkComponent: React.ElementType; className?: string }) {
  const parent = items.length >= 2 ? items[items.length - 2] : items[0];

  const handleClick = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.history.length > 1 && document.referrer && document.referrer.includes(window.location.host)) {
      e.preventDefault();
      window.history.back();
    }
  };

  return (
    <LinkComponent
      href={parent.href ?? '/'}
      onClick={handleClick}
      aria-label={`Quay lại ${parent.label}`}
      className={`lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100/90 hover:bg-gray-200 active:bg-gray-300 text-xs font-semibold text-gray-800 no-underline transition-all border border-gray-200/80 shadow-xs ${className || ''}`}
    >
      <ArrowLeft className="w-3.5 h-3.5 text-gray-600" strokeWidth={2.5} />
      <span>{parent.label}</span>
    </LinkComponent>
  );
}

export function PageBreadcrumb({ items, LinkComponent = 'a', variant = 'gray' }: PageBreadcrumbProps) {
  if (variant === 'light') {
    return (
      <div className="border-b border-gray-100">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-2.5">
          <MobileBackLink
            items={items}
            LinkComponent={LinkComponent}
          />
          <div className="hidden lg:flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-gray-400">
            {items.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 min-w-0">
                {i > 0 && <span>/</span>}
                {item.href ? (
                  <LinkComponent href={item.href} className="hover:text-[#5e8dd1] no-underline transition-colors">
                    {item.label}
                  </LinkComponent>
                ) : (
                  <span className="text-[#111] truncate max-w-[500px]">{item.label}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', padding: '16px 20px' }} className="lg:!py-6">
      <div style={{ maxWidth: '1266px', margin: '0 auto' }}>
        <MobileBackLink
          items={items}
          LinkComponent={LinkComponent}
        />
        <nav
          aria-label="breadcrumb"
          className="hidden lg:flex flex-wrap items-center gap-y-1"
          style={{ fontSize: '12px', color: '#666' }}
        >
          {items.map((item, i) => (
            <span key={i} className="inline-flex items-center min-w-0">
              {i > 0 && <span style={{ margin: '0 6px' }}>&gt;</span>}
              {item.href ? (
                <LinkComponent href={item.href} style={{ color: '#666', textDecoration: 'none' }}>
                  {item.label}
                </LinkComponent>
              ) : (
                <span className="truncate max-w-[160px] sm:max-w-none" style={{ color: '#333' }}>
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}

