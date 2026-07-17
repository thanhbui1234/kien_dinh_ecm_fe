import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { Slogan } from 'shared-api';
import { useSlogans, useCreateSlogan, useUpdateSlogan, useDeleteSlogan, useUpdateSloganOrders } from '@/queries/settings';
import { SloganCard } from './SloganCard';
import { btnPrimary } from '@/utils/admin-styles';

export function SloganSection() {
  const { data, isLoading } = useSlogans();
  const createMutation = useCreateSlogan();
  const updateMutation = useUpdateSlogan();
  const deleteMutation = useDeleteSlogan();
  const reorderMutation = useUpdateSloganOrders();

  const [items, setItems] = useState<Slogan[]>([]);

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
      title: 'Slogan mới',
      icon: '✨',
      description: 'Mô tả slogan',
      orderIndex: items.length,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa slogan này?')) deleteMutation.mutate(id);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h2 className="text-sm font-bold text-black">SLOGAN TRANG CHỦ</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Quản lý các slogan nổi bật — kéo thả để sắp xếp thứ tự
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={createMutation.isPending}
          className={btnPrimary}
        >
          {createMutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            '+ Thêm Slogan'
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">
          Chưa có slogan nào — bấm "Thêm Slogan" để bắt đầu
        </p>
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((slogan) => (
                  <SloganCard
                    key={slogan.id}
                    slogan={slogan}
                    onDelete={handleDelete}
                    onUpdate={(id, data) => updateMutation.mutate({ id, data })}
                    isDeleting={deleteMutation.isPending}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <p className="text-xs text-gray-400 text-center pt-2">
            Kéo thả để thay đổi thứ tự • Bấm vào card để chỉnh sửa
          </p>
        </>
      )}
    </div>
  );
}
