"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  m,
  useInView,
  useScroll,
  useTransform,
  MotionConfig,
} from "framer-motion";
import type { CompanyHistoryEvent } from "shared-api";

const EXPO = [0.16, 1, 0.3, 1] as const;

// TODO: remove fallback once BE adds imageUrl to TimelineResponseDto
const PLACEHOLDER_IMAGE = "https://placehold.co/480x300/111111/5e8dd1?text=Kiến+Đỉnh";

function VerticalLine({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.3"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] pointer-events-none hidden md:block"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gray-200" />
      <m.div className="absolute inset-0 origin-top bg-[#5e8dd1]" style={{ scaleY }} />
    </div>
  );
}

function MobileVerticalLine({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.3"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      className="absolute left-5 top-0 bottom-0 w-[2px] pointer-events-none md:hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gray-200" />
      <m.div className="absolute inset-0 origin-top bg-[#5e8dd1]" style={{ scaleY }} />
    </div>
  );
}

function ContentBlock({
  item,
  inView,
  align,
}: {
  item: CompanyHistoryEvent;
  inView: boolean;
  align: "left" | "right";
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative pb-16 max-w-[440px] w-full ${align === "right" ? "text-right" : "text-left"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Floating image — absolute above text, no layout shift */}
      <m.div
        className={`absolute -top-4 z-20 w-full rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.18)] pointer-events-none`}
        style={{
          transformOrigin: align === "right" ? "bottom right" : "bottom left",
        }}
        initial={{ opacity: 0, clipPath: "inset(100% 0 0 0 round 12px)" }}
        animate={
          hovered
            ? { opacity: 1, clipPath: "inset(0% 0 0 0 round 12px)" }
            : { opacity: 0, clipPath: "inset(100% 0 0 0 round 12px)" }
        }
        transition={{ duration: 0.45, ease: EXPO }}
      >
        <div className="relative aspect-16/10">
          <Image
            src={item.imageUrl || PLACEHOLDER_IMAGE}
            alt={item.year}
            fill
            className="object-cover"
            sizes="440px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#5e8dd1]" />
        </div>
      </m.div>

      {/* Year */}
      <div style={{ overflow: "hidden" }}>
        <m.span
          className="block text-[#5e8dd1] font-black tabular-nums text-[42px] md:text-[52px] leading-none tracking-tight"
          initial={{ y: "110%" }}
          animate={{ y: inView ? "0%" : "110%" }}
          transition={{ duration: 0.6, ease: EXPO }}
        >
          {item.year}
        </m.span>
      </div>

      {/* Title */}
      <m.h3
        className="m-0 mt-3 mb-3 text-[#111] font-semibold leading-tight text-[18px] md:text-[22px]"
        style={{ letterSpacing: "-0.01em" }}
        initial={{ clipPath: align === "right" ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }}
        animate={{
          clipPath: inView
            ? "inset(0 0% 0 0)"
            : align === "right"
              ? "inset(0 0 0 100%)"
              : "inset(0 100% 0 0)",
        }}
        transition={{ duration: 0.65, ease: EXPO, delay: 0.1 }}
      >
        {item.text}
      </m.h3>

      {/* Description — period as subtitle */}
      {item.period && (
        <m.p
          className="m-0 text-[13.5px] text-gray-500 leading-relaxed"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 8 }}
          transition={{ duration: 0.5, ease: EXPO, delay: 0.25 }}
        >
          {item.period}
        </m.p>
      )}
    </div>
  );
}

function Milestone({ item, index }: { item: CompanyHistoryEvent; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative grid grid-cols-1 md:grid-cols-2 mb-0">
      {/* Left slot */}
      <div className={`hidden md:flex ${isLeft ? "justify-end pr-12" : "justify-start pl-12"}`}>
        {isLeft && <ContentBlock item={item} inView={inView} align="right" />}
      </div>

      {/* Center dot — absolute on the line, perfectly centered */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-8 z-10">
        <m.div
          className="relative w-4 h-4 rounded-full bg-[#5e8dd1] ring-4 ring-[#f9f9f9] shadow-md"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: inView ? 1 : 0, opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.3, ease: EXPO }}
        >
          <m.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-[#5e8dd1]"
            initial={{ scale: 1, opacity: 0 }}
            animate={inView ? { scale: 3.5, opacity: [0.6, 0] } : { scale: 1, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
          />
        </m.div>
      </div>

      {/* Right slot */}
      <div className={`hidden md:flex ${!isLeft ? "justify-start pl-12" : "justify-end pr-12"}`}>
        {!isLeft && <ContentBlock item={item} inView={inView} align="left" />}
      </div>

      {/* Mobile layout */}
      <div className="md:hidden pl-14 pb-12">
        <div className="absolute left-5 top-2 -translate-x-1/2 z-10">
          <m.div
            className="relative w-4 h-4 rounded-full bg-[#5e8dd1] ring-4 ring-white shadow-md"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: inView ? 1 : 0, opacity: inView ? 1 : 0 }}
            transition={{ duration: 0.3, ease: EXPO }}
          />
        </div>
        <ContentBlock item={item} inView={inView} align="left" />
      </div>
    </div>
  );
}

export function CompanyHistoryTimeline({ items }: { items: CompanyHistoryEvent[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <MotionConfig reducedMotion="user">
      <section className="py-10 md:py-16">
        <div ref={containerRef} className="relative max-w-[1100px] mx-auto px-6 md:px-10">
          <VerticalLine containerRef={containerRef} />
          <MobileVerticalLine containerRef={containerRef} />
          {items.map((item, i) => (
            <Milestone key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>
    </MotionConfig>
  );
}
