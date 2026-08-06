'use client';

import StickyContactBar from '@/components/ui/StickyContactBar';
import { useTranslations } from 'next-intl';

interface StickyProjectBarProps {
  projectName: string;
  ctaRef: React.RefObject<HTMLDivElement | null>;
}

export default function StickyProjectBar({ projectName, ctaRef }: StickyProjectBarProps) {
  const t = useTranslations();
  return (
    <StickyContactBar
      entityLabel={t('projects.breadcrumb_projects')}
      entityName={projectName}
      ctaLabel={t('common.contact_consult')}
      ctaHref="/contact/"
      bottomSectionRef={ctaRef}
    />
  );
}
