import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Loader2, Search, X, CheckCircle2 } from 'lucide-react';
import { FileUpload } from '@/components/upload/FileUpload';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { useCreateProject, useUpdateProject, useProjectDetail } from '@/queries/projects';
import { useProducts } from '@/queries/products';
import { CreateProjectSchema, CreateProjectInput } from 'shared-api';

const inputCls = "w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2";

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
  const [productSearch, setProductSearch] = useState('');

  const { data: productsData } = useProducts({ limit: 100 });
  const allProducts = productsData?.items || [];
  const filteredProducts = allProducts.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const { data: projectData, isLoading: isLoadingDetail } = useProjectDetail(id || '');

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<CreateProjectInput>({
    resolver: zodResolver(CreateProjectSchema) as any,
    defaultValues: {
      name: '', description: '', coverImage: '', status: true,
      contentDetail: '', productIds: [], categoryIds: [],
    } as Partial<CreateProjectInput> as CreateProjectInput,
  });

  const statusValue = watch('status');
  const selectedProductIds = watch('productIds') || [];

  useEffect(() => {
    if (isEdit && projectData) {
      reset({
        name: projectData.name,
        description: projectData.description,
        coverImage: projectData.coverImage,
        status: projectData.status,
        contentDetail: (projectData as any).detail?.contentDetail || '',
        productIds: (projectData as any).productIds || [],
        categoryIds: (projectData as any).categoryIds || [],
      });
    }
  }, [isEdit, projectData, reset]);

  const toggleProduct = (pid: string) => {
    const current = selectedProductIds as string[];
    setValue('productIds' as any, current.includes(pid) ? current.filter(x => x !== pid) : [...current, pid]);
  };

  const selectedProducts = allProducts.filter(p => (selectedProductIds as string[]).includes(p.id));
  const isSaving = createMutation.isPending || updateMutation.isPending || isSubmitting;

  const onSubmit = (data: CreateProjectInput) => {
    if (isEdit && id) {
      updateMutation.mutate({ id, data }, { onSuccess: () => navigate('/projects') });
    } else {
      createMutation.mutate(data, { onSuccess: () => navigate('/projects') });
    }
  };

  if (isEdit && isLoadingDetail) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 text-black animate-spin" /></div>;
  }

  return (
    <div className="space-y-5 max-w-5xl pb-12">
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

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5">
        <div className="grid grid-cols-3 gap-5">
          {/* Main */}
          <div className="col-span-2 space-y-5">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">THÔNG TIN CƠ BẢN</h2>
              <div>
                <label className={labelCls}>Tên dự án <span className="text-red-500">*</span></label>
                <input {...register('name')} placeholder="VD: Lắp đặt máy phay CNC tại Hà Nội" className={inputCls} />
                {errors.name && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.name.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Mô tả ngắn <span className="text-red-500">*</span></label>
                <textarea {...register('description')} rows={3} placeholder="Mô tả ngắn gọn về dự án..."
                  className="w-full px-3 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm resize-none" />
                {errors.description && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.description.message}</p>}
              </div>
            </div>

            {/* Product Picker */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-sm font-bold text-black">SẢN PHẨM LIÊN QUAN</h2>
                {selectedProducts.length > 0 && (
                  <span className="text-xs text-black font-bold border border-black rounded px-2 py-0.5">{selectedProducts.length} đã chọn</span>
                )}
              </div>

              {selectedProducts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedProducts.map(p => (
                    <div key={p.id} className="flex items-center gap-1.5 bg-gray-100 border border-gray-300 text-black font-semibold text-xs px-2.5 py-1 rounded">
                      {p.thumbnailUrl && <img src={p.thumbnailUrl} alt={p.name} className="w-4 h-4 rounded-sm object-cover" />}
                      <span className="max-w-[150px] truncate">{p.name}</span>
                      <button type="button" onClick={() => toggleProduct(p.id)} className="hover:text-red-600 transition-colors ml-1">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={productSearch} onChange={e => setProductSearch(e.target.value)}
                  placeholder="Tìm sản phẩm..."
                  className="w-full h-9 pl-9 pr-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                {filteredProducts.length === 0 ? (
                  <p className="col-span-2 text-sm font-medium text-gray-500 text-center py-5">Không tìm thấy sản phẩm</p>
                ) : filteredProducts.map(p => {
                  const isSelected = (selectedProductIds as string[]).includes(p.id);
                  return (
                    <button key={p.id} type="button" onClick={() => toggleProduct(p.id)}
                      className={`flex items-center gap-3 p-2.5 rounded-md border text-left transition-all ${
                        isSelected ? 'border-black bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}>
                      <div className="shrink-0 relative">
                        <img src={p.thumbnailUrl || 'https://placehold.co/32x32/f9fafb/6b7280?text=...'} alt={p.name}
                          className="w-8 h-8 rounded-sm object-cover border border-gray-200" />
                        {isSelected && (
                          <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-black" />
                          </div>
                        )}
                      </div>
                      <span className={`text-xs truncate font-bold ${isSelected ? 'text-black' : 'text-gray-600'}`}>
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rich text */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">NỘI DUNG CHI TIẾT</h2>
              <Controller name={'contentDetail' as any} control={control}
                render={({ field }) => <RichTextEditor value={field.value || ''} onChange={field.onChange} placeholder="Nhập nội dung chi tiết về dự án..." />}
              />
            </div>
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
                <Toggle checked={!!statusValue} onToggle={() => setValue('status' as any, !statusValue)} />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button type="submit" disabled={isSaving}
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
