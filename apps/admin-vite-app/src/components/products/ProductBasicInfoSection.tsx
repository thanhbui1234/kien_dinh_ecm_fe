import { Controller, UseFormReturn } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const inputCls = "w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2";

interface Category {
  id: string;
  name: string;
}

interface ProductBasicInfoSectionProps {
  form: UseFormReturn<any>;
  categories: Category[];
}

export function ProductBasicInfoSection({ form, categories }: ProductBasicInfoSectionProps) {
  const { register, control, formState: { errors } } = form;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
      <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">THÔNG TIN CƠ BẢN</h2>
      <div>
        <label className={labelCls}>Tên sản phẩm <span className="text-red-500">*</span></label>
        <input {...register('name')} placeholder="Ví dụ: Máy phay CNC 3 trục" className={inputCls} />
        {errors.name && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.name.message as string}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Danh mục <span className="text-red-500">*</span></label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(v) => {
                  if (v === field.value) return;
                  field.onChange(v);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="-- Chọn danh mục --" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.categoryId && <p className="text-xs font-medium text-red-500 mt-1.5">{(errors.categoryId as any).message}</p>}
        </div>
        <div>
          <label className={labelCls}>Giá bán (VNĐ)</label>
          <input
            {...register('price', { setValueAs: (v) => v === '' || Number.isNaN(Number(v)) ? null : Number(v) })}
            type="number"
            placeholder="Để trống nếu liên hệ"
            className={inputCls}
          />
          {errors.price && <p className="text-xs font-medium text-red-500 mt-1.5">{errors.price?.message as any}</p>}
        </div>
      </div>
    </div>
  );
}
