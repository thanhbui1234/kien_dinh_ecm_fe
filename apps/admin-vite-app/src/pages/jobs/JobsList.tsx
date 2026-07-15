import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useJobs, useDeleteJob } from '@/queries/jobs';
import { DataTable, ColumnDef } from '@/components/common/DataTable';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Job } from 'shared-api';
import { Link } from 'react-router-dom';

export default function JobsList() {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useJobs({ page, limit: 10 });
  const deleteMutation = useDeleteJob();

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
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
          row.status ? 'bg-white border-black text-black' : 'bg-gray-100 border-gray-300 text-gray-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${row.status ? 'bg-black' : 'bg-gray-400'}`} />
          {row.status ? 'Đang tuyển' : 'Đã đóng'}
        </span>
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

      <DataTable columns={columns} data={data?.items || []} isLoading={isLoading} pageMeta={data?.meta} onPageChange={setPage} />

      <ConfirmModal isOpen={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}
        title="Xóa tin tuyển dụng" description="Bạn có chắc muốn xóa tin tuyển dụng này? Hành động này không thể hoàn tác."
        onConfirm={handleDelete} isLoading={deleteMutation.isPending} />
    </div>
  );
}
