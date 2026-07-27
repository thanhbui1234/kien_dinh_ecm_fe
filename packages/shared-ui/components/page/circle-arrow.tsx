import * as React from 'react';

interface CircleArrowProps {
  size?: number;
}

export function CircleArrow({ size = 22 }: CircleArrowProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <circle cx="11" cy="11" r="10.5" stroke="currentColor" />
      <path
        d="M8.5 7.5L13.5 11L8.5 14.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
