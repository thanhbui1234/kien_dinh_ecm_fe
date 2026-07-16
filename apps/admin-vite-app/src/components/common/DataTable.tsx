import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { PageMeta } from 'shared-api';

export interface ColumnDef<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  pageMeta?: PageMeta;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({ columns, data, isLoading, pageMeta, onPageChange }: DataTableProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap ${col.className || ''}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
                      <p className="text-xs text-gray-500">Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">Chưa có dữ liệu</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3.5 align-middle ${col.className || ''}`}>
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pageMeta && pageMeta.totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-gray-600">
            Trang <span className="font-semibold text-black">{pageMeta.currentPage}</span> / {pageMeta.totalPages}
            <span className="ml-1 text-gray-400">({pageMeta.totalItems} kết quả)</span>
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange?.(pageMeta.currentPage - 1)}
              disabled={!pageMeta.hasPreviousPage || isLoading}
              className="flex items-center justify-center w-7 h-7 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onPageChange?.(pageMeta.currentPage + 1)}
              disabled={!pageMeta.hasNextPage || isLoading}
              className="flex items-center justify-center w-7 h-7 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
