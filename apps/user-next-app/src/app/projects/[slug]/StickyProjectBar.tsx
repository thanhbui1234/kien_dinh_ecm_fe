'use client';

import StickyContactBar from '@/components/ui/StickyContactBar';

interface StickyProjectBarProps {
  projectName: string;
  ctaRef: React.RefObject<HTMLDivElement | null>;
}

export default function StickyProjectBar({ projectName, ctaRef }: StickyProjectBarProps) {
  return (
    <StickyContactBar
      entityLabel="Dự án"
      entityName={projectName}
      ctaLabel="Liên hệ tư vấn"
      ctaHref="/contact/"
      bottomSectionRef={ctaRef}
    />
  );
}
