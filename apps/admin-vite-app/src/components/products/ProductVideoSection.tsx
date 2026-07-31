import { UseFormReturn, UseFieldArrayReturn } from 'react-hook-form';
import { Plus, Trash2, Play } from 'lucide-react';
import { getYoutubeId } from '@/utils/youtube';

const inputCls = "w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm";

interface ProductVideoSectionProps {
  form: UseFormReturn<any>;
  videoFieldArray: UseFieldArrayReturn<any, 'videoList'>;
  videoListValue: { url: string }[];
}

export function ProductVideoSection({ form, videoFieldArray, videoListValue }: ProductVideoSectionProps) {
  const { register } = form;
  const { fields: videoFields, append: appendVideo, remove: removeVideo } = videoFieldArray;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-sm font-bold text-black">VIDEO SẢN PHẨM</h2>
        <button
          type="button"
          onClick={() => appendVideo({ url: '' })}
          className="flex items-center gap-1.5 h-7 px-2.5 rounded border border-gray-300 text-xs font-bold text-black hover:bg-gray-50 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Thêm video
        </button>
      </div>

      <div className="space-y-4">
        {videoFields.map((field, index) => {
          const youtubeId = getYoutubeId(videoListValue?.[index]?.url || '');
          return (
            <div key={field.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  {...register(`videoList.${index}.url` as const)}
                  placeholder="Link YouTube..."
                  className={`${inputCls} flex-1`}
                />
                <button
                  type="button"
                  onClick={() => removeVideo(index)}
                  className="w-9 h-9 rounded border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-all shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {youtubeId && (
                <div className="relative aspect-video rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                    alt="Xem trước video"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="h-4 w-4 text-black fill-black ml-0.5" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {videoFields.length === 0 && (
          <p className="text-xs font-medium text-gray-500 text-center py-4">Chưa có video sản phẩm</p>
        )}
      </div>
    </div>
  );
}
