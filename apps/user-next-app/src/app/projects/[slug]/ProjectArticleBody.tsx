'use client';

import { motion } from 'framer-motion';
import type { Project } from 'shared-api';

const E = [0.16, 1, 0.3, 1] as const;

interface Props {
  project: Project;
}

function sanitizeHtml(html: string): string {
  return html.replace(/&nbsp;/g, ' ').replace(/ /g, ' ');
}

export default function ProjectArticleBody({ project }: Props) {
  return (
    <motion.article
      className="min-w-0"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: E }}
    >
      {project.detail?.contentDetail ? (
        <div
          className="project-article-body"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.detail.contentDetail) }}
        />
      ) : project.description ? (
        <p className="text-[16px] text-gray-600 leading-[1.85] max-w-[65ch]">
          {project.description}
        </p>
      ) : null}
    </motion.article>
  );
}
