import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useJobs, useDeleteJob, useUpdateJob } from '@/queries/jobs';
import { DataTable, ColumnDef } from '@/components/common/DataTable';
import { DataFilter, FilterField } from '@/components/common/DataFilter';
import { StatusSwitch } from '@/components/common/StatusSwitch';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Job } from 'shared-api';
import { Link } from 'react-router-dom';

export default function JobsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || undefined;
  const statusParam = searchParams.get('status');
  const status = statusParam === 'true' ? true : statusParam === 'false' ? false : undefined;

  const { data, isLoading } = useJobs({ page, limit: 10, search, status });
  const deleteMutation = useDeleteJob();
  const updateMutation = useUpdateJob();

  const filterFields: FilterField[] = [
    { key: 'search', type: 'search', placeholder: 'Tìm vị trí tuyển dụng...' },
    { key: 'status', type: 'select', placeholder: 'Tất cả trạng thái', options: [{ label: 'Đang tuyển', value: 'true' }, { label: 'Đã đóng', value: 'false' }] },
  ];

  const handleDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const columns: ColumnDef<Job>[] = [
    {
      key: 'title', header: 'Vị trí tuyển dụng',
      cell: (row) => <span className="font-semibold text-black">{row.title}</span>,
    },
    {
      key: 'salary', header: 'Mức lương',
      cell: (row) => <span className="text-sm font-medium text-gray-600">{row.salary || 'Thỏa thuận'}</span>,
    },
    {
      key: 'createdAt', header: 'Ngày đăng',
      cell: (row) => <span className="text-xs font-medium text-gray-500">{new Date(row.createdAt).toLocaleDateString('vi-VN')}</span>,
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
            {row.status ? 'Đang tuyển' : 'Đã đóng'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions', header: '',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Link to={`/jobs/${row.id}/edit`}
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
          <h1 className="text-xl font-bold text-black">Tuyển dụng</h1>
          <p className="text-xs text-gray-500 mt-0.5">Quản lý các tin tuyển dụng</p>
        </div>
        <Link to="/jobs/create"
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
        title="Xóa tin tuyển dụng" description="Bạn có chắc muốn xóa tin tuyển dụng này? Hành động này không thể hoàn tác."
        onConfirm={handleDelete} isLoading={deleteMutation.isPending} />
    </div>
  );
}
