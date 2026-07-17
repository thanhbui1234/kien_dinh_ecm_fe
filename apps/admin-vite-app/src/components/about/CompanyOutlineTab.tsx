import { Loader2 } from 'lucide-react';
import { useSystemSettings, useUpdateSystemSetting } from '@/queries/settings';
import { SystemSetting } from 'shared-api';
import { SettingTextItem } from '@/components/common/SettingTextItem';
import { SettingHtmlItem } from '@/components/common/SettingHtmlItem';
import { CompanyInfoTable } from './CompanyInfoTable';

export function CompanyOutlineTab() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateMutation = useUpdateSystemSetting();

  const textSettings =
    settings?.filter(
      (s: SystemSetting) => !s.key.includes('HTML') && !s.key.includes('POLICY')
    ) || [];

  const htmlSettings =
    settings?.filter(
      (s: SystemSetting) => s.key.includes('HTML') || s.key.includes('POLICY')
    ) || [];

  return (
    <div className="space-y-6">
      {/* System settings — text */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : textSettings.length > 0 && (
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

      {/* Company info table — label/value CRUD */}
      <CompanyInfoTable />

      {/* System settings — HTML / rich text */}
      {htmlSettings.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-black">NỘI DUNG MỞ RỘNG</h2>
            <p className="text-xs text-gray-500 mt-0.5">Các nội dung dạng HTML / Chính sách</p>
          </div>
          {htmlSettings.map((s: SystemSetting) => (
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
