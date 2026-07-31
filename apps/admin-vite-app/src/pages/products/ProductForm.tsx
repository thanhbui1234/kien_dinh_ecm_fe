import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { FileUpload } from '@/components/upload/FileUpload';
import { AIGenerator } from '@/components/common/AIGenerator';
import { generateProductContent } from '@/utils/ai';
import { useCreateProduct, useUpdateProduct, useProductDetail } from '@/queries/products';
import { useCategories } from '@/queries/categories';
import { resolveImageValue } from '@/queries/upload/useUpload';
import { CreateProductSchema, CreateProductImageSchema, CreateProductInput } from 'shared-api';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';
import { useObjectUrlCache } from '@/hooks/useObjectUrlCache';
import { ImageLightbox } from '@/components/common/ImageLightbox';
import { toast } from '@/utils/toast';
import { AdminPageHeader } from '@/components/common/AdminPageHeader';
import { FormActionButtons } from '@/components/common/FormActionButtons';
import { ProductBasicInfoSection } from '@/components/products/ProductBasicInfoSection';
import { ProductSpecsSection } from '@/components/products/ProductSpecsSection';
import { ProductFeaturesSection } from '@/components/products/ProductFeaturesSection';
import { ProductVideoSection } from '@/components/products/ProductVideoSection';
import { ProductGallerySection } from '@/components/products/ProductGallerySection';

const fileOrString = z.union([z.string(), z.instanceof(Blob)]);
const ProductFormSchema = CreateProductSchema.extend({
  thumbnailUrl: fileOrString,
  images: z.array(CreateProductImageSchema.extend({ imageUrl: fileOrString })).optional(),
});

const Toggle = ({ checked, onToggle }: { checked: boolean; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`relative inline-flex w-10 h-5 rounded-full transition-colors shadow-sm border ${
      checked ? 'bg-black border-black' : 'bg-gray-100 border-gray-300'
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full shadow transition-transform ${
        checked ? 'translate-x-5 bg-white' : 'translate-x-0 bg-gray-400'
      }`}
    />
  </button>
);

