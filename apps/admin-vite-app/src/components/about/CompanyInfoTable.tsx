import { useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import { useCompanyInfo, useCreateCompanyInfo, useUpdateCompanyInfo, useDeleteCompanyInfo } from '@/queries/about';
import { CompanyInfoRow } from './CompanyInfoRow';
import { inputCls, btnPrimary, btnGhost } from '@/utils/admin-styles';

export function CompanyInfoTable() {
  const { data: items, isLoading } = useCompanyInfo();
  const createMutation = useCreateCompanyInfo();
  const updateMutation = useUpdateCompanyInfo();
  const deleteMutation = useDeleteCompanyInfo();

  const [addingRow, setAddingRow] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    createMutation.mutate(
      { label: newLabel.trim(), value: newValue.trim(), orderIndex: items?.length ?? 0 },
      {
        onSuccess: () => {
          setNewLabel('');
          setNewValue('');
          setAddingRow(false);
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Xóa thông tin này?')) deleteMutation.mutate(id);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-bold text-black">THÔNG TIN GIỚI THIỆU CÔNG TY</h2>
          <p className="text-xs text-gray-500 mt-0.5">Hiển thị trên trang "Sơ lược về công ty"</p>
        </div>
        <button
          type="button"
          onClick={() => setAddingRow(true)}
          disabled={addingRow}
          className={btnPrimary}
        >
          <Plus className="h-3.5 w-3.5" /> Thêm dòng
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-2.5 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-2/5">Nhãn</th>
              <th className="py-2.5 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Giá trị</th>
              <th className="py-2.5 px-4 w-24" />
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <CompanyInfoRow
                key={item.id}
                item={item}
                onUpdate={(id, data) => updateMutation.mutate({ id, data })}
                onDelete={handleDelete}
                isDeleting={deleteMutation.isPending}
              />
            ))}

            {addingRow && (
              <tr className="border-b border-gray-100 bg-green-50/40">
                <td className="py-2 px-4">
                  <input
                    autoFocus
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className={inputCls}
                    placeholder="VD: Thành lập..."
                  />
                </td>
                <td className="py-2 px-4">
                  <input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    className={inputCls}
                    placeholder="VD: 1919..."
                  />
                </td>
                <td className="py-2 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => { setAddingRow(false); setNewLabel(''); setNewValue(''); }}
                      className={btnGhost}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleAdd}
                      disabled={!newLabel.trim() || createMutation.isPending}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-black rounded hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {createMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Thêm'}
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {!items?.length && !addingRow && (
              <tr>
                <td colSpan={3} className="py-10 text-center text-xs text-gray-400">
                  Chưa có thông tin nào — bấm "Thêm dòng" để bắt đầu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
