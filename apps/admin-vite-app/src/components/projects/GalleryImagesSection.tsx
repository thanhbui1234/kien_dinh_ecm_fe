import { useId, useRef, useState } from 'react';
import { ImageIcon, Loader2, Plus, X, FolderSearch } from 'lucide-react';
import { useUpload } from '@/queries/upload/useUpload';
import { MediaPickerModal } from '@/components/upload/MediaPickerModal';
import { toast } from '@/utils/toast';
import imageCompression from 'browser-image-compression';

interface GalleryImagesSectionProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const MAX_IMAGES = 10;
const VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function GalleryImagesSection({ images, onChange }: GalleryImagesSectionProps) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const uploadMutation = useUpload();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      toast.error(null, `Tối đa ${MAX_IMAGES} ảnh.`);
      return;
    }

    const toUpload = Array.from(files).slice(0, remaining);
    const invalid = toUpload.filter(f => !VALID_TYPES.includes(f.type));
    if (invalid.length) {
      toast.error(null, 'Chỉ hỗ trợ JPG, PNG, WEBP, GIF.');
      return;
    }

    setUploading(true);
    const urls: string[] = [];

    for (const file of toUpload) {
      let toProcess = file;
      if (file.type !== 'image/gif') {
        try {
          toProcess = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
        } catch {
          // fallback to original
        }
      }

      await new Promise<void>((resolve) => {
        uploadMutation.mutate(
          { file: toProcess },
          {
            onSuccess: (res) => {
              const url = res?.url || (res as any)?.data?.url || (res as any)?.secure_url;
              if (url) urls.push(url);
              resolve();
            },
            onError: () => {
              toast.error(null, `Lỗi tải lên: ${file.name}`);
              resolve();
            },
          }
        );
      });
    }

    if (urls.length) onChange([...images, ...urls]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  const handlePickFromLibrary = (url: string) => {
    if (images.length >= MAX_IMAGES) {
      toast.error(null, `Tối đa ${MAX_IMAGES} ảnh.`);
      return;
    }
    onChange([...images, url]);
    setMediaPickerOpen(false);
  };

  const canAdd = images.length < MAX_IMAGES && !uploading;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h2 className="text-sm font-bold text-black">HÌNH ẢNH DỰ ÁN</h2>
          <p className="text-xs font-medium text-gray-400 mt-0.5">
            Gallery hiển thị trong trang chi tiết — tối đa {MAX_IMAGES} ảnh
          </p>
        </div>
        {images.length > 0 && (
          <span className="text-xs text-black font-bold border border-black rounded px-2 py-0.5">
            {images.length} / {MAX_IMAGES}
          </span>
        )}
      </div>

      {/* Thumbnail grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-5 gap-2">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-md overflow-hidden border border-gray-200 bg-gray-100"
            >
              <img src={url} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />

              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150"
              >
                <X className="w-2.5 h-2.5 text-white" />
              </button>

              {/* Index */}
              <div className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white/60 tabular-nums leading-none">
                {String(idx + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-300 border border-dashed border-gray-200 rounded-lg bg-gray-50">
          <ImageIcon className="w-7 h-7" />
          <p className="text-xs font-medium text-gray-400">Chưa có ảnh nào</p>
        </div>
      )}

      {/* Action buttons */}
      {canAdd && (
        <div className="flex items-center gap-2 pt-1">
          {/* Upload from device */}
          <label
            htmlFor={fileInputId}
            className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-black cursor-pointer transition-colors shadow-sm"
          >
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            {uploading ? 'Đang tải...' : 'Thêm ảnh'}
          </label>
          <input
            id={fileInputId}
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="sr-only"
            onChange={e => handleFiles(e.target.files)}
            disabled={uploading}
          />

          {/* Pick from library */}
          <button
            type="button"
            onClick={() => setMediaPickerOpen(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-black transition-colors shadow-sm"
          >
            <FolderSearch className="w-3.5 h-3.5" />
            Chọn từ thư viện
          </button>

          {images.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="ml-auto flex items-center gap-1 h-8 px-3 rounded-md text-xs font-bold text-gray-400 hover:text-red-600 transition-colors"
            >
              <X className="w-3 h-3" /> Xóa tất cả
            </button>
          )}
        </div>
      )}

      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={handlePickFromLibrary}
      />
    </div>
  );
}
