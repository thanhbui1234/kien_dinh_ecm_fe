import { useState } from 'react';
import { Mail, Phone, Calendar, Filter, ArrowDownUp } from 'lucide-react';
import { useLeads, useUpdateLeadStatus, useUpdateLead } from '@/queries/leads';
import { DataTable, ColumnDef } from '@/components/common/DataTable';
import { Lead } from 'shared-api';

const statusConfig = {
  PENDING: { label: 'MỚI', bg: 'bg-black', text: 'text-white', border: 'border-black' },
  CONTACTED: { label: 'ĐÃ LIÊN HỆ', bg: 'bg-white', text: 'text-black', border: 'border-black' },
  SPAM: { label: 'SPAM', bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-300' },
};

const priorityConfig = {
  HIGH: { label: 'Cao (High)', color: 'text-red-700 bg-red-50 border-red-200' },
  MEDIUM: { label: 'Vừa (Medium)', color: 'text-orange-700 bg-orange-50 border-orange-200' },
  LOW: { label: 'Thấp (Low)', color: 'text-gray-700 bg-gray-50 border-gray-200' },
};

export default function LeadsList() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    priority: '',
    sortBy: 'createdAt_desc',
  });

  const { data, isLoading } = useLeads({ page, limit: 10, ...filters });
  const updateStatusMutation = useUpdateLeadStatus();
  const updateLeadMutation = useUpdateLead();

  const handleStatusChange = (id: string, status: 'PENDING' | 'CONTACTED' | 'SPAM') => {
    updateStatusMutation.mutate({ id, data: { status } });
  };

  const handlePriorityChange = (id: string, priority: string) => {
    updateLeadMutation.mutate({ id, data: { priority } as Partial<Lead> });
  };

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset page on filter
  };

  const columns: ColumnDef<Lead>[] = [
    {
      key: 'customer', header: 'Khách hàng',
      cell: (row) => (
        <div>
          <div className="font-bold text-black text-sm">{row.fullName}</div>
          <div className="flex flex-col gap-1.5 mt-2">
            <a href={`tel:${row.phoneNumber}`} className="inline-flex items-center gap-1.5 w-fit px-2 py-1 rounded border border-blue-100 bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors">
              <Phone className="w-3 h-3" /> {row.phoneNumber}
            </a>
            {row.email && (
              <a href={`mailto:${row.email}`} className="inline-flex items-center gap-1.5 w-fit px-2 py-1 rounded border border-gray-200 bg-gray-50 text-gray-700 text-xs font-semibold hover:bg-gray-100 transition-colors">
                <Mail className="w-3 h-3" /> {row.email}
              </a>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'message', header: 'Nội dung',
      cell: (row) => (
        <div className="max-w-xs lg:max-w-md">
          <p className="text-sm font-medium text-gray-700 line-clamp-3">{row.message}</p>
          {row.targetProductId && <span className="text-xs font-bold text-indigo-600 mt-2 block">→ Sản phẩm quan tâm: ID {row.targetProductId}</span>}
        </div>
      ),
    },
    {
      key: 'createdAt', header: 'Thời gian',
      cell: (row) => <span className="text-xs font-medium text-gray-500">{new Date(row.createdAt).toLocaleString('vi-VN')}</span>,
    },
    {
      key: 'priority', header: 'Độ ưu tiên',
      cell: (row) => {
        const priority = (row as any).priority || 'MEDIUM';
        const cfg = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.MEDIUM;
        return (
          <select
            className={`h-8 rounded-md border px-2 text-xs font-bold focus:outline-none cursor-pointer transition-all shadow-sm ${cfg.color}`}
            value={priority}
            onChange={(e) => handlePriorityChange(row.id, e.target.value)}
            disabled={updateLeadMutation.isPending}
          >
            <option value="HIGH">Cao (High)</option>
            <option value="MEDIUM">Vừa (Medium)</option>
            <option value="LOW">Thấp (Low)</option>
          </select>
        );
      },
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
      key: 'actions', header: 'Xử lý',
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
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-bold text-black">Liên hệ</h1>
        <p className="text-xs text-gray-500 mt-0.5">Khách hàng để lại thông tin liên hệ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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

      {/* Filter Bar */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm flex flex-wrap items-end gap-4">
        <div className="space-y-1.5 flex-1 min-w-[150px]">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Từ ngày</label>
          <input
            type="date"
            className="w-full h-9 rounded-md border border-gray-300 px-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
            value={filters.startDate}
            onChange={(e) => updateFilter('startDate', e.target.value)}
          />
        </div>
        <div className="space-y-1.5 flex-1 min-w-[150px]">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Đến ngày</label>
          <input
            type="date"
            className="w-full h-9 rounded-md border border-gray-300 px-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
            value={filters.endDate}
            onChange={(e) => updateFilter('endDate', e.target.value)}
          />
        </div>
        <div className="space-y-1.5 flex-1 min-w-[150px]">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><Filter className="w-3.5 h-3.5" /> Độ ưu tiên</label>
          <select
            className="w-full h-9 rounded-md border border-gray-300 px-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
            value={filters.priority}
            onChange={(e) => updateFilter('priority', e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="HIGH">Cao (High)</option>
            <option value="MEDIUM">Vừa (Medium)</option>
            <option value="LOW">Thấp (Low)</option>
          </select>
        </div>
        <div className="space-y-1.5 flex-1 min-w-[150px]">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5"><ArrowDownUp className="w-3.5 h-3.5" /> Sắp xếp</label>
          <select
            className="w-full h-9 rounded-md border border-gray-300 px-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
          >
            <option value="createdAt_desc">Mới nhất</option>
            <option value="createdAt_asc">Cũ nhất</option>
            <option value="priority_desc">Ưu tiên (Cao ➔ Thấp)</option>
            <option value="priority_asc">Ưu tiên (Thấp ➔ Cao)</option>
          </select>
        </div>
        <div className="flex items-end mb-0.5">
          <button
            onClick={() => { setFilters({ startDate: '', endDate: '', priority: '', sortBy: 'createdAt_desc' }); setPage(1); }}
            className="h-9 px-4 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold transition-colors"
          >
            Xoá bộ lọc
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={data?.items || []} isLoading={isLoading} pageMeta={data?.meta} onPageChange={setPage} />
      </div>
    </div>
  );
}
