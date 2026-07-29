import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useCompanyLocations,
  useCreateCompanyLocation,
  useUpdateCompanyLocation,
  useDeleteCompanyLocation,
} from '@/queries/about';
import { Loader2, Plus, Edit2, Trash2, MapPin, Navigation, Save, Eye } from 'lucide-react';
import { CompanyLocation, CreateCompanyLocationInput } from 'shared-api';

function getEmbedUrl(addressOrIframe?: string): string {
  if (!addressOrIframe) return '';
  const match = addressOrIframe.match(/src=["']([^"']+)["']/);
  if (match && match[1]) return match[1];
  if (addressOrIframe.startsWith('http://') || addressOrIframe.startsWith('https://')) return addressOrIframe;
  return `https://www.google.com/maps?q=${encodeURIComponent(addressOrIframe)}&output=embed`;
}

export function LocationSectionTab() {
  const { data: locations, isLoading } = useCompanyLocations();
  const createMutation = useCreateCompanyLocation();
  const updateMutation = useUpdateCompanyLocation();
  const deleteMutation = useDeleteCompanyLocation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm<CreateCompanyLocationInput>({
    defaultValues: {
      title: 'Vị trí nhà máy',
      addressLabel: 'ĐỊA CHỈ NHÀ MÁY',
      address: '',
      directionsUrl: '',
      mapUrl: '',
      orderIndex: 0,
    },
  });

  const watchMapUrl = watch('mapUrl');
  const watchAddress = watch('address');
  const previewSrc = getEmbedUrl(watchMapUrl || watchAddress);

  const handleStartCreate = () => {
    reset({
      title: 'Vị trí nhà máy',
      addressLabel: 'ĐỊA CHỈ NHÀ MÁY',
      address: '',
      directionsUrl: '',
      mapUrl: '',
      orderIndex: (locations?.length || 0) + 1,
    });
    setIsCreating(true);
    setEditingId(null);
  };

  const handleStartEdit = (loc: CompanyLocation) => {
    setEditingId(loc.id);
    reset({
      title: loc.title || 'Vị trí nhà máy',
      addressLabel: loc.addressLabel || 'ĐỊA CHỈ NHÀ MÁY',
      address: loc.address || '',
      directionsUrl: loc.directionsUrl || '',
      mapUrl: loc.mapUrl || '',
      orderIndex: loc.orderIndex || 0,
    });
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
  };

  const onSubmit = (data: CreateCompanyLocationInput) => {
    if (isCreating) {
      createMutation.mutate(data, {
        onSuccess: () => setIsCreating(false),
      });
    } else if (editingId) {
      updateMutation.mutate(
        { id: editingId, data },
        { onSuccess: () => setEditingId(null) }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa vị trí này?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 text-black animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-black uppercase">QUẢN LÝ VỊ TRÍ CÔNG TY & NHÀ MÁY</h2>
          <p className="text-xs text-gray-500 mt-0.5">Cấu hình các vị trí hiển thị trên trang Về chúng tôi (About Us)</p>
        </div>
        {!isCreating && !editingId && (
          <button
            type="button"
            onClick={handleStartCreate}
            className="inline-flex items-center gap-2 px-3 py-2 bg-black text-white text-xs font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Thêm vị trí mới
          </button>
        )}
      </div>

      {/* Form Tạo / Sửa */}
      {(isCreating || editingId) && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-black/10 bg-white p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-xs font-bold text-black uppercase">
              {isCreating ? 'THÊM VỊ TRÍ MỚI' : 'CHỈNH SỬA VỊ TRÍ'}
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending || isSubmitting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-md hover:bg-gray-800 disabled:opacity-50"
              >
                {createMutation.isPending || updateMutation.isPending || isSubmitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Lưu vị trí
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cột trái: Các trường thông tin */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Tiêu đề vị trí</label>
                <input
                  type="text"
                  required
                  {...register('title', { required: true })}
                  placeholder="Ví dụ: Vị trí nhà máy / Văn phòng đại diện"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Nhãn địa chỉ (Label nhỏ)</label>
                <input
                  type="text"
                  required
                  {...register('addressLabel', { required: true })}
                  placeholder="Ví dụ: ĐỊA CHỈ NHÀ MÁY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Địa chỉ chi tiết</label>
                <textarea
                  required
                  rows={2}
                  {...register('address', { required: true })}
                  placeholder="Ví dụ: Công Ty Cổ Phần Thanh Bằng, Xuân Trường, Ninh Bình 420000, Việt Nam"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Link chỉ đường Google Maps (Directions URL)</label>
                <input
                  type="text"
                  {...register('directionsUrl')}
                  placeholder="Ví dụ: https://maps.google.com/?q=..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Bản đồ Google Maps (URL / Thẻ nhúng iframe)</label>
                <input
                  type="text"
                  {...register('mapUrl')}
                  placeholder="Dán thẻ <iframe src='...'> hoặc link nhúng https://www.google.com/maps/embed?pb=..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-black focus:outline-none"
                />
                <p className="text-[11px] text-gray-400">Backend sẽ tự động bóc tách link nhúng `src` nếu bạn dán nguyên đoạn mã iframe từ Google Maps.</p>
              </div>
            </div>

            {/* Cột phải: Live Preview Map */}
            <div className="space-y-2 flex flex-col">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <Eye className="h-4 w-4 text-[#5e8dd1]" />
                <span>Xem trước bản đồ (Live Preview)</span>
              </div>
              <div className="flex-1 min-h-[260px] rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                {previewSrc ? (
                  <iframe
                    src={previewSrc}
                    title="Live Preview Map"
                    className="w-full h-full min-h-[260px] border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                ) : (
                  <p className="text-xs text-gray-400 italic">Nhập địa chỉ hoặc dán link Google Maps để xem trước bản đồ</p>
                )}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Danh sách các vị trí hiện có */}
      <div className="space-y-4">
        {(!locations || locations.length === 0) && !isCreating ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
            <MapPin className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-2 text-xs font-medium text-gray-500">Chưa có vị trí nào được tạo</p>
            <button
              type="button"
              onClick={handleStartCreate}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#5e8dd1] hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Tạo vị trí đầu tiên
            </button>
          </div>
        ) : (
          locations?.map((loc) => {
            const isEditingThis = editingId === loc.id;
            if (isEditingThis) return null;

            const locEmbedSrc = getEmbedUrl(loc.mapUrl || loc.address);

            return (
              <div
                key={loc.id}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#5e8dd1] bg-[#5e8dd1]/10 px-2 py-0.5 rounded">
                      {loc.addressLabel || 'VỊ TRÍ'}
                    </span>
                    <h3 className="text-base font-semibold text-black">{loc.title}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(loc)}
                      className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(loc.id)}
                      disabled={deleteMutation.isPending}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-xs text-gray-700">
                      <MapPin className="h-4 w-4 shrink-0 text-[#5e8dd1] mt-0.5" />
                      <span>{loc.address}</span>
                    </div>

                    {loc.directionsUrl && (
                      <a
                        href={loc.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#5e8dd1] font-medium hover:underline pt-1"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        Chỉ đường Google Maps
                      </a>
                    )}
                  </div>

                  {locEmbedSrc && (
                    <div className="h-36 rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                      <iframe
                        src={locEmbedSrc}
                        title={`Bản đồ - ${loc.title}`}
                        className="w-full h-full border-0"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
