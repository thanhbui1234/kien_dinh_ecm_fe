'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import type { Project } from 'shared-api';

const E = [0.16, 1, 0.3, 1] as const;

interface Props {
  project: Project;
  formattedDate: string;
  readMins: number;
}

export default function ProjectMetaStrip({ project, formattedDate, readMins }: Props) {
  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10">
        <motion.div
          className="flex flex-wrap items-center justify-between gap-3 py-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: E, delay: 0.05 }}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-gray-400">
            {project.isFeatured && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#ff5901]">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5901] opacity-50" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff5901]" />
                </span>
                Dự án tiêu biểu
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3 h-3 shrink-0" />
              {formattedDate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3 h-3 shrink-0" />
              {readMins} phút đọc
            </span>
          </div>
          <Link
            href="/contact/"
            className="inline-flex items-center bg-[#ff5901] text-white text-[12px] font-semibold px-4 py-2 rounded-full hover:bg-[#e04f00] active:scale-[0.98] transition-all no-underline shrink-0"
          >
            Yêu cầu tư vấn
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
