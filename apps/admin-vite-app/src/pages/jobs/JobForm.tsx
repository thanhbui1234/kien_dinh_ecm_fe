import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Loader2, Plus, Trash2, Globe } from 'lucide-react';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { useCreateJob, useUpdateJob, useJobDetail } from '@/queries/jobs';
import { CreateJobSchema, CreateJobInput, API_ENDPOINTS } from 'shared-api';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';
import { LanguageTabs } from '@/components/common/LanguageTabs';
import { JobEnglishTranslationSection } from '@/components/jobs/JobEnglishTranslationSection';
import { axiosInstance } from '@/lib/axios';
import { toast } from '@/utils/toast';

import { TranslationWarningBanner } from '@/components/common/TranslationWarningBanner';

const inputCls = "w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2";

const Toggle = ({ checked, onToggle }: { checked: boolean; onToggle: () => void }) => (
  <button type="button" onClick={onToggle}
    className={`relative inline-flex w-10 h-5 rounded-full transition-colors shadow-sm border ${checked ? 'bg-black border-black' : 'bg-gray-100 border-gray-300'}`}>
    <span className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full shadow transition-transform ${checked ? 'translate-x-5 bg-white' : 'translate-x-0 bg-gray-400'}`} />
  </button>
);

export default function JobForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const createMutation = useCreateJob();
  const updateMutation = useUpdateJob();
  const { data: jobData, isLoading: isLoadingDetail } = useJobDetail(id || '');

  const [activeTab, setActiveTab] = useState<'VI' | 'EN'>('VI');
  const [enTranslation, setEnTranslation] = useState({
    title: '',
    slug: '',
    salary: '',
    sections: [{ title: 'Job Description', content: '' }],
  });
  const [isSavingEn, setIsSavingEn] = useState(false);

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting, isDirty, dirtyFields } } = useForm<CreateJobInput>({
    resolver: zodResolver(CreateJobSchema as any),
    defaultValues: { title: '', salary: '', status: true, sections: [{ title: 'Mô tả công việc', content: '' }] as any },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "sections" as any });
  const statusValue = watch('status');
  const { UnsavedChangesModal, markSaved } = useLeaveConfirm(isDirty);

  useEffect(() => {
    if (isEdit && jobData) {
      reset({
        title: jobData.title,
        salary: jobData.salary || '',
        status: jobData.status,
        sections: (jobData as any).sections?.length ? (jobData as any).sections : [{ title: 'Mô tả công việc', content: '' }] as any,
      });

      const enTrans = (jobData as any).translations?.find((t: any) => t.lang === 'EN');
      if (enTrans) {
        setEnTranslation({
          title: enTrans.title || '',
          slug: enTrans.slug || '',
          salary: enTrans.salary || '',
          sections: enTrans.sections?.length ? enTrans.sections : [{ title: 'Job Description', content: '' }],
        });
      }
    }
  }, [isEdit, jobData, reset]);

  const handleSaveEnTranslation = async () => {
    if (!id || !enTranslation.title.trim()) {
      toast.error(null, 'Vui lòng nhập tiêu đề tuyển dụng tiếng Anh');
      return;
    }

    try {
      setIsSavingEn(true);
      await axiosInstance.post(API_ENDPOINTS.JOBS.TRANSLATION(id), {
        lang: 'EN',
        title: enTranslation.title.trim(),
        slug: enTranslation.slug.trim() || undefined,
        salary: enTranslation.salary || undefined,
        sections: enTranslation.sections,
      });
      toast.success('Lưu bản dịch Tiếng Anh bài tuyển dụng thành công!');
    } catch {
      toast.error(null, 'Lưu bản dịch Tiếng Anh thất bại');
    } finally {
      setIsSavingEn(false);
    }
  };

  const onSubmit = (data: CreateJobInput) => {
    if (isEdit && id) {
      const dirtyData: any = {};
      Object.keys(dirtyFields).forEach((key) => {
        dirtyData[key] = (data as any)[key];
      });

      updateMutation.mutate({ id, data: dirtyData }, { 
        onSuccess: () => { 
          markSaved(); 
          toast.success('Cập nhật bài tuyển dụng thành công!');
          navigate('/jobs'); 
        } 
      });
    } else {
      createMutation.mutate(data, { 
        onSuccess: async (res: any) => { 
          markSaved(); 
          const newId = res?.id || res?.data?.id;

          // Save EN translation if populated on create
          if (newId && enTranslation.title.trim()) {
            try {
              await axiosInstance.post(API_ENDPOINTS.JOBS.TRANSLATION(newId), {
                lang: 'EN',
                title: enTranslation.title.trim(),
                slug: enTranslation.slug.trim() || undefined,
                salary: enTranslation.salary || undefined,
                sections: enTranslation.sections,
              });
            } catch (err) {
              console.error('Failed to save EN job translation on create', err);
            }
          }

          toast.success('Tạo bài tuyển dụng thành công!');
          navigate('/jobs'); 
        } 
      });
    }
  };

  const onInvalid = () => {
    toast.error(null, 'Vui lòng kiểm tra lại các trường bắt buộc (được đánh dấu đỏ) trước khi lưu.');
  };

  const isSaving = createMutation.isPending || updateMutation.isPending || isSubmitting;

  if (isEdit && isLoadingDetail) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 text-black animate-spin" /></div>;
  }

  const hasEnTranslation = !!(jobData as any)?.translations?.some((t: any) => t.lang === 'EN');

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <UnsavedChangesModal />
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate('/jobs')}
          className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition-all shadow-sm">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-black">{isEdit ? 'Chỉnh sửa tin tuyển dụng' : 'Thêm tin tuyển dụng mới'}</h1>
          <p className="text-xs font-medium text-gray-500 mt-0.5">{isEdit ? 'Cập nhật thông tin tuyển dụng' : 'Điền thông tin để đăng tin mới'}</p>
        </div>
      </div>

      {isEdit && (
        <TranslationWarningBanner
          hasEnTranslation={hasEnTranslation || !!enTranslation.title.trim()}
          activeTab={activeTab}
          onSwitchToEnTab={() => setActiveTab('EN')}
          mismatches={[
            {
              label: 'mục nội dung tuyển dụng',
              viCount: fields ? fields.length : 0,
              enCount: enTranslation.sections ? enTranslation.sections.filter(s => s.title.trim() || s.content.trim()).length : 0,
              onSync: () => {
                const viSections = watch('sections') || [];
                if (!viSections || viSections.length === 0) return;
                const synced = viSections.map((sec: any) => ({
                  title: sec.title || '',
                  content: sec.content || '',
                }));
                setEnTranslation((prev) => ({ ...prev, sections: synced }));
                setActiveTab('EN');
                toast.success('Đã đồng bộ các mục nội dung sang Tiếng Anh!');
              },
            },
          ]}
        />
      )}

      <LanguageTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasEnTranslation={hasEnTranslation || !!enTranslation.title.trim()}
      />

      {/* English Translation View */}
      {activeTab === 'EN' ? (
        <JobEnglishTranslationSection
          isEdit={isEdit}
          jobId={id}
          enTranslation={enTranslation}
          setEnTranslation={setEnTranslation}
          viSectionsCount={fields ? fields.length : 0}
          onSyncFromVi={() => {
            const viSections = watch('sections') || [];
            if (!viSections || viSections.length === 0) return;
            const synced = viSections.map((sec: any) => ({
              title: sec.title || '',
              content: sec.content || '',
            }));
            setEnTranslation((prev) => ({
              ...prev,
              sections: synced,
            }));
            toast.success('Đã tải cấu trúc các mục nội dung từ bản Tiếng Việt!');
          }}
          onSwitchToViTab={() => setActiveTab('VI')}
        />
      ) : (
        /* Vietnamese (Default) Form */
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
          <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-100 pb-2">Thông tin cơ bản</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Vị trí tuyển dụng *</label>
                <input type="text" {...register('title')} placeholder="VD: Kỹ sư cơ khí CNC" className={inputCls} />
                {errors.title && <p className="text-xs font-semibold text-red-500 mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Mức lương</label>
                <input type="text" {...register('salary')} placeholder="VD: 15 - 20 triệu hoặc Thỏa thuận" className={inputCls} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <label className="text-xs font-bold text-black block">Trạng thái tin tuyển dụng</label>
                <span className="text-xs text-gray-500 font-medium">{statusValue ? 'Đang tuyển (Công khai)' : 'Tạm dừng tuyển (Ẩn)'}</span>
              </div>
              <Toggle checked={!!statusValue} onToggle={() => setValue('status', !statusValue, { shouldDirty: true })} />
            </div>
          </div>

          {/* Dynamic Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-black uppercase tracking-wider">Các mục nội dung (Mô tả, Yêu cầu, Quyền lợi...)</h2>
              <button
                type="button"
                onClick={() => append({ title: '', content: '' } as any)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm mục mới
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm space-y-4 relative group">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      {...register(`sections.${index}.title` as any)}
                      placeholder="Tiêu đề mục (VD: Yêu cầu công việc, Quyền lợi...)"
                      className={inputCls}
                    />
                    {(errors as any)?.sections?.[index]?.title && (
                      <p className="text-xs font-semibold text-red-500 mt-1">{(errors as any).sections[index].title?.message}</p>
                    )}
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors shrink-0"
                      title="Xóa mục này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <Controller
                    name={`sections.${index}.content` as any}
                    control={control}
                    render={({ field: contentField }) => (
                      <RichTextEditor
                        value={(contentField.value as string) || ''}
                        onChange={contentField.onChange}
                        placeholder="Nhập nội dung chi tiết cho mục này..."
                      />
                    )}
                  />
                  {(errors as any)?.sections?.[index]?.content && (
                    <p className="text-xs font-semibold text-red-500 mt-1">{(errors as any).sections[index].content?.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/jobs')}
              className="px-4 py-2 rounded-md border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 rounded-md bg-black text-white text-xs font-bold hover:bg-gray-800 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isEdit ? 'Cập nhật tin' : 'Đăng tin mới'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
