'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Project, Product } from 'shared-api';

const E = [0.16, 1, 0.3, 1] as const;

interface Props {
  project: Project;
  formattedDate: string;
  relatedProducts: Product[];
}

export default function ProjectSidebar({ project, formattedDate, relatedProducts }: Props) {
  return (
    <motion.aside
      className="lg:sticky lg:top-[88px] self-start"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: E, delay: 0.1 }}
    >
      <div className="divide-y divide-gray-100">
        {/* Date */}
        <motion.div
          className="pb-5"
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: E, delay: 0.18 }}
        >
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">
            Ngày thực hiện
          </p>
          <p className="text-[14px] font-medium text-[#111]">{formattedDate}</p>
        </motion.div>

        {/* Featured */}
        {project.isFeatured && (
          <motion.div
            className="py-5 flex items-center gap-2.5"
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: E, delay: 0.26 }}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5e8dd1] opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5e8dd1]" />
            </span>
            <span className="text-[13px] font-medium text-[#5e8dd1]">
              Dự án tiêu biểu
            </span>
          </motion.div>
        )}

        {/* Products used */}
        {relatedProducts.length > 0 && (
          <motion.div
            className="py-5"
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: E, delay: 0.34 }}
          >
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">
              Thiết bị sử dụng
            </p>
            <div className="flex flex-wrap gap-1.5">
              {relatedProducts.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="inline-block text-[11px] font-medium text-[#111] border border-gray-200 px-2.5 py-1 rounded hover:border-[#5e8dd1] hover:text-[#5e8dd1] transition-colors no-underline"
                >
                  {p.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}
