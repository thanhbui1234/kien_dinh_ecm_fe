import { Loader2 } from 'lucide-react';
import { useSystemSettings, useUpdateSystemSetting } from '@/queries/settings';
import { SystemSetting } from 'shared-api';
import { SettingTextItem } from '@/components/common/SettingTextItem';
import { SettingHtmlItem } from '@/components/common/SettingHtmlItem';
import { CompanyInfoTable } from './CompanyInfoTable';

const ABOUT_INTRO_KEY = 'ABOUT_INTRO_HTML';

export function CompanyOutlineTab() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateMutation = useUpdateSystemSetting();

  const aboutIntroSetting: SystemSetting =
    settings?.find((s: SystemSetting) => s.key === ABOUT_INTRO_KEY) ??
    { key: ABOUT_INTRO_KEY, value: '' };

  const textSettings =
    settings?.filter(
      (s: SystemSetting) => !s.key.includes('HTML') && !s.key.includes('POLICY')
    ) || [];

  const otherHtmlSettings =
    settings?.filter(
      (s: SystemSetting) =>
        (s.key.includes('HTML') || s.key.includes('POLICY')) && s.key !== ABOUT_INTRO_KEY
    ) || [];

  return (
    <div className="space-y-6">
      {/* ── Bảng thông tin công ty (label/value) ── */}
      <CompanyInfoTable />

      {/* ── Giới thiệu công ty — always visible ── */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-sm font-bold text-black">GIỚI THIỆU CÔNG TY</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Nội dung hiển thị trên trang <code className="bg-gray-100 px-1 rounded">/about-us</code>.
            Hỗ trợ định dạng HTML đầy đủ — có thể chia nhiều section bằng tiêu đề H2/H3.
          </p>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : (
          <SettingHtmlItem
            setting={aboutIntroSetting}
            onSave={(val) => updateMutation.mutate({ key: ABOUT_INTRO_KEY, data: { value: val } })}
            isSaving={updateMutation.isPending}
          />
        )}
      </div>

      {/* ── Thông tin cấu hình văn bản ── */}
      {!isLoading && textSettings.length > 0 && (
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
                onSave={(val) => updateMutation.mutate({ key: s.key, data: { value: val } })}
                isSaving={updateMutation.isPending}
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
              onSave={(val) => updateMutation.mutate({ key: s.key, data: { value: val } })}
              isSaving={updateMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
