"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Banner } from "shared-api";

interface Slide {
  type: "fullscreen" | "product";
  image: string;
  title: string;
  subtitle?: string;
  description: string;
  link: string;
  linkText: string;
  darkText?: boolean;
}

const defaultSlides: Slide[] = [
  {
    type: "fullscreen",
    image: "/images/hero/integrex-i-neo.jpg",
    title: "DONE IN ONE",
    subtitle: "INTEGREX i NEO series",
    description:
      "Máy đa năng tích hợp nhiều quy trình như tiện, phay, mài và đo lường chi tiết gia công.",
    link: "/products/integrex-i-neo/",
    linkText: "Đọc thêm",
  },
  {
    type: "fullscreen",
    image: "/images/hero/go-green.jpg",
    title: "Đổi mới vì Trái Đất",
    subtitle: "Ý tưởng toàn cầu, tác động cục bộ",
    description:
      "Chúng tôi đóng góp vào một xã hội bền vững bằng cách cân bằng giữa sản xuất thân thiện với con người và với môi trường.",
    link: "/about-us/environment/",
    linkText: "Đọc thêm",
    darkText: true,
  },
  {
    type: "fullscreen",
    image: "/images/hero/automation.jpg",
    title: "Giải pháp tổng thể",
    subtitle: "cho hệ thống tự động hóa",
    description:
      "Giải pháp trọn gói mọi thiết bị cần thiết cho tự động hóa: máy công cụ, công nghệ gia công, đồ gá, phần mềm và thiết bị đo lường.",
    link: "/products/automation-machining/",
    linkText: "Xem hệ thống tự động hóa",
  },
  {
    type: "product",
    image: "/images/hero/qte-series.jpg",
    title: "QTE series",
    description:
      "Trung tâm tiện CNC tốc độ cao, độ chính xác cao, tiết kiệm không gian.",
    link: "/products/qte/",
    linkText: "Đọc thêm",
    darkText: true,
  },
  {
    type: "product",
    image: "/images/hero/qt-primos.jpg",
    title: "QT PRIMOS",
    description: "Trung tâm tiện CNC 2 trục nhỏ gọn, hiệu suất cao.",
    link: "/products/qt-primos/",
    linkText: "Đọc thêm",
    darkText: true,
  },
];

const AUTO_ADVANCE_MS = 6500;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const HexagonBg = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundColor: "#f2f2f2",
      overflow: "hidden",
    }}
  >
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <pattern
          id="hexPattern"
          x="0"
          y="0"
          width="120"
          height="104"
          patternUnits="userSpaceOnUse"
        >
          <polygon points="60,2 112,32 112,72 60,102 8,72 8,32" fill="none" stroke="#dadada" strokeWidth="1" />
          <polygon points="0,54 -52,84 -52,124 0,154 52,124 52,84" fill="none" stroke="#dadada" strokeWidth="1" />
          <polygon points="120,54 68,84 68,124 120,154 172,124 172,84" fill="none" stroke="#dadada" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexPattern)" />
    </svg>
  </div>
);

