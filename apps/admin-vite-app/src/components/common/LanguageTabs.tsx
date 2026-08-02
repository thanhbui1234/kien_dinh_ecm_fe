import { Globe } from 'lucide-react';

interface LanguageTabsProps {
  activeTab: 'VI' | 'EN';
  onTabChange: (tab: 'VI' | 'EN') => void;
  hasEnTranslation?: boolean;
}

export function LanguageTabs({ activeTab, onTabChange, hasEnTranslation }: LanguageTabsProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-gray-100/80 rounded-lg w-fit border border-gray-200 mb-6">
      <button
        type="button"
        onClick={() => onTabChange('VI')}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
          activeTab === 'VI'
            ? 'bg-white text-black shadow-xs border border-gray-200'
            : 'text-gray-600 hover:text-black hover:bg-gray-200/50'
        }`}
      >
        <span>🇻🇳 Tiếng Việt (Gốc)</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('EN')}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer relative ${
          activeTab === 'EN'
            ? 'bg-white text-purple-700 shadow-xs border border-purple-200'
            : 'text-gray-600 hover:text-black hover:bg-gray-200/50'
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-purple-600" />
        <span>🇬🇧 English Translation</span>
        {hasEnTranslation && (
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Đã có bản dịch Tiếng Anh" />
        )}
      </button>
    </div>
  );
}
