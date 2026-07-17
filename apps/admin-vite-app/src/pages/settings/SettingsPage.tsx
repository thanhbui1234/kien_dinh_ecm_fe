import { useSystemSettings, useUpdateSystemSetting } from '@/queries/settings';
import { Loader2 } from 'lucide-react';
import { SystemSetting } from 'shared-api';
import { SettingTextItem } from '@/components/common/SettingTextItem';
import { SettingHtmlItem } from '@/components/common/SettingHtmlItem';

export default function SettingsPage() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateMutation = useUpdateSystemSetting();

  const handleUpdate = (key: string, value: string) => {
    updateMutation.mutate({ key, data: { value } });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 text-black animate-spin" />
      </div>
    );
  }

  const textSettings = settings?.filter((s: SystemSetting) => !s.key.includes('HTML') && !s.key.includes('POLICY')) || [];
  const htmlSettings = settings?.filter((s: SystemSetting) => s.key.includes('HTML') || s.key.includes('POLICY')) || [];

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <div>
        <h1 className="text-xl font-bold text-black">Cài đặt hệ thống</h1>
        <p className="text-xs font-medium text-gray-500 mt-0.5">Quản lý cấu hình chung cho website</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">CẤU HÌNH THÔNG TIN</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {textSettings.map((setting: SystemSetting) => (
            <SettingTextItem
              key={setting.key}
              setting={setting}
              onSave={(val) => handleUpdate(setting.key, val)}
              isSaving={updateMutation.isPending}
            />
          ))}
        </div>

        {htmlSettings.length > 0 && (
          <div className="pt-6 border-t border-gray-200 space-y-6">
            <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">CẤU HÌNH NỘI DUNG MỞ RỘNG</h2>
            {htmlSettings.map((setting: SystemSetting) => (
              <SettingHtmlItem
                key={setting.key}
                setting={setting}
                onSave={(val) => handleUpdate(setting.key, val)}
                isSaving={updateMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
