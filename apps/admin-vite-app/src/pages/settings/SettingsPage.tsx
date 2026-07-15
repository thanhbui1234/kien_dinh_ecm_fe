import { useState } from 'react';
import { useSettings, useUpdateSetting } from '@/queries/settings';
import { Loader2, Save } from 'lucide-react';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { SystemSetting } from 'shared-api';

const inputCls = "w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2";

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpdateSetting();

  const handleUpdate = (key: string, value: string) => {
    updateMutation.mutate({ key, data: { value } });
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 text-black animate-spin" /></div>;
  }

  const textSettings = settings?.filter(s => !s.key.includes('HTML') && !s.key.includes('POLICY')) || [];
  const htmlSettings = settings?.filter(s => s.key.includes('HTML') || s.key.includes('POLICY')) || [];

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <div>
        <h1 className="text-xl font-bold text-black">Cài đặt hệ thống</h1>
        <p className="text-xs font-medium text-gray-500 mt-0.5">Quản lý cấu hình chung cho website</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">CẤU HÌNH THÔNG TIN</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {textSettings.map((setting) => (
            <SettingItem
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
            {htmlSettings.map((setting) => (
              <div key={setting.key} className="space-y-3">
                <label className={labelCls}>{setting.key}</label>
                <SettingHtmlItem
                  setting={setting}
                  onSave={(val) => handleUpdate(setting.key, val)}
                  isSaving={updateMutation.isPending}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SettingItem({ setting, onSave, isSaving }: { setting: SystemSetting, onSave: (val: string) => void, isSaving: boolean }) {
  const [value, setValue] = useState(setting.value || '');

  return (
    <div className="space-y-2">
      <label className={labelCls}>{setting.key}</label>
      <div className="flex space-x-2">
        <input
          id={setting.key}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => onSave(value)}
          disabled={isSaving || value === setting.value}
          className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-md bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-sm shrink-0"
        >
          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          LƯU
        </button>
      </div>
    </div>
  );
}

function SettingHtmlItem({ setting, onSave, isSaving }: { setting: SystemSetting, onSave: (val: string) => void, isSaving: boolean }) {
  const [value, setValue] = useState(setting.value || '');

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm">
        <RichTextEditor value={value} onChange={setValue} />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onSave(value)}
          disabled={isSaving || value === setting.value}
          className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-md bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-sm"
        >
          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          LƯU THAY ĐỔI
        </button>
      </div>
    </div>
  );
}
