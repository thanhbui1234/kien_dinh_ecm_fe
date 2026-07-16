import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, Search, ImageIcon, CheckCircle2 } from 'lucide-react';
import { useGetFiles } from '@/queries/upload';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface MediaPickerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

export function MediaPickerModal({ isOpen, onOpenChange, onSelect }: MediaPickerModalProps) {
  const { data, isLoading } = useGetFiles();
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / k ** i).toFixed(1)) + ' ' + sizes[i];
  };

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onOpenChange(false);
      setSelectedUrl(null);
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 flex w-full max-w-4xl flex-col max-h-[85vh] translate-x-[-50%] translate-y-[-50%] border border-gray-200 bg-white shadow-xl sm:rounded-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          
          <div className="flex items-center justify-between border-b border-gray-100 p-5 shrink-0">
            <div>
              <DialogPrimitive.Title className="text-lg font-bold text-black">
                Chọn ảnh từ thư viện
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-xs font-medium text-gray-500 mt-0.5">
                Chọn một tấm ảnh đã tải lên hệ thống trước đó
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500">
              <X className="h-5 w-5" />
              <span className="sr-only">Đóng</span>
            </DialogPrimitive.Close>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
              </div>
            ) : !data?.resources || data.resources.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-12 bg-white">
                <ImageIcon className="h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-bold text-gray-900">Không có ảnh nào</h3>
                <p className="mt-1 text-xs text-gray-500">Thư viện của bạn hiện đang trống.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
                {data.resources.map((file: any) => {
                  const isSelected = selectedUrl === file.secure_url;
                  
                  return (
                    <button
                      key={file.public_id}
                      type="button"
                      onClick={() => setSelectedUrl(file.secure_url)}
                      className={`group relative flex flex-col overflow-hidden rounded-lg border-2 text-left transition-all hover:shadow-md ${
                        isSelected ? 'border-black shadow-md ring-1 ring-black ring-offset-1' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="aspect-square w-full overflow-hidden bg-gray-50 flex items-center justify-center p-2 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZmZmIi8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjBmMGYwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4=')]">
                        <img
                          src={file.secure_url}
                          alt={file.public_id}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                            <div className="bg-black text-white rounded-full p-1 shadow-lg">
                              <CheckCircle2 className="w-6 h-6" />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col p-2.5 bg-white border-t border-gray-100">
                        <p className="truncate text-[11px] font-bold text-gray-900" title={file.public_id}>
                          {file.public_id.split('/').pop()}
                        </p>
                        <p className="mt-0.5 text-[9px] font-medium text-gray-500 uppercase">
                          {formatFileSize(file.bytes)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 p-5 shrink-0 bg-white rounded-b-lg">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-9 px-4 rounded-md bg-white border border-gray-300 text-black text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={!selectedUrl}
              onClick={handleConfirm}
              className="h-9 px-6 rounded-md bg-black text-white text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
            >
              Chọn ảnh này
            </button>
          </div>

        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
