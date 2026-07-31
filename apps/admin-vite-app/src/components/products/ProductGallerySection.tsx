import { UseFormReturn, UseFieldArrayReturn } from 'react-hook-form';
import { Trash2, ZoomIn } from 'lucide-react';
import { FileUpload } from '@/components/upload/FileUpload';

interface ProductGallerySectionProps {
  form: UseFormReturn<any>;
  imageFieldArray: UseFieldArrayReturn<any, 'images'>;
  getImagePreviewSrc: (val: any) => string;
  onOpenLightbox: (index: number) => void;
}

export function ProductGallerySection({ imageFieldArray, getImagePreviewSrc, onOpenLightbox }: ProductGallerySectionProps) {
  const { fields: imageFields, append: appendImage, remove: removeImage } = imageFieldArray;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
      <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">THƯ VIỆN ẢNH SẢN PHẨM</h2>

      {imageFields.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imageFields.map((field, index) => (
            <div key={field.id} className="relative aspect-square rounded-md border border-gray-200 overflow-hidden group bg-gray-50">
              <button
                type="button"
                onClick={() => onOpenLightbox(index)}
                className="w-full h-full cursor-zoom-in"
              >
                <img
                  src={getImagePreviewSrc((field as any).imageUrl)}
                  alt={`Ảnh ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </button>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-50 z-10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-1 px-2">
                <p className="text-[10px] text-white font-medium truncate">Ảnh {index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2">
        <FileUpload
          label="Tải thêm ảnh vào thư viện"
          value=""
          onChange={(url) => {
            if (url) {
              appendImage({ imageUrl: url, isMain: false, orderIndex: imageFields.length });
            }
          }}
          bgOption="none"
        />
      </div>
    </div>
  );
}
