import { type ChangeEvent, type DragEvent, useRef, useState } from 'react';
import { ImagePlus, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useUpload } from '@/queries/upload/useUpload';
import { toast } from '@/utils/toast';

interface FileUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  label?: string;
  bgOption?: 'none' | 'transparent' | 'cloudinary_white';
}

export function FileUpload({ value, onChange, label = 'Tải ảnh lên', bgOption = 'none' }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [localBgOption, setLocalBgOption] = useState<'none' | 'transparent' | 'cloudinary_white'>(bgOption);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUpload();

  const validFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  const handleFile = async (selectedFile: File | undefined) => {
    if (!selectedFile) return;

    if (validFileTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setProgress(0);
      
      uploadMutation.mutate({
        file: selectedFile,
        bgOption: localBgOption,
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        }
      }, {
        onSuccess: (res) => {
          const url = res?.url || (res as any)?.data?.url;
          if (url) {
             onChange?.(url);
          } else {
             onChange?.(res as any);
          }
        },
        onError: () => {
          setFile(null);
          setProgress(0);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      });
    } else {
      toast.error(null, 'Vui lòng chọn file ảnh hợp lệ (JPG, PNG, WEBP, GIF).');
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  const resetFile = () => {
    setFile(null);
    setProgress(0);
    onChange?.(''); 
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / k ** i).toFixed(1)) + ' ' + sizes[i];
  };

  const isUploading = uploadMutation.isPending;

  return (
    <div className="flex w-full flex-col">
      {label && (
        <h3 className="text-sm font-bold text-black mb-3">
          {label}
        </h3>
      )}

      {/* Option Selector */}
      <div className="mb-3">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Xử lý nền ảnh (AI)</label>
        <select
          value={localBgOption}
          onChange={(e) => setLocalBgOption(e.target.value as any)}
          disabled={isUploading || !!value}
          className="w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm disabled:bg-gray-50 disabled:text-gray-400"
        >
          <option value="none">Giữ nguyên bản gốc</option>
          <option value="transparent">Xóa nền (Tách nền trong suốt)</option>
          <option value="cloudinary_white">Xóa nền & Chuyển thành nền trắng</option>
        </select>
      </div>

      <div
        className="flex flex-col justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 transition-colors hover:border-black bg-gray-50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <ImagePlus aria-hidden={true} className="mx-auto h-10 w-10 text-gray-400" />
          <div className="mt-4 flex justify-center text-sm font-medium text-gray-600">
            <p>Kéo thả ảnh vào đây hoặc</p>
            <label
              className="relative cursor-pointer rounded-sm pl-1 font-bold text-black hover:underline focus-within:outline-none"
              htmlFor="file-upload"
            >
              <span>chọn file</span>
              <input
                accept="image/jpeg, image/png, image/webp, image/gif"
                className="sr-only"
                id="file-upload"
                name="file-upload"
                onChange={handleFileChange}
                ref={fileInputRef}
                type="file"
                disabled={isUploading}
              />
            </label>
          </div>
          <p className="mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">PNG, JPG, WEBP TỐI ĐA 10MB</p>
        </div>
      </div>

      {/* Progress & File Info */}
      {(file || isUploading) && (
        <div className="relative mt-3 flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm border border-gray-200">
          {!isUploading && (
            <button
              aria-label="Remove"
              className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-red-600 transition-colors"
              onClick={resetFile}
              type="button"
            >
              <X aria-hidden={true} className="h-4 w-4" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50">
              {isUploading ? <Loader2 className="h-5 w-5 text-black animate-spin" /> : <ImageIcon className="h-5 w-5 text-gray-400" />}
            </span>
            <div className="flex-1 min-w-0 pr-6">
              <p className="truncate font-bold text-black text-sm">
                {file?.name || 'Đang tải lên...'}
              </p>
              <p className="mt-0.5 text-gray-500 font-medium text-xs">
                {file ? formatFileSize(file.size) : '...'}
              </p>
            </div>
          </div>

          {isUploading && (
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-black transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-black text-xs font-bold w-8 text-right">{progress}%</span>
            </div>
          )}
        </div>
      )}

      {/* Preview Result */}
      {value && !isUploading && (
        <div className="mt-3 relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
          <img src={value} alt="Preview" className="max-h-56 w-auto object-contain" />
          <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
            <button
              onClick={resetFile}
              className="flex items-center gap-2 h-9 px-4 rounded-md bg-white border border-gray-300 text-black text-xs font-bold hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
            >
              <X className="h-3.5 w-3.5" /> GỠ ẢNH
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
