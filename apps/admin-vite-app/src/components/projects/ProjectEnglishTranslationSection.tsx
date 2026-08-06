import { useEffect, useState } from 'react';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { toast } from '@/utils/toast';
import { useSaveProjectTranslation } from '@/queries/projects';
import { ENV } from '@/config/env';
import { translateProjectViToEnglish } from '@/utils/ai';
import { TranslationSectionHeader } from '@/components/common/TranslationSectionHeader';
import { TranslationSectionFooter } from '@/components/common/TranslationSectionFooter';

export interface ProjectEnTranslationState {
  name: string;
  slug: string;
  description: string;
  contentDetail: string;
}

interface ProjectEnglishTranslationSectionProps {
  isEdit: boolean;
  projectId?: string;
  enTranslation: ProjectEnTranslationState;
  setEnTranslation: React.Dispatch<React.SetStateAction<ProjectEnTranslationState>>;
  viName?: string;
  viDescription?: string;
  viContentDetail?: string;
  onSwitchToViTab?: () => void;
}

const inputCls = "w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2";

export function ProjectEnglishTranslationSection({
  isEdit,
  projectId,
  enTranslation,
  setEnTranslation,
  viName = '',
  viDescription = '',
  viContentDetail = '',
  onSwitchToViTab,
}: ProjectEnglishTranslationSectionProps) {
  const saveMutation = useSaveProjectTranslation();
  const [isTranslatingAi, setIsTranslatingAi] = useState(false);
  const [initialData, setInitialData] = useState<ProjectEnTranslationState | null>(null);

  useEffect(() => {
    if (initialData === null) {
      setInitialData(enTranslation);
    }
  }, [enTranslation, initialData]);

  const checkIsDirty = () => {
    if (!initialData) return false;
    const normalize = (state: ProjectEnTranslationState) => ({
      name: state.name.trim(),
      description: state.description?.trim() || '',
      contentDetail: state.contentDetail?.trim() || '',
    });
    return JSON.stringify(normalize(enTranslation)) !== JSON.stringify(normalize(initialData));
  };

  const isDirty = checkIsDirty();

  const missingFields = [];
  if (viName?.trim() && !enTranslation.name.trim()) missingFields.push('Tên dự án');
  if (viDescription?.trim() && !enTranslation.description.trim()) missingFields.push('Mô tả ngắn');
  if (viContentDetail?.trim() && !enTranslation.contentDetail.trim()) missingFields.push('Bài viết mô tả');

  const handleReset = () => {
    if (initialData) {
      setEnTranslation(initialData);
      toast.info('Đã khôi phục dữ liệu bản dịch về ban đầu.');
    }
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
      const needsDescription = viDescription?.trim() && !enTranslation.description.trim();
      const needsContent = viContentDetail?.trim() && !enTranslation.contentDetail.trim();

      const res = await translateProjectViToEnglish(apiKey, {
        name: needsName ? viName : '',
        description: needsDescription ? viDescription : '',
        contentDetail: needsContent ? viContentDetail : '',
      });

      setEnTranslation({
        name: needsName ? (res.name || enTranslation.name) : enTranslation.name,
        slug: enTranslation.slug,
        description: needsDescription ? (res.description || enTranslation.description) : enTranslation.description,
        contentDetail: needsContent ? (res.contentDetail || enTranslation.contentDetail) : enTranslation.contentDetail,
      });

      toast.success('Dịch tự động các trường còn thiếu bằng AI thành công!');
    } catch (err: any) {
      toast.error(null, err.message || 'Lỗi khi dịch bằng AI, vui lòng thử lại');
    } finally {
      setIsTranslatingAi(false);
    }
  };

  const handleSave = async () => {
    if (!projectId || !enTranslation.name.trim()) {
      toast.error(null, 'Vui lòng nhập tên dự án bằng Tiếng Anh trước khi lưu');
      return;
    }

    saveMutation.mutate(
      {
        projectId: projectId!,
        lang: 'EN',
        name: enTranslation.name.trim(),
        description: enTranslation.description?.trim() || undefined,
        contentDetail: enTranslation.contentDetail?.trim() || undefined,
      },
      {
        onSuccess: () => {
          const newSavedState = {
            name: enTranslation.name.trim(),
            slug: enTranslation.slug || '',
            description: enTranslation.description?.trim() || '',
            contentDetail: enTranslation.contentDetail?.trim() || '',
          };
          setInitialData(newSavedState);
          setEnTranslation(newSavedState);
          toast.success('Lưu bản dịch Tiếng Anh dự án thành công!');
        },
        onError: () => {
          toast.error(null, 'Lưu bản dịch Tiếng Anh thất bại, vui lòng thử lại');
        },
      }
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
      <TranslationSectionHeader
        title="Bản dịch Tiếng Anh (English Project Translation)"
        missingFields={missingFields}
        isTranslatingAi={isTranslatingAi}
        onAiTranslate={handleAiTranslate}
        disableAiButton={isTranslatingAi || missingFields.length === 0 || isDirty}
      />

      <div className="space-y-5">
        <div>
          <label className={labelCls}>Tên dự án (Tiếng Anh) *</label>
          <input
            type="text"
            className={inputCls}
            placeholder="Ví dụ: Factory Automation Project 2026"
            value={enTranslation.name}
            onChange={(e) => setEnTranslation({ ...enTranslation, name: e.target.value })}
          />
        </div>

        <div>
          <label className={labelCls}>Mô tả ngắn (Tiếng Anh)</label>
          <textarea
            rows={3}
            className="w-full p-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm"
            placeholder="Tóm tắt nội dung chính của dự án bằng Tiếng Anh..."
            value={enTranslation.description}
            onChange={(e) => setEnTranslation({ ...enTranslation, description: e.target.value })}
          />
        </div>

        <div className="space-y-2 pt-2">
          <label className={labelCls}>Bài viết giới thiệu chi tiết dự án (Tiếng Anh)</label>
          <RichTextEditor
            value={enTranslation.contentDetail}
            onChange={(val) => setEnTranslation({ ...enTranslation, contentDetail: val })}
            placeholder="Nhập nội dung mô tả dự án chi tiết bằng Tiếng Anh..."
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