type FormValues = Omit<CreateProductInput, 'thumbnailUrl' | 'images' | 'videoUrls'> & {
  thumbnailUrl: string | File;
  images: { imageUrl: string | File; isMain: boolean; orderIndex: number }[];
  specList: { key: string; value: string }[];
  featureList: { key: string; value: string }[];
  videoList: { url: string }[];
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: categoriesData } = useCategories({ limit: 100 });
  const categories = categoriesData || [];
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const { data: productData, isLoading: isLoadingDetail } = useProductDetail(id || '');

  const form = useForm<FormValues>({
    resolver: zodResolver(ProductFormSchema as any),
    defaultValues: {
      name: '',
      price: null,
      thumbnailUrl: '',
      isFeatured: false,
      status: true,
      categoryId: '',
      contentDetail: '',
      specList: [{ key: '', value: '' }],
      featureList: [{ key: '', value: '' }],
      images: [],
      videoList: [],
    },
  });

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting, isDirty, dirtyFields }, watch, setValue } = form;

  const { UnsavedChangesModal, markSaved } = useLeaveConfirm(isDirty);
  const [isFormReady, setIsFormReady] = useState(!isEdit);

  useEffect(() => {
    if (isEdit) setIsFormReady(false);
  }, [id, isEdit]);

  const specFieldArray = useFieldArray({ control, name: 'specList' });
  const featureFieldArray = useFieldArray({ control, name: 'featureList' });
  const imageFieldArray = useFieldArray({ control, name: 'images' });
  const videoFieldArray = useFieldArray({ control, name: 'videoList' });

  const statusValue = watch('status');
  const isFeaturedValue = watch('isFeatured');
  const specListValue = watch('specList');
  const featureListValue = watch('featureList');
  const videoListValue = watch('videoList');
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const getImagePreviewSrc = useObjectUrlCache(imageFieldArray.fields.map((f) => f.imageUrl));

  const [showAI, setShowAI] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleAIGenerateSuccess = (result: any) => {
    if (result.name) setValue('name', result.name, { shouldDirty: true });
    if (result.price !== undefined) setValue('price', result.price, { shouldDirty: true });
    if (result.contentDetail) setValue('contentDetail', result.contentDetail, { shouldDirty: true });

    if (result.specs && result.specs.length > 0) {
      specFieldArray.replace(result.specs);
    }

    if (result.features && result.features.length > 0) {
      featureFieldArray.replace(result.features);
    }
  };

  useEffect(() => {
    if (isEdit && productData) {
      const specs = productData.detail?.specifications || {};
      const specsArray = Object.entries(specs).map(([key, value]) => ({ key, value: String(value) }));

      const features = productData.detail?.features || {};
      const featuresArray = Object.entries(features).map(([key, value]) => ({ key, value: String(value) }));

      const videoUrls = (productData.detail as any)?.videoUrls || [];

      reset({
        name: productData.name,
        price: productData.price ?? null,
        thumbnailUrl: productData.thumbnailUrl,
        isFeatured: productData.isFeatured,
        status: productData.status,
        categoryId: productData.categoryId,
        contentDetail: productData.detail?.contentDetail || '',
        specList: specsArray.length ? specsArray : [{ key: '', value: '' }],
        featureList: featuresArray.length ? featuresArray : [{ key: '', value: '' }],
        images: (productData.images || []).map((img) => ({
          imageUrl: img.imageUrl,
          isMain: img.isMain || false,
          orderIndex: img.orderIndex || 0,
        })),
        videoList: videoUrls.map((url: string) => ({ url })),
      });
      setIsFormReady(true);
    }
  }, [isEdit, productData, reset]);

  const onSubmit = async (validatedData: any) => {
    const data: CreateProductInput = { ...validatedData };

    if (specListValue && specListValue.length > 0) {
      const specsObj = specListValue.reduce((acc: any, item) => {
        if (item.key && item.key.trim()) {
          acc[item.key.trim()] = item.value;
        }
        return acc;
      }, {});

      if (Object.keys(specsObj).length > 0) {
        data.specifications = specsObj;
      }
    }

    if (featureListValue && featureListValue.length > 0) {
      const featuresObj = featureListValue.reduce((acc: any, item) => {
        if (item.key && item.key.trim()) {
          acc[item.key.trim()] = item.value;
        }
        return acc;
      }, {});

      if (Object.keys(featuresObj).length > 0) {
        data.features = featuresObj;
      }
    }

    if (videoListValue && videoListValue.length > 0) {
      (data as any).videoUrls = videoListValue.map((item) => item.url.trim()).filter(Boolean);
    }

    try {
      setIsUploadingImages(true);
      data.thumbnailUrl = await resolveImageValue(validatedData.thumbnailUrl);
      if (data.images) {
        data.images = await Promise.all(
          data.images.map(async (img: any) => ({ ...img, imageUrl: await resolveImageValue(img.imageUrl) }))
        );
      }
    } catch {
      toast.error(null, 'Tải ảnh lên thất bại, vui lòng thử lại.');
      setIsUploadingImages(false);
      return;
    }
    setIsUploadingImages(false);

    if (isEdit && id) {
      const dirtyData: any = {};
      Object.keys(dirtyFields).forEach((key) => {
        if (key === 'specList') {
          dirtyData.specifications = data.specifications || {};
        } else if (key === 'featureList') {
          dirtyData.features = data.features || {};
        } else if (key === 'images') {
          dirtyData.images = data.images || [];
        } else if (key === 'videoList') {
          (dirtyData as any).videoUrls = (data as any).videoUrls || [];
        } else {
          (dirtyData as any)[key] = (data as any)[key];
        }
      });

      updateMutation.mutate(
        { id, data: dirtyData },
        {
          onSuccess: () => {
            markSaved();
            toast.success('Cập nhật sản phẩm thành công!');
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: (res: any) => {
          markSaved();
          toast.success('Tạo sản phẩm thành công!');
          const newId = res?.id || res?.data?.id;
          if (newId) {
            navigate(`/products/${newId}`);
          } else {
            navigate('/products');
          }
        },
      });
    }
  };

  const handleCancel = () => {
    if (isEdit) {
      reset();
    } else {
      navigate('/products');
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending || isSubmitting || isUploadingImages;

  if (isEdit && (isLoadingDetail || !isFormReady)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 text-black animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <UnsavedChangesModal />
      <AdminPageHeader
        title={isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        subtitle={isEdit ? 'Cập nhật thông tin sản phẩm' : 'Điền thông tin để tạo sản phẩm mới'}
        onBack={handleCancel}
        clientUrl={isEdit && productData?.slug ? `/products/${productData.slug}` : undefined}
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
          title="Sinh dữ liệu sản phẩm tự động bằng AI"
          description="Nhập yêu cầu chi tiết để AI phân tích và tự điền Tên, Giá bán, Thông số kỹ thuật, Tính năng nổi bật và Nội dung mô tả."
          placeholder="Ví dụ: Tạo cho tôi sản phẩm Máy phay CNC 3 trục giá 500 triệu. Gồm thông số điện áp 220V, hành trình X Y Z. Viết mô tả thật chuyên nghiệp..."
          generateContent={generateProductContent}
          onGenerateSuccess={handleAIGenerateSuccess}
          onClose={() => setShowAI(false)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-3 gap-5">
          {/* Main content */}
          <div className="col-span-2 space-y-5">
            <ProductBasicInfoSection form={form} categories={categories} />
            <ProductSpecsSection form={form} specFieldArray={specFieldArray} />
            <ProductFeaturesSection form={form} featureFieldArray={featureFieldArray} />

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">NỘI DUNG CHI TIẾT</h2>
              <Controller
                name="contentDetail"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder="Nhập mô tả chi tiết sản phẩm..."
                  />
                )}
              />
            </div>

            <ProductGallerySection
              form={form}
              imageFieldArray={imageFieldArray}
              getImagePreviewSrc={getImagePreviewSrc}
              onOpenLightbox={(idx) => {
                setLightboxIndex(idx);
                setLightboxOpen(true);
              }}
            />
          </div>

          {/* Right sidebar */}
          <div className="col-span-1">
            <div className="sticky top-6 space-y-5">
              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
                <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">ẢNH ĐẠI DIỆN</h2>
                <Controller
                  name="thumbnailUrl"
                  control={control}
                  render={({ field }) => <FileUpload label="" value={field.value} onChange={field.onChange} bgOption="none" />}
                />
                {errors.thumbnailUrl && <p className="text-xs font-medium text-red-500">{(errors.thumbnailUrl as any).message}</p>}
              </div>

              <ProductVideoSection form={form} videoFieldArray={videoFieldArray} videoListValue={videoListValue} />

              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
                <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">CÀI ĐẶT</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-black">Hiển thị</p>
                    <p className="text-xs font-medium text-gray-500">Hiện trên website</p>
                  </div>
                  <Toggle checked={!!statusValue} onToggle={() => setValue('status', !statusValue, { shouldDirty: true })} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-black">Nổi bật</p>
                    <p className="text-xs font-medium text-gray-500">Trang chủ</p>
                  </div>
                  <Toggle checked={!!isFeaturedValue} onToggle={() => setValue('isFeatured', !isFeaturedValue, { shouldDirty: true })} />
                </div>
              </div>

              <FormActionButtons
                isEdit={isEdit}
                isSaving={isSaving}
                isDirty={isDirty}
                submitText={isUploadingImages ? 'ĐANG TẢI ẢNH LÊN...' : undefined}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      </form>

      <ImageLightbox
        open={lightboxOpen}
        index={lightboxIndex}
        slides={imageFieldArray.fields.map((f) => ({ src: getImagePreviewSrc(f.imageUrl) }))}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(i) => setLightboxIndex(i)}
      />
    </div>
  );
}
