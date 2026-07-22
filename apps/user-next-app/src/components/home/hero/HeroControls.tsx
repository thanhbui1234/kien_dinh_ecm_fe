import { ArrowLeft, ArrowRight } from '@/components/icons';
import { AUTO_ADVANCE_MS } from '@/constants/hero';

interface HeroControlsProps {
  current: number;
  total: number;
  goPrev: () => void;
  goNext: () => void;
  goTo: (index: number) => void;
  isDark: boolean;
}

export const HeroControls = ({
  current,
  total,
  goPrev,
  goNext,
  goTo,
  isDark,
}: HeroControlsProps) => {
  return (
    <div className="absolute bottom-[clamp(40px,6vh,80px)] left-0 right-0 z-20 px-[clamp(24px,5vw,72px)] max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between gap-6 max-[900px]:gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              aria-label="Slide trước"
              className="w-14 h-14 max-[900px]:w-12 max-[900px]:h-12 rounded-full border-none bg-[#5e8dd1] text-white cursor-pointer inline-flex items-center justify-center shrink-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#356098] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5e8dd1] focus-visible:outline-offset-2"
            >
              <ArrowLeft />
            </button>
            <button
              onClick={goNext}
              aria-label="Slide kế tiếp"
              className="w-14 h-14 max-[900px]:w-12 max-[900px]:h-12 rounded-full border-none bg-[#5e8dd1] text-white cursor-pointer inline-flex items-center justify-center shrink-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#356098] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5e8dd1] focus-visible:outline-offset-2"
            >
              <ArrowRight />
            </button>
          </div>

          <div role="tablist" aria-label="Slide indicators" className="flex items-center gap-2">
            {Array.from({ length: total }).map((_, i) => {
              const active = i === current;
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  role="tab"
                  aria-selected={active}
                  aria-label={`Slide ${i + 1}`}
                  className="relative w-16 max-[900px]:w-10 h-[2px] hover:h-[3px] border-none p-0 cursor-pointer overflow-hidden transition-[height] duration-200"
                >
                  <span
                    className={`absolute inset-0 ${isDark ? 'bg-[#0a0a0a]/20' : 'bg-white/30'}`}
                  />
                  <span
                    key={`fill-${i}-${current}`}
                    className={`absolute inset-0 bg-[#5e8dd1] origin-left ${active ? 'hero-progress-bar' : 'scale-x-0'}`}
                    style={{ animationDuration: `${AUTO_ADVANCE_MS}ms` }}
                    data-active={active}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`font-mono text-[13px] tracking-[0.08em] select-none tabular-nums ${isDark ? 'text-[#0a0a0a]/70' : 'text-white/85'}`}
          aria-live="polite"
        >
          <span className={`font-medium ${isDark ? 'text-[#0a0a0a]' : 'text-white'}`}>
            {String(current + 1).padStart(2, "0")}
          </span>
          <span className="mx-1.5 opacity-50">/</span>
          <span>{String(total).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
};
