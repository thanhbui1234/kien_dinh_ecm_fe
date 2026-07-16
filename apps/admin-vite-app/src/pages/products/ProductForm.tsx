import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { FileUpload } from '@/components/upload/FileUpload';
import { useCreateProduct, useUpdateProduct, useProductDetail } from '@/queries/products';
import { useCategories } from '@/queries/categories';
import { CreateProductSchema, CreateProductInput } from 'shared-api';

const inputCls = "w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2";

const Toggle = ({ checked, onToggle }: { checked: boolean; onToggle: () => void }) => (
  <button type="button" onClick={onToggle}
    className={`relative inline-flex w-10 h-5 rounded-full transition-colors shadow-sm border ${checked ? 'bg-black border-black' : 'bg-gray-100 border-gray-300'}`}>
    <span className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full shadow transition-transform ${checked ? 'translate-x-5 bg-white' : 'translate-x-0 bg-gray-400'}`} />
  </button>
);

type FormValues = CreateProductInput & { specList: { key: string, value: string }[] };

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: categoriesData } = useCategories({ limit: 100 });
  const categories = categoriesData || [];
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const { data: productData, isLoading: isLoadingDetail } = useProductDetail(id || '');

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting }, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(CreateProductSchema) as any,
    defaultValues: { 
      name: '', price: undefined, thumbnailUrl: '', isFeatured: false, status: true, categoryId: '', contentDetail: '',
      specList: [{ key: '', value: '' }]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specList',
  });

  const statusValue = watch('status');
  const isFeaturedValue = watch('isFeatured');
  const specListValue = watch('specList');

  useEffect(() => {
    if (isEdit && productData) {
      const specs = productData.detail?.specifications || {};
      const specsArray = Object.entries(specs).map(([key, value]) => ({ key, value: String(value) }));

      reset({
        name: productData.name,
        price: productData.price || undefined,
        thumbnailUrl: productData.thumbnailUrl,
        isFeatured: productData.isFeatured,
        status: productData.status,
        categoryId: productData.categoryId,
        contentDetail: productData.detail?.contentDetail || '',
        specList: specsArray.length ? specsArray : [{ key: '', value: '' }]
      });
    }
  }, [isEdit, productData, reset]);

  const onSubmit = (validatedData: any) => {
    const data: CreateProductInput = { ...validatedData };

    // Convert specList array to a JSON object for specifications
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

    if (isEdit && id) {
      updateMutation.mutate({ id, data }, { onSuccess: () => navigate('/products') });
    } else {
      createMutation.mutate(data, { onSuccess: () => navigate('/products') });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending || isSubmitting;

  if (isEdit && isLoadingDetail) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 text-black animate-spin" /></div>;
  }

  return (
    <div className="space-y-5 max-w-5xl pb-12">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate('/products')}
          className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition-all shadow-sm">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-black">{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>
          <p className="text-xs font-medium text-gray-500 mt-0.5">{isEdit ? 'Cập nhật thông tin sản phẩm' : 'Điền thông tin để tạo sản phẩm mới'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-3 gap-5">
          {/* Main content */}
          <div className="col-span-2 space-y-5">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">THÔNG TIN CƠ BẢN</h2>
              <div>
                <label className={labelCls}>Tên sản phẩm <span className="text-red-500">*</span></label>
                <input {...register('name')} placeholder="Ví dụ: Máy phay CNC 3 trục" className={inputCls} />
                {errors.name && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.name.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Danh mục <span className="text-red-500">*</span></label>
                  <select {...register('categoryId')} className={inputCls}>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                  {errors.categoryId && <p className="text-xs font-medium text-red-500 mt-1.5">{(errors.categoryId as any).message}</p>}
                </div>
                <div>
                  <label className={labelCls}>Giá bán (VNĐ)</label>
                  <input {...register('price', { setValueAs: (v) => v === '' || Number.isNaN(Number(v)) ? undefined : Number(v) })} type="number" placeholder="Để trống nếu liên hệ" className={inputCls} />
                  {errors.price && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.price?.message as any}</p>}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-sm font-bold text-black">THÔNG SỐ KỸ THUẬT</h2>
                <button type="button" onClick={() => append({ key: '', value: '' })}
                  className="flex items-center gap-1.5 h-7 px-2.5 rounded border border-gray-300 text-xs font-bold text-black hover:bg-gray-50 transition-colors">
                  <Plus className="h-3.5 w-3.5" /> Thêm thông số
                </button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-3 relative group">
                    <div className="flex-1">
                      <input {...register(`specList.${index}.key` as const)} placeholder="Tên thông số (VD: Điện áp)" className={inputCls} />
                    </div>
                    <div className="flex-[2]">
                      <input {...register(`specList.${index}.value` as const)} placeholder="Giá trị (VD: 220V)" className={inputCls} />
                    </div>
                    <button type="button" onClick={() => remove(index)}
                      className="w-9 h-9 rounded border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-all shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {fields.length === 0 && (
                  <p className="text-xs font-medium text-gray-500 text-center py-4">Chưa có thông số kỹ thuật</p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">NỘI DUNG CHI TIẾT</h2>
              <Controller name="contentDetail" control={control}
                render={({ field }) => <RichTextEditor value={field.value || ''} onChange={field.onChange} placeholder="Nhập mô tả chi tiết sản phẩm..." />}
              />
            </div>
          </div>

          {/* Right sidebar */}
          <div className="col-span-1 space-y-5">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">ẢNH ĐẠI DIỆN</h2>
              <Controller name="thumbnailUrl" control={control}
                render={({ field }) => <FileUpload label="" value={field.value} onChange={field.onChange} bgOption="none" />}
              />
              {errors.thumbnailUrl && <p className="text-xs font-medium text-red-500">{errors.thumbnailUrl.message}</p>}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">CÀI ĐẶT</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-black">Hiển thị</p>
                  <p className="text-xs font-medium text-gray-500">Hiện trên website</p>
                </div>
                <Toggle checked={!!statusValue} onToggle={() => setValue('status', !statusValue)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-black">Nổi bật</p>
                  <p className="text-xs font-medium text-gray-500">Trang chủ</p>
                </div>
                <Toggle checked={!!isFeaturedValue} onToggle={() => setValue('isFeatured', !isFeaturedValue)} />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button type="submit" disabled={isSaving}
                className="flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-bold transition-colors shadow-sm">
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEdit ? 'CẬP NHẬT' : 'TẠO SẢN PHẨM'}
              </button>
              <button type="button" onClick={() => navigate('/products')} disabled={isSaving}
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
