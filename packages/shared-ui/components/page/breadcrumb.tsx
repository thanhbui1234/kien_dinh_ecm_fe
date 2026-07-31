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

/** Native-app-style back button — mobile replaces the full trail with just a back icon. */
function MobileBackLink({ items, LinkComponent, className }: { items: BreadcrumbItem[]; LinkComponent: React.ElementType; className: string }) {
  const parent = items.length >= 2 ? items[items.length - 2] : items[0];
  return (
    <LinkComponent href={parent.href ?? '/'} aria-label={`Quay lại ${parent.label}`} className={className}>
      <ArrowLeft className="w-5 h-5" strokeWidth={2} />
    </LinkComponent>
  );
}

export function PageBreadcrumb({ items, LinkComponent = 'a', variant = 'gray' }: PageBreadcrumbProps) {
  if (variant === 'light') {
    return (
      <div className="border-b border-gray-100">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-3">
          <MobileBackLink
            items={items}
            LinkComponent={LinkComponent}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full text-[#111] no-underline hover:bg-black/5 active:bg-black/10 transition-colors"
          />
          <div className="hidden md:flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-gray-400">
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
    <div style={{ background: '#f5f5f5', padding: '16px 20px' }} className="md:!py-6">
      <div style={{ maxWidth: '1266px', margin: '0 auto' }}>
        <MobileBackLink
          items={items}
          LinkComponent={LinkComponent}
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full text-[#333] no-underline hover:bg-black/5 active:bg-black/10 transition-colors"
        />
        <nav
          aria-label="breadcrumb"
          className="hidden md:flex flex-wrap items-center gap-y-1"
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
