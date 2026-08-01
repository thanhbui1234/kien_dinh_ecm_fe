import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { FileUpload } from '@/components/upload/FileUpload';
import { useCreateCategory, useUpdateCategory, useCategoryDetail } from '@/queries/categories';
import { resolveImageValue } from '@/queries/upload/useUpload';
import { CreateCategorySchema, CreateCategoryInput } from 'shared-api';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';
import { toast } from '@/utils/toast';

const inputCls = "w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2";

const Toggle = ({ checked, onToggle }: { checked: boolean; onToggle: () => void }) => (
  <button type="button" onClick={onToggle}
    className={`relative inline-flex w-10 h-5 rounded-full transition-colors shadow-sm border ${checked ? 'bg-black border-black' : 'bg-gray-100 border-gray-300'}`}>
    <span className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full shadow transition-transform ${checked ? 'translate-x-5 bg-white' : 'translate-x-0 bg-gray-400'}`} />
  </button>
);

// imageUrl may hold a File that hasn't been uploaded yet — upload is
// deferred until submit — so extend the API schema locally for form validation.
type CategoryFormValues = Omit<CreateCategoryInput, 'imageUrl'> & { imageUrl?: string | File };
const CategoryFormSchema = CreateCategorySchema.extend({
  // browser-image-compression's runtime output is a Blob, not a real File
  // instance (despite its .d.ts claiming otherwise), so validate against Blob.
  imageUrl: z.union([z.string(), z.instanceof(Blob)]).optional(),
});

export default function CategoryForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const { data: categoryData, isLoading: isLoadingDetail } = useCategoryDetail(id || '');

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting, isDirty, dirtyFields } } = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema as any),
    defaultValues: { name: '', slug: '', imageUrl: '', orderIndex: 0, status: true, parentId: '' },
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const statusValue = watch('status');
  const { UnsavedChangesModal, markSaved } = useLeaveConfirm(isDirty);

  useEffect(() => {
    if (isEdit && categoryData) {
      reset({
        name: categoryData.name,
        slug: categoryData.slug,
        imageUrl: categoryData.imageUrl || '',
        orderIndex: categoryData.orderIndex,
        status: categoryData.status,
        parentId: categoryData.parentId || '',
      });
    }
  }, [isEdit, categoryData, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    let resolvedImageUrl: string;
    try {
      setIsUploadingImage(true);
      resolvedImageUrl = await resolveImageValue(data.imageUrl);
    } catch {
      toast.error(null, 'Tải ảnh lên thất bại, vui lòng thử lại.');
      setIsUploadingImage(false);
      return;
    }
    setIsUploadingImage(false);

    const payload: CreateCategoryInput = { ...data, imageUrl: resolvedImageUrl };
    if (isEdit && id) {
      const dirtyData: any = {};
      Object.keys(dirtyFields).forEach((key) => {
        if (key === 'imageUrl') {
          dirtyData.imageUrl = resolvedImageUrl;
        } else {
          dirtyData[key] = (payload as any)[key];
        }
      });

      updateMutation.mutate({ id, data: dirtyData }, { 
        onSuccess: () => { 
          markSaved(); 
          toast.success('Cập nhật danh mục thành công!');
          navigate('/categories'); 
        } 
      });
    } else {
      createMutation.mutate(payload, { 
        onSuccess: () => { 
          markSaved(); 
          toast.success('Tạo danh mục thành công!');
          navigate('/categories'); 
        } 
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending || isSubmitting || isUploadingImage;

  if (isEdit && isLoadingDetail) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 text-black animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <UnsavedChangesModal />
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate('/categories')}
          className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition-all shadow-sm">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-black">{isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h1>
          <p className="text-xs font-medium text-gray-500 mt-0.5">{isEdit ? 'Cập nhật thông tin danh mục' : 'Điền thông tin để tạo danh mục mới'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 space-y-5">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">THÔNG TIN CƠ BẢN</h2>
              <div>
                <label className={labelCls}>Tên danh mục <span className="text-red-500">*</span></label>
                <input {...register('name')} placeholder="Ví dụ: Máy gia công CNC" className={inputCls} />
                {errors.name && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.name.message}</p>}
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="sticky top-6 space-y-5">
              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
                <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">ẢNH ĐẠI DIỆN</h2>
                <Controller name="imageUrl" control={control}
                  render={({ field }) => <FileUpload label="" value={field.value} onChange={field.onChange} bgOption="none" />}
                />
                {errors.imageUrl && <p className="text-xs font-medium text-red-500">{errors.imageUrl.message}</p>}
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3 mb-4">CÀI ĐẶT</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-black">Hiển thị</p>
                    <p className="text-xs font-medium text-gray-500">Hiện trên website</p>
                  </div>
                  <Toggle checked={!!statusValue} onToggle={() => setValue('status', !statusValue, { shouldDirty: true })} />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <button type="submit" disabled={isSaving || !isDirty}
                  className="flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-bold transition-colors shadow-sm">
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isUploadingImage ? 'ĐANG TẢI ẢNH LÊN...' : isEdit ? 'CẬP NHẬT' : 'TẠO DANH MỤC'}
                </button>
                <button type="button" onClick={() => navigate('/categories')} disabled={isSaving}
                  className="h-10 px-4 rounded-md bg-white hover:bg-gray-50 border border-gray-300 text-black text-sm font-bold transition-colors shadow-sm">
                  HỦY
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
