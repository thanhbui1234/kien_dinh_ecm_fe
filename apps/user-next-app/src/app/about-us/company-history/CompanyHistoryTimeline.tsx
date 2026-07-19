"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  MotionConfig,
} from "framer-motion";
import type { Timeline } from "shared-api";

const EXPO = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────────────────────
   Year tag: slides up out of a clipped box
───────────────────────────────────────── */
function YearTag({ year, inView }: { year: string; inView: boolean }) {
  return (
    <div style={{ overflow: "hidden", lineHeight: 1 }}>
      <motion.span
        className="block text-[#ff5901] font-bold tabular-nums"
        style={{
          fontSize: "12px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontFamily: "'Geomanist', 'Noto Sans', sans-serif",
        }}
        initial={{ y: "110%" }}
        animate={{ y: inView ? "0%" : "110%" }}
        transition={{ duration: 0.55, ease: EXPO }}
      >
        {year}
      </motion.span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Single milestone row
───────────────────────────────────────── */
function Milestone({ item }: { item: Timeline }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px 0px" });

  return (
    <div ref={ref} className="relative pl-10 md:pl-16 pb-16 md:pb-24 last:pb-10">

      {/* Dot — centered on the vertical line */}
      <div className="absolute left-0 top-[6px] z-10 -translate-x-1/2">
        <motion.div
          className="relative w-3 h-3 rounded-full bg-[#ff5901]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: inView ? 1 : 0, opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.28, ease: EXPO }}
        >
          {/* Expanding ring — fires once */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-[#ff5901]/60"
            initial={{ scale: 1, opacity: 0 }}
            animate={
              inView
                ? { scale: 4, opacity: [0.8, 0] }
                : { scale: 1, opacity: 0 }
            }
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
          />
        </motion.div>
      </div>

      {/* Year label — slide up reveal */}
      <YearTag year={item.year} inView={inView} />

      {/* Title — clip-path horizontal wipe */}
      <motion.h3
        className="m-0 mt-3 mb-3 text-white font-light leading-tight"
        style={{
          fontSize: "clamp(22px, 3vw, 30px)",
          letterSpacing: "-0.02em",
          textWrap: "balance",
        } as React.CSSProperties}
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: inView ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
        transition={{ duration: 0.7, ease: EXPO, delay: 0.1 }}
      >
        {item.title}
      </motion.h3>

      {/* Description — fade + rise */}
      {item.description && (
        <motion.p
          className="m-0 leading-relaxed"
          style={{
            fontSize: "13.5px",
            color: "#888",
            maxWidth: "52ch",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 10 }}
          transition={{ duration: 0.5, ease: EXPO, delay: 0.28 }}
        >
          {item.description}
        </motion.p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Scroll-driven vertical line
───────────────────────────────────────── */
function VerticalLine({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.88", "end 0.2"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute inset-0" style={{ background: "rgba(255,89,1,0.15)" }} />
      <motion.div
        className="absolute inset-0 origin-top"
        style={{ background: "#ff5901", scaleY }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   Exported component
───────────────────────────────────────── */
export function CompanyHistoryTimeline({ items }: { items: Timeline[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <MotionConfig reducedMotion="user">
      {/* Full-width dark section */}
      <section
        style={{ background: "#0d0d0d" }}
        className="py-20 md:py-28"
      >
        <div
          ref={containerRef}
          className="relative max-w-[1266px] mx-auto px-5 md:px-10"
        >
          <VerticalLine containerRef={containerRef} />

          {items.map((item) => (
            <Milestone key={item.id} item={item} />
          ))}
        </div>
      </section>
    </MotionConfig>
  );
}
