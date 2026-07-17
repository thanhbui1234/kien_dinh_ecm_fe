import { useState } from 'react';
import { Loader2, Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Slogan } from 'shared-api';
import { inputCls } from '@/utils/admin-styles';

interface Props {
  slogan: Slogan;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Slogan>) => void;
  isDeleting: boolean;
}

export function SloganCard({ slogan, onDelete, onUpdate, isDeleting }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: slogan.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
  };

  const [title, setTitle] = useState(slogan.title || '');
  const [icon, setIcon] = useState(slogan.icon || '');
  const [description, setDescription] = useState(slogan.description || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate(slogan.id, { title, icon, description });
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm flex flex-col gap-3"
    >
      <div className="flex justify-between items-start">
        <div
          {...attributes}
          {...listeners}
          className="text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" />
        </div>
        <button
          type="button"
          onClick={() => onDelete(slogan.id)}
          disabled={isDeleting}
          className="text-red-400 hover:text-red-600 disabled:opacity-50 cursor-pointer"
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
      </div>

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
            <label className="text-[10px] font-bold text-gray-700 uppercase">Icon</label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className={inputCls}
              placeholder="Biểu tượng..."
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
          <div className="flex items-center gap-2">
            <span className="text-xl" dangerouslySetInnerHTML={{ __html: icon }} />
            <p
              className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors"
              title="Bấm để chỉnh sửa"
            >
              {title || <span className="text-gray-400 italic font-normal">Chưa có tiêu đề</span>}
            </p>
          </div>
          <p className="text-xs text-gray-600 mt-2 line-clamp-2">
            {description || (
              <span className="text-gray-400 italic font-normal">Chưa có mô tả</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
