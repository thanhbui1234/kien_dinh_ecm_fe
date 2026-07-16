import { useState, useEffect } from 'react';
import { useSystemSettings, useUpdateSystemSetting, useBanners, useCreateBanner, useUpdateBanner, useDeleteBanner, useUpdateBannerOrders } from '@/queries/settings';
import { Loader2, Save, Trash2, GripVertical } from 'lucide-react';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { SystemSetting, Banner } from 'shared-api';
import { FileUpload } from '@/components/upload/FileUpload';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Toggle = ({ checked, onToggle }: { checked: boolean; onToggle: () => void }) => (
  <button type="button" onClick={onToggle}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${checked ? 'bg-black' : 'bg-gray-200'}`}
  >
    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
  </button>
);

const inputCls = "w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2";

export default function SettingsPage() {
  const { data: settings, isLoading } = useSystemSettings();
  const updateMutation = useUpdateSystemSetting();

  const handleUpdate = (key: string, value: string) => {
    updateMutation.mutate({ key, data: { value } });
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 text-black animate-spin" /></div>;
  }

  const textSettings = settings?.filter((s: SystemSetting) => !s.key.includes('HTML') && !s.key.includes('POLICY')) || [];
  const htmlSettings = settings?.filter((s: SystemSetting) => s.key.includes('HTML') || s.key.includes('POLICY')) || [];

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <div>
        <h1 className="text-xl font-bold text-black">Cài đặt hệ thống</h1>
        <p className="text-xs font-medium text-gray-500 mt-0.5">Quản lý cấu hình chung cho website</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">CẤU HÌNH THÔNG TIN</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {textSettings.map((setting: SystemSetting) => (
            <SettingItem
              key={setting.key}
              setting={setting}
              onSave={(val) => handleUpdate(setting.key, val)}
              isSaving={updateMutation.isPending}
            />
          ))}
        </div>

        {htmlSettings.length > 0 && (
          <div className="pt-6 border-t border-gray-200 space-y-6">
            <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">CẤU HÌNH NỘI DUNG MỞ RỘNG</h2>
            {htmlSettings.map((setting: SystemSetting) => (
              <div key={setting.key} className="space-y-3">
                <label className={labelCls}>{setting.key}</label>
                <SettingHtmlItem
                  setting={setting}
                  onSave={(val) => handleUpdate(setting.key, val)}
                  isSaving={updateMutation.isPending}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <BannerSection />
    </div>
  );
}

function SettingItem({ setting, onSave, isSaving }: { setting: SystemSetting, onSave: (val: string) => void, isSaving: boolean }) {
  const [value, setValue] = useState(setting.value || '');

  return (
    <div className="space-y-2">
      <label className={labelCls}>{setting.key}</label>
      <div className="flex space-x-2">
        <input
          id={setting.key}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => onSave(value)}
          disabled={isSaving || value === setting.value}
          className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-md bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-sm shrink-0"
        >
          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          LƯU
        </button>
      </div>
    </div>
  );
}

function SettingHtmlItem({ setting, onSave, isSaving }: { setting: SystemSetting, onSave: (val: string) => void, isSaving: boolean }) {
  const [value, setValue] = useState(setting.value || '');

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm">
        <RichTextEditor value={value} onChange={setValue} />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onSave(value)}
          disabled={isSaving || value === setting.value}
          className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-md bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-sm"
        >
          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          LƯU THAY ĐỔI
        </button>
      </div>
    </div>
  );
}

const BannerCard = ({ 
  banner, 
  onToggleStatus, 
  onDelete, 
  onUpdate, 
  isDeleting 
}: { 
  banner: any, 
  onToggleStatus: (id: string, currentStatus: boolean) => void, 
  onDelete: (id: string) => void, 
  onUpdate: (id: string, data: any) => void,
  isDeleting: boolean
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id });

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
    <div ref={setNodeRef} style={style} className="group rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex flex-col">
      <div className="relative aspect-[21/9] w-full bg-gray-100 border-b border-gray-200">
        <img src={banner.imageUrl} alt={`Banner`} className="w-full h-full object-cover" />
        <button 
          type="button" 
          onClick={() => onDelete(banner.id)}
          disabled={isDeleting}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-50 disabled:opacity-50 z-20"
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
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputCls} placeholder="Nhập tiêu đề..." />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">Mô tả</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className={`${inputCls} h-auto py-2`} rows={2} placeholder="Nhập mô tả..." />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-700 uppercase">Đường dẫn liên kết</label>
              <input type="text" value={link} onChange={e => setLink(e.target.value)} className={inputCls} placeholder="Nhập link..." />
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-black transition-colors">Hủy</button>
              <button type="button" onClick={handleSave} className="px-3 py-1.5 text-xs font-bold text-white bg-black rounded hover:bg-gray-800 transition-colors">Lưu lại</button>
            </div>
          </div>
        ) : (
          <div className="group/text cursor-pointer" onClick={() => setIsEditing(true)}>
            <p className="text-sm font-bold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors" title="Bấm để chỉnh sửa">
              {title || <span className="text-gray-400 italic font-normal">Chưa có tiêu đề</span>}
            </p>
            <p className="text-xs text-gray-600 line-clamp-2 mt-1">
              {description || <span className="text-gray-400 italic font-normal">Chưa có mô tả</span>}
            </p>
            {link && <p className="text-[10px] text-blue-500 mt-2 truncate max-w-full block">{link}</p>}
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
};

function BannerSection() {
  const { data, isLoading } = useBanners();
  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const deleteMutation = useDeleteBanner();
  const reorderMutation = useUpdateBannerOrders();

  const [items, setItems] = useState<Banner[]>([]);

  useEffect(() => {
    if (data) {
      setItems([...data].sort((a, b) => a.orderIndex - b.orderIndex));
    }
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Cập nhật orderIndex cho tất cả
        const updatedOrders = newItems.map((item, index) => ({
          id: item.id,
          orderIndex: index
        }));
        
        // Gọi API cập nhật
        reorderMutation.mutate(updatedOrders);
        
        return newItems.map((item, index) => ({ ...item, orderIndex: index }));
      });
    }
  };

  const handleAddBanner = (url: string) => {
    if (url) {
      createMutation.mutate({ imageUrl: url, orderIndex: items.length });
    }
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    updateMutation.mutate({ id, data: { status: !currentStatus } });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa banner này?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-sm font-bold text-black">CẤU HÌNH BANNER TRANG CHỦ</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(i => i.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((banner) => (
                <BannerCard 
                  key={banner.id}
                  banner={banner}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDelete}
                  onUpdate={(id, data) => updateMutation.mutate({ id, data })}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="pt-4 border-t border-gray-100">
        <FileUpload 
          label="Tải thêm banner" 
          value="" 
          onChange={handleAddBanner} 
          bgOption="none" 
        />
      </div>
    </div>
  );
}
