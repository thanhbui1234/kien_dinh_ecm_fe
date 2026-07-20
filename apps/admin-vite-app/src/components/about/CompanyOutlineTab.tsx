import { Loader2 } from 'lucide-react';
import { useSystemSettings, useUpdateSystemSetting } from '@/queries/settings';
import { SystemSetting } from 'shared-api';
import { SettingTextItem } from '@/components/common/SettingTextItem';
import { SettingHtmlItem } from '@/components/common/SettingHtmlItem';
import { FileUpload } from '@/components/upload/FileUpload';
import { CompanyInfoTable } from './CompanyInfoTable';
import { useCompanyProfile, useUpdateCompanyProfile } from '@/queries/about';

export function CompanyOutlineTab() {
  const { data: settings, isLoading: settingsLoading } = useSystemSettings();
  const updateSettingMutation = useUpdateSystemSetting();

  const { data: profile, isLoading: profileLoading } = useCompanyProfile();
  const updateProfileMutation = useUpdateCompanyProfile();

  const isLoading = settingsLoading || profileLoading;

  const introHtmlSetting = { key: 'ABOUT_INTRO_HTML', value: profile?.introHtml ?? '' };

  const textSettings =
    settings?.filter(
      (s: SystemSetting) => !s.key.includes('HTML') && !s.key.includes('POLICY')
    ) || [];

  const otherHtmlSettings =
    settings?.filter(
      (s: SystemSetting) =>
        (s.key.includes('HTML') || s.key.includes('POLICY'))
    ) || [];

  return (
    <div className="space-y-6">
      {/* ── Bảng thông tin công ty (label/value) ── */}
      <CompanyInfoTable />

      {/* ── Thumbnail sơ lược ── */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-sm font-bold text-black">ẢNH THUMBNAIL SƠ LƯỢC</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Ảnh đại diện hiển thị trên trang <code className="bg-gray-100 px-1 rounded">/about-us</code> — section Sơ lược công ty.
          </p>
        </div>
        {profileLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : (
          <FileUpload
            label="Tải ảnh thumbnail lên"
            value={profile?.thumbnailUrl ?? ''}
            onChange={(url) => updateProfileMutation.mutate({ thumbnailUrl: url })}
            bgOption="none"
          />
        )}
      </div>

      {/* ── Giới thiệu công ty ── */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-sm font-bold text-black">GIỚI THIỆU CÔNG TY</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Nội dung hiển thị trên trang <code className="bg-gray-100 px-1 rounded">/about-us</code>.
            Hỗ trợ định dạng HTML đầy đủ — có thể chia nhiều section bằng tiêu đề H2/H3.
          </p>
        </div>
        {profileLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : (
          <SettingHtmlItem
            setting={introHtmlSetting as SystemSetting}
            onSave={(val) => updateProfileMutation.mutate({ introHtml: val })}
            isSaving={updateProfileMutation.isPending}
          />
        )}
      </div>

      {/* ── Thông tin cấu hình văn bản ── */}
      {!settingsLoading && textSettings.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-black">CẤU HÌNH THÔNG TIN HỆ THỐNG</h2>
            <p className="text-xs text-gray-500 mt-0.5">Các tham số cấu hình chung của website</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {textSettings.map((s: SystemSetting) => (
              <SettingTextItem
                key={s.key}
                setting={s}
                onSave={(val) => updateSettingMutation.mutate({ key: s.key, data: { value: val } })}
                isSaving={updateSettingMutation.isPending}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Các nội dung HTML khác ── */}
      {otherHtmlSettings.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-black">NỘI DUNG MỞ RỘNG</h2>
            <p className="text-xs text-gray-500 mt-0.5">Các nội dung dạng HTML / Chính sách</p>
          </div>
          {otherHtmlSettings.map((s: SystemSetting) => (
            <SettingHtmlItem
              key={s.key}
              setting={s}
              onSave={(val) => updateSettingMutation.mutate({ key: s.key, data: { value: val } })}
              isSaving={updateSettingMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
