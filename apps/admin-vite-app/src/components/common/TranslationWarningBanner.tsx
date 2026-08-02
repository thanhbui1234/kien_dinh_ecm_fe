import { AlertTriangle, Globe, RefreshCw } from 'lucide-react';

interface TranslationWarningBannerProps {
  hasEnTranslation: boolean;
  activeTab: 'VI' | 'EN';
  onSwitchToEnTab: () => void;
  mismatches?: {
    label: string;
    viCount: number;
    enCount: number;
    onSync?: () => void;
  }[];
}

export function TranslationWarningBanner({
  hasEnTranslation,
  activeTab,
  onSwitchToEnTab,
  mismatches = [],
}: TranslationWarningBannerProps) {
  const activeMismatches = mismatches.filter(m => m.viCount > 0 && m.enCount !== m.viCount);

  if (hasEnTranslation && activeMismatches.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-5 animate-in fade-in duration-150">
      {/* Missing English Translation Warning */}
      {!hasEnTranslation && (
        <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-xl text-xs font-medium text-purple-900 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-purple-600 shrink-0" />
            <span>
              <strong>Chưa có bản dịch Tiếng Anh:</strong> Sản phẩm / Mục này hiện chưa có nội dung hiển thị cho người dùng phiên bản Tiếng Anh.
            </span>
          </div>
          {activeTab !== 'EN' && (
            <button
              type="button"
              onClick={onSwitchToEnTab}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shrink-0 ml-3 shadow-2xs"
            >
              🇬🇧 Tạo bản dịch ngay
            </button>
          )}
        </div>
      )}

      {/* Mismatch Warning Banners */}
      {activeMismatches.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-900 shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Cảnh báo lệch {item.label}:</strong> Tiếng Anh hiện có <strong>{item.enCount}</strong> {item.label}, nhưng Tiếng Việt gốc có <strong>{item.viCount}</strong> {item.label}.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            {item.onSync && (
              <button
                type="button"
                onClick={item.onSync}
                className="flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-bold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Đồng bộ ngay
              </button>
            )}
            {activeTab !== 'EN' && (
              <button
                type="button"
                onClick={onSwitchToEnTab}
                className="text-xs font-bold text-purple-700 underline hover:text-purple-900 cursor-pointer"
              >
                Xem Tab Tiếng Anh
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
