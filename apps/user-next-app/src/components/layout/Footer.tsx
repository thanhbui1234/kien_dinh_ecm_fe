'use client';

import { PRODUCTS_COL, TECHNOLOGY_GROUPS, SERVICE_GROUPS } from '@/constants/footer';
import { FooterSocial } from './footer/FooterSocial';
import { FooterCopyright } from './footer/FooterCopyright';
import { FooterNavColumn } from './footer/FooterNavColumn';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden text-[#cccccc] bg-gradient-to-b from-[#1a1a1a] from-0% via-[#1a1a1a] via-70% via-[#4a2010] via-88% to-[#ff5901] to-100%">
      {/* Main footer content */}
      <div className="relative z-[1] max-w-[1400px] mx-auto pt-[60px] px-10 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[220px_1fr_1fr_1fr] gap-10">
          {/* Column 1: Logo + Social */}
          <FooterSocial />

          {/* Column 2: Products */}
          <FooterNavColumn groups={[PRODUCTS_COL]} />

          {/* Column 3: Technology + News */}
          <FooterNavColumn groups={TECHNOLOGY_GROUPS} />

          {/* Column 4: Service + About */}
          <FooterNavColumn groups={SERVICE_GROUPS} />
        </div>
      </div>

      {/* Copyright bar */}
      <FooterCopyright />
    </footer>
  );
}
