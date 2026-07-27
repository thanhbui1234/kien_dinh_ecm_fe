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
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-3 flex items-center gap-2 text-[12px] text-gray-400">
          {items.map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span>/</span>}
              {item.href ? (
                <LinkComponent href={item.href} className="hover:text-[#5e8dd1] no-underline transition-colors">
                  {item.label}
                </LinkComponent>
              ) : (
                <span className="text-[#111] truncate max-w-[220px]">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f5f5', padding: '24px 20px' }}>
      <div style={{ maxWidth: '1266px', margin: '0 auto' }}>
        <nav aria-label="breadcrumb" style={{ fontSize: '12px', color: '#666' }}>
          {items.map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ margin: '0 6px' }}>&gt;</span>}
              {item.href ? (
                <LinkComponent href={item.href} style={{ color: '#666', textDecoration: 'none' }}>
                  {item.label}
                </LinkComponent>
              ) : (
                <span style={{ color: '#333' }}>{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
}
