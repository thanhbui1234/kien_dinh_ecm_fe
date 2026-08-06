import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useFooterSetting, useUpdateFooterSetting, useSaveFooterTranslation, useFooterSettingEN } from '@/queries/settings';
import { Loader2, Save, Plus, Trash2, Globe } from 'lucide-react';
import { UpdateFooterSettingInput } from 'shared-api';
import { LanguageTabs } from '@/components/common/LanguageTabs';
import { TranslationWarningBanner } from '@/components/common/TranslationWarningBanner';
import { inputCls, labelCls } from '@/utils/admin-styles';

export const FooterSettingForm: React.FC = () => {
  const { data: footerSetting, isLoading } = useFooterSetting();
  const { data: footerSettingEN } = useFooterSettingEN();
  const updateMutation = useUpdateFooterSetting();
  const saveTranslation = useSaveFooterTranslation();
  const [activeTab, setActiveTab] = useState<'VI' | 'EN'>('VI');

  // EN fields
  const [enIntroText, setEnIntroText] = useState('');
  const [enAddress, setEnAddress] = useState('');
  const [enCustomerSupportTitle, setEnCustomerSupportTitle] = useState('');
  const [enLinks, setEnLinks] = useState<{ label: string; href: string }[]>([]);

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
      // Pre-populate EN links: keep VI hrefs, empty labels for translation
      if (footerSetting.customerSupportLinks?.length) {
        setEnLinks(footerSetting.customerSupportLinks.map((l) => ({ label: '', href: l.href })));
      }
    }
  }, [footerSetting, reset]);

  useEffect(() => {
    if (footerSettingEN) {
      setEnIntroText(footerSettingEN.introText || '');
      setEnAddress(footerSettingEN.address || '');
      setEnCustomerSupportTitle(footerSettingEN.customerSupportTitle || '');
      if (footerSettingEN.customerSupportLinks?.length) {
        setEnLinks(footerSettingEN.customerSupportLinks.map((l) => ({ label: l.label, href: l.href })));
      }
    }
  }, [footerSettingEN]);

  const isEnDirty = (() => {
    const savedLinks = footerSettingEN?.customerSupportLinks?.map((l) => ({ label: l.label, href: l.href }))
      ?? enLinks.map((l) => ({ label: '', href: l.href }));
    return (
      enIntroText !== (footerSettingEN?.introText || '') ||
      enAddress !== (footerSettingEN?.address || '') ||
      enCustomerSupportTitle !== (footerSettingEN?.customerSupportTitle || '') ||
      JSON.stringify(enLinks) !== JSON.stringify(savedLinks)
    );
  })();

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

  const viLinks = footerSetting?.customerSupportLinks || [];

  return (
    <div className="space-y-4">
      <TranslationWarningBanner
        hasEnTranslation={enIntroText.trim() !== ''}
        activeTab={activeTab}
        onSwitchToEnTab={() => setActiveTab('EN')}
      />
      <LanguageTabs activeTab={activeTab} onTabChange={setActiveTab} hasEnTranslation={enIntroText.trim() !== ''} />

      {/* VI form */}
      <form onSubmit={handleSubmit(onSubmit)} className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-6 ${activeTab === 'VI' ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-sm font-bold text-black uppercase">CẤU HÌNH FOOTER (CHÂN TRANG)</h2>
          <button type="submit" disabled={updateMutation.isPending || isSubmitting} className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors">
            {updateMutation.isPending || isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Lưu cấu hình Footer
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-1.5">
              <h3 className="text-xs font-bold text-gray-700 uppercase">Cột 1 — Giới thiệu & Mạng xã hội</h3>
              <span className="text-[10px] text-gray-400 italic">(hiển thị dưới Logo ở góc trái Footer)</span>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Đoạn giới thiệu ngắn</label>
              <textarea rows={3} {...register('introText')} placeholder="Giới thiệu thương hiệu hiển thị dưới Logo..." className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Facebook URL</label>
                <input type="text" {...register('facebookUrl')} placeholder="https://facebook.com/..." className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">YouTube URL</label>
                <input type="text" {...register('youtubeUrl')} placeholder="https://youtube.com/@..." className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Email <span className="font-normal text-gray-400">(icon ✉ cạnh social)</span></label>
                <input type="email" {...register('email')} placeholder="Ví dụ: maygachbetongtb@gmail.com" className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Số điện thoại <span className="font-normal text-gray-400">(icon 📞 cạnh social)</span></label>
                <input type="text" {...register('phone')} placeholder="Ví dụ: 0374864110" className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-1.5">
              <h3 className="text-xs font-bold text-gray-700 uppercase">Cột 3 — Hỗ trợ tư vấn</h3>
              <span className="text-[10px] text-gray-400 italic">(địa chỉ, hotline hiển thị ở cột "HỖ TRỢ TƯ VẤN")</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Hotline Mua hàng</label>
                <input type="text" {...register('salesPhone')} placeholder="Ví dụ: 0943.67.68.69" className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Hotline Đóng góp ý kiến</label>
                <input type="text" {...register('feedbackPhone')} placeholder="Ví dụ: 0914 161 122" className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Hotline Bảo hành</label>
                <input type="text" {...register('warrantyPhone')} placeholder="Ví dụ: 0912 01 77 55" className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
              <div className="space-y-1.5 md:col-span-3">
                <label className="text-xs font-semibold text-gray-700">Địa chỉ</label>
                <input type="text" {...register('address')} placeholder="Ví dụ: Công Ty Cổ Phần Thanh Bằng, Xuân Trường, Ninh Bình 420000, Việt Nam" className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-gray-700 uppercase">Cột 4 — Hỗ trợ khách hàng</h3>
                <span className="text-[10px] text-gray-400 italic">(danh sách link ở cột "HỖ TRỢ KHÁCH HÀNG")</span>
              </div>
              <button type="button" onClick={() => append({ label: '', href: '' })} className="inline-flex items-center gap-1 text-xs font-semibold text-[#5e8dd1] hover:underline">
                <Plus className="h-3.5 w-3.5" /> Thêm liên kết
              </button>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Tiêu đề cột</label>
              <input type="text" {...register('customerSupportTitle')} placeholder="Ví dụ: HỖ TRỢ KHÁCH HÀNG" className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div className="space-y-3 pt-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3">
                  <input type="text" {...register(`customerSupportLinks.${index}.label` as const)} placeholder="Nhãn (Ví dụ: Tư vấn ngay)" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
                  <input type="text" {...register(`customerSupportLinks.${index}.href` as const)} placeholder="Đường dẫn (Ví dụ: /contact)" className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
                  <button type="button" onClick={() => remove(index)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors" title="Xóa link">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>

      {/* EN form */}
      <div className={`rounded-lg border border-purple-200 bg-white p-6 shadow-sm space-y-6 ${activeTab === 'EN' ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-purple-600" />
            <h2 className="text-sm font-bold text-gray-900 uppercase">FOOTER (Tiếng Anh)</h2>
          </div>
          <button
            type="button"
            onClick={() => saveTranslation.mutate({
              lang: 'EN',
              introText: enIntroText,
              address: enAddress || undefined,
              customerSupportTitle: enCustomerSupportTitle || undefined,
              customerSupportLinks: enLinks.some((l) => l.label.trim())
                ? enLinks.map((l, i) => ({ label: l.label || viLinks[i]?.label || '', href: viLinks[i]?.href || l.href }))
                : undefined,
            })}
            disabled={saveTranslation.isPending || !isEnDirty}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-xs font-medium rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {saveTranslation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Lưu bản dịch EN
          </button>
        </div>

        <div className="space-y-6">
          {/* EN Group 1: Cột 1 — Giới thiệu */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-purple-100 pb-1.5">
              <h3 className="text-xs font-bold text-purple-700 uppercase">Cột 1 — Giới thiệu</h3>
              <span className="text-[10px] text-gray-400 italic">(đoạn text hiển thị dưới Logo)</span>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Đoạn giới thiệu (EN) *</label>
              <textarea
                rows={3}
                value={enIntroText}
                onChange={(e) => setEnIntroText(e.target.value)}
                className={`${inputCls} h-auto py-2`}
                placeholder={footerSetting?.introText || 'Brand introduction in English...'}
              />
            </div>
          </div>

          {/* EN Group 2: Cột 3 — Hỗ trợ tư vấn */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 border-b border-purple-100 pb-1.5">
              <h3 className="text-xs font-bold text-purple-700 uppercase">Cột 3 — Hỗ trợ tư vấn</h3>
              <span className="text-[10px] text-gray-400 italic">(địa chỉ — hotlines là số điện thoại, không cần dịch)</span>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Địa chỉ (EN)</label>
              <input
                type="text"
                value={enAddress}
                onChange={(e) => setEnAddress(e.target.value)}
                className={inputCls}
                placeholder={footerSetting?.address || 'e.g. Thanh Bang JSC, Xuan Truong, Ninh Binh 420000, Vietnam'}
              />
            </div>
          </div>

          {/* EN Group 3: Cột 4 — Hỗ trợ khách hàng */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 border-b border-purple-100 pb-1.5">
              <h3 className="text-xs font-bold text-purple-700 uppercase">Cột 4 — Hỗ trợ khách hàng</h3>
              <span className="text-[10px] text-gray-400 italic">(tiêu đề cột + nhãn các liên kết)</span>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Tiêu đề cột (EN)</label>
              <input
                type="text"
                value={enCustomerSupportTitle}
                onChange={(e) => setEnCustomerSupportTitle(e.target.value)}
                className={inputCls}
                placeholder={footerSetting?.customerSupportTitle || 'CUSTOMER SUPPORT'}
              />
            </div>

            {enLinks.length > 0 && (
              <div className="space-y-2 pt-1">
                <p className={labelCls}>Nhãn liên kết (EN) — đường dẫn giữ nguyên từ VI</p>
                {enLinks.map((link, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-3 items-center">
                    <div className="px-3 py-2 rounded-md bg-gray-50 border border-gray-200 text-xs text-gray-500 truncate" title={viLinks[idx]?.label}>
                      VI: {viLinks[idx]?.label || '—'}
                    </div>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => setEnLinks((prev) => prev.map((l, i) => i === idx ? { ...l, label: e.target.value } : l))}
                      className={inputCls}
                      placeholder="Label in English..."
                    />
                  </div>
                ))}
              </div>
            )}
            {enLinks.length === 0 && (
              <p className="text-xs text-gray-400 italic">Không có links — thêm links ở tab VI trước.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
