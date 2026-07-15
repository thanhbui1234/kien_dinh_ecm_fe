import * as React from 'react';

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return <div style={{ paddingTop: 'var(--mazak-header-height)' }}>{children}</div>;
}
