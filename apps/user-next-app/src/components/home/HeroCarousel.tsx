"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

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

const slides: Slide[] = [
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
    title: "Đổi mới vì Trái Đất:",
    subtitle: "Ý tưởng toàn cầu, tác động cục bộ",
    description:
      'Chúng tôi sẽ đóng góp vào một xã hội bền vững bằng cách cân bằng giữa "sản xuất thân thiện với con người" và "sản xuất thân thiện với môi trường".',
    link: "/about-us/environment/",
    linkText: "Đọc thêm",
    darkText: true,
  },
  {
    type: "fullscreen",
    image: "/images/hero/automation.jpg",
    title: "Giải pháp tổng thể cho",
    subtitle: "hệ thống tự động hóa",
    description:
      "Chúng tôi cung cấp giải pháp trọn gói mọi thiết bị cần thiết cho tự động hóa, từ việc lựa chọn máy công cụ đến công nghệ gia công, đồ gá, phần mềm và thiết bị đo lường.",
    link: "/products/automation-machining/",
    linkText: "Hệ thống tự động hóa cho các trung tâm gia công",
  },
  {
    type: "product",
    image: "/images/hero/qte-series.jpg",
    title: "QTE series",
    description:
      "Trung tâm tiện CNC tốc độ cao, độ chính xác cao, tiết kiệm không gian",
    link: "/products/qte/",
    linkText: "Đọc thêm",
    darkText: true,
  },
  {
    type: "product",
    image: "/images/hero/qt-primos.jpg",
    title: "QT PRIMOS",
    description: "Trung tâm tiện CNC 2 trục nhỏ gọn, hiệu suất cao",
    link: "/products/qt-primos/",
    linkText: "Đọc thêm",
    darkText: true,
  },
];

const HexagonBg = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundColor: "#f0f0f0",
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
          <polygon
            points="60,2 112,32 112,72 60,102 8,72 8,32"
            fill="none"
            stroke="#d8d8d8"
            strokeWidth="1"
          />
          <polygon
            points="0,54 -52,84 -52,124 0,154 52,124 52,84"
            fill="none"
            stroke="#d8d8d8"
            strokeWidth="1"
          />
          <polygon
            points="120,54 68,84 68,124 120,154 172,124 172,84"
            fill="none"
            stroke="#d8d8d8"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexPattern)" />
    </svg>
  </div>
);

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [contentKey, setContentKey] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating || index === current) return;
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setContentKey((k) => k + 1);
        setIsAnimating(false);
        // Signal header to adapt text color for light/dark slides
        const slide = slides[index];
        document.dispatchEvent(
          new CustomEvent('hero-slide-change', { detail: { darkText: !!slide.darkText } })
        );
      }, 500);
    },
    [isAnimating, current]
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  return (
    <>
      <style>{`
        @keyframes contentFadeIn2 {
          0% { opacity: 0.2; }
          100% { opacity: 1; }
        }
        .hero-content-enter {
          animation: contentFadeIn2 0.4s ease-in forwards;
        }
        .hero-nav-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 89, 1, 0.75);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
          flex-shrink: 0;
        }
        .hero-nav-btn:hover {
          background: rgba(255, 89, 1, 1);
        }
        .hero-nav-btn-next {
          background: rgba(255, 89, 1, 0.75) !important;
        }
        .hero-nav-btn-next:hover {
          background: rgba(255, 89, 1, 1) !important;
        }
        .hero-readmore {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          text-decoration: none;
          margin-top: 20px;
          transition: opacity 0.2s;
        }
        .hero-readmore:hover {
          opacity: 0.7;
        }
      `}</style>
      <section
        style={{
          position: "relative",
          width: "100%",
          height: "720px",
          overflow: "hidden",
        }}
      >
        {/* Slides */}
        {slides.map((s, i) => {
          const active = i === current;
          const sTextColor = s.darkText ? "#000" : "#fff";
          const sIconColor = s.darkText ? "#000000" : "#ffffff";

          return (
            <div
              key={s.image}
              style={{
                position: "absolute",
                inset: 0,
                opacity: active && !isAnimating ? 1 : 0,
                transition: "opacity 0.5s ease",
                pointerEvents: active ? "auto" : "none",
              }}
            >
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
                  {!s.darkText && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                      }}
                    />
                  )}
                </>
              ) : (
                <>
                  <HexagonBg />
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      width: "55%",
                      height: "100%",
                    }}
                  >
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      style={{
                        objectFit: "contain",
                        objectPosition: "center right",
                      }}
                      sizes="55vw"
                    />
                  </div>
                </>
              )}

              {/* Text content — only rendered for active slide, key forces re-animation */}
              {active && (
                <div
                  key={contentKey}
                  className="hero-content-enter"
                  style={{
                    position: "absolute",
                    top: "360px",
                    left: "20px",
                    width: "calc(100% - 40px)",
                    maxWidth: "1280px",
                    zIndex: 10,
                    color: sTextColor,
                  }}
                >
                  {/* Title — 40px/400/52px line-height, 560px wide */}
                  <h2
                    style={{
                      fontSize: "40px",
                      fontWeight: 400,
                      lineHeight: "52px",
                      margin: 0,
                      width: "560px",
                      maxWidth: "100%",
                      color: "inherit",
                    }}
                  >
                    {s.title}
                    {s.subtitle && (
                      <>
                        <br />
                        {s.subtitle}
                      </>
                    )}
                  </h2>

                  {/* Orange underline — 64px × 4px */}
                  <div
                    style={{
                      width: "64px",
                      height: "4px",
                      backgroundColor: "#ff5901",
                      marginTop: "8px",
                      marginBottom: "20px",
                    }}
                  />

                  {/* Description — 16px/300/27.2px */}
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: 300,
                      lineHeight: "27.2px",
                      width: "540px",
                      maxWidth: "100%",
                      margin: 0,
                      color: "inherit",
                    }}
                  >
                    {s.description}
                  </p>

                  {/* "Đọc thêm" link with circle arrow SVG */}
                  <Link
                    href={s.link}
                    className="hero-readmore"
                    style={{ color: sTextColor }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="7"
                        stroke={sIconColor}
                        strokeWidth="1.5"
                      />
                      <path
                        d="M6.5 5L9.5 8L6.5 11"
                        stroke={sIconColor}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {s.linkText}
                  </Link>
                </div>
              )}
            </div>
          );
        })}

        {/* Bottom navigation — prev/dashes/next at bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            left: "20px",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <button
            onClick={goPrev}
            aria-label="Previous slide"
            className="hero-nav-btn"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3L5 8L10 13"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Dash indicators */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: "40px",
                  height: "4px",
                  border: "none",
                  borderRadius: "2px",
                  backgroundColor:
                    i === current ? "#ff5901" : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  padding: 0,
                  transition: "background-color 0.3s ease",
                }}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            aria-label="Next slide"
            className="hero-nav-btn hero-nav-btn-next"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 3L11 8L6 13"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>
    </>
  );
}
