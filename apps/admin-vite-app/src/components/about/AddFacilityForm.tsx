import { useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import { FileUpload } from '@/components/upload/FileUpload';
import { useCreateFacility } from '@/queries/about';
import { resolveImageValue } from '@/queries/upload/useUpload';
import { toast } from '@/utils/toast';
import { inputCls, labelCls, btnPrimary, btnGhost } from '@/utils/admin-styles';
import type { Facility } from '@/types/about';

// imageUrl may hold a File that hasn't been uploaded yet — upload is
// deferred until submit — this is a form-only type, not the API's Facility DTO.
type FacilityFormValues = Omit<Facility, 'id' | 'imageUrl'> & { imageUrl?: string | File };

const defaultForm: FacilityFormValues = {
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
  const [form, setForm] = useState<FacilityFormValues>({ ...defaultForm, orderIndex });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const set = (key: keyof FacilityFormValues, val: string | number | File) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.country.trim()) return;

    let resolvedImageUrl: string;
    try {
      setIsUploadingImage(true);
      resolvedImageUrl = await resolveImageValue(form.imageUrl);
    } catch {
      toast.error(null, 'Tải ảnh lên thất bại, vui lòng thử lại.');
      setIsUploadingImage(false);
      return;
    }
    setIsUploadingImage(false);

    createMutation.mutate({ ...form, imageUrl: resolvedImageUrl }, { onSuccess: onClose });
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
          disabled={!form.name.trim() || !form.country.trim() || createMutation.isPending || isUploadingImage}
          className={btnPrimary}
        >
          {(createMutation.isPending || isUploadingImage) ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          {isUploadingImage ? 'Đang tải ảnh lên...' : 'Thêm cơ sở'}
        </button>
      </div>
    </div>
  );
}
