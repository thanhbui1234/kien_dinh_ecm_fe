import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useContactSetting, useUpdateContactSetting } from '@/queries/settings';
import { Loader2, Save } from 'lucide-react';
import { UpdateContactSettingInput } from 'shared-api';

export const ContactSettingForm: React.FC = () => {
  const { data: contactSetting, isLoading } = useContactSetting();
  const updateMutation = useUpdateContactSetting();

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<UpdateContactSettingInput>({
    defaultValues: {
      title: '',
      description: '',
      hotline: '',
      zalo: '',
      email: '',
      address: '',
      workingHours: '',
      mapUrl: '',
    },
  });

  useEffect(() => {
    if (contactSetting) {
      reset({
        title: contactSetting.title || '',
        description: contactSetting.description || '',
        hotline: contactSetting.hotline || '',
        zalo: contactSetting.zalo || '',
        email: contactSetting.email || '',
        address: contactSetting.address || '',
        workingHours: contactSetting.workingHours || '',
        mapUrl: contactSetting.mapUrl || '',
      });
    }
  }, [contactSetting, reset]);

  const onSubmit = (data: UpdateContactSettingInput) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-sm font-bold text-black uppercase">CẤU HÌNH THÔNG TIN LIÊN HỆ</h2>
        <button
          type="submit"
          disabled={updateMutation.isPending || isSubmitting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {updateMutation.isPending || isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Lưu thay đổi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Tiêu đề khối liên hệ</label>
          <input
            type="text"
            {...register('title')}
            placeholder="Ví dụ: Liên hệ với chúng tôi"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Hotline tư vấn</label>
          <input
            type="text"
            {...register('hotline')}
            placeholder="Ví dụ: 0374 864 110"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Chat Zalo</label>
          <input
            type="text"
            {...register('zalo')}
            placeholder="Ví dụ: 0374 864 110"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Email liên hệ</label>
          <input
            type="email"
            {...register('email')}
            placeholder="Ví dụ: info@kiendinhecm.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Địa chỉ</label>
          <input
            type="text"
            {...register('address')}
            placeholder="Ví dụ: Hà Nội, Việt Nam"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700">Thời gian làm việc</label>
          <input
            type="text"
            {...register('workingHours')}
            placeholder="Ví dụ: 8:00 - 17:30 (Thứ 2 - Thứ 6)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-gray-700">Mô tả ngắn</label>
          <textarea
            rows={3}
            {...register('description')}
            placeholder="Mô tả ngắn hiển thị bên dưới tiêu đề khối liên hệ"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>
    </form>
  );
};
