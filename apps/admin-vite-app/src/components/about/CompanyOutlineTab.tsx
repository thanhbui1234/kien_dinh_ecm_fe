import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { SystemSetting } from 'shared-api';
import { SettingHtmlItem } from '@/components/common/SettingHtmlItem';
import { FileUpload } from '@/components/upload/FileUpload';
import { uploadFileAndGetUrl } from '@/queries/upload/useUpload';
import { toast } from '@/utils/toast';
import { CompanyInfoTable } from './CompanyInfoTable';
import { useCompanyProfile, useUpdateCompanyProfile, useCompanyProfileEN, useCompanyInfoEN } from '@/queries/about';
import { LanguageTabs } from '@/components/common/LanguageTabs';
import { ProfileEnTranslationSection, CompanyInfoEnTranslationSection } from './CompanyOutlineEnTranslation';

export function CompanyOutlineTab() {
  const { data: profile, isLoading: profileLoading } = useCompanyProfile();
  const { data: profileEN } = useCompanyProfileEN();
  const { data: companyInfoEN } = useCompanyInfoEN();
  const updateProfileMutation = useUpdateCompanyProfile();
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [activeTab, setActiveTab] = useState<'VI' | 'EN'>('VI');

  const handleThumbnailChange = async (value: string | File) => {
    if (!value) {
      updateProfileMutation.mutate({ thumbnailUrl: '' });
      return;
    }
    if (typeof value === 'string') {
      updateProfileMutation.mutate({ thumbnailUrl: value });
      return;
    }

    setIsUploadingThumbnail(true);
    try {
      const url = await uploadFileAndGetUrl({ file: value });
      updateProfileMutation.mutate({ thumbnailUrl: url });
    } catch (error) {
      toast.error(error, 'Lỗi tải ảnh lên server.');
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  return (
    <div className="space-y-6">
      <LanguageTabs activeTab={activeTab} onTabChange={setActiveTab} hasEnTranslation />

      {/* ── VI Tab ── */}
      <div className={activeTab === 'VI' ? 'block space-y-6' : 'hidden'}>
        <CompanyInfoTable />

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-black">ẢNH THUMBNAIL SƠ LƯỢC</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Ảnh đại diện hiển thị trên trang <code className="bg-gray-100 px-1 rounded">/about-us</code> — section Sơ lược công ty.
            </p>
          </div>
          {profileLoading || isUploadingThumbnail ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              {isUploadingThumbnail && (
                <p className="text-sm font-medium text-gray-600">Đang tải ảnh lên server...</p>
              )}
            </div>
          ) : (
            <FileUpload
              label="Tải ảnh thumbnail lên"
              value={profile?.thumbnailUrl ?? ''}
              onChange={handleThumbnailChange}
              bgOption="none"
            />
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-black">GIỚI THIỆU CÔNG TY</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Nội dung hiển thị trên trang <code className="bg-gray-100 px-1 rounded">/about-us</code>.
            </p>
          </div>
          {profileLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : (
            <SettingHtmlItem
              setting={{ key: 'ABOUT_INTRO_HTML', value: profile?.introHtml ?? '' } as SystemSetting}
              onSave={(val) => updateProfileMutation.mutate({ introHtml: val })}
              isSaving={updateProfileMutation.isPending}
            />
          )}
        </div>
      </div>

      {/* ── EN Tab ── */}
      <div className={activeTab === 'EN' ? 'block space-y-6' : 'hidden'}>
        <CompanyInfoEnTranslationSection enItems={companyInfoEN ?? []} />
        <ProfileEnTranslationSection viIntroHtml={profile?.introHtml ?? ''} enIntroHtml={profileEN?.introHtml ?? ''} />
      </div>
    </div>
  );
}
