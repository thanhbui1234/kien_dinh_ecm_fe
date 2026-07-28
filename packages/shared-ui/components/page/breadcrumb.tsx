import * as React from 'react';

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

export function PageBreadcrumb({ items, LinkComponent = 'a', variant = 'gray' }: PageBreadcrumbProps) {
  if (variant === 'light') {
    return (
      <div className="border-b border-gray-100">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-gray-400">
          {items.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 min-w-0">
              {i > 0 && <span>/</span>}
              {item.href ? (
                <LinkComponent href={item.href} className="hover:text-[#5e8dd1] no-underline transition-colors">
                  {item.label}
                </LinkComponent>
              ) : (
                <span className="text-[#111] truncate max-w-[140px] sm:max-w-[500px]">{item.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', padding: '24px 20px' }}>
      <div style={{ maxWidth: '1266px', margin: '0 auto' }}>
        <nav
          aria-label="breadcrumb"
          className="flex flex-wrap items-center gap-y-1"
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
