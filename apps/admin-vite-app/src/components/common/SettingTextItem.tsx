import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { SystemSetting } from 'shared-api';
import { inputCls, labelCls, btnPrimary } from '@/utils/admin-styles';

interface Props {
  setting: SystemSetting;
  onSave: (value: string) => void;
  isSaving: boolean;
}

export function SettingTextItem({ setting, onSave, isSaving }: Props) {
  const [value, setValue] = useState(setting.value || '');

  return (
    <div className="space-y-1.5">
      <label className={labelCls}>{setting.key}</label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => onSave(value)}
          disabled={isSaving || value === setting.value}
          className={btnPrimary}
        >
          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          LƯU
        </button>
      </div>
    </div>
  );
}
