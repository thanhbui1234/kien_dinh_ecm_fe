import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { SystemSetting } from 'shared-api';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { labelCls, btnPrimary } from '@/utils/admin-styles';

interface Props {
  setting: SystemSetting;
  onSave: (value: string) => void;
  isSaving: boolean;
}

export function SettingHtmlItem({ setting, onSave, isSaving }: Props) {
  const [value, setValue] = useState(setting.value || '');

  return (
    <div className="space-y-3">
      <label className={labelCls}>{setting.key}</label>
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm">
        <RichTextEditor value={value} onChange={setValue} />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onSave(value)}
          disabled={isSaving || value === setting.value}
          className={btnPrimary}
        >
          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          LƯU THAY ĐỔI
        </button>
      </div>
    </div>
  );
}
