import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { CreateProjectInput } from 'shared-api';

const inputCls = "w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2";

interface ProjectBasicInfoSectionProps {
  register: UseFormRegister<CreateProjectInput>;
  errors: FieldErrors<CreateProjectInput>;
}

export function ProjectBasicInfoSection({ register, errors }: ProjectBasicInfoSectionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
      <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">THÔNG TIN CƠ BẢN</h2>

      <div>
        <label className={labelCls}>
          Tên dự án <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          placeholder="VD: Lắp đặt máy phay CNC tại Hà Nội"
          className={inputCls}
        />
        {errors.name && (
          <p className="text-xs font-medium text-red-500 mt-1.5">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className={labelCls}>
          Mô tả ngắn <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Mô tả ngắn gọn về dự án..."
          className="w-full px-3 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm resize-none"
        />
        {errors.description && (
          <p className="text-xs font-medium text-red-500 mt-1.5">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
}
