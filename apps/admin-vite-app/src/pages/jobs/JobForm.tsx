import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { useCreateJob, useUpdateJob, useJobDetail } from '@/queries/jobs';
import { CreateJobSchema, CreateJobInput } from 'shared-api';

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

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<CreateJobInput>({
    resolver: zodResolver(CreateJobSchema) as any,
    defaultValues: { title: '', salary: '', status: true, sections: [{ title: 'Mô tả công việc', content: '' }] as any },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "sections" as any });
  const statusValue = watch('status');

  useEffect(() => {
    if (isEdit && jobData) {
      reset({
        title: jobData.title,
        salary: jobData.salary || '',
        status: jobData.status,
        sections: (jobData as any).sections?.length ? (jobData as any).sections : [{ title: 'Mô tả công việc', content: '' }] as any,
      });
    }
  }, [isEdit, jobData, reset]);

  const onSubmit = (data: CreateJobInput) => {
    if (isEdit && id) {
      updateMutation.mutate({ id, data }, { onSuccess: () => navigate('/jobs') });
    } else {
      createMutation.mutate(data, { onSuccess: () => navigate('/jobs') });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending || isSubmitting;

  if (isEdit && isLoadingDetail) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 text-black animate-spin" /></div>;
  }

  return (
    <div className="space-y-5 max-w-5xl pb-12">
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

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-5">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">THÔNG TIN CƠ BẢN</h2>
              <div>
                <label className={labelCls}>Vị trí tuyển dụng <span className="text-red-500">*</span></label>
                <input {...register('title')} placeholder="Ví dụ: Lập trình viên CNC" className={inputCls} />
                {errors.title && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.title.message}</p>}
              </div>

              <div>
                <label className={labelCls}>Mức lương đề xuất</label>
                <input {...register('salary')} placeholder="Ví dụ: 15-20 triệu, Thoả thuận..." className={inputCls} />
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-sm font-bold text-black">NỘI DUNG TUYỂN DỤNG</h2>
                <button type="button" onClick={() => append({ title: '', content: '' } as any)}
                  className="flex items-center gap-1.5 h-7 px-2.5 rounded border border-gray-300 text-xs font-bold text-black hover:bg-gray-50 transition-colors">
                  <Plus className="h-3.5 w-3.5" /> Thêm mục mới
                </button>
              </div>

              <div className="space-y-5">
                {fields.map((field, index) => (
                  <div key={field.id} className="rounded-lg border border-gray-200 bg-gray-50 p-5 space-y-4 relative group">
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(index)}
                        className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-all shadow-sm opacity-0 group-hover:opacity-100">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    
                    <div>
                      <label className={labelCls}>Tiêu đề mục</label>
                      <input {...(register as any)(`sections.${index}.title`)} placeholder="VD: Yêu cầu công việc, Quyền lợi..." className={inputCls} />
                      {errors.sections && (errors.sections as any)?.[index]?.title && (
                        <p className="text-xs font-medium text-red-500 mt-1.5">{(errors.sections as any)[index]?.title?.message}</p>
                      )}
                    </div>

                    <div>
                      <label className={labelCls}>Nội dung chi tiết</label>
                      <div className="bg-white rounded-md">
                        <Controller name={`sections.${index}.content` as any} control={control}
                          render={({ field: { value, onChange } }) => (
                            <RichTextEditor value={value as string} onChange={onChange} />
                          )}
                        />
                      </div>
                      {errors.sections && (errors.sections as any)?.[index]?.content && (
                        <p className="text-xs font-medium text-red-500 mt-1.5">{(errors.sections as any)[index]?.content?.message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-1 space-y-5">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3 mb-4">CÀI ĐẶT</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-black">Trạng thái tuyển dụng</p>
                  <p className="text-xs font-medium text-gray-500">{statusValue ? 'Đang tuyển' : 'Đã đóng'}</p>
                </div>
                <Toggle checked={!!statusValue} onToggle={() => setValue('status' as any, !statusValue)} />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button type="submit" disabled={isSaving}
                className="flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-bold transition-colors shadow-sm">
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEdit ? 'CẬP NHẬT' : 'ĐĂNG TIN'}
              </button>
              <button type="button" onClick={() => navigate('/jobs')} disabled={isSaving}
                className="h-10 px-4 rounded-md bg-white hover:bg-gray-50 border border-gray-300 text-black text-sm font-bold transition-colors shadow-sm">
                HỦY
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
