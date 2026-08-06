import { useState, useEffect } from 'react';
import { Loader2, GripVertical, Trash2, Plus, Tag, Globe } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Slogan } from 'shared-api';
import {
  useSlogans,
  useCreateSlogan,
  useUpdateSlogan,
  useDeleteSlogan,
  useUpdateSloganOrders,
  useSaveSloganTranslation,
} from '@/queries/settings';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { inputCls, labelCls, btnPrimary } from '@/utils/admin-styles';

// ─── Slogan Card ──────────────────────────────────────────────────────────────

function SloganCard({
  slogan,
  onDelete,
  onUpdate,
  isDeleting,
}: {
  slogan: Slogan;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Slogan>) => void;
  isDeleting: boolean;
}) {
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
  const [activeTab, setActiveTab] = useState<'VI' | 'EN'>('VI');
  const [enTitle, setEnTitle] = useState('');
  const [enDescription, setEnDescription] = useState('');
  const [savedEN, setSavedEN] = useState(false);
  const saveTranslation = useSaveSloganTranslation();

  const hasEnContent = savedEN || enTitle.trim() !== '';

  const handleSave = () => {
    onUpdate(slogan.id, { title, icon, description });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(slogan.title || '');
    setIcon(slogan.icon || '');
    setDescription(slogan.description || '');
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group rounded-lg border border-gray-200 bg-white shadow-sm flex flex-col overflow-hidden"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
        <div
          {...attributes}
          {...listeners}
          className="text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'VI' ? 'EN' : 'VI')}
            className={`flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${activeTab === 'EN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500 hover:text-purple-600'}`}
          >
            <Globe className="h-3 w-3" />
            {activeTab === 'EN' ? 'EN' : 'VI'}
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block ml-0.5 ${hasEnContent ? 'bg-emerald-500' : 'bg-amber-400'}`}
              title={hasEnContent ? 'Đã có bản dịch EN' : 'Chưa có bản dịch EN'}
            />
          </button>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-1">
            #{slogan.orderIndex ?? 0}
          </span>
          <button
            type="button"
            onClick={() => onDelete(slogan.id)}
            disabled={isDeleting}
            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* VI Body */}
      <div className={`p-4 flex-1 ${activeTab === 'VI' ? 'block' : 'hidden'}`}>
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Icon (emoji hoặc text)</label>
              <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} className={inputCls} placeholder="Ví dụ: 🏭 hoặc check" />
            </div>
            <div>
              <label className={labelCls}>Tiêu đề</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="Nhập tiêu đề slogan..." />
            </div>
            <div>
              <label className={labelCls}>Mô tả (subtitle)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputCls} h-auto py-2`} rows={2} placeholder="Nhập mô tả ngắn..." />
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button type="button" onClick={handleCancel} className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-black transition-colors cursor-pointer">Hủy</button>
              <button type="button" onClick={handleSave} className="px-3 py-1.5 text-xs font-bold text-white bg-black rounded hover:bg-gray-800 transition-colors cursor-pointer">Lưu lại</button>
            </div>
          </div>
        ) : (
          <div className="cursor-pointer space-y-1.5" onClick={() => setIsEditing(true)} title="Bấm để chỉnh sửa">
            {slogan.icon && <span className="text-2xl leading-none block">{slogan.icon}</span>}
            <p className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
              {slogan.title || <span className="text-gray-400 italic font-normal text-xs">Chưa có tiêu đề</span>}
            </p>
            <p className="text-xs text-gray-500 line-clamp-3">
              {slogan.description || <span className="text-gray-400 italic">Chưa có mô tả</span>}
            </p>
          </div>
        )}
      </div>

      {/* EN Body */}
      <div className={`p-4 space-y-3 ${activeTab === 'EN' ? 'block' : 'hidden'}`}>
        <p className="text-[10px] text-purple-600 font-semibold uppercase">🇬🇧 English Translation</p>
        <div>
          <label className={labelCls}>Title (EN)</label>
          <input type="text" value={enTitle} onChange={(e) => setEnTitle(e.target.value)} className={inputCls} placeholder={slogan.title || 'Slogan title in English...'} />
        </div>
        <div>
          <label className={labelCls}>Description (EN)</label>
          <textarea value={enDescription} onChange={(e) => setEnDescription(e.target.value)} className={`${inputCls} h-auto py-2`} rows={2} placeholder={slogan.description || 'Slogan description in English...'} />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => saveTranslation.mutate(
              { id: slogan.id, data: { lang: 'EN', title: enTitle, description: enDescription } },
              { onSuccess: () => setSavedEN(true) }
            )}
            disabled={!enTitle.trim() || saveTranslation.isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {saveTranslation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            Lưu EN
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SloganSection ────────────────────────────────────────────────────────────

export function SloganSection() {
  const { data, isLoading } = useSlogans();
  const createMutation = useCreateSlogan();
  const updateMutation = useUpdateSlogan();
  const deleteMutation = useDeleteSlogan();
  const reorderMutation = useUpdateSloganOrders();

  const [items, setItems] = useState<Slogan[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [newDescription, setNewDescription] = useState('');

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
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        const next = arrayMove(prev, oldIndex, newIndex);
        reorderMutation.mutate(next.map((item, idx) => ({ id: item.id, orderIndex: idx })));
        return next.map((item, idx) => ({ ...item, orderIndex: idx }));
      });
    }
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    createMutation.mutate(
      { title: newTitle, icon: newIcon, description: newDescription, orderIndex: items.length },
      {
        onSuccess: () => {
          setShowAddForm(false);
          setNewTitle('');
          setNewIcon('');
          setNewDescription('');
        },
      }
    );
  };

  const handleConfirmDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-black">
            {items.length} slogan
          </p>
          <p className="text-xs text-gray-500">Quản lý các điểm nổi bật / slogan hiển thị trên trang chủ</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm((v) => !v)}
          className={btnPrimary}
        >
          <Plus className="h-3.5 w-3.5" />
          Thêm slogan
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5 space-y-4">
          <p className="text-xs font-bold text-gray-500 uppercase">Slogan mới</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Icon (emoji hoặc text)</label>
              <input
                type="text"
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                className={inputCls}
                placeholder="Ví dụ: 🏭 hoặc ✅"
              />
            </div>
            <div>
              <label className={labelCls}>Tiêu đề *</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className={inputCls}
                placeholder="Nhập tiêu đề slogan..."
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Mô tả (subtitle)</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className={`${inputCls} h-auto py-2`}
                rows={2}
                placeholder="Mô tả ngắn hiển thị bên dưới tiêu đề..."
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setNewTitle(''); setNewIcon(''); setNewDescription(''); }}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-black transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newTitle.trim() || createMutation.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-black rounded hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {createMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Tạo slogan
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {/* Empty */}
      {!isLoading && items.length === 0 && !showAddForm && (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border-2 border-dashed border-gray-200">
          <Tag className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-500">Chưa có slogan nào</p>
          <p className="text-xs text-gray-400 mt-1">Bấm "Thêm slogan" để bắt đầu</p>
        </div>
      )}

      {/* Grid with drag/drop */}
      {!isLoading && items.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((slogan) => (
                <SloganCard
                  key={slogan.id}
                  slogan={slogan}
                  onDelete={setDeleteId}
                  onUpdate={(id, data) => updateMutation.mutate({ id, data })}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {items.length > 1 && (
        <p className="text-xs text-gray-400 text-center">
          Kéo thả để thay đổi thứ tự • Bấm vào card để chỉnh sửa
        </p>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Xóa slogan"
        description="Bạn có chắc chắn muốn xóa slogan này? Hành động này không thể hoàn tác."
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
