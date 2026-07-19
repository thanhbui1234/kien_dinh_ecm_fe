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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5901] opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5901]" />
            </span>
            <span className="text-[13px] font-medium text-[#ff5901]">
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
                  className="inline-block text-[11px] font-medium text-[#111] border border-gray-200 px-2.5 py-1 rounded hover:border-[#ff5901] hover:text-[#ff5901] transition-colors no-underline"
                >
                  {p.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA buttons */}
        <motion.div
          className="pt-5 flex flex-col gap-2.5"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: E, delay: 0.42 }}
        >
          <Link
            href="/contact/"
            className="inline-flex items-center justify-center bg-[#ff5901] text-white text-[13px] font-semibold px-5 py-3 rounded-full hover:bg-[#e04f00] active:scale-[0.98] transition-all no-underline w-full"
          >
            Yêu cầu tư vấn
          </Link>
          <a
            href="https://zalo.me/0374864110"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-[#0068FF]/25 text-[#0068FF] text-[13px] font-semibold px-5 py-3 rounded-full hover:bg-[#0068FF] hover:text-white hover:border-[#0068FF] active:scale-[0.98] transition-all no-underline w-full"
          >
            Chat Zalo
          </a>
        </motion.div>
      </div>
    </motion.aside>
  );
}
