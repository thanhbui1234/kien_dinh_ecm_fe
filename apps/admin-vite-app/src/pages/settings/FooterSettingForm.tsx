import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useFooterSetting, useUpdateFooterSetting } from '@/queries/settings';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { UpdateFooterSettingInput } from 'shared-api';

export const FooterSettingForm: React.FC = () => {
  const { data: footerSetting, isLoading } = useFooterSetting();
  const updateMutation = useUpdateFooterSetting();

  const { register, handleSubmit, control, reset, formState: { isSubmitting } } = useForm<UpdateFooterSettingInput>({
    defaultValues: {
      introText: '',
      facebookUrl: '',
      youtubeUrl: '',
      instagramUrl: '',
      phone: '',
      email: '',
      address: '',
      salesPhone: '',
      feedbackPhone: '',
      warrantyPhone: '',
      customerSupportTitle: 'HỖ TRỢ KHÁCH HÀNG',
      customerSupportLinks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'customerSupportLinks',
  });

  useEffect(() => {
    if (footerSetting) {
      reset({
        introText: footerSetting.introText || '',
        facebookUrl: footerSetting.facebookUrl || '',
        youtubeUrl: footerSetting.youtubeUrl || '',
        instagramUrl: footerSetting.instagramUrl || '',
        phone: footerSetting.phone || '',
        email: footerSetting.email || '',
        address: footerSetting.address || '',
        salesPhone: footerSetting.salesPhone || '',
        feedbackPhone: footerSetting.feedbackPhone || '',
        warrantyPhone: footerSetting.warrantyPhone || '',
        customerSupportTitle: footerSetting.customerSupportTitle || 'HỖ TRỢ KHÁCH HÀNG',
        customerSupportLinks: footerSetting.customerSupportLinks || [],
      });
    }
  }, [footerSetting, reset]);

  const onSubmit = (data: UpdateFooterSettingInput) => {
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
        <h2 className="text-sm font-bold text-black uppercase">CẤU HÌNH FOOTER (CHÂN TRANG)</h2>
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
          Lưu cấu hình Footer
        </button>
      </div>

      <div className="space-y-6">
        {/* Khối 1: Giới thiệu & MXH */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-700 uppercase border-b border-gray-100 pb-1.5">Giới thiệu & Mạng xã hội</h3>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Đoạn giới thiệu ngắn ở Footer</label>
            <textarea
              rows={3}
              {...register('introText')}
              placeholder="Giới thiệu thương hiệu hiển thị dưới Logo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Facebook URL</label>
              <input
                type="text"
                {...register('facebookUrl')}
                placeholder="https://facebook.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">YouTube URL</label>
              <input
                type="text"
                {...register('youtubeUrl')}
                placeholder="https://youtube.com/@..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Instagram URL</label>
              <input
                type="text"
                {...register('instagramUrl')}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        </div>

        {/* Khối 2: Hotline & Thông tin liên hệ */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-xs font-bold text-gray-700 uppercase border-b border-gray-100 pb-1.5">Hotline & Thông tin liên hệ Footer</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Hotline Mua hàng</label>
              <input
                type="text"
                {...register('salesPhone')}
                placeholder="Ví dụ: 0943.67.68.69"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Hotline Đóng góp ý kiến</label>
              <input
                type="text"
                {...register('feedbackPhone')}
                placeholder="Ví dụ: 0914 161 122"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Hotline Bảo hành</label>
              <input
                type="text"
                {...register('warrantyPhone')}
                placeholder="Ví dụ: 0912 01 77 55"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Hotline chính (Social)</label>
              <input
                type="text"
                {...register('phone')}
                placeholder="Ví dụ: 0943676869"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Email Footer</label>
              <input
                type="email"
                {...register('email')}
                placeholder="Ví dụ: maygachbetongtb@gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-xs font-semibold text-gray-700">Địa chỉ Footer</label>
              <input
                type="text"
                {...register('address')}
                placeholder="Ví dụ: Công Ty Cổ Phần Thanh Bằng, Xuân Trường, Ninh Bình 420000, Việt Nam"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        </div>

        {/* Khối 3: Đường dẫn Hỗ trợ khách hàng */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
            <h3 className="text-xs font-bold text-gray-700 uppercase">Cột Hỗ trợ khách hàng</h3>
            <button
              type="button"
              onClick={() => append({ label: '', href: '' })}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#5e8dd1] hover:underline"
            >
              <Plus className="h-3.5 w-3.5" /> Thêm liên kết
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Tiêu đề cột Hỗ trợ khách hàng</label>
            <input
              type="text"
              {...register('customerSupportTitle')}
              placeholder="Ví dụ: HỖ TRỢ KHÁCH HÀNG"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="space-y-3 pt-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3">
                <input
                  type="text"
                  {...register(`customerSupportLinks.${index}.label` as const)}
                  placeholder="Nhãn (Ví dụ: Tư vấn ngay)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
                />
                <input
                  type="text"
                  {...register(`customerSupportLinks.${index}.href` as const)}
                  placeholder="Đường dẫn (Ví dụ: /contact)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  title="Xóa link"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
