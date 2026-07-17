import React from 'react';
export const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-label="Facebook">
    <circle cx="20" cy="20" r="19" stroke="#333" strokeWidth="1" />
    <path d="M21.5 14.5H23V12H21C18.8 12 17.5 13.3 17.5 15.5V17H15.5V19.5H17.5V28H20V19.5H22L22.5 17H20V15.5C20 14.9 20.3 14.5 21.5 14.5Z" fill="white" />
  </svg>
);

export const YouTubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-label="YouTube">
    <circle cx="20" cy="20" r="19" stroke="#333" strokeWidth="1" />
    <path d="M29.5 15.5C29.2 14.4 28.3 13.6 27.2 13.3C25.2 12.8 20 12.8 20 12.8C20 12.8 14.8 12.8 12.8 13.3C11.7 13.6 10.8 14.4 10.5 15.5C10 17.5 10 21.5 10 21.5C10 21.5 10 25.5 10.5 27.5C10.8 28.6 11.7 29.4 12.8 29.7C14.8 30.2 20 30.2 20 30.2C20 30.2 25.2 30.2 27.2 29.7C28.3 29.4 29.2 28.6 29.5 27.5C30 25.5 30 21.5 30 21.5C30 21.5 30 17.5 29.5 15.5ZM18 25V18L24 21.5L18 25Z" fill="white" />
  </svg>
);

export const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 2C12 2 8 6 8 12C8 18 12 22 12 22" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 2C12 2 16 6 16 12C16 18 12 22 12 22" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 12H22" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 7H21" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 17H21" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ReadMoreArrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronDownIcon = ({ color }: { color?: string }) => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 3.5L5 6.5L8 3.5" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
