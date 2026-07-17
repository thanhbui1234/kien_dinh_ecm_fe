import { useState, useEffect } from 'react';
import { Loader2, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Timeline } from 'shared-api';
import {
  useTimelines,
  useCreateTimeline,
  useUpdateTimeline,
  useDeleteTimeline,
  useUpdateTimelineOrders,
} from '@/queries/settings';

const inputCls =
  'w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm';
const labelCls = 'text-[10px] font-bold text-gray-700 uppercase';

const TimelineCard = ({
  timeline,
  onDelete,
  onUpdate,
  isDeleting,
}: {
  timeline: Timeline;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Timeline>) => void;
  isDeleting: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: timeline.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
  };

  const [year, setYear] = useState(timeline.year || '');
  const [title, setTitle] = useState(timeline.title || '');
  const [description, setDescription] = useState(timeline.description || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate(timeline.id, { year, title, description });
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
          onClick={() => onDelete(timeline.id)}
          disabled={isDeleting}
          className="text-red-400 hover:text-red-600 disabled:opacity-50 cursor-pointer"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Năm</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={inputCls}
              placeholder="Năm..."
            />
          </div>
          <div>
            <label className={labelCls}>Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
              placeholder="Tiêu đề..."
            />
          </div>
          <div>
            <label className={labelCls}>Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputCls} h-auto py-2`}
              rows={3}
              placeholder="Mô tả..."
            />
          </div>
          <div className="flex gap-2 justify-end">
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
        <div
          className="cursor-pointer"
          onClick={() => setIsEditing(true)}
          title="Bấm để chỉnh sửa"
        >
          <p className="text-blue-600 font-bold text-sm">{year || 'Chưa có năm'}</p>
          <p className="text-sm font-semibold text-gray-900 mt-1 line-clamp-1">
            {title || 'Chưa có tiêu đề'}
          </p>
          <p className="text-xs text-gray-500 mt-1 line-clamp-3">
            {description || 'Chưa có mô tả'}
          </p>
        </div>
      )}
    </div>
  );
};

export function TimelineSection() {
  const { data, isLoading } = useTimelines();
  const createMutation = useCreateTimeline();
  const updateMutation = useUpdateTimeline();
  const deleteMutation = useDeleteTimeline();
  const reorderMutation = useUpdateTimelineOrders();

  const [items, setItems] = useState<Timeline[]>([]);

  useEffect(() => {
    if (data) {
      setItems([...data].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)));
    }
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        const updatedOrders = newItems.map((item, index) => ({ id: item.id, orderIndex: index }));
        reorderMutation.mutate(updatedOrders);
        return newItems.map((item, index) => ({ ...item, orderIndex: index }));
      });
    }
  };

  const handleAdd = () => {
    createMutation.mutate({
      year: new Date().getFullYear().toString(),
      title: 'Cột mốc mới',
      description: 'Mô tả cột mốc',
      orderIndex: items.length,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cột mốc này?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h2 className="text-sm font-bold text-black">LỊCH SỬ PHÁT TRIỂN</h2>
          <p className="text-xs text-gray-500 mt-0.5">Quản lý các cột mốc lịch sử công ty</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={createMutation.isPending}
          className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {createMutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin inline" />
          ) : (
            '+ Thêm cột mốc'
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">Chưa có cột mốc nào</p>
          <p className="text-xs text-gray-400 mt-1">Bấm "Thêm cột mốc" để bắt đầu</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((timeline) => (
                <TimelineCard
                  key={timeline.id}
                  timeline={timeline}
                  onDelete={handleDelete}
                  onUpdate={(id, data) => updateMutation.mutate({ id, data })}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {items.length > 0 && (
        <p className="text-xs text-gray-400 text-center pt-2">
          Kéo thả để thay đổi thứ tự hiển thị • Bấm vào card để chỉnh sửa
        </p>
      )}
    </div>
  );
}
