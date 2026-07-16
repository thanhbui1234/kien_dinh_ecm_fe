import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useCategories, useDeleteCategory } from '@/queries/categories';
import { DataTable, ColumnDef } from '@/components/common/DataTable';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Category } from 'shared-api';
import { Link } from 'react-router-dom';

export default function CategoriesList() {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useCategories({ page, limit: 10 });
  const deleteMutation = useDeleteCategory();

  const handleDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const columns: ColumnDef<Category>[] = [
    {
      key: 'image', header: 'Hình ảnh',
      cell: (row) => (
        <img src={row.imageUrl || 'https://placehold.co/36x36/f9fafb/6b7280?text=...'} alt={row.name}
          className="w-8 h-8 rounded border border-gray-300 object-cover" />
      ),
    },
    {
      key: 'name', header: 'Tên danh mục',
      cell: (row) => (
        <div>
          <div className="font-semibold text-black">{row.name}</div>
          <div className="text-xs font-medium text-gray-500 mt-0.5">{row.slug}</div>
        </div>
      ),
    },
    {
      key: 'order', header: 'Thứ tự',
      cell: (row) => <span className="font-semibold text-black">{row.orderIndex}</span>,
    },
    {
      key: 'parentId', header: 'Danh mục cha',
      cell: (row) => <span className="text-xs font-medium text-gray-500">{row.parentId ? row.parentId.slice(0, 8) + '...' : '—'}</span>,
    },
    {
      key: 'status', header: 'Trạng thái',
      cell: (row) => (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
          row.status ? 'bg-white border-black text-black' : 'bg-gray-100 border-gray-300 text-gray-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${row.status ? 'bg-black' : 'bg-gray-400'}`} />
          {row.status ? 'Hiển thị' : 'Đã ẩn'}
        </span>
      ),
    },
    {
      key: 'actions', header: '',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Link to={`/categories/${row.id}/edit`}
            className="flex items-center justify-center w-7 h-7 rounded border border-transparent text-gray-400 hover:text-black hover:border-gray-300 hover:bg-gray-50 transition-all">
            <Edit className="h-3.5 w-3.5" />
          </Link>
          <button onClick={() => setDeleteId(row.id)}
            className="flex items-center justify-center w-7 h-7 rounded border border-transparent text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-black">Danh mục</h1>
          <p className="text-xs text-gray-500 mt-0.5">Quản lý danh mục sản phẩm</p>
        </div>
        <Link to="/categories/create"
          className="flex items-center gap-1.5 h-8 px-4 rounded-md bg-black hover:bg-gray-800 text-white text-xs font-semibold transition-colors shadow-sm">
          <Plus className="h-3.5 w-3.5" /> Thêm mới
        </Link>
      </div>

      <DataTable columns={columns} data={Array.isArray(data) ? data : []} isLoading={isLoading} onPageChange={setPage} />

      <ConfirmModal isOpen={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}
        title="Xóa danh mục" description="Bạn có chắc muốn xóa danh mục này? Hành động này không thể hoàn tác."
        onConfirm={handleDelete} isLoading={deleteMutation.isPending} />
    </div>
  );
}
