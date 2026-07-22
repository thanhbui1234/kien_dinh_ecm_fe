import Link from 'next/link';
import { ReadMoreArrow } from '@/components/icons';

interface HeroSlideContentProps {
  title: string;
  subtitle?: string;
  description: string;
  link: string;
  linkText: string;
  isDark: boolean;
}

export const HeroSlideContent = ({
  title,
  subtitle,
  description,
  link,
  linkText,
  isDark,
}: HeroSlideContentProps) => {
  return (
    <div className="absolute inset-0 flex items-center px-[clamp(24px,5vw,72px)] max-w-[1440px] mx-auto z-10">
      <div className="w-[min(640px,100%)]">
        <h2
          className={`animate-[hero-rise_0.75s_cubic-bezier(0.22,1,0.36,1)_forwards] opacity-0 translate-y-5 text-[clamp(32px,3.8vw,52px)] font-medium leading-[1.15] tracking-[-0.02em] text-balance ${isDark ? 'text-[#0a0a0a]' : 'text-white'}`}
          style={{ animationDelay: "0.12s" }}
        >
          {title}
          {subtitle && (
            <span
              className="block mt-1.5 opacity-90 text-[clamp(24px,2.8vw,38px)] font-normal leading-[1.2]"
            >
              {subtitle}
            </span>
          )}
        </h2>

        <div
          className="w-16 h-[2px] mt-6 mb-5 overflow-hidden relative opacity-0 animate-[hero-rise_0.75s_cubic-bezier(0.22,1,0.36,1)_forwards]"
          style={{ animationDelay: "0.24s" }}
        >
          <div
            className="absolute inset-0 bg-[#5e8dd1] origin-left scale-x-0 animate-[hero-underline_0.65s_cubic-bezier(0.22,1,0.36,1)_forwards]"
            style={{ animationDelay: "0.48s" }} // Delay 0.24s (from rise) + 0.24s = 0.48s
          />
        </div>

        <p
          className={`text-[18px] font-normal leading-[1.65] max-w-[56ch] m-0 text-pretty opacity-0 translate-y-5 animate-[hero-rise_0.75s_cubic-bezier(0.22,1,0.36,1)_forwards] ${isDark ? 'text-[#0a0a0a]/70' : 'text-white/85'}`}
          style={{ animationDelay: "0.36s" }}
        >
          {description}
        </p>

        <div
          className="opacity-0 translate-y-5 animate-[hero-rise_0.75s_cubic-bezier(0.22,1,0.36,1)_forwards]"
          style={{ animationDelay: "0.48s" }}
        >
          <Link
            href={link}
            className={`inline-flex items-center gap-2.5 text-[15px] font-medium no-underline pb-1 border-b border-current mt-8 transition-[gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-4 ${isDark ? 'text-[#0a0a0a]' : 'text-white'}`}
          >
            <span>{linkText}</span>
            <ReadMoreArrow />
          </Link>
        </div>
      </div>
    </div>
  );
};
