import { UseFormReturn, UseFieldArrayReturn } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';

const inputCls = "w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm";

interface ProductFeaturesSectionProps {
  form: UseFormReturn<any>;
  featureFieldArray: UseFieldArrayReturn<any, 'featureList'>;
}

export function ProductFeaturesSection({ form, featureFieldArray }: ProductFeaturesSectionProps) {
  const { register } = form;
  const { fields: featureFields, append: appendFeature, remove: removeFeature } = featureFieldArray;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-sm font-bold text-black">TÍNH NĂNG NỔI BẬT</h2>
        <button
          type="button"
          onClick={() => appendFeature({ key: '', value: '' })}
          className="flex items-center gap-1.5 h-7 px-2.5 rounded border border-gray-300 text-xs font-bold text-black hover:bg-gray-50 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Thêm tính năng
        </button>
      </div>

      <div className="space-y-3">
        {featureFields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-3 relative group">
            <div className="flex-1">
              <input {...register(`featureList.${index}.key` as const)} placeholder="Tên tính năng (VD: Động cơ)" className={inputCls} />
            </div>
            <div className="flex-[2]">
              <input {...register(`featureList.${index}.value` as const)} placeholder="Mô tả (VD: Hoạt động mạnh mẽ)" className={inputCls} />
            </div>
            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="w-9 h-9 rounded border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-all shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {featureFields.length === 0 && (
          <p className="text-xs font-medium text-gray-500 text-center py-4">Chưa có tính năng nổi bật</p>
        )}
      </div>
    </div>
  );
}
