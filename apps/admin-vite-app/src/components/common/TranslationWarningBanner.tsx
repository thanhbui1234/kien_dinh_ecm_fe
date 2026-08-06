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
  const isAllMissing = !hasEnTranslation || (activeMismatches.length > 0 && activeMismatches.every(m => m.enCount === 0));

  if (hasEnTranslation && activeMismatches.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-5 animate-in fade-in duration-150">
      {/* Missing English Translation Warning */}
      {isAllMissing ? (
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
      ) : activeMismatches.length > 0 ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-900 shadow-xs gap-3">
          {/* Mismatch Warning Banner (Combined) */}
          <div className="flex items-start sm:items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong>Cảnh báo:</strong>{' '}
              {activeMismatches.map((m, i) => (
                <span key={i}>
                  {m.enCount === 0 ? (
                    <>Chưa có bản dịch <strong>{m.label}</strong></>
                  ) : (
                    <>Lệch số lượng <strong>{m.label}</strong> ({m.enCount}/{m.viCount})</>
                  )}
                  {i < activeMismatches.length - 1 ? ', ' : ''}
                </span>
              ))}.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* {activeMismatches.map((item, idx) => item.onSync && (
              <button
                key={idx}
                type="button"
                onClick={item.onSync}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-bold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Đồng bộ {item.label}
              </button>
            ))} */}
            {activeTab !== 'EN' && (
              <button
                type="button"
                onClick={onSwitchToEnTab}
                className="text-xs font-bold text-purple-700 underline hover:text-purple-900 cursor-pointer ml-1"
              >
                Xem Tab Tiếng Anh
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
