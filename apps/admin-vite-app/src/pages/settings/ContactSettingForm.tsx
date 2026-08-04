import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useContactSetting, useUpdateContactSetting, useSaveContactTranslation, useContactSettingEN } from '@/queries/settings';
import { Loader2, Save, Globe } from 'lucide-react';
import { UpdateContactSettingInput } from 'shared-api';
import { LanguageTabs } from '@/components/common/LanguageTabs';
import { TranslationWarningBanner } from '@/components/common/TranslationWarningBanner';
import { inputCls, labelCls } from '@/utils/admin-styles';

export const ContactSettingForm: React.FC = () => {
  const { data: contactSetting, isLoading } = useContactSetting();
  const { data: contactSettingEN } = useContactSettingEN();
  const updateMutation = useUpdateContactSetting();
  const saveTranslation = useSaveContactTranslation();
  const [activeTab, setActiveTab] = useState<'VI' | 'EN'>('VI');

  // EN fields
  const [enTitle, setEnTitle] = useState('');
  const [enDescription, setEnDescription] = useState('');
  const [enAddress, setEnAddress] = useState('');
  const [enWorkingHours, setEnWorkingHours] = useState('');

  useEffect(() => {
    if (contactSettingEN) {
      setEnTitle(contactSettingEN.title || '');
      setEnDescription(contactSettingEN.description || '');
      setEnAddress(contactSettingEN.address || '');
      setEnWorkingHours(contactSettingEN.workingHours || '');
    }
  }, [contactSettingEN]);

  const isEnDirty =
    enTitle !== (contactSettingEN?.title || '') ||
    enDescription !== (contactSettingEN?.description || '') ||
    enAddress !== (contactSettingEN?.address || '') ||
    enWorkingHours !== (contactSettingEN?.workingHours || '');

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
    <div className="space-y-4">
      <TranslationWarningBanner
        hasEnTranslation={enTitle.trim() !== ''}
        activeTab={activeTab}
        onSwitchToEnTab={() => setActiveTab('EN')}
      />
      <LanguageTabs activeTab={activeTab} onTabChange={setActiveTab} hasEnTranslation={enTitle.trim() !== ''} />

      {/* VI form */}
      <form onSubmit={handleSubmit(onSubmit)} className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-6 ${activeTab === 'VI' ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-sm font-bold text-black uppercase">CẤU HÌNH THÔNG TIN LIÊN HỆ</h2>
          <button
            type="submit"
            disabled={updateMutation.isPending || isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {updateMutation.isPending || isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Lưu thay đổi
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Tiêu đề khối liên hệ</label>
            <input type="text" {...register('title')} placeholder="Ví dụ: Liên hệ với chúng tôi" className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Hotline tư vấn</label>
            <input type="text" {...register('hotline')} placeholder="Ví dụ: 0374 864 110" className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Chat Zalo</label>
            <input type="text" {...register('zalo')} placeholder="Ví dụ: 0374 864 110" className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Email liên hệ</label>
            <input type="email" {...register('email')} placeholder="Ví dụ: info@kiendinhecm.com" className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Địa chỉ</label>
            <input type="text" {...register('address')} placeholder="Ví dụ: Hà Nội, Việt Nam" className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Thời gian làm việc</label>
            <input type="text" {...register('workingHours')} placeholder="Ví dụ: 8:00 - 17:30 (Thứ 2 - Thứ 6)" className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-gray-700">Mô tả ngắn</label>
            <textarea rows={3} {...register('description')} placeholder="Mô tả ngắn hiển thị bên dưới tiêu đề khối liên hệ" className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black" />
          </div>
        </div>
      </form>

      {/* EN form */}
      <div className={`rounded-lg border border-purple-200 bg-white p-6 shadow-sm space-y-6 ${activeTab === 'EN' ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-purple-600" />
            <h2 className="text-sm font-bold text-gray-900 uppercase">THÔNG TIN LIÊN HỆ (Tiếng Anh)</h2>
          </div>
          <button
            type="button"
            onClick={() => saveTranslation.mutate({
              lang: 'EN',
              title: enTitle || contactSetting?.title || '',
              description: enDescription || contactSetting?.description || '',
              address: enAddress || undefined,
              workingHours: enWorkingHours || undefined,
            })}
            disabled={saveTranslation.isPending || !isEnDirty}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-xs font-medium rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {saveTranslation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Lưu bản dịch EN
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className={labelCls}>Title (EN)</label>
            <input type="text" value={enTitle} onChange={(e) => setEnTitle(e.target.value)} className={inputCls} placeholder={contactSetting?.title || 'Contact section title in English...'} />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Address (EN)</label>
            <input type="text" value={enAddress} onChange={(e) => setEnAddress(e.target.value)} className={inputCls} placeholder={contactSetting?.address || 'Address in English...'} />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Working Hours (EN)</label>
            <input type="text" value={enWorkingHours} onChange={(e) => setEnWorkingHours(e.target.value)} className={inputCls} placeholder={contactSetting?.workingHours || 'e.g. 8:00 AM - 5:30 PM (Mon - Fri)'} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className={labelCls}>Description (EN)</label>
            <textarea rows={3} value={enDescription} onChange={(e) => setEnDescription(e.target.value)} className={`${inputCls} h-auto py-2`} placeholder={contactSetting?.description || 'Short description in English...'} />
          </div>
        </div>
      </div>
    </div>
  );
};
