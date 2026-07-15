import * as React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
  LinkComponent?: React.ElementType;
}

export function PageBreadcrumb({ items, LinkComponent = 'a' }: PageBreadcrumbProps) {
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
