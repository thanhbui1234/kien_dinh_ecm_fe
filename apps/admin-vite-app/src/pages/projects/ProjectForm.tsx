import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import { FileUpload } from '@/components/upload/FileUpload';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { AIGenerator } from '@/components/common/AIGenerator';
import { generateProjectContent } from '@/utils/ai';
import { useCreateProject, useUpdateProject, useProjectDetail } from '@/queries/projects';
import { resolveImageValue, resolveImageValues } from '@/queries/upload/useUpload';
import { CreateProjectSchema, CreateProjectInput } from 'shared-api';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';
import { ProductVideoSection } from '@/components/products/ProductVideoSection';
import { useFieldArray } from 'react-hook-form';
import { AdminPageHeader } from '@/components/common/AdminPageHeader';
import { FormActionButtons } from '@/components/common/FormActionButtons';
import { ProjectBasicInfoSection } from '@/components/projects/ProjectBasicInfoSection';
import { ProductPickerSection } from '@/components/projects/ProductPickerSection';
import { CategoryPickerSection } from '@/components/projects/CategoryPickerSection';
import { GalleryImagesSection } from '@/components/projects/GalleryImagesSection';
import { toast } from '@/utils/toast';

const Toggle = ({ checked, onToggle }: { checked: boolean; onToggle: () => void }) => (
  <button type="button" onClick={onToggle}
    className={`relative inline-flex w-10 h-5 rounded-full transition-colors shadow-sm border ${checked ? 'bg-black border-black' : 'bg-gray-100 border-gray-300'}`}>
    <span className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full shadow transition-transform ${checked ? 'translate-x-5 bg-white' : 'translate-x-0 bg-gray-400'}`} />
  </button>
);

// coverImage may hold a File that hasn't been uploaded yet — upload is
// deferred until submit — so extend the API schema locally for form validation.
type ProjectFormValues = Omit<CreateProjectInput, 'coverImage'> & { coverImage: string | File; videoList?: { url: string }[] };
const ProjectFormSchema = CreateProjectSchema.extend({
  // browser-image-compression's runtime output is a Blob, not a real File
  // instance (despite its .d.ts claiming otherwise), so validate against Blob.
  coverImage: z.union([z.string().min(1, 'Ảnh bìa là bắt buộc'), z.instanceof(Blob)]),
});

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState<(string | File)[]>([]);
  const [isGalleryDirty, setIsGalleryDirty] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const handleGalleryImagesChange = (images: (string | File)[]) => {
    setGalleryImages(images);
    setIsGalleryDirty(true);
  };

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const { data: projectData, isLoading: isLoadingDetail } = useProjectDetail(id || '');

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectFormSchema as any),
    defaultValues: {
      name: '', description: '', coverImage: '', status: true, isFeatured: false,
      contentDetail: '', productIds: [], categoryIds: [], videoList: [] as any
    } as Partial<ProjectFormValues> as ProjectFormValues,
  });
  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting, isDirty, dirtyFields } } = form;

  const videoFieldArray = useFieldArray({ control, name: 'videoList' as any });
  const videoListValue = (watch('videoList' as any) || []) as { url: string }[];

  const { UnsavedChangesModal, markSaved } = useLeaveConfirm(isDirty || isGalleryDirty);

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
      const videoUrls = (projectData as any).detail?.videoUrls || (projectData as any).videoUrls || [];
      reset({
        name: projectData.name,
        description: projectData.description,
        coverImage: projectData.coverImage,
        status: projectData.status,
        isFeatured: (projectData as any).isFeatured || false,
        contentDetail: (projectData as any).detail?.contentDetail || '',
        productIds: (projectData as any).productIds || [],
        categoryIds: (projectData as any).categoryIds || [],
        videoList: videoUrls.map((url: string) => ({ url })) as any,
      });
      setGalleryImages((projectData as any).images || []);
      setIsGalleryDirty(false);
    }
  }, [isEdit, projectData, reset]);

  const isSaving = createMutation.isPending || updateMutation.isPending || isSubmitting || isUploadingImages;

  const onSubmit = async (data: ProjectFormValues) => {
    let resolvedCoverImage: string;
    let resolvedImages: string[];
    try {
      setIsUploadingImages(true);
      resolvedCoverImage = await resolveImageValue(data.coverImage);
      resolvedImages = await resolveImageValues(galleryImages);
    } catch {
      toast.error(null, 'Tải ảnh lên thất bại, vui lòng thử lại.');
      setIsUploadingImages(false);
      return;
    }
    setIsUploadingImages(false);

    const payload = { ...data, coverImage: resolvedCoverImage, images: resolvedImages } as any;
    if (videoListValue && videoListValue.length > 0) {
      payload.videoUrls = videoListValue.map((item) => item.url.trim()).filter(Boolean);
    }
    if (isEdit && id) {
      const dirtyData: any = {};
      Object.keys(dirtyFields).forEach((key) => {
        if (key === 'coverImage') {
          dirtyData.coverImage = resolvedCoverImage;
        } else if (key === 'videoList') {
          dirtyData.videoUrls = payload.videoUrls || [];
        } else {
          dirtyData[key] = (payload as any)[key];
        }
      });
      if (isGalleryDirty) {
        dirtyData.images = resolvedImages;
      }

      updateMutation.mutate({ id, data: dirtyData }, { 
        onSuccess: () => { 
          markSaved(); 
          setIsGalleryDirty(false);
          toast.success('Cập nhật dự án thành công!');
        } 
      });
    } else {
      createMutation.mutate(payload, { 
        onSuccess: (res: any) => { 
          markSaved(); 
          setIsGalleryDirty(false);
          toast.success('Tạo dự án thành công!');
          const newId = res?.id || res?.data?.id;
          if (newId) {
            navigate(`/projects/${newId}/edit`);
          } else {
            navigate('/projects');
          }
        } 
      });
    }
  };

  const handleCancel = () => {
    if (isEdit) {
      reset();
      setIsGalleryDirty(false);
    } else {
      navigate('/projects');
    }
  };

  if (isEdit && isLoadingDetail) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 text-black animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <UnsavedChangesModal />
      <AdminPageHeader
        title={isEdit ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
        subtitle={isEdit ? 'Cập nhật thông tin dự án' : 'Điền thông tin để tạo dự án mới'}
        onBack={handleCancel}
        clientUrl={isEdit && projectData?.slug ? `/projects/${projectData.slug}` : undefined}
        actions={
          !isEdit ? (
            <button
              type="button"
              onClick={() => setShowAI(!showAI)}
              className="flex items-center gap-1.5 h-9 px-3 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors border border-indigo-200 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Tạo tự động bằng AI
            </button>
          ) : undefined
        }
      />

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
            <ProjectBasicInfoSection register={register as any} errors={errors as any} />

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

            <GalleryImagesSection images={galleryImages} onChange={handleGalleryImagesChange} />
          </div>

          {/* Right sidebar */}
          <div className="col-span-1">
            <div className="sticky top-6 space-y-5">
              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">ẢNH BÌA</h2>
                <Controller name="coverImage" control={control}
                  render={({ field }) => <FileUpload label="" value={field.value} onChange={field.onChange} bgOption="none" />}
                />
                {errors.coverImage && <p className="text-xs font-medium text-red-500">{errors.coverImage.message}</p>}
              </div>

              <ProductVideoSection form={form as any} videoFieldArray={videoFieldArray as any} videoListValue={videoListValue as any} />

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

              <FormActionButtons
                isEdit={isEdit}
                isSaving={isSaving}
                isDirty={isDirty || isGalleryDirty}
                submitText={isUploadingImages ? 'ĐANG TẢI ẢNH LÊN...' : undefined}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
