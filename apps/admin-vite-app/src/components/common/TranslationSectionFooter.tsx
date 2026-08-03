import { Loader2 } from 'lucide-react';

interface TranslationSectionFooterProps {
  isEdit: boolean;
  isDirty: boolean;
  isSaving: boolean;
  onReset: () => void;
  onSave: () => Promise<void>;
  onSwitchToViTab?: () => void;
}

export function TranslationSectionFooter({
  isEdit,
  isDirty,
  isSaving,
  onReset,
  onSave,
  onSwitchToViTab,
}: TranslationSectionFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
      {isEdit ? (
        <>
          {isDirty && (
            <button
              type="button"
              onClick={onReset}
              disabled={isSaving}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy thay đổi
            </button>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || !isDirty}
            className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Lưu bản dịch Tiếng Anh
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={onSwitchToViTab}
          className="flex items-center gap-2 px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs cursor-pointer"
        >
          Xác nhận & Quay lại Tab Tiếng Việt để Tạo mới
        </button>
      )}
    </div>
  );
}
