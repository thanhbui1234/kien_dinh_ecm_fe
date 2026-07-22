import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import { FileUpload } from '@/components/upload/FileUpload';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { AIGenerator } from '@/components/common/AIGenerator';
import { generateProjectContent } from '@/utils/ai';
import { useCreateProject, useUpdateProject, useProjectDetail } from '@/queries/projects';
import { CreateProjectSchema, CreateProjectInput } from 'shared-api';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';
import { ProjectBasicInfoSection } from '@/components/projects/ProjectBasicInfoSection';
import { ProductPickerSection } from '@/components/projects/ProductPickerSection';
import { CategoryPickerSection } from '@/components/projects/CategoryPickerSection';
import { GalleryImagesSection } from '@/components/projects/GalleryImagesSection';

const Toggle = ({ checked, onToggle }: { checked: boolean; onToggle: () => void }) => (
  <button type="button" onClick={onToggle}
    className={`relative inline-flex w-10 h-5 rounded-full transition-colors shadow-sm border ${checked ? 'bg-black border-black' : 'bg-gray-100 border-gray-300'}`}>
    <span className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full shadow transition-transform ${checked ? 'translate-x-5 bg-white' : 'translate-x-0 bg-gray-400'}`} />
  </button>
);

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const { data: projectData, isLoading: isLoadingDetail } = useProjectDetail(id || '');

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting, isDirty } } = useForm<CreateProjectInput>({
    resolver: zodResolver(CreateProjectSchema as any),
    defaultValues: {
      name: '', description: '', coverImage: '', status: true, isFeatured: false,
      contentDetail: '', productIds: [], categoryIds: [],
    } as Partial<CreateProjectInput> as CreateProjectInput,
  });

  const { UnsavedChangesModal, markSaved } = useLeaveConfirm(isDirty);

  const [showAI, setShowAI] = useState(false);

  const handleAIGenerateSuccess = (result: any) => {
    if (result.name) setValue('name', result.name, { shouldDirty: true });
    if (result.description) setValue('description', result.description, { shouldDirty: true });
    if (result.contentDetail) setValue('contentDetail' as any, result.contentDetail, { shouldDirty: true });
  };

  const statusValue = watch('status');
  const isFeaturedValue = watch('isFeatured' as any);
  const selectedProductIds = watch('productIds') || [];
  const selectedCategoryIds = watch('categoryIds') || [];

  useEffect(() => {
    if (isEdit && projectData) {
      reset({
        name: projectData.name,
        description: projectData.description,
        coverImage: projectData.coverImage,
        status: projectData.status,
        isFeatured: (projectData as any).isFeatured || false,
        contentDetail: (projectData as any).detail?.contentDetail || '',
        productIds: (projectData as any).productIds || [],
        categoryIds: (projectData as any).categoryIds || [],
      });
      setGalleryImages((projectData as any).images || []);
    }
  }, [isEdit, projectData, reset]);

  const isSaving = createMutation.isPending || updateMutation.isPending || isSubmitting;

  const onSubmit = (data: CreateProjectInput) => {
    const payload = { ...data, images: galleryImages } as any;
    if (isEdit && id) {
      updateMutation.mutate({ id, data: payload }, { onSuccess: () => { markSaved(); navigate('/projects'); } });
    } else {
      createMutation.mutate(payload, { onSuccess: () => { markSaved(); navigate('/projects'); } });
    }
  };

  if (isEdit && isLoadingDetail) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 text-black animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <UnsavedChangesModal />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/projects')}
            className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition-all shadow-sm">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-black">{isEdit ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}</h1>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{isEdit ? 'Cập nhật thông tin dự án' : 'Điền thông tin để tạo dự án mới'}</p>
          </div>
        </div>

        {!isEdit && (
          <button type="button" onClick={() => setShowAI(!showAI)} className="flex items-center gap-1.5 h-9 px-3 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors border border-indigo-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Tạo tự động bằng AI
          </button>
        )}
      </div>

      {showAI && !isEdit && (
      <AIGenerator
        title="Sinh nội dung dự án tự động bằng AI"
        description="Nhập yêu cầu chi tiết để AI phân tích và tự điền Tên dự án, Mô tả ngắn và Nội dung chi tiết."
        placeholder="Ví dụ: Tạo nội dung cho dự án 'Lắp đặt máy CNC tại xưởng A', bối cảnh là xưởng cần tăng năng suất, mục tiêu hoàn thành trong 1 tháng..."
        generateContent={generateProjectContent}
        onGenerateSuccess={handleAIGenerateSuccess}
        onClose={() => setShowAI(false)}
      />
      )}

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5">
        <div className="grid grid-cols-3 gap-5">
          {/* Main */}
          <div className="col-span-2 space-y-5">
            <ProjectBasicInfoSection register={register} errors={errors} />

            <CategoryPickerSection
              selectedIds={selectedCategoryIds as string[]}
              onChange={(ids) => setValue('categoryIds' as any, ids, { shouldDirty: true })}
            />

            <ProductPickerSection
              selectedIds={selectedProductIds as string[]}
              onChange={(ids) => setValue('productIds' as any, ids, { shouldDirty: true })}
            />

            {/* Rich text */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">NỘI DUNG CHI TIẾT</h2>
              <Controller name={'contentDetail' as any} control={control}
                render={({ field }) => <RichTextEditor value={field.value || ''} onChange={field.onChange} placeholder="Nhập nội dung chi tiết về dự án..." />}
              />
            </div>

            <GalleryImagesSection images={galleryImages} onChange={setGalleryImages} />
          </div>

          {/* Right sidebar */}
          <div className="col-span-1 space-y-5">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">ẢNH BÌA</h2>
              <Controller name="coverImage" control={control}
                render={({ field }) => <FileUpload label="" value={field.value} onChange={field.onChange} bgOption="none" />}
              />
              {errors.coverImage && <p className="text-xs font-medium text-red-500">{errors.coverImage.message}</p>}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3 mb-4">CÀI ĐẶT</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-black">Hiển thị dự án</p>
                  <p className="text-xs font-medium text-gray-500">Hiện trên website</p>
                </div>
                <Toggle checked={!!statusValue} onToggle={() => setValue('status' as any, !statusValue, { shouldDirty: true })} />
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm font-bold text-black">Nổi bật</p>
                  <p className="text-xs font-medium text-gray-500">Hiển ở trang chủ</p>
                </div>
                <Toggle checked={!!isFeaturedValue} onToggle={() => setValue('isFeatured' as any, !isFeaturedValue, { shouldDirty: true })} />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button type="submit" disabled={isSaving || !isDirty}
                className="flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-bold transition-colors shadow-sm">
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEdit ? 'CẬP NHẬT' : 'TẠO DỰ ÁN'}
              </button>
              <button type="button" onClick={() => navigate('/projects')} disabled={isSaving}
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
