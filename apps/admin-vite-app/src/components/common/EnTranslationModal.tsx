import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, Globe, Loader2, Save } from 'lucide-react';

interface Field {
  key: string;
  label: string;
  viValue: string;
  enValue: string;
  multiline?: boolean;
  required?: boolean;
}

interface EnTranslationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: Field[];
  onChange: (key: string, value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  isDirty: boolean;
}

export function EnTranslationModal({
  isOpen,
  onOpenChange,
  title,
  fields,
  onChange,
  onSave,
  isSaving,
  isDirty,
}: EnTranslationModalProps) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-xl bg-white shadow-2xl flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-purple-100 flex items-center justify-center">
                <Globe className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-500">🇬🇧 English Translation</p>
                <p className="text-sm font-bold text-gray-900 leading-tight">{title}</p>
              </div>
            </div>
            <DialogPrimitive.Close className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-0.5">*</span>}
                </label>
                {/* VI reference */}
                <div className="rounded-md bg-gray-50 border border-gray-200 px-3 py-2">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Tiếng Việt (tham khảo)</p>
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{field.viValue || '—'}</p>
                </div>
                {/* EN input */}
                {field.multiline ? (
                  <textarea
                    value={field.enValue}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    placeholder={field.viValue || `${field.label} in English...`}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition resize-none bg-white"
                  />
                ) : (
                  <input
                    type="text"
                    value={field.enValue}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    placeholder={field.viValue || `${field.label} in English...`}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition bg-white"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400">
              {isDirty ? (
                <span className="text-amber-500 font-medium">Có thay đổi chưa lưu</span>
              ) : (
                'Chưa có thay đổi'
              )}
            </p>
            <div className="flex items-center gap-2">
              <DialogPrimitive.Close className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-black transition-colors cursor-pointer">
                Đóng
              </DialogPrimitive.Close>
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving || !isDirty}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Lưu bản dịch
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
