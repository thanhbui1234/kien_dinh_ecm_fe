import { useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import { FileUpload } from '@/components/upload/FileUpload';
import { useCreateFacility } from '@/queries/about';
import { inputCls, labelCls, btnPrimary, btnGhost } from '@/utils/admin-styles';
import type { Facility } from '@/types/about';

const REGIONS = ['Châu Á', 'Bắc Mỹ', 'Trung và Nam Mỹ', 'Châu Âu', 'Khác'];

const defaultForm: Omit<Facility, 'id'> = {
  region: 'Châu Á',
  country: '',
  name: '',
  address: '',
  phone: '',
  imageUrl: '',
  orderIndex: 0,
};

interface Props {
  onClose: () => void;
  orderIndex: number;
}

export function AddFacilityForm({ onClose, orderIndex }: Props) {
  const createMutation = useCreateFacility();
  const [form, setForm] = useState<Omit<Facility, 'id'>>({ ...defaultForm, orderIndex });

  const set = (key: keyof Omit<Facility, 'id'>, val: string | number) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.country.trim()) return;
    createMutation.mutate(form, { onSuccess: onClose });
  };

  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-black uppercase tracking-wider">Thêm cơ sở mới</p>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-200 text-gray-500 cursor-pointer transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>
            Khu vực <span className="text-red-400">*</span>
          </label>
          <select
            value={form.region}
            onChange={(e) => set('region', e.target.value)}
            className={inputCls}
          >
            {REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>
            Quốc gia <span className="text-red-400">*</span>
          </label>
          <input
            value={form.country}
            onChange={(e) => set('country', e.target.value)}
            className={inputCls}
            placeholder="VD: Nhật Bản"
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>
          Tên cơ sở <span className="text-red-400">*</span>
        </label>
        <input
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          className={inputCls}
          placeholder="Tên công ty / nhà máy..."
        />
      </div>

      <div>
        <label className={labelCls}>Địa chỉ</label>
        <textarea
          value={form.address}
          onChange={(e) => set('address', e.target.value)}
          className={`${inputCls} h-auto py-2`}
          rows={2}
          placeholder="Địa chỉ đầy đủ..."
        />
      </div>

      <div>
        <label className={labelCls}>Điện thoại</label>
        <input
          value={form.phone}
          onChange={(e) => set('phone', e.target.value)}
          className={inputCls}
          placeholder="+(81)..."
        />
      </div>

      <div>
        <label className={labelCls}>Ảnh cơ sở</label>
        <FileUpload
          label="Tải ảnh lên"
          value={form.imageUrl || ''}
          onChange={(url) => set('imageUrl', url)}
          bgOption="none"
        />
      </div>

      <div className="flex justify-end gap-2 pt-1 border-t border-gray-200">
        <button type="button" onClick={onClose} className={btnGhost}>
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!form.name.trim() || !form.country.trim() || createMutation.isPending}
          className={btnPrimary}
        >
          {createMutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          Thêm cơ sở
        </button>
      </div>
    </div>
  );
}
