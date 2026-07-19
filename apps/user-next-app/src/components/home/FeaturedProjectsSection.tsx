"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "shared-api";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "shared-ui";
import { motion, useInView } from "framer-motion";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

interface FeaturedProjectsSectionProps {
  projects?: Project[];
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_EXPO } },
};

export default function FeaturedProjectsSection({ projects = [] }: FeaturedProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  if (projects.length === 0) return null;

  const displayed = projects.slice(0, 6);

  return (
    <section ref={sectionRef} className="bg-white py-20">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          className="mb-10 flex items-end justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_EXPO }}
        >
          <SectionHeading>Dự án nổi bật</SectionHeading>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
          variants={container}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Hero card — col span 2, row span 2 */}
          {displayed[0] && (
            <motion.div variants={item} className="md:col-span-2 md:row-span-2">
              <BentoCard project={displayed[0]} hero />
            </motion.div>
          )}

          {/* Side cards */}
          {displayed[1] && (
            <motion.div variants={item}>
              <BentoCard project={displayed[1]} />
            </motion.div>
          )}
          {displayed[2] && (
            <motion.div variants={item}>
              <BentoCard project={displayed[2]} />
            </motion.div>
          )}

          {/* Bottom row */}
          {displayed[3] && (
            <motion.div variants={item}>
              <BentoCard project={displayed[3]} />
            </motion.div>
          )}
          {displayed[4] && (
            <motion.div variants={item}>
              <BentoCard project={displayed[4]} />
            </motion.div>
          )}
          {displayed[5] && (
            <motion.div variants={item}>
              <BentoCard project={displayed[5]} />
            </motion.div>
          )}
        </motion.div>

        {/* CTA button — all screens */}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE_EXPO, delay: 0.45 }}
        >
          <Link
            href="/projects/"
            className="group inline-flex items-center gap-2.5 border border-[#111]/20 text-[#111] text-[13px] font-semibold px-7 py-3 rounded-full hover:bg-[#111] hover:text-white hover:border-[#111] active:scale-[0.98] transition-all no-underline"
          >
            Xem tất cả dự án
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

const cardVariants = {
  rest: {},
  hover: {},
};

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.08, transition: { duration: 0.7, ease: EASE_EXPO } },
};

const overlayVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.4 } },
};

// Title luôn hiện, chỉ rise-up nhẹ khi hover
const titleVariants = {
  rest: { y: 0 },
  hover: { y: -6, transition: { duration: 0.45, ease: EASE_EXPO } },
};

// Description + CTA ẩn khi rest, stagger rise-up khi hover
const descVariants = {
  rest: { y: 20, opacity: 0 },
  hover: { y: 0, opacity: 1, transition: { duration: 0.45, ease: EASE_EXPO, delay: 0.07 } },
};

const ctaVariants = {
  rest: { y: 16, opacity: 0 },
  hover: { y: 0, opacity: 1, transition: { duration: 0.4, ease: EASE_EXPO, delay: 0.15 } },
};

function BentoCard({ project, hero = false }: { project: Project; hero?: boolean }) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer ${hero ? "h-[460px] md:h-full min-h-[460px]" : "h-[220px]"}`}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <Link href={"/projects/" + project.slug} className="absolute inset-0 z-20" aria-label={project.name} />

      {/* Image */}
      {project.coverImage ? (
        <motion.div className="absolute inset-0" variants={imageVariants}>
          <Image
            src={project.coverImage}
            alt={project.name}
            fill
            sizes={hero ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover"
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 bg-gray-200" />
      )}

      {/* Persistent gradient — luôn hiện để title đọc được */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Hover overlay tối thêm — đủ contrast cho description */}
      <motion.div
        className="absolute inset-0 bg-black/40"
        variants={overlayVariants}
      />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 z-[2] overflow-hidden">
        {hero && (
          <p className="text-[#ff5901] text-[11px] font-semibold uppercase tracking-[0.18em] mb-2">
            Dự án tiêu biểu
          </p>
        )}

        {/* Title luôn visible */}
        <motion.h3
          className={`text-white font-semibold leading-snug line-clamp-2 ${hero ? "text-xl md:text-2xl" : "text-sm"}`}
          variants={titleVariants}
        >
          {project.name}
        </motion.h3>

        {/* Description — hidden at rest */}
        {project.description && (
          <motion.p
            className={`text-white/70 mt-2 line-clamp-3 ${hero ? "text-sm" : "text-xs"}`}
            variants={descVariants}
          >
            {project.description}
          </motion.p>
        )}

        {/* CTA — hidden at rest */}
        <motion.div
          className="flex items-center gap-1.5 mt-3 text-[#ff5901] text-xs font-semibold uppercase tracking-wider"
          variants={ctaVariants}
        >
          Xem dự án <ArrowRight className="w-3 h-3" />
        </motion.div>
      </div>
    </motion.div>
  );
}
