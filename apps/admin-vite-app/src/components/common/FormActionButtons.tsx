import { Loader2 } from 'lucide-react';

interface FormActionButtonsProps {
  isEdit: boolean;
  isSaving: boolean;
  isDirty?: boolean;
  submitText?: string;
  onCancel: () => void;
}

export function FormActionButtons({
  isEdit,
  isSaving,
  isDirty = true,
  submitText,
  onCancel,
}: FormActionButtonsProps) {
  const defaultText = isEdit ? 'CẬP NHẬT' : 'TẠO MỚI';
  const label = submitText || defaultText;

  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="submit"
        disabled={isSaving || !isDirty}
        className="flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-bold transition-colors shadow-sm cursor-pointer"
      >
        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        {label}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        className="h-10 px-4 rounded-md bg-white hover:bg-gray-50 border border-gray-300 text-black text-sm font-bold transition-colors shadow-sm cursor-pointer"
      >
        HỦY
      </button>
    </div>
  );
}
