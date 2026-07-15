import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { useLeads, useUpdateLeadStatus } from '@/queries/leads';
import { DataTable, ColumnDef } from '@/components/common/DataTable';
import { Lead } from 'shared-api';

const statusConfig = {
  PENDING: { label: 'MỚI', bg: 'bg-black', text: 'text-white', border: 'border-black' },
  CONTACTED: { label: 'ĐÃ LIÊN HỆ', bg: 'bg-white', text: 'text-black', border: 'border-black' },
  SPAM: { label: 'SPAM', bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-300' },
};

export default function LeadsList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useLeads({ page, limit: 10 });
  const updateStatusMutation = useUpdateLeadStatus();

  const handleStatusChange = (id: string, status: 'PENDING' | 'CONTACTED' | 'SPAM') => {
    updateStatusMutation.mutate({ id, data: { status } });
  };

  const columns: ColumnDef<Lead>[] = [
    {
      key: 'customer', header: 'Khách hàng',
      cell: (row) => (
        <div>
          <div className="font-semibold text-black">{row.fullName}</div>
          <div className="flex flex-col gap-0.5 mt-1">
            <span className="text-xs font-medium text-gray-500 flex items-center gap-1"><Phone className="w-2.5 h-2.5" /> {row.phoneNumber}</span>
            {row.email && <span className="text-xs font-medium text-gray-500 flex items-center gap-1"><Mail className="w-2.5 h-2.5" /> {row.email}</span>}
          </div>
        </div>
      ),
    },
    {
      key: 'message', header: 'Nội dung',
      cell: (row) => (
        <div className="max-w-sm">
          <p className="text-sm font-medium text-gray-700 line-clamp-2">{row.message}</p>
          {row.product && <span className="text-xs font-semibold text-black mt-1 block">→ Quan tâm: {row.product.name}</span>}
        </div>
      ),
    },
    {
      key: 'createdAt', header: 'Thời gian',
      cell: (row) => <span className="text-xs font-medium text-gray-500">{new Date(row.createdAt).toLocaleString('vi-VN')}</span>,
    },
    {
      key: 'status', header: 'Trạng thái',
      cell: (row) => {
        const cfg = statusConfig[row.status as keyof typeof statusConfig] || statusConfig.PENDING;
        return (
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            {cfg.label}
          </span>
        );
      },
    },
    {
      key: 'actions', header: 'Cập nhật',
      cell: (row) => (
        <select
          className="h-8 rounded-md border border-gray-300 bg-white px-2 text-xs font-semibold text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black cursor-pointer transition-all shadow-sm"
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value as any)}
          disabled={updateStatusMutation.isPending}
        >
          <option value="PENDING">Đánh dấu MỚI</option>
          <option value="CONTACTED">Đã liên hệ</option>
          <option value="SPAM">Đánh dấu Spam</option>
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-black">Liên hệ</h1>
        <p className="text-xs text-gray-500 mt-0.5">Khách hàng để lại thông tin liên hệ</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Tổng liên hệ', value: data?.meta?.totalItems || 0, color: 'text-black' },
          { label: 'Mới (Chờ xử lý)', value: (data?.items || []).filter(l => l.status === 'PENDING').length, color: 'text-black' },
          { label: 'Đã liên hệ', value: (data?.items || []).filter(l => l.status === 'CONTACTED').length, color: 'text-gray-500' },
        ].map(stat => (
          <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={data?.items || []} isLoading={isLoading} pageMeta={data?.meta} onPageChange={setPage} />
    </div>
  );
}
