"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { SectionHeading } from "shared-ui";
import type { Category } from "shared-api";

const EASE_EXPO = [0.16, 1, 0.3, 1] as [number, number, number, number];

const PLACEHOLDER_COLORS = [
  "#1a1a2e",
  "#16213e",
  "#0f3460",
  "#533483",
  "#2b2d42",
  "#3d405b",
  "#1b4332",
  "#1e3a5f",
];

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE_EXPO } },
};

interface Props {
  categories: Category[];
}

export default function LayoutB({ categories }: Props) {
  if (!categories || categories.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const activeCategory = categories[activeIndex];

  return (
    <section className="bg-[#f0f0f0] py-20">
      {/* Heading — constrained */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 mb-12">
        <SectionHeading>Danh mục sản phẩm</SectionHeading>
      </div>

      {/* Panel — full-bleed với margin nhỏ 2 bên */}
      <div ref={ref} className="mx-4 md:mx-10 xl:mx-16 flex flex-col md:flex-row min-h-[480px] rounded-2xl overflow-hidden shadow-md">
        {/* Left panel — category list */}
        <motion.ul
          className="md:w-[36%] bg-white flex flex-col list-none m-0 p-0 overflow-y-auto"
          variants={listVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {categories.map((cat, index) => {
            const isActive = index === activeIndex;
            return (
              <motion.li key={cat.id} variants={itemVariants} className="m-0 p-0 flex-1">
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={[
                    "w-full h-full flex items-center justify-between gap-4 px-6 py-4 text-left border-b border-gray-100 transition-all duration-200",
                    isActive
                      ? "border-l-4 border-l-[#ff5901] bg-[#fafafa]"
                      : "border-l-4 border-l-transparent hover:bg-[#f8f8f8]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "text-[15px] transition-colors duration-200",
                      isActive ? "font-bold text-[#111]" : "font-normal text-gray-500",
                    ].join(" ")}
                  >
                    {cat.name}
                  </span>
                  <span
                    className={[
                      "text-xs font-mono shrink-0 transition-colors duration-200",
                      isActive ? "text-[#ff5901]" : "text-gray-300",
                    ].join(" ")}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* Right panel — image showcase */}
        <div className="md:w-[64%] relative bg-gray-900 overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="absolute inset-0"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: EASE_EXPO }}
            >
              {activeCategory?.imageUrl ? (
                <Image
                  src={activeCategory.imageUrl}
                  alt={activeCategory.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 64vw"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: PLACEHOLDER_COLORS[activeIndex % PLACEHOLDER_COLORS.length] }}
                >
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                </div>
              )}

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="text-[#ff5901] text-[11px] font-semibold uppercase tracking-[0.2em] mb-2">
                  Danh mục sản phẩm
                </p>
                <h3 className="text-white text-2xl md:text-3xl font-semibold mb-4">
                  {activeCategory?.name}
                </h3>
                {activeCategory && (
                  <Link
                    href={`/products/?category=${activeCategory.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-white border border-white/40 rounded-full px-5 py-2 hover:bg-white hover:text-[#111] transition-colors duration-200 no-underline"
                  >
                    Xem sản phẩm
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.33 7H11.67M11.67 7L7.58 3M11.67 7L7.58 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
