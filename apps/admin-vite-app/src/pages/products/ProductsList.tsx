import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Copy, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useProducts, useDeleteProduct, useCopyProduct, useUpdateProduct } from '@/queries/products';
import { useCategories } from '@/queries/categories';
import { DataTable, ColumnDef } from '@/components/common/DataTable';
import { DataFilter, FilterField } from '@/components/common/DataFilter';
import { StatusSwitch } from '@/components/common/StatusSwitch';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Product } from 'shared-api';
import { Link } from 'react-router-dom';

export default function ProductsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Extract all relevant params from URL
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || undefined;
  const categoryId = searchParams.get('categoryId') || undefined;
  const statusParam = searchParams.get('status');
  const status = statusParam === 'true' ? true : statusParam === 'false' ? false : undefined;
  const isFeaturedParam = searchParams.get('isFeatured');
  const isFeatured = isFeaturedParam === 'true' ? true : isFeaturedParam === 'false' ? false : undefined;
  const sortBy = searchParams.get('sortBy') || undefined;

  const { data, isLoading } = useProducts({ page, limit: 10, search, categoryId, status, isFeatured, sortBy });
  const deleteMutation = useDeleteProduct();
  const copyMutation = useCopyProduct();
  const updateMutation = useUpdateProduct();
  const { data: categoriesData } = useCategories();

  const filterFields: FilterField[] = [
    { key: 'search', type: 'search', placeholder: 'Tìm tên sản phẩm, mã...' },
    { key: 'categoryId', type: 'select', placeholder: 'Tất cả danh mục', options: (categoriesData || []).map((c: any) => ({ label: c.name, value: c.id })) },
    { key: 'status', type: 'select', placeholder: 'Tất cả trạng thái', options: [{ label: 'Hiển thị', value: 'true' }, { label: 'Đã ẩn', value: 'false' }] },
    { key: 'isFeatured', type: 'select', placeholder: 'Nổi bật?', options: [{ label: 'Có', value: 'true' }, { label: 'Không', value: 'false' }] },
    { key: 'sortBy', type: 'select', placeholder: 'Sắp xếp theo', options: [
      { label: 'Mới nhất', value: 'createdAt' },
      { label: 'Cũ nhất', value: 'createdAt_asc' },
      { label: 'Giá tăng dần', value: 'price_asc' },
      { label: 'Giá giảm dần', value: 'price_desc' }
    ] },
  ];

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
        <div className="flex items-center gap-2">
          <StatusSwitch 
            checked={row.status} 
            isLoading={updateMutation.isPending && updateMutation.variables?.id === row.id}
            onChange={(checked) => updateMutation.mutate({ id: row.id, data: { status: checked } })} 
          />
          <span className={`text-xs font-semibold ${row.status ? 'text-black' : 'text-gray-500'}`}>
            {row.status ? 'Hiển thị' : 'Đã ẩn'}
          </span>
        </div>
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
          <button 
            onClick={() => copyMutation.mutate(row.id)}
            disabled={copyMutation.isPending}
            className="flex items-center justify-center w-7 h-7 rounded-md border border-transparent text-gray-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all disabled:opacity-50">
            {copyMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
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

      <DataFilter fields={filterFields} />

      <DataTable 
        columns={columns} 
        data={data?.items || []} 
        isLoading={isLoading} 
        pageMeta={data?.meta} 
        onPageChange={(newPage) => {
          const newParams = new URLSearchParams(searchParams);
          newParams.set('page', newPage.toString());
          // Sử dụng setSearchParams từ hook để router bắt được thay đổi
          setSearchParams(newParams);
        }} 
      />
      <ConfirmModal isOpen={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}
        title="Xóa sản phẩm" description="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
        onConfirm={handleDelete} isLoading={deleteMutation.isPending} />
    </div>
  );
}
