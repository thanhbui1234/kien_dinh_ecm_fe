import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { toast } from '@/utils/toast';
import { useSaveJobTranslation } from '@/queries/jobs';
import { ENV } from '@/config/env';
import { translateJobViToEnglish } from '@/utils/ai';
import { TranslationSectionHeader } from '@/components/common/TranslationSectionHeader';
import { TranslationSectionFooter } from '@/components/common/TranslationSectionFooter';

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
  viTitle?: string;
  viSalary?: string;
  viSections?: any[];
  onSwitchToViTab?: () => void;
}

const inputCls = "w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2";

export function JobEnglishTranslationSection({
  isEdit,
  jobId,
  enTranslation,
  setEnTranslation,
  viTitle = '',
  viSalary = '',
  viSections = [],
  onSwitchToViTab,
}: JobEnglishTranslationSectionProps) {
  const saveMutation = useSaveJobTranslation();
  const [isTranslatingAi, setIsTranslatingAi] = useState(false);
  const [initialData, setInitialData] = useState<JobEnTranslationState | null>(null);

  useEffect(() => {
    if (initialData === null) {
      setInitialData(enTranslation);
    }
  }, [enTranslation, initialData]);

  const checkIsDirty = () => {
    if (!initialData) return false;
    const normalize = (state: JobEnTranslationState) => ({
      title: state.title.trim(),
      salary: state.salary?.trim() || '',
      sections: state.sections.filter(s => s.title.trim() || s.content.trim()).map(s => ({ title: s.title.trim(), content: s.content.trim() }))
    });
    return JSON.stringify(normalize(enTranslation)) !== JSON.stringify(normalize(initialData));
  };

  const isDirty = checkIsDirty();

  const missingFields = [];
  if (viTitle?.trim() && !enTranslation.title.trim()) missingFields.push('Tiêu đề');
  if (viSalary?.trim() && !enTranslation.salary.trim()) missingFields.push('Mức lương');
  const enSectionsCount = enTranslation.sections.filter(s => s.title.trim() || s.content.trim()).length;
  if (viSections.length > 0 && enSectionsCount < viSections.length) missingFields.push(`Mục nội dung (${enSectionsCount}/${viSections.length})`);

  const handleReset = () => {
    if (initialData) {
      setEnTranslation(initialData);
      toast.info('Đã khôi phục dữ liệu bản dịch về ban đầu.');
    }
  };

  const handleSave = async () => {
    if (!jobId || !enTranslation.title.trim()) {
      toast.error(null, 'Vui lòng nhập tiêu đề tuyển dụng bằng Tiếng Anh trước khi lưu');
      return;
    }

    saveMutation.mutate(
      {
        jobId: jobId!,
        lang: 'EN',
        title: enTranslation.title.trim(),
        salary: enTranslation.salary?.trim() || undefined,
        sections: enTranslation.sections,
      },
      {
        onSuccess: () => {
          const newSavedState = {
            title: enTranslation.title.trim(),
            slug: enTranslation.slug || '',
            salary: enTranslation.salary?.trim() || '',
            sections: enTranslation.sections,
          };
          setInitialData(newSavedState);
          setEnTranslation(newSavedState);
          toast.success('Lưu bản dịch Tiếng Anh bài tuyển dụng thành công!');
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
        title="Bản dịch Tiếng Anh (English Job Translation)"
        missingFields={missingFields}
        isTranslatingAi={isTranslatingAi}
        onAiTranslate={async () => {
          const apiKey = ENV.GEMINI_API_KEY;
          if (!apiKey) {
            toast.error(null, 'Chưa cấu hình VITE_GEMINI_API_KEY trong file .env.local!');
            return;
          }
          try {
            setIsTranslatingAi(true);
            toast.info('AI đang dịch các trường còn thiếu sang Tiếng Anh...');
            
            const needsTitle = viTitle?.trim() && !enTranslation.title.trim();
            const needsSalary = viSalary?.trim() && !enTranslation.salary.trim();
            
            const sectionsToTranslate = viSections.filter((_, idx) => {
              const enItem = enTranslation.sections[idx];
              return !enItem || (!enItem.title.trim() && !enItem.content.trim());
            });

            const res = await translateJobViToEnglish(apiKey, {
              title: needsTitle ? viTitle : '',
              salary: needsSalary ? viSalary : '',
              sections: sectionsToTranslate,
            });

            const newSections = [...enTranslation.sections];
            let secResultIdx = 0;
            viSections.forEach((_, idx) => {
              const enItem = enTranslation.sections[idx];
              if (!enItem || (!enItem.title.trim() && !enItem.content.trim())) {
                if (res.sections && res.sections[secResultIdx]) {
                  newSections[idx] = res.sections[secResultIdx];
                  secResultIdx++;
                }
              }
            });
            while (secResultIdx < (res.sections?.length || 0)) {
              newSections.push(res.sections[secResultIdx]);
              secResultIdx++;
            }

            setEnTranslation({
              ...enTranslation,
              title: needsTitle ? (res.title || enTranslation.title) : enTranslation.title,
              salary: needsSalary ? (res.salary || enTranslation.salary) : enTranslation.salary,
              sections: newSections.length > 0 ? newSections : enTranslation.sections,
            });

            toast.success('Dịch tự động các trường còn thiếu bằng AI thành công!');
          } catch (err: any) {
            toast.error(null, err.message || 'Lỗi khi dịch bằng AI, vui lòng thử lại');
          } finally {
            setIsTranslatingAi(false);
          }
        }}
        disableAiButton={isTranslatingAi || missingFields.length === 0 || isDirty}
      />

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
