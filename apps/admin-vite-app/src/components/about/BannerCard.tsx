import { useState } from 'react';
import { Loader2, Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Banner } from 'shared-api';
import { Toggle } from '@/components/common/Toggle';
import { inputCls } from '@/utils/admin-styles';

interface Props {
  banner: Banner;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Banner>) => void;
  isDeleting: boolean;
}

export function BannerCard({ banner, onToggleStatus, onDelete, onUpdate, isDeleting }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: banner.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
  };

  const [title, setTitle] = useState(banner.title || '');
  const [description, setDescription] = useState(banner.description || '');
  const [link, setLink] = useState(banner.link || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate(banner.id, { title, description, link });
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex flex-col"
    >
      <div className="relative aspect-[21/9] w-full bg-gray-100 border-b border-gray-200">
        <img src={banner.imageUrl} alt="Banner" className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={() => onDelete(banner.id)}
          disabled={isDeleting}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-50 disabled:opacity-50 z-20 cursor-pointer"
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 w-8 h-8 rounded-md bg-white/90 text-gray-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-gray-100 cursor-grab active:cursor-grabbing z-20"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </div>

      <div className="p-4 bg-white flex flex-col gap-3">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">Tiêu đề</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputCls}
                placeholder="Nhập tiêu đề..."
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">Mô tả</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputCls} h-auto py-2`}
                rows={2}
                placeholder="Nhập mô tả..."
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">Đường dẫn liên kết</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className={inputCls}
                placeholder="Nhập link..."
              />
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-black transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-3 py-1.5 text-xs font-bold text-white bg-black rounded hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Lưu lại
              </button>
            </div>
          </div>
        ) : (
          <div className="cursor-pointer" onClick={() => setIsEditing(true)}>
            <p
              className="text-sm font-bold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors"
              title="Bấm để chỉnh sửa"
            >
              {title || <span className="text-gray-400 italic font-normal">Chưa có tiêu đề</span>}
            </p>
            <p className="text-xs text-gray-600 line-clamp-2 mt-1">
              {description || (
                <span className="text-gray-400 italic font-normal">Chưa có mô tả</span>
              )}
            </p>
            {link && (
              <p className="text-[10px] text-blue-500 mt-2 truncate max-w-full block">{link}</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
          <div>
            <p className="text-xs font-bold text-gray-800">Hiển thị banner</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Thứ tự: {banner.orderIndex}</p>
          </div>
          <Toggle
            checked={banner.status}
            onToggle={() => onToggleStatus(banner.id, banner.status)}
          />
        </div>
      </div>
    </div>
  );
}
