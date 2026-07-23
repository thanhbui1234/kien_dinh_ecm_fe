import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { Banner } from 'shared-api';
import { useBanners, useCreateBanner, useUpdateBanner, useDeleteBanner, useUpdateBannerOrders } from '@/queries/settings';
import { FileUpload } from '@/components/upload/FileUpload';
import { BannerCard } from './BannerCard';
import { ConfirmModal } from '@/components/common/ConfirmModal';

export function BannerSection() {
  const { data, isLoading } = useBanners();
  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const deleteMutation = useDeleteBanner();
  const reorderMutation = useUpdateBannerOrders();

  const [items, setItems] = useState<Banner[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  const handleAddBanner = (url: string) => {
    if (url) createMutation.mutate({ imageUrl: url, orderIndex: items.length });
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    updateMutation.mutate({ id, data: { status: !currentStatus } });
  };

  const handleConfirmDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-6">
      <div className="border-b border-gray-100 pb-3">
        <h2 className="text-sm font-bold text-black">BANNER TRANG CHỦ</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Quản lý ảnh banner hiển thị trên trang chủ — kéo thả để sắp xếp thứ tự
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {items.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">
              Chưa có banner nào — tải ảnh lên bên dưới để thêm
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((banner) => (
                    <BannerCard
                      key={banner.id}
                      banner={banner}
                      onToggleStatus={handleToggleStatus}
                      onDelete={setDeleteId}
                      onUpdate={(id, data) => updateMutation.mutate({ id, data })}
                      isDeleting={deleteMutation.isPending}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <div className="pt-4 border-t border-gray-100">
            <FileUpload label="Tải thêm banner" value="" onChange={handleAddBanner} bgOption="none" />
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Xóa banner"
        description="Bạn có chắc chắn muốn xóa banner này? Hành động này không thể hoàn tác."
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
