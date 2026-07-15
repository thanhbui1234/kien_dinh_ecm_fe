import * as React from 'react';

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
  noPaddingTop?: boolean;
}

export function PageContent({ children, className, noPaddingTop }: PageContentProps) {
  return (
    <div
      className={className}
      style={{
        maxWidth: '1266px',
        margin: '0 auto',
        padding: noPaddingTop ? '0 20px 80px' : '40px 20px 80px',
      }}
    >
      {children}
    </div>
  );
}
