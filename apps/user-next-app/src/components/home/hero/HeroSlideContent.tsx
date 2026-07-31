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
    <div className="absolute inset-0 flex flex-col justify-center items-start pt-16 pb-20 md:flex-row md:items-center md:justify-start md:pt-0 md:pb-0 px-6 md:px-[clamp(24px,5vw,72px)] max-w-[1440px] mx-auto z-10">
      <div className="w-[min(640px,100%)]">
        <h2
          className={`animate-[hero-rise_0.75s_cubic-bezier(0.22,1,0.36,1)_forwards] opacity-0 translate-y-5 text-[24px] sm:text-[32px] md:text-[clamp(32px,3.8vw,52px)] font-medium leading-[1.25] md:leading-[1.15] tracking-[-0.02em] text-balance ${isDark ? 'text-[#0a0a0a]' : 'text-white'}`}
          style={{ animationDelay: "0.12s" }}
        >
          {title}
          {subtitle && (
            <span
              className="block mt-2 md:mt-1.5 opacity-90 text-[17px] sm:text-[24px] md:text-[clamp(24px,2.8vw,38px)] font-normal leading-[1.25] md:leading-[1.2]"
            >
              {subtitle}
            </span>
          )}
        </h2>

        <div
          className="w-12 md:w-16 h-[2px] mt-4 md:mt-6 mb-4 md:mb-5 overflow-hidden relative opacity-0 animate-[hero-rise_0.75s_cubic-bezier(0.22,1,0.36,1)_forwards]"
          style={{ animationDelay: "0.24s" }}
        >
          <div
            className="absolute inset-0 bg-[#5e8dd1] origin-left scale-x-0 animate-[hero-underline_0.65s_cubic-bezier(0.22,1,0.36,1)_forwards]"
            style={{ animationDelay: "0.48s" }}
          />
        </div>

        <p
          className={`line-clamp-3 md:line-clamp-none text-[14px] md:text-[18px] font-normal leading-[1.6] md:leading-[1.65] max-w-[56ch] m-0 text-pretty opacity-0 translate-y-5 animate-[hero-rise_0.75s_cubic-bezier(0.22,1,0.36,1)_forwards] ${isDark ? 'text-[#0a0a0a]/70' : 'text-white/85'}`}
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
            className={`inline-flex items-center gap-2 md:gap-2.5 text-[13px] md:text-[15px] font-bold md:font-medium no-underline mt-5 md:mt-8 rounded-full bg-white text-[#0a0a0a] px-5 py-2.5 shadow-md md:rounded-none md:bg-transparent md:px-0 md:py-0 md:pb-1 md:border-b md:border-current transition-[gap] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:gap-4 ${isDark ? 'md:text-[#0a0a0a]' : 'md:text-white'}`}
          >
            <span>{linkText}</span>
            <ReadMoreArrow />
          </Link>
        </div>
      </div>
    </div>
  );
};
