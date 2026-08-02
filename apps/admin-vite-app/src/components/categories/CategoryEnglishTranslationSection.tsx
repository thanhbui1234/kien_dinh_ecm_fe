import { useEffect, useState } from 'react';
import { Globe, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/utils/toast';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS, categoryKeys } from 'shared-api';

export interface CategoryEnTranslationState {
  name: string;
  slug: string;
}

interface CategoryEnglishTranslationSectionProps {
  isEdit: boolean;
  categoryId?: string;
  enTranslation: CategoryEnTranslationState;
  setEnTranslation: React.Dispatch<React.SetStateAction<CategoryEnTranslationState>>;
  onSwitchToViTab?: () => void;
}

const inputCls = "w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2";

export function CategoryEnglishTranslationSection({
  isEdit,
  categoryId,
  enTranslation,
  setEnTranslation,
  onSwitchToViTab,
}: CategoryEnglishTranslationSectionProps) {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [initialData, setInitialData] = useState<CategoryEnTranslationState | null>(null);

  useEffect(() => {
    if (initialData === null) {
      setInitialData(enTranslation);
    }
  }, [enTranslation, initialData]);

  const isDirty = initialData ? JSON.stringify(enTranslation) !== JSON.stringify(initialData) : false;

  const handleReset = () => {
    if (initialData) {
      setEnTranslation(initialData);
      toast.info('Đã khôi phục dữ liệu bản dịch về ban đầu.');
    }
  };

  const handleSave = async () => {
    if (!categoryId || !enTranslation.name.trim()) {
      toast.error(null, 'Vui lòng nhập tên danh mục bằng Tiếng Anh trước khi lưu');
      return;
    }

    try {
      setIsSaving(true);
      await axiosInstance.post(API_ENDPOINTS.CATEGORIES.TRANSLATION(categoryId), {
        lang: 'EN',
        name: enTranslation.name.trim(),
      });
      setInitialData(enTranslation);
      if (categoryKeys?.detail) {
        await queryClient.invalidateQueries({ queryKey: categoryKeys.detail(categoryId) });
      }
      toast.success('Lưu bản dịch Tiếng Anh danh mục thành công!');
    } catch {
      toast.error(null, 'Lưu bản dịch Tiếng Anh thất bại, vui lòng thử lại');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <Globe className="w-4 h-4 text-purple-600" />
        <h2 className="text-sm font-bold text-gray-900">Bản dịch Tiếng Anh (English Category Translation)</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelCls}>Tên danh mục (Tiếng Anh) *</label>
          <input
            type="text"
            className={inputCls}
            placeholder="Ví dụ: CNC Milling Machines"
            value={enTranslation.name}
            onChange={(e) => setEnTranslation({ ...enTranslation, name: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        {isEdit ? (
          <>
            {isDirty && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Hủy thay đổi
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
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
    </div>
  );
}
