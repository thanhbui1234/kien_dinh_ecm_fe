import { type ChangeEvent, type DragEvent, useRef, useState, useEffect, useId } from 'react';
import { ImagePlus, X, Image as ImageIcon, Loader2, FolderSearch, Scissors, Square } from 'lucide-react';
import { toast } from '@/utils/toast';
import { resetStrayScroll } from '@/utils/scroll';
import imageCompression from 'browser-image-compression';
import { getFileBgOption, setFileBgOption, type BgOption } from '@/utils/fileBgOption';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MediaPickerModal } from './MediaPickerModal';

const aiOptions = [
  { value: 'none', label: 'Giữ nguyên bản gốc', icon: ImageIcon },
  { value: 'transparent', label: 'Xóa nền (Tách nền trong suốt)', icon: Scissors },
  { value: 'cloudinary_white', label: 'Xóa nền & Chuyển thành nền trắng', icon: Square },
];

interface FileUploadProps {
  value?: string | File;
  onChange?: (value: string | File) => void;
  label?: string;
  bgOption?: BgOption;
}

export function FileUpload({ value, onChange, label = 'Tải ảnh lên', bgOption = 'none' }: FileUploadProps) {
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [valueObjectUrl, setValueObjectUrl] = useState<string | null>(null);
  const [localBgOption, setLocalBgOption] = useState<BgOption>(bgOption);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const validFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  // Cleanup object URL for the transient (still-compressing) preview
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Preview a selected-but-not-yet-uploaded value (blob URL). Note: this can
  // be a Blob rather than a true File instance, since browser-image-compression
  // returns a Blob at runtime despite its .d.ts claiming Promise<File>.
  useEffect(() => {
    if (value && typeof value !== 'string') {
      const url = URL.createObjectURL(value);
      setValueObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setValueObjectUrl(null);
  }, [value]);

  // The AI background-removal option is a per-file choice (applied later, at
  // submit time) — keep the dropdown in sync with whichever file is current.
  useEffect(() => {
    if (value && typeof value !== 'string') {
      setLocalBgOption(getFileBgOption(value));
    } else {
      setLocalBgOption(bgOption);
    }
  }, [value, bgOption]);

  const displaySrc = typeof value === 'string' ? value : valueObjectUrl;

  const handleBgOptionChange = (option: BgOption) => {
    setLocalBgOption(option);
    if (value && typeof value !== 'string') {
      setFileBgOption(value, option);
    }
  };

  // Selecting a file commits it immediately — no separate confirm step.
  // Only compression runs here; AI background removal (if chosen via the
  // dropdown once the file is the current value) is deferred to submit time.
  const handleSelectFile = async (selectedFile: File | undefined) => {
    if (!selectedFile) return;
    if (!validFileTypes.includes(selectedFile.type)) {
      toast.error(null, 'Vui lòng chọn file ảnh hợp lệ (JPG, PNG, WEBP, GIF).');
      return;
    }

    setPendingFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));

    let fileToUse = selectedFile;
    if (fileToUse.type !== 'image/gif') {
      try {
        setIsProcessing(true);
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: fileToUse.type as string, // Preserve type
        };
        fileToUse = await imageCompression(fileToUse, options);
      } catch (error) {
        console.error('Lỗi nén ảnh:', error);
        toast.error(null, 'Lỗi nén ảnh, hệ thống sẽ sử dụng ảnh gốc.');
      }
    }

    setIsProcessing(false);
    setPendingFile(null);
    setPreviewUrl(null);
    onChange?.(fileToUse);
  };

  const handleSelectFromLibrary = (url: string) => {
    onChange?.(url);
    setIsMediaPickerOpen(false);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleSelectFile(event.target.files?.[0]);
    resetStrayScroll();
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    handleSelectFile(event.dataTransfer.files?.[0]);
  };

  const resetFile = () => {
    setPendingFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onChange?.('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / k ** i).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="flex w-full flex-col">
      {label && (
        <h3 className="text-sm font-bold text-black mb-3">
          {label}
        </h3>
      )}

      {/* Ảnh đã chọn (chưa hoặc đã tải lên) */}
      {value && !isProcessing && !pendingFile && (
        <div className="flex flex-col gap-3">
          <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
            <img src={displaySrc || undefined} alt="Preview" className="max-h-56 w-auto object-contain" />
            <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
              <button
                onClick={resetFile}
                className="flex items-center gap-2 h-9 px-4 rounded-md bg-white border border-gray-300 text-black text-xs font-bold hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
              >
                <X className="h-3.5 w-3.5" /> GỠ ẢNH
              </button>
            </div>
          </div>

          {/* Ảnh chưa tải lên server — cho phép chọn xử lý nền AI, sẽ áp dụng khi lưu */}
          {typeof value !== 'string' && (
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Xử lý nền ảnh (AI)</label>
              <Select value={localBgOption} onValueChange={handleBgOptionChange}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aiOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2">
                        <opt.icon className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-black">{opt.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {localBgOption !== 'none' && (
                <p className="mt-2 text-[11px] text-gray-500">Ảnh sẽ được xử lý nền khi bạn lưu/tạo/cập nhật.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Đang nén ảnh vừa chọn */}
      {pendingFile && (
        <div className="flex flex-col gap-4">
          <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjZmZmIi8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjBmMGYwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4=')]">
            <img src={previewUrl!} alt="Preview Pending" className="max-h-56 w-auto object-contain" />
          </div>

          <div className="relative flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50">
                <Loader2 className="h-5 w-5 text-black animate-spin" />
              </span>
              <div className="flex-1 min-w-0 pr-2">
                <p className="truncate font-bold text-black text-sm">
                  Đang nén ảnh...
                </p>
                <p className="mt-0.5 text-gray-500 font-medium text-xs">
                  {formatFileSize(pendingFile.size)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Khu vực kéo thả */}
      {!pendingFile && !isProcessing && (
        <div className={`flex flex-col gap-3 ${value ? 'mt-4' : ''}`}>
          <label
            htmlFor={inputId}
            className="flex cursor-pointer flex-col justify-center rounded-lg border-2 border-dashed border-gray-300 px-3 py-6 transition-colors hover:border-black bg-gray-50"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <ImagePlus aria-hidden={true} className="mx-auto h-8 w-8 text-gray-400" />
              <div className="mt-3 text-xs font-medium text-gray-600 leading-normal text-balance">
                Kéo thả ảnh vào đây hoặc <span className="font-bold text-black hover:underline">chọn file</span>
              </div>
              <p className="mt-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-balance">PNG, JPG, WEBP (TỐI ĐA 10MB)</p>
            </div>
            <input
              accept="image/jpeg, image/png, image/webp, image/gif"
              className="sr-only"
              id={inputId}
              name={inputId}
              onChange={handleFileChange}
              onFocus={resetStrayScroll}
              ref={fileInputRef}
              type="file"
            />
          </label>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-[10px] font-bold uppercase text-gray-400">hoặc</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMediaPickerOpen(true)}
            className="flex items-center justify-center gap-2 h-10 w-full rounded-md border border-gray-300 bg-white text-sm font-bold text-black hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FolderSearch className="h-4 w-4 text-gray-500" />
            CHỌN TỪ THƯ VIỆN
          </button>

          <MediaPickerModal
            isOpen={isMediaPickerOpen}
            onOpenChange={setIsMediaPickerOpen}
            onSelect={handleSelectFromLibrary}
          />
        </div>
      )}

      {/* Render modal outside conditional blocks to prevent unmounting issues */}
      {value && (
        <MediaPickerModal
          isOpen={isMediaPickerOpen}
          onOpenChange={setIsMediaPickerOpen}
          onSelect={handleSelectFromLibrary}
        />
      )}
    </div>
  );
}