const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ReadMoreArrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function HeroCarousel({ banners }: { banners?: Banner[] | null }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const displaySlides: Slide[] = useMemo(() => {
    return banners && banners.length > 0
      ? banners.map((b) => ({
          type: "fullscreen",
          image: b.imageUrl,
          title: b.title || "",
          description: b.description || "",
          link: b.link || "#",
          linkText: "Đọc thêm",
          darkText: false,
        }))
      : defaultSlides;
  }, [banners]);

  const goTo = useCallback((index: number) => {
    setCurrent((c) => {
      if (index === c) return c;
      const slide = displaySlides[index];
      document.dispatchEvent(
        new CustomEvent("hero-slide-change", { detail: { darkText: !!slide.darkText } })
      );
      return index;
    });
  }, [displaySlides]);

  const goNext = useCallback(() => goTo((current + 1) % displaySlides.length), [current, goTo, displaySlides]);
  const goPrev = useCallback(() => goTo((current - 1 + displaySlides.length) % displaySlides.length), [current, goTo, displaySlides]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % displaySlides.length;
        const slide = displaySlides[next];
        document.dispatchEvent(
          new CustomEvent("hero-slide-change", { detail: { darkText: !!slide.darkText } })
        );
        return next;
      });
    }, AUTO_ADVANCE_MS);
  }, [displaySlides]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer, current]);

  const activeSlide = displaySlides[current] || displaySlides[0];
  const isDark = !!activeSlide.darkText;
  const ink = isDark ? "#0a0a0a" : "#ffffff";
  const inkMuted = isDark ? "rgba(10,10,10,0.72)" : "rgba(255,255,255,0.85)";
  const dashInactive = isDark ? "rgba(10,10,10,0.18)" : "rgba(255,255,255,0.28)";

  return (
    <>
      <style>{`
        @keyframes hero-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes hero-rise {
          0% { opacity: 0; transform: translate3d(0, 20px, 0); }
          100% { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes hero-underline {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes hero-progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }

        .hero-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.8s ${EASE};
          will-change: opacity;
          pointer-events: none;
        }
        .hero-slide[data-active="true"] {
          opacity: 1;
          pointer-events: auto;
        }

        .hero-content-item {
          opacity: 0;
          transform: translate3d(0, 20px, 0);
          animation: hero-rise 0.75s ${EASE} forwards;
          will-change: opacity, transform;
        }
        .hero-content-item-1 { animation-delay: 0.12s; }
        .hero-content-item-2 { animation-delay: 0.24s; }
        .hero-content-item-3 { animation-delay: 0.36s; }
        .hero-content-item-4 { animation-delay: 0.48s; }

        .hero-underline {
          transform-origin: left center;
          transform: scaleX(0);
          animation: hero-underline 0.65s 0.24s ${EASE} forwards;
        }

        /* Nav buttons — solid orange, single committed style (no glass, no border+shadow combo) */
        .hero-nav-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: none;
          background: #ff5901;
          color: #ffffff;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.35s ${EASE},
                      transform 0.35s ${EASE};
          flex-shrink: 0;
        }
        .hero-nav-btn:hover {
          background: #e04d00;
          transform: translateY(-2px);
        }
        .hero-nav-btn:active { transform: translateY(0) scale(0.96); }
        .hero-nav-btn:focus-visible {
          outline: 2px solid #ff5901;
          outline-offset: 3px;
        }

        /* Dash — solid track, functional progress fill on active */
        .hero-dash {
          position: relative;
          width: 64px;
          height: 2px;
          border: none;
          padding: 0;
          cursor: pointer;
          overflow: hidden;
          transition: height 0.25s ${EASE};
        }
        .hero-dash:hover { height: 3px; }
        .hero-dash-track {
          position: absolute;
          inset: 0;
        }
        .hero-dash-fill {
          position: absolute;
          inset: 0;
          background: #ff5901;
          transform-origin: left center;
          transform: scaleX(0);
        }
        .hero-dash-fill[data-active="true"] {
          animation: hero-progress ${AUTO_ADVANCE_MS}ms linear forwards;
        }

        .hero-counter {
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
          font-size: 13px;
          letter-spacing: 0.08em;
          font-variant-numeric: tabular-nums;
          user-select: none;
        }

        .hero-readmore {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          padding-bottom: 4px;
          border-bottom: 1px solid currentColor;
          transition: gap 0.35s ${EASE};
          margin-top: 32px;
        }
        .hero-readmore:hover { gap: 16px; }

        @media (max-width: 900px) {
          .hero-nav-btn { width: 48px; height: 48px; }
          .hero-dash { width: 40px !important; }
          .hero-controls-inner { gap: 16px !important; }
          .hero-content-wrap { padding: 0 24px !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-slide { transition: opacity 0.15s linear; }
          .hero-content-item {
            animation: hero-fade 0.2s ease forwards;
            transform: none;
          }
          .hero-underline {
            animation: hero-fade 0.2s ease forwards;
            transform: scaleX(1);
          }
          .hero-dash-fill[data-active="true"] {
            animation: none;
            transform: scaleX(1);
          }
          .hero-nav-btn:hover { transform: none; }
        }
      `}</style>

      <section
        aria-label="Hero carousel"
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          minHeight: "720px",
          maxHeight: "1080px",
          overflow: "hidden",
          backgroundColor: "#0a0a0a",
        }}
      >
        {displaySlides.map((s, i) => {
          const active = i === current;
          return (
            <div key={s.image} className="hero-slide" data-active={active} aria-hidden={!active}>
              {/* Background layer */}
              {s.type === "fullscreen" ? (
                <>
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    priority={i === 0}
                    style={{ objectFit: "cover" }}
                    sizes="100vw"
                  />
                  {/* Committed dark→transparent overlay for text legibility */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: s.darkText
                        ? "linear-gradient(90deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0) 75%)"
                        : "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 80%)",
                    }}
                  />
                </>
              ) : (
                <>
                  <HexagonBg />
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      width: "58%",
                      height: "100%",
                    }}
                  >
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      style={{ objectFit: "contain", objectPosition: "center right" }}
                      sizes="60vw"
                    />
                  </div>
                </>
              )}

              {/* Content — only rendered for active slide so stagger animation replays cleanly */}
              {active && (
                <div
                  className="hero-content-wrap"
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 clamp(24px, 5vw, 72px)",
                    maxWidth: "1440px",
                    margin: "0 auto",
                    zIndex: 10,
                  }}
                >
                  <div style={{ width: "min(640px, 100%)" }}>
                    <h2
                      className="hero-content-item hero-content-item-1"
                      style={{
                        fontSize: "clamp(28px, 3.4vw, 46px)",
                        fontWeight: 500,
                        lineHeight: 1.15,
                        letterSpacing: "-0.02em",
                        margin: 0,
                        color: ink,
                        textWrap: "balance",
                      }}
                    >
                      {s.title}
                      {s.subtitle && (
                        <span
                          style={{
                            display: "block",
                            marginTop: "6px",
                            fontSize: "clamp(22px, 2.5vw, 34px)",
                            fontWeight: 400,
                            lineHeight: 1.2,
                            opacity: 0.92,
                          }}
                        >
                          {s.subtitle}
                        </span>
                      )}
                    </h2>

                    <div
                      className="hero-content-item hero-content-item-2"
                      style={{
                        width: "64px",
                        height: "2px",
                        marginTop: "24px",
                        marginBottom: "22px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <div
                        className="hero-underline"
                        style={{ position: "absolute", inset: 0, backgroundColor: "#ff5901" }}
                      />
                    </div>

                    <p
                      className="hero-content-item hero-content-item-3"
                      style={{
                        fontSize: "15px",
                        fontWeight: 400,
                        lineHeight: 1.65,
                        maxWidth: "56ch",
                        margin: 0,
                        color: inkMuted,
                        textWrap: "pretty",
                      }}
                    >
                      {s.description}
                    </p>

                    <div className="hero-content-item hero-content-item-4">
                      <Link href={s.link} className="hero-readmore" style={{ color: ink }}>
                        <span>{s.linkText}</span>
                        <ReadMoreArrow />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Controls — buttons + progressive dashes (left), slide counter (right) */}
        <div
          style={{
            position: "absolute",
            bottom: "clamp(40px, 6vh, 80px)",
            left: 0,
            right: 0,
            zIndex: 20,
            padding: "0 clamp(24px, 5vw, 72px)",
            maxWidth: "1440px",
            margin: "0 auto",
          }}
        >
          <div
            className="hero-controls-inner"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={goPrev}
                  aria-label="Slide trước"
                  className="hero-nav-btn"
                >
                  <ArrowLeft />
                </button>
                <button
                  onClick={goNext}
                  aria-label="Slide kế tiếp"
                  className="hero-nav-btn"
                >
                  <ArrowRight />
                </button>
              </div>

              <div
                role="tablist"
                aria-label="Slide indicators"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {displaySlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    role="tab"
                    aria-selected={i === current}
                    aria-label={`Slide ${i + 1}`}
                    className="hero-dash"
                  >
                    <span
                      className="hero-dash-track"
                      style={{ backgroundColor: dashInactive }}
                    />
                    <span
                      key={`fill-${i}-${current}`}
                      className="hero-dash-fill"
                      data-active={i === current}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="hero-counter" style={{ color: inkMuted }} aria-live="polite">
              <span style={{ color: ink, fontWeight: 500 }}>
                {String(current + 1).padStart(2, "0")}
              </span>
              <span style={{ margin: "0 6px", opacity: 0.5 }}>/</span>
              <span>{String(displaySlides.length).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
