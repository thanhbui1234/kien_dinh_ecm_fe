'use client';
import { useTranslations } from 'next-intl';
interface FeaturesSectionProps {
  features: object;
}

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  const t = useTranslations();
  const entries = Object.entries(features).filter(([, v]) => v !== null && v !== undefined && v !== '');
  if (entries.length === 0) return null;

  return (
    <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-100">
      <h2 className="text-[20px] sm:text-[22px] font-light text-[#111] mb-6 sm:mb-8">Tính năng nổi bật</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {entries.map(([key, value]) => (
          <div key={key} className="flex gap-4 p-4 sm:p-5 rounded-xl bg-[#fafafa] border border-gray-100 hover:border-[#5e8dd1]/30 hover:bg-[#f8fafd] transition-all duration-200">
            <div className="shrink-0 w-7 h-7 rounded-full bg-[#5e8dd1]/10 flex items-center justify-center mt-0.5">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 4.5" stroke="#5e8dd1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#111] mb-0.5 m-0">{key}</p>
              <p className="text-[13px] text-gray-400 m-0 leading-snug">{String(value)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
