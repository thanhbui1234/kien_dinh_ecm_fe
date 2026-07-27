import * as React from 'react';

export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1
      style={{
        fontSize: '40px',
        fontWeight: 400,
        marginTop: 0,
        marginBottom: '40px',
        color: '#000',
      }}
    >
      {children}
    </h1>
  );
}
