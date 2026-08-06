import { Loader2 } from 'lucide-react';
import { useSystemSettings, useUpdateSystemSetting } from '@/queries/settings';
import { SystemSetting } from 'shared-api';
import { SettingTextItem } from '@/components/common/SettingTextItem';
import { SettingHtmlItem } from '@/components/common/SettingHtmlItem';

export function SystemSettingsSection() {
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

  if (!settings || settings.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
        <p className="text-sm font-medium text-gray-500">Chưa có cài đặt hệ thống nào</p>
        <p className="text-xs text-gray-400 mt-1">Các key cấu hình sẽ hiển thị ở đây khi được khởi tạo từ backend</p>
      </div>
    );
  }

  const textSettings = settings.filter(
    (s: SystemSetting) => !s.key.includes('HTML') && !s.key.includes('POLICY')
  );
  const htmlSettings = settings.filter(
    (s: SystemSetting) => s.key.includes('HTML') || s.key.includes('POLICY')
  );

  return (
    <div className="space-y-6">
      {textSettings.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">
            CẤU HÌNH THÔNG TIN CHUNG
          </h2>
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
        </div>
      )}

      {htmlSettings.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">
            CẤU HÌNH NỘI DUNG MỞ RỘNG
          </h2>
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
  );
}
