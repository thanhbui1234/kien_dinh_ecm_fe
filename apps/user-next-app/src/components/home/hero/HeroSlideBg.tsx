import Image from 'next/image';

const HexagonBg = () => (
  <div className="absolute inset-0 bg-[#f2f2f2] overflow-hidden">
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0"
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

interface HeroSlideBgProps {
  type: "fullscreen" | "product";
  image: string;
  title: string;
  isFirst: boolean;
  darkText: boolean;
}

export const HeroSlideBg = ({ type, image, title, isFirst, darkText }: HeroSlideBgProps) => {
  if (type === "fullscreen") {
    return (
      <>
        <Image
          src={image}
          alt={title}
          fill
          priority={isFirst}
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Committed dark→transparent overlay for text legibility */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-gradient-to-r ${darkText ? 'from-white/80 via-white/45 to-transparent' : 'from-black/55 via-black/25 to-transparent'} via-50% to-80%`}
        />

        {/* Top scrim — mobile only. Headline anchors to the top there instead of the
            vertical center, so it needs its own legibility gradient regardless of photo. */}
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 h-2/5 md:hidden bg-gradient-to-b ${darkText ? 'from-white/70' : 'from-black/60'} to-transparent`}
        />
      </>
    );
  }

  return (
    <>
      {/* Hexagon texture doubles as the mobile backdrop, so a contained product shot
          never needs cropping or bare black bars — it's the same treatment desktop
          already uses for the uncovered left panel, just extended to the full frame. */}
      <HexagonBg />
      <div className="absolute inset-0 md:left-auto md:right-0 md:w-[58%]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain object-center md:object-right"
          sizes="(min-width: 768px) 60vw, 100vw"
        />
      </div>
    </>
  );
};
