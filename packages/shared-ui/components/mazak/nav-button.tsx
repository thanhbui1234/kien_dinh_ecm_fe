'use client';

import * as React from 'react';

interface NavButtonProps {
  direction: 'prev' | 'next';
  onClick?: () => void;
  disabled?: boolean;
  size?: number;
  'aria-label'?: string;
}

export function NavButton({ direction, onClick, disabled, size = 36, ...props }: NavButtonProps) {
  const d = direction === 'prev' ? 'M9 3L5 7L9 11' : 'M5 3L9 7L5 11';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: 'none',
        backgroundColor: disabled ? 'rgba(255,89,1,0.35)' : '#ff5901',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s ease',
        flexShrink: 0,
      }}
      {...props}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d={d} stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
