import { useState } from 'react';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { inputCls, btnGhost } from '@/utils/admin-styles';
import type { CompanyInfoItem } from '@/types/about';

interface Props {
  item: CompanyInfoItem;
  onUpdate: (id: string, data: Partial<CompanyInfoItem>) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function CompanyInfoRow({ item, onUpdate, onDelete, isDeleting }: Props) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(item.label);
  const [value, setValue] = useState(item.value);

  const handleSave = () => {
    onUpdate(item.id, { label, value });
    setEditing(false);
  };

  if (editing) {
    return (
      <tr className="border-b border-gray-100 bg-blue-50/40">
        <td className="py-2 px-4 w-2/5">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className={inputCls}
            placeholder="Nhãn..."
          />
        </td>
        <td className="py-2 px-4">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={inputCls}
            placeholder="Giá trị..."
          />
        </td>
        <td className="py-2 px-4 text-right whitespace-nowrap">
          <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={() => setEditing(false)} className={btnGhost}>
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1.5 text-xs font-bold text-white bg-black rounded hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Lưu
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-gray-100 group hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4 text-xs font-semibold text-gray-700 w-2/5">{item.label}</td>
      <td className="py-3 px-4 text-xs text-gray-600 leading-relaxed">{item.value}</td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-black transition-colors cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            disabled={isDeleting}
            className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
