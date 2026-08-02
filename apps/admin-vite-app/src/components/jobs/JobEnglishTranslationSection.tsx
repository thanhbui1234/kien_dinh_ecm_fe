import { useEffect, useState } from 'react';
import { Globe, Plus, Trash2, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { toast } from '@/utils/toast';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';

interface JobSectionItem {
  title: string;
  content: string;
}

export interface JobEnTranslationState {
  title: string;
  slug: string;
  salary: string;
  sections: JobSectionItem[];
}

interface JobEnglishTranslationSectionProps {
  isEdit: boolean;
  jobId?: string;
  enTranslation: JobEnTranslationState;
  setEnTranslation: React.Dispatch<React.SetStateAction<JobEnTranslationState>>;
  viSectionsCount: number;
  onSyncFromVi: () => void;
  onSwitchToViTab?: () => void;
}

const inputCls = "w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2";

export function JobEnglishTranslationSection({
  isEdit,
  jobId,
  enTranslation,
  setEnTranslation,
  viSectionsCount,
  onSyncFromVi,
  onSwitchToViTab,
}: JobEnglishTranslationSectionProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [initialData, setInitialData] = useState<JobEnTranslationState | null>(null);

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

  const enSectionsCount = enTranslation.sections.filter(s => s.title.trim() || s.content.trim()).length;
  const isSectionsMismatched = viSectionsCount > 0 && enSectionsCount !== viSectionsCount;

  const handleSave = async () => {
    if (!jobId || !enTranslation.title.trim()) {
      toast.error(null, 'Vui lòng nhập tiêu đề tuyển dụng bằng Tiếng Anh trước khi lưu');
      return;
    }

    try {
      setIsSaving(true);
      await axiosInstance.post(API_ENDPOINTS.JOBS.TRANSLATION(jobId), {
        lang: 'EN',
        title: enTranslation.title.trim(),
        salary: enTranslation.salary || undefined,
        sections: enTranslation.sections,
      });
      setInitialData(enTranslation);
      toast.success('Lưu bản dịch Tiếng Anh bài tuyển dụng thành công!');
    } catch {
      toast.error(null, 'Lưu bản dịch Tiếng Anh thất bại, vui lòng thử lại');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-600" />
          <h2 className="text-sm font-bold text-gray-900">Bản dịch Tiếng Anh (English Job Translation)</h2>
        </div>

        {/* Sync from VI Button */}
        {viSectionsCount > 0 && (
          <button
            type="button"
            onClick={onSyncFromVi}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Sao chép danh sách các mục từ Tiếng Việt sang để tiện dịch"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>⚡ Tải khung từ Tiếng Việt</span>
          </button>
        )}
      </div>

      {/* Mismatch Warning Banner */}
      {isSectionsMismatched && (
        <div className="flex items-center justify-between p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Cảnh báo lệch số lượng:</strong> Tiếng Anh hiện có <strong>{enSectionsCount}</strong> mục nội dung, nhưng Tiếng Việt gốc có <strong>{viSectionsCount}</strong> mục.
            </span>
          </div>
          <button
            type="button"
            onClick={onSyncFromVi}
            className="text-xs font-bold text-purple-700 underline hover:text-purple-900 cursor-pointer ml-3 shrink-0"
          >
            Đồng bộ ngay
          </button>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className={labelCls}>Vị trí tuyển dụng (Tiếng Anh) *</label>
          <input
            type="text"
            className={inputCls}
            placeholder="Ví dụ: Senior CNC Mechanical Engineer"
            value={enTranslation.title}
            onChange={(e) => setEnTranslation({ ...enTranslation, title: e.target.value })}
          />
        </div>

        <div>
          <label className={labelCls}>Mức lương (Tiếng Anh)</label>
          <input
            type="text"
            className={inputCls}
            placeholder="Ví dụ: Competitive / $1,500 - $2,000"
            value={enTranslation.salary}
            onChange={(e) => setEnTranslation({ ...enTranslation, salary: e.target.value })}
          />
        </div>

        {/* Dynamic Sections EN */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <label className={labelCls}>Các mục nội dung (Tiếng Anh)</label>
            <button
              type="button"
              onClick={() =>
                setEnTranslation({
                  ...enTranslation,
                  sections: [...enTranslation.sections, { title: '', content: '' }],
                })
              }
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm mục mới
            </button>
          </div>

          {enTranslation.sections.map((sec, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 space-y-3 relative">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Tiêu đề mục (VD: Job Description, Requirements...)"
                  className={inputCls}
                  value={sec.title}
                  onChange={(e) => {
                    const updated = [...enTranslation.sections];
                    updated[idx].title = e.target.value;
                    setEnTranslation({ ...enTranslation, sections: updated });
                  }}
                />
                {enTranslation.sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = enTranslation.sections.filter((_, i) => i !== idx);
                      setEnTranslation({ ...enTranslation, sections: updated });
                    }}
                    className="ml-2 p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors"
                    title="Xóa mục này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <RichTextEditor
                value={sec.content}
                onChange={(val) => {
                  const updated = [...enTranslation.sections];
                  updated[idx].content = val;
                  setEnTranslation({ ...enTranslation, sections: updated });
                }}
                placeholder="Nhập nội dung mô tả chi tiết bằng Tiếng Anh cho mục này..."
              />
            </div>
          ))}
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
