import { useState } from 'react';
import { Loader2, Pencil, Trash2, Globe, Phone, Factory } from 'lucide-react';
import { FileUpload } from '@/components/upload/FileUpload';
import { inputCls, labelCls, btnGhost } from '@/utils/admin-styles';
import type { Facility } from '@/types/about';

const REGIONS = ['Châu ��', 'Bắc Mỹ', 'Trung và Nam Mỹ', 'Châu Âu', 'Khác'];

interface Props {
  facility: Facility;
  onUpdate: (id: string, data: Partial<Facility>) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function FacilityCard({ facility, onUpdate, onDelete, isDeleting }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Facility>>({
    region: facility.region,
    country: facility.country,
    name: facility.name,
    address: facility.address,
    phone: facility.phone,
    imageUrl: facility.imageUrl || '',
  });

  const set = (key: keyof Facility, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    onUpdate(facility.id, form);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Khu vực</label>
            <select
              value={form.region}
              onChange={(e) => set('region', e.target.value)}
              className={inputCls}
            >
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Quốc gia</label>
            <input
              value={form.country}
              onChange={(e) => set('country', e.target.value)}
              className={inputCls}
              placeholder="VD: Nhật Bản"
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Tên cơ sở</label>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Địa chỉ</label>
          <textarea
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            className={`${inputCls} h-auto py-2`}
            rows={2}
          />
        </div>
        <div>
          <label className={labelCls}>Điện thoại</label>
          <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} />
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
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={() => setEditing(false)} className={btnGhost}>
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1.5 text-xs font-bold text-white bg-black rounded hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-lg border border-gray-200 bg-white overflow-hidden hover:border-gray-300 transition-colors shadow-sm">
      {facility.imageUrl ? (
        <img src={facility.imageUrl} alt={facility.name} className="w-full h-36 object-cover" />
      ) : (
        <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
          <Factory className="h-8 w-8 text-gray-300" />
        </div>
      )}

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold text-black leading-snug line-clamp-2 flex-1">
            {facility.name}
          </p>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-black transition-colors cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(facility.id)}
              disabled={isDeleting}
              className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
          <Globe className="h-3 w-3" />
          {facility.region} · {facility.country}
        </div>

        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{facility.address}</p>

        <a
          href={`tel:${facility.phone.replace(/[\s()]/g, '')}`}
          className="flex items-center gap-1 text-[11px] text-black font-medium hover:text-gray-600 transition-colors"
        >
          <Phone className="h-3 w-3 shrink-0" />
          {facility.phone}
        </a>
      </div>
    </div>
  );
}
