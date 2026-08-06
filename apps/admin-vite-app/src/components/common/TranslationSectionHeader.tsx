import { Globe, Loader2, Sparkles, AlertTriangle } from 'lucide-react';

interface TranslationSectionHeaderProps {
  title: string;
  missingFields: string[];
  isTranslatingAi: boolean;
  onAiTranslate: () => Promise<void>;
  disableAiButton: boolean;
}

export function TranslationSectionHeader({
  title,
  missingFields,
  isTranslatingAi,
  onAiTranslate,
  disableAiButton,
}: TranslationSectionHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-600" />
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        </div>

        {/* AI Translate Button */}
        <button
          type="button"
          onClick={onAiTranslate}
          disabled={disableAiButton}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          title="Dùng Gemini AI tự động dịch các trường còn thiếu sang Tiếng Anh"
        >
          {isTranslatingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>🤖 Dịch Tiếng Anh bằng AI</span>
        </button>
      </div>

      {missingFields.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 mt-0">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Tiếng Anh đang thiếu bản dịch cho: {missingFields.join(', ')}.</span>
        </div>
      )}
    </>
  );
}
