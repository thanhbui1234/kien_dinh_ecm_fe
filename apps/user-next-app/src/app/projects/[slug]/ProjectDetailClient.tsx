'use client';

import { useRef } from 'react';
import { MotionConfig } from 'framer-motion';
import type { Project, Product } from 'shared-api';
import ProjectHero from './ProjectHero';
import ProjectGallery from './ProjectGallery';
import RelatedProducts from './RelatedProducts';
import StickyProjectBar from './StickyProjectBar';
import ProjectMetaStrip from './ProjectMetaStrip';
import ProjectArticleBody from './ProjectArticleBody';
import ProjectSidebar from './ProjectSidebar';
import ProjectBottomCTA from './ProjectBottomCTA';

interface Props {
  project: Project;
  relatedProducts?: Product[];
  galleryImages?: string[];
}

function calcReadingTime(html: string): number {
  const words = html
    .replace(/<[^>]+>/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function ProjectDetailClient({
  project,
  relatedProducts = [],
  galleryImages = [],
}: Props) {
  const ctaRef = useRef<HTMLDivElement>(null);

  const formattedDate = new Date(project.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const readMins = calcReadingTime(
    project.detail?.contentDetail || project.description || ''
  );

  return (
    <MotionConfig reducedMotion="user">
      <>
        <StickyProjectBar projectName={project.name} ctaRef={ctaRef} />
        <ProjectHero project={project} />
        <ProjectMetaStrip project={project} formattedDate={formattedDate} readMins={readMins} />

        {/* ── Two-column content ────────────────────────────── */}
        <div className="max-w-[1300px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-12 lg:gap-16 py-12 md:py-16">
            <ProjectArticleBody project={project} />
            <ProjectSidebar project={project} formattedDate={formattedDate} relatedProducts={relatedProducts} />
          </div>

          {/* Full-width below the grid */}
          <ProjectGallery images={galleryImages} />
          <RelatedProducts products={relatedProducts} />
          <ProjectBottomCTA ctaRef={ctaRef} />
        </div>
      </>
    </MotionConfig>
  );
}
