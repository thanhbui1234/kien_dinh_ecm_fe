import { useEffect, useState } from 'react';
import { toast } from '@/utils/toast';
import { useSaveCategoryTranslation } from '@/queries/categories';
import { ENV } from '@/config/env';
import { translateCategoryViToEnglish } from '@/utils/ai';
import { TranslationSectionHeader } from '@/components/common/TranslationSectionHeader';
import { TranslationSectionFooter } from '@/components/common/TranslationSectionFooter';

export interface CategoryEnTranslationState {
  name: string;
  slug: string;
}

interface CategoryEnglishTranslationSectionProps {
  isEdit: boolean;
  categoryId?: string;
  enTranslation: CategoryEnTranslationState;
  setEnTranslation: React.Dispatch<React.SetStateAction<CategoryEnTranslationState>>;
  viName?: string;
  onSwitchToViTab?: () => void;
}

const inputCls = "w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2";

export function CategoryEnglishTranslationSection({
  isEdit,
  categoryId,
  enTranslation,
  setEnTranslation,
  viName = '',
  onSwitchToViTab,
}: CategoryEnglishTranslationSectionProps) {
  const saveMutation = useSaveCategoryTranslation();
  const [isTranslatingAi, setIsTranslatingAi] = useState(false);
  const [initialData, setInitialData] = useState<CategoryEnTranslationState | null>(null);

  useEffect(() => {
    if (initialData === null) {
      setInitialData(enTranslation);
    }
  }, [enTranslation, initialData]);

  const checkIsDirty = () => {
    if (!initialData) return false;
    const normalize = (state: CategoryEnTranslationState) => ({
      name: state.name.trim(),
    });
    return JSON.stringify(normalize(enTranslation)) !== JSON.stringify(normalize(initialData));
  };

  const isDirty = checkIsDirty();

  const missingFields = [];
  if (viName?.trim() && !enTranslation.name.trim()) missingFields.push('Tên danh mục');

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

    saveMutation.mutate(
      { categoryId: categoryId!, lang: 'EN', name: enTranslation.name.trim() },
      {
        onSuccess: () => {
          const newSavedState = {
            name: enTranslation.name.trim(),
            slug: enTranslation.slug || '',
          };
          setInitialData(newSavedState);
          setEnTranslation(newSavedState);
          toast.success('Lưu bản dịch Tiếng Anh danh mục thành công!');
        },
        onError: () => {
          toast.error(null, 'Lưu bản dịch Tiếng Anh thất bại, vui lòng thử lại');
        },
      }
    );
  };

  const handleAiTranslate = async () => {
    const apiKey = ENV.GEMINI_API_KEY;
    if (!apiKey) {
      toast.error(null, 'Chưa cấu hình VITE_GEMINI_API_KEY trong file .env.local!');
      return;
    }
    try {
      setIsTranslatingAi(true);
      toast.info('AI đang dịch các trường còn thiếu sang Tiếng Anh...');
      
      const needsName = viName?.trim() && !enTranslation.name.trim();

      const res = await translateCategoryViToEnglish(apiKey, {
        name: needsName ? viName : '',
      });

      setEnTranslation({
        name: needsName ? (res.name || enTranslation.name) : enTranslation.name,
        slug: enTranslation.slug,
      });

      toast.success('Dịch tự động các trường còn thiếu bằng AI thành công!');
    } catch (err: any) {
      toast.error(null, err.message || 'Lỗi khi dịch bằng AI, vui lòng thử lại');
    } finally {
      setIsTranslatingAi(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
      <TranslationSectionHeader
        title="Bản dịch Tiếng Anh (English Category Translation)"
        missingFields={missingFields}
        isTranslatingAi={isTranslatingAi}
        onAiTranslate={handleAiTranslate}
        disableAiButton={isTranslatingAi || missingFields.length === 0 || isDirty}
      />

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

      <TranslationSectionFooter
        isEdit={isEdit}
        isDirty={isDirty}
        isSaving={saveMutation.isPending}
        onReset={handleReset}
        onSave={handleSave}
        onSwitchToViTab={onSwitchToViTab}
      />
    </div>
  );
}
