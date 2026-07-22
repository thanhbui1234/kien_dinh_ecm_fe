import { useState } from 'react';
import { Search, X, CheckCircle2 } from 'lucide-react';
import { useCategories } from '@/queries/categories';

interface CategoryPickerSectionProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function CategoryPickerSection({ selectedIds, onChange }: CategoryPickerSectionProps) {
  const [search, setSearch] = useState('');

  // Fetch categories (no pagination limit needed as usually small)
  const { data: categoriesData } = useCategories();
  const allCategories = Array.isArray(categoriesData) ? categoriesData : [];

  const filtered = allCategories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selected = allCategories.filter(c => selectedIds.includes(c.id));

  const toggle = (cid: string) => {
    onChange(
      selectedIds.includes(cid)
        ? selectedIds.filter(id => id !== cid)
        : [...selectedIds, cid]
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-sm font-bold text-black">DANH MỤC DỰ ÁN</h2>
        {selected.length > 0 && (
          <span className="text-xs text-black font-bold border border-black rounded px-2 py-0.5">
            {selected.length} đã chọn
          </span>
        )}
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map(c => (
            <div
              key={c.id}
              className="flex items-center gap-1.5 bg-gray-100 border border-gray-300 text-black font-semibold text-xs px-2.5 py-1 rounded"
            >
              <span className="max-w-[150px] truncate">{c.name}</span>
              <button
                type="button"
                onClick={() => toggle(c.id)}
                className="hover:text-red-600 transition-colors ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm danh mục..."
          className="w-full h-9 pl-9 pr-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black transition-all"
        />
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <p className="col-span-2 text-sm font-medium text-gray-500 text-center py-5">
            Không tìm thấy danh mục
          </p>
        ) : (
          filtered.map(c => {
            const isSelected = selectedIds.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                className={`flex items-center justify-between p-2.5 rounded-md border text-left transition-all ${
                  isSelected
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className={`text-xs truncate font-bold ${isSelected ? 'text-black' : 'text-gray-600'}`}>
                  {c.name}
                </span>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0 ml-2" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
