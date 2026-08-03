import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { FileUpload } from '@/components/upload/FileUpload';
import { useCreateCategory, useUpdateCategory, useCategoryDetail, useSaveCategoryTranslation } from '@/queries/categories';
import { resolveImageValue } from '@/queries/upload/useUpload';
import { CreateCategorySchema, CreateCategoryInput } from 'shared-api';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';
import { toast } from '@/utils/toast';
import { LanguageTabs } from '@/components/common/LanguageTabs';
import { CategoryEnglishTranslationSection } from '@/components/categories/CategoryEnglishTranslationSection';

import { TranslationWarningBanner } from '@/components/common/TranslationWarningBanner';

const inputCls = "w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2";

const Toggle = ({ checked, onToggle }: { checked: boolean; onToggle: () => void }) => (
  <button type="button" onClick={onToggle}
    className={`relative inline-flex w-10 h-5 rounded-full transition-colors shadow-sm border ${checked ? 'bg-black border-black' : 'bg-gray-100 border-gray-300'}`}>
    <span className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full shadow transition-transform ${checked ? 'translate-x-5 bg-white' : 'translate-x-0 bg-gray-400'}`} />
  </button>
);

type CategoryFormValues = Omit<CreateCategoryInput, 'imageUrl'> & { imageUrl?: string | File };
const CategoryFormSchema = CreateCategorySchema.extend({
  imageUrl: z.union([z.string(), z.instanceof(Blob)]).optional(),
});

export default function CategoryForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const { data: categoryData, isLoading: isLoadingDetail } = useCategoryDetail(id || '');

  const [activeTab, setActiveTab] = useState<'VI' | 'EN'>('VI');
  const [enTranslation, setEnTranslation] = useState({ name: '', slug: '' });
  const [isDataSynced, setIsDataSynced] = useState(!isEdit);
  const saveEnTranslation = useSaveCategoryTranslation();

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

      const enTrans = (categoryData as any).translations?.find((t: any) => t.lang === 'EN');
      if (enTrans) {
        setEnTranslation({ name: enTrans.name || '', slug: enTrans.slug || '' });
      }
      setIsDataSynced(true);
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
        onSuccess: async (res: any) => { 
          markSaved(); 
          const newId = res?.id || res?.data?.id;

          if (newId && enTranslation.name.trim()) {
            saveEnTranslation.mutate({
              categoryId: newId,
              lang: 'EN',
              name: enTranslation.name.trim(),
              slug: enTranslation.slug.trim() || undefined,
            });
          }

          toast.success('Tạo danh mục thành công!');
          navigate('/categories'); 
        } 
      });
    }
  };

  if (isEdit && isLoadingDetail) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const hasEnTranslation = !!(categoryData as any)?.translations?.some((t: any) => t.lang === 'EN');

  return (
    <div className="mx-auto max-w-4xl py-6">
      <UnsavedChangesModal />
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/categories')} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{isEdit ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}</h1>
            <p className="text-xs text-gray-500 mt-0.5">{isEdit ? 'Cập nhật thông tin chi tiết của danh mục' : 'Điền thông tin bên dưới để tạo danh mục mới'}</p>
          </div>
        </div>
      </div>

      {isEdit && (
        <TranslationWarningBanner
          hasEnTranslation={hasEnTranslation || !!enTranslation.name.trim()}
          activeTab={activeTab}
          onSwitchToEnTab={() => setActiveTab('EN')}
        />
      )}

      <LanguageTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasEnTranslation={hasEnTranslation || !!enTranslation.name.trim()}
      />

      {/* English Translation Form View */}
      <div className={activeTab === 'EN' ? 'block' : 'hidden'}>
        {isDataSynced && (
          <CategoryEnglishTranslationSection
            isEdit={isEdit}
            categoryId={id}
            enTranslation={enTranslation}
            setEnTranslation={setEnTranslation}
            viName={watch('name')}
            onSwitchToViTab={() => setActiveTab('VI')}
          />
        )}
      </div>

      {/* Vietnamese (Default) Form */}
      <form onSubmit={handleSubmit(onSubmit)} className={`bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-6 ${activeTab === 'VI' ? 'block' : 'hidden'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Tên danh mục *</label>
              <input type="text" className={inputCls} placeholder="Nhập tên danh mục" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Slug (Đường dẫn tĩnh)</label>
              <input type="text" className={inputCls} placeholder="tu-dong-sinh-neu-de-trong" {...register('slug')} />
            </div>

            <div>
              <label className={labelCls}>Thứ tự hiển thị</label>
              <input type="number" className={inputCls} {...register('orderIndex', { valueAsNumber: true })} />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Trạng thái hoạt động</label>
              <Toggle checked={!!statusValue} onToggle={() => setValue('status', !statusValue, { shouldDirty: true })} />
              <span className="text-xs font-semibold text-gray-600">{statusValue ? 'Hiển thị' : 'Ẩn'}</span>
            </div>
          </div>

          <div>
            <label className={labelCls}>Ảnh danh mục</label>
            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                <FileUpload
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/categories')}
              className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || updateMutation.isPending || createMutation.isPending || isUploadingImage}
              className="flex items-center gap-2 px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              {(isSubmitting || updateMutation.isPending || createMutation.isPending || isUploadingImage) && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              {isEdit ? 'Lưu thay đổi' : 'Tạo danh mục'}
            </button>
          </div>
        </form>
    </div>
  );
}
