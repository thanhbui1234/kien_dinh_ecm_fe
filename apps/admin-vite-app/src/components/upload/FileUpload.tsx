import { type ChangeEvent, type DragEvent, useRef, useState, useEffect } from 'react';
import { ImagePlus, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useUpload } from '@/queries/upload/useUpload';
import { toast } from '@/utils/toast';
import imageCompression from 'browser-image-compression';
import { removeBackground } from '@imgly/background-removal';

interface FileUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  label?: string;
  bgOption?: 'none' | 'transparent' | 'cloudinary_white';
  publicId?: string;
}

export function FileUpload({ value, onChange, label = 'Tải ảnh lên', bgOption = 'none', publicId }: FileUploadProps) {
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [localBgOption, setLocalBgOption] = useState<'none' | 'transparent' | 'cloudinary_white'>(bgOption);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUpload();

  const validFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSelectFile = (selectedFile: File | undefined) => {
    if (!selectedFile) return;
    if (validFileTypes.includes(selectedFile.type)) {
      setPendingFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setProgress(0);
    } else {
      toast.error(null, 'Vui lòng chọn file ảnh hợp lệ (JPG, PNG, WEBP, GIF).');
    }
  };

  const cancelPending = () => {
    setPendingFile(null);
    setPreviewUrl(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmUpload = async () => {
    if (!pendingFile) return;

    let fileToUpload = pendingFile;

    if (localBgOption === 'transparent' || localBgOption === 'cloudinary_white') {
      try {
        setIsProcessingAI(true);
        toast.info('Đang xử lý AI tách nền, vui lòng đợi một chút...');
        
        const blob = await removeBackground(pendingFile);
        
        if (localBgOption === 'cloudinary_white') {
          const img = new Image();
          img.src = URL.createObjectURL(blob);
          await new Promise((r) => { img.onload = r; });
          
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const whiteBlob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.95));
            if (whiteBlob) {
              fileToUpload = new File([whiteBlob], pendingFile.name.replace(/\.[^/.]+$/, "") + "_white.jpg", { type: 'image/jpeg' });
            }
          }
        } else {
          fileToUpload = new File([blob], pendingFile.name.replace(/\.[^/.]+$/, "") + "_transparent.png", { type: 'image/png' });
        }
      } catch (error) {
        console.error('Lỗi xóa nền AI:', error);
        toast.error(null, 'Xử lý nền thất bại, hệ thống sẽ sử dụng ảnh gốc.');
      } finally {
        setIsProcessingAI(false);
      }
    }

    if (fileToUpload.type !== 'image/gif') {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: fileToUpload.type as string, // Preserve type
        };
        fileToUpload = await imageCompression(fileToUpload, options);
      } catch (error) {
        console.error('Lỗi nén ảnh:', error);
        toast.error(null, 'Lỗi nén ảnh, hệ thống sẽ sử dụng ảnh gốc.');
      }
    }

    setProgress(0);
    
    uploadMutation.mutate({
      file: fileToUpload,
      publicId,
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
        cancelPending();
      },
      onError: () => {
        toast.error(null, 'Lỗi tải ảnh lên server.');
        setProgress(0);
      }
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleSelectFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleSelectFile(event.dataTransfer.files?.[0]);
  };

  const resetFile = () => {
    cancelPending();
    onChange?.(''); 
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / k ** i).toFixed(1)) + ' ' + sizes[i];
  };

  const isUploading = uploadMutation.isPending || isProcessingAI;

  return (
    <div className="flex w-full flex-col">
      {label && (
        <h3 className="text-sm font-bold text-black mb-3">
          {label}
        </h3>
      )}

      {/* Preview đã tải lên thành công */}
      {value && !isUploading && !pendingFile && (
        <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
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

      {/* Preview ảnh đang chờ upload */}
      {pendingFile && (
        <div className="flex flex-col gap-4">
          <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZmZmIi8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjBmMGYwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4=')]">
            <img src={previewUrl!} alt="Preview Pending" className="max-h-56 w-auto object-contain" />
          </div>

          {!isUploading ? (
            <div className="flex flex-col gap-3 rounded-lg bg-gray-50 p-4 border border-gray-200">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Xử lý nền ảnh (AI)</label>
                <select
                  value={localBgOption}
                  onChange={(e) => setLocalBgOption(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm"
                >
                  <option value="none">Giữ nguyên bản gốc</option>
                  <option value="transparent">Xóa nền (Tách nền trong suốt)</option>
                  <option value="cloudinary_white">Xóa nền & Chuyển thành nền trắng</option>
                </select>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button type="button" onClick={handleConfirmUpload} className="flex-1 h-9 bg-black text-white rounded-md text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm">
                  Xác nhận & Tải lên
                </button>
                <button type="button" onClick={cancelPending} className="px-4 h-9 bg-white border border-gray-300 text-black rounded-md text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <div className="relative flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50">
                  <Loader2 className="h-5 w-5 text-black animate-spin" />
                </span>
                <div className="flex-1 min-w-0 pr-2">
                  <p className="truncate font-bold text-black text-sm">
                    {isProcessingAI ? 'Đang xử lý tách nền bằng AI...' : 'Đang tải lên server...'}
                  </p>
                  <p className="mt-0.5 text-gray-500 font-medium text-xs">
                    {formatFileSize(pendingFile.size)}
                  </p>
                </div>
              </div>
              {!isProcessingAI && (
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
        </div>
      )}

      {/* Khu vực kéo thả */}
      {!value && !pendingFile && (
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
                />
              </label>
            </div>
            <p className="mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">PNG, JPG, WEBP TỐI ĐA 10MB</p>
          </div>
        </div>
      )}
    </div>
  );
}
