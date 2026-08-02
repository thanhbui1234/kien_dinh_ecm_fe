import { useEffect, useState } from 'react';
import { Globe, Loader2, Sparkles } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { toast } from '@/utils/toast';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS, projectKeys } from 'shared-api';
import { ENV } from '@/config/env';
import { translateProjectViToEnglish } from '@/utils/ai';

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
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslatingAi, setIsTranslatingAi] = useState(false);
  const [initialData, setInitialData] = useState<ProjectEnTranslationState | null>(null);

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

  const handleAiTranslate = async () => {
    const apiKey = ENV.GEMINI_API_KEY;
    if (!apiKey) {
      toast.error(null, 'Chưa cấu hình VITE_GEMINI_API_KEY trong file .env.local!');
      return;
    }

    try {
      setIsTranslatingAi(true);
      toast.info('AI đang dịch toàn bộ nội dung dự án sang Tiếng Anh...');
      const res = await translateProjectViToEnglish(apiKey, {
        name: viName || enTranslation.name,
        description: viDescription || enTranslation.description,
        contentDetail: viContentDetail || enTranslation.contentDetail,
      });

      setEnTranslation({
        name: res.name || enTranslation.name,
        slug: enTranslation.slug,
        description: res.description || enTranslation.description,
        contentDetail: res.contentDetail || enTranslation.contentDetail,
      });

      toast.success('Dịch tự động nội dung dự án bằng AI thành công!');
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

    try {
      setIsSaving(true);
      await axiosInstance.post(API_ENDPOINTS.PROJECTS.TRANSLATION(projectId), {
        lang: 'EN',
        name: enTranslation.name.trim(),
        description: enTranslation.description || undefined,
        contentDetail: enTranslation.contentDetail || undefined,
      });
      setInitialData(enTranslation);
      await queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      toast.success('Lưu bản dịch Tiếng Anh dự án thành công!');
    } catch {
      toast.error(null, 'Lưu bản dịch Tiếng Anh thất bại, vui lòng thử lại');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-600" />
          <h2 className="text-sm font-bold text-gray-900">Bản dịch Tiếng Anh (English Project Translation)</h2>
        </div>

        {/* AI Translate Button */}
        <button
          type="button"
          onClick={handleAiTranslate}
          disabled={isTranslatingAi}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          title="Dùng Gemini AI tự động dịch Tên dự án, Mô tả ngắn và Bài viết sang Tiếng Anh"
        >
          {isTranslatingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>🤖 Dịch Tiếng Anh bằng AI</span>
        </button>
      </div>

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
