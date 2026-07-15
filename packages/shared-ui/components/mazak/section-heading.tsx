import * as React from 'react';

interface SectionHeadingProps {
  children: React.ReactNode;
  size?: 'lg' | 'sm';
}

export function SectionHeading({ children, size = 'lg' }: SectionHeadingProps) {
  const large = size === 'lg';
  return (
    <div>
      <h2
        style={{
          fontSize: large ? '40px' : '22px',
          fontWeight: 400,
          color: '#111',
          margin: large ? '0 0 12px 0' : '0 0 10px 0',
          letterSpacing: large ? undefined : '0.5px',
        }}
      >
        {children}
      </h2>
      <div
        style={{
          width: large ? '56px' : '40px',
          height: '3px',
          backgroundColor: '#ff5901',
        }}
      />
    </div>
  );
}
