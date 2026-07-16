import { useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useProducts, useDeleteProduct } from '@/queries/products';
import { DataTable, ColumnDef } from '@/components/common/DataTable';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Product } from 'shared-api';
import { Link } from 'react-router-dom';

export default function ProductsList() {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useProducts({ page, limit: 10 });
  const deleteMutation = useDeleteProduct();

  const handleDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const columns: ColumnDef<Product>[] = [
    {
      key: 'image', header: 'Hình ảnh',
      cell: (row) => {
        // Tối ưu hóa ảnh thumbnail bằng Cloudinary: resize xuống 100x100, tự động format (WebP) và nén chất lượng
        const optimizedUrl = row.thumbnailUrl 
          ? row.thumbnailUrl.replace('/upload/', '/upload/c_thumb,w_100,h_100,f_auto,q_auto/') 
          : 'https://placehold.co/40x40/f9fafb/6b7280?text=...';
          
        return (
          <img src={optimizedUrl} alt={row.name}
            className="w-9 h-9 rounded-md object-cover border border-gray-300" />
        );
      },
    },
    {
      key: 'name', header: 'Tên sản phẩm',
      cell: (row) => (
        <div>
          <div className="font-semibold text-black">{row.name}</div>
          <div className="text-xs text-gray-500 mt-0.5">{row.slug}</div>
        </div>
      ),
    },
    {
      key: 'price', header: 'Giá',
      cell: (row) => (
        <span className="text-sm font-medium text-black">
          {row.price ? `${row.price.toLocaleString('vi-VN')} ₫` : 'Liên hệ'}
        </span>
      ),
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
          <Link to={`/products/${row.id}`}
            className="flex items-center justify-center w-7 h-7 rounded-md border border-transparent text-gray-400 hover:text-black hover:border-gray-300 hover:bg-gray-50 transition-all">
            <Eye className="h-3.5 w-3.5" />
          </Link>
          <Link to={`/products/${row.id}/edit`}
            className="flex items-center justify-center w-7 h-7 rounded-md border border-transparent text-gray-400 hover:text-black hover:border-gray-300 hover:bg-gray-50 transition-all">
            <Edit className="h-3.5 w-3.5" />
          </Link>
          <button onClick={() => setDeleteId(row.id)}
            className="flex items-center justify-center w-7 h-7 rounded-md border border-transparent text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all">
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
          <h1 className="text-xl font-bold text-black">Sản phẩm</h1>
          <p className="text-xs text-gray-500 mt-0.5">Quản lý danh sách sản phẩm trong hệ thống</p>
        </div>
        <Link to="/products/create"
          className="flex items-center gap-1.5 h-8 px-4 rounded-md bg-black hover:bg-gray-800 text-white text-xs font-semibold transition-colors shadow-sm">
          <Plus className="h-3.5 w-3.5" /> Thêm mới
        </Link>
      </div>
      <DataTable columns={columns} data={data?.items || []} isLoading={isLoading} pageMeta={data?.meta} onPageChange={setPage} />
      <ConfirmModal isOpen={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}
        title="Xóa sản phẩm" description="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
        onConfirm={handleDelete} isLoading={deleteMutation.isPending} />
    </div>
  );
}
