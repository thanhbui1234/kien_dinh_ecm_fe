import { useState, useEffect } from 'react';
import { Loader2, Pencil, Trash2, MapPin, Phone, Factory, Globe } from 'lucide-react';
import { FileUpload } from '@/components/upload/FileUpload';
import { resolveImageValue } from '@/queries/upload/useUpload';
import { toast } from '@/utils/toast';
import { inputCls, labelCls, btnGhost } from '@/utils/admin-styles';
import type { Facility } from '@/types/about';
import { useSaveFacilityTranslation } from '@/queries/about';
import { EnTranslationModal } from '@/components/common/EnTranslationModal';

type FacilityFormState = Omit<Partial<Facility>, 'imageUrl'> & { imageUrl?: string | File };

interface Props {
  facility: Facility;
  enFacility?: Facility;
  onUpdate: (id: string, data: Partial<Facility>) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function FacilityCard({ facility, enFacility, onUpdate, onDelete, isDeleting }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FacilityFormState>({
    country: facility.country,
    name: facility.name,
    address: facility.address,
    phone: facility.phone,
    imageUrl: facility.imageUrl || '',
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [enModalOpen, setEnModalOpen] = useState(false);
  const [enName, setEnName] = useState(enFacility?.name ?? '');
  const [enCountry, setEnCountry] = useState(enFacility?.country ?? '');
  const [enAddress, setEnAddress] = useState(enFacility?.address ?? '');
  const saveTranslation = useSaveFacilityTranslation();

  useEffect(() => {
    setEnName(enFacility?.name ?? '');
    setEnCountry(enFacility?.country ?? '');
    setEnAddress(enFacility?.address ?? '');
  }, [enFacility]);

  const hasEnContent = !!enFacility?.name;

  const isEnDirty =
    enName !== (enFacility?.name ?? '') ||
    enCountry !== (enFacility?.country ?? '') ||
    enAddress !== (enFacility?.address ?? '');

  const handleEnChange = (key: string, value: string) => {
    if (key === 'name') setEnName(value);
    else if (key === 'country') setEnCountry(value);
    else if (key === 'address') setEnAddress(value);
  };

  const handleSaveEN = () => {
    if (!enName.trim()) return;
    saveTranslation.mutate(
      { id: facility.id, data: { lang: 'EN', name: enName, country: enCountry || facility.country, address: enAddress || facility.address } },
      { onSuccess: () => setEnModalOpen(false) },
    );
  };

  const set = (key: keyof FacilityFormState, val: string | File) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
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
    onUpdate(facility.id, { ...form, imageUrl: resolvedImageUrl });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50/30 p-4 space-y-3">
        <div>
          <label className={labelCls}>Quốc gia</label>
          <input value={form.country} onChange={(e) => set('country', e.target.value)} className={inputCls} placeholder="VD: Nhật Bản" />
        </div>
        <div>
          <label className={labelCls}>Tên cơ sở</label>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Địa chỉ</label>
          <textarea value={form.address} onChange={(e) => set('address', e.target.value)} className={`${inputCls} h-auto py-2`} rows={2} />
        </div>
        <div>
          <label className={labelCls}>Điện thoại</label>
          <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Ảnh cơ sở</label>
          <FileUpload label="Tải ảnh lên" value={form.imageUrl || ''} onChange={(url) => set('imageUrl', url)} bgOption="none" />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={() => setEditing(false)} className={btnGhost}>Hủy</button>
          <button type="button" onClick={handleSave} disabled={isUploadingImage} className="px-3 py-1.5 text-xs font-bold text-white bg-black rounded hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50">
            {isUploadingImage ? 'Đang tải ảnh lên...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="group rounded-lg border border-gray-200 bg-white overflow-hidden hover:border-gray-300 transition-colors shadow-sm">
        {facility.imageUrl ? (
          <img src={facility.imageUrl} alt={facility.name} className="w-full h-36 object-cover" />
        ) : (
          <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
            <Factory className="h-8 w-8 text-gray-300" />
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
          <button
            type="button"
            onClick={() => setEnModalOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer bg-gray-100 text-gray-500 hover:bg-purple-100 hover:text-purple-700"
          >
            <Globe className="h-3 w-3" />
            EN
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block ml-0.5 ${hasEnContent ? 'bg-emerald-500' : 'bg-amber-400'}`}
              title={hasEnContent ? 'Đã có bản dịch EN' : 'Chưa có bản dịch EN'}
            />
          </button>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => setEditing(true)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-black transition-colors cursor-pointer">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={() => onDelete(facility.id)} disabled={isDeleting} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50">
              {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* VI content */}
        <div className="p-4 space-y-2">
          <p className="text-xs font-semibold text-black leading-snug line-clamp-2">{facility.name}</p>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            <MapPin className="h-3 w-3" />{facility.country}
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{facility.address}</p>
          <a href={`tel:${facility.phone.replace(/[\s()]/g, '')}`} className="flex items-center gap-1 text-[11px] text-black font-medium hover:text-gray-600 transition-colors">
            <Phone className="h-3 w-3 shrink-0" />{facility.phone}
          </a>
        </div>
      </div>

      <EnTranslationModal
        isOpen={enModalOpen}
        onOpenChange={setEnModalOpen}
        title={facility.name}
        fields={[
          { key: 'name', label: 'Tên cơ sở', viValue: facility.name, enValue: enName, required: true },
          { key: 'country', label: 'Quốc gia', viValue: facility.country, enValue: enCountry },
          { key: 'address', label: 'Địa chỉ', viValue: facility.address, enValue: enAddress, multiline: true },
        ]}
        onChange={handleEnChange}
        onSave={handleSaveEN}
        isSaving={saveTranslation.isPending}
        isDirty={isEnDirty}
      />
    </>
  );
}
