import { useState } from 'react';
import { useGetFiles, useDeleteFile } from '@/queries/upload';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { FileUpload } from '@/components/upload/FileUpload';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Trash2, RefreshCw, Plus, ImageIcon } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export default function MediaGallery() {
  const { data, isLoading, refetch } = useGetFiles();
  const deleteMutation = useDeleteFile();
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [replaceId, setReplaceId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
        }
      });
    }
  };

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    setReplaceId(null);
    refetch(); // Reload the list
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / k ** i).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Thư viện ảnh</h1>
          <p className="mt-1 text-sm font-medium text-gray-500">Quản lý toàn bộ ảnh trên hệ thống</p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all"
        >
          <Plus className="h-4 w-4" />
          Tải ảnh mới
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
        </div>
      ) : !data?.resources || data.resources.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-12">
          <ImageIcon className="h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-bold text-gray-900">Không có ảnh nào</h3>
          <p className="mt-1 text-xs text-gray-500">Tải ảnh lên để bắt đầu quản lý thư viện của bạn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {data.resources.map((file: any) => (
            <div key={file.public_id} className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="aspect-square w-full overflow-hidden bg-gray-50 flex items-center justify-center p-2 relative">
                <img
                  src={file.secure_url}
                  alt={file.public_id}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setReplaceId(file.public_id);
                      setIsUploadModalOpen(true);
                    }}
                    className="p-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                    title="Thay thế ảnh"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(file.public_id)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    title="Xóa ảnh"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-1 flex-col p-3">
                <p className="truncate text-xs font-bold text-gray-900" title={file.public_id}>
                  {file.public_id.split('/').pop()}
                </p>
                <div className="mt-1 flex items-center justify-between text-[10px] font-medium text-gray-500">
                  <span>{formatFileSize(file.bytes)}</span>
                  <span>{format(new Date(file.created_at), 'dd/MM/yyyy', { locale: vi })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Xóa ảnh"
        description="Bạn có chắc chắn muốn xóa vĩnh viễn ảnh này? Hành động này không thể hoàn tác và ảnh sẽ bị mất khỏi mọi bài viết đang sử dụng."
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />

      {/* Upload/Replace Modal */}
      <DialogPrimitive.Root open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-xl sm:rounded-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <DialogPrimitive.Title className="text-lg font-bold text-black">
                {replaceId ? 'Thay thế ảnh cũ' : 'Tải ảnh mới'}
              </DialogPrimitive.Title>
              <DialogPrimitive.Close className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500">
                <X className="h-5 w-5" />
                <span className="sr-only">Đóng</span>
              </DialogPrimitive.Close>
            </div>
            
            <div className="py-2">
              <FileUpload 
                publicId={replaceId || undefined} 
                onChange={handleUploadSuccess} 
                label={replaceId ? "Chọn ảnh mới để ghi đè" : "Kéo thả ảnh để tải lên"}
              />
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
