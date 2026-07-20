import { useState } from 'react';
import { Plus, Edit, Trash2, Sparkles } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useProjects, useDeleteProject, useUpdateProject } from '@/queries/projects';
import { DataTable, ColumnDef } from '@/components/common/DataTable';
import { DataFilter, FilterField } from '@/components/common/DataFilter';
import { StatusSwitch } from '@/components/common/StatusSwitch';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Project } from 'shared-api';
import { Link } from 'react-router-dom';

export default function ProjectsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || undefined;
  const statusParam = searchParams.get('status');
  const status = statusParam === 'true' ? true : statusParam === 'false' ? false : undefined;

  const { data, isLoading } = useProjects({ page, limit: 9, search, status });
  const deleteMutation = useDeleteProject();
  const updateMutation = useUpdateProject();

  const filterFields: FilterField[] = [
    { key: 'search', type: 'search', placeholder: 'Tìm tên dự án...' },
    { key: 'status', type: 'select', placeholder: 'Tất cả trạng thái', options: [{ label: 'Hiển thị', value: 'true' }, { label: 'Đã ẩn', value: 'false' }] },
  ];

  const handleDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const columns: ColumnDef<Project>[] = [
    {
      key: 'image', header: 'Ảnh bìa',
      cell: (row) => (
        <img src={row.coverImage || 'https://placehold.co/40x28/f9fafb/6b7280?text=...'} alt={row.name}
          className="w-14 h-9 rounded border border-gray-300 object-cover" />
      ),
    },
    {
      key: 'name', header: 'Tên dự án',
      cell: (row) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-black">{row.name}</span>
            {(row as any).isFeatured && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                <Sparkles className="w-2.5 h-2.5" /> Nổi bật
              </span>
            )}
          </div>
          <div className="text-xs font-medium text-gray-500 mt-0.5 line-clamp-1 max-w-xs">{row.description}</div>
        </div>
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
          <Link to={`/projects/${row.id}/edit`}
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
          <h1 className="text-xl font-bold text-black">Dự án</h1>
          <p className="text-xs text-gray-500 mt-0.5">Quản lý danh sách dự án tiêu biểu</p>
        </div>
        <Link to="/projects/create"
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
          setSearchParams(newParams);
        }} 
      />

      <ConfirmModal isOpen={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}
        title="Xóa dự án" description="Bạn có chắc muốn xóa dự án này? Hành động này không thể hoàn tác."
        onConfirm={handleDelete} isLoading={deleteMutation.isPending} />
    </div>
  );
}
