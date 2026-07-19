import { useState } from 'react';
import { Search, X, CheckCircle2 } from 'lucide-react';
import { useProducts } from '@/queries/products';

interface ProductPickerSectionProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function ProductPickerSection({ selectedIds, onChange }: ProductPickerSectionProps) {
  const [search, setSearch] = useState('');

  const { data: productsData } = useProducts({ limit: 100 });
  const allProducts = productsData?.items || [];

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const selected = allProducts.filter(p => selectedIds.includes(p.id));

  const toggle = (pid: string) => {
    onChange(
      selectedIds.includes(pid)
        ? selectedIds.filter(id => id !== pid)
        : [...selectedIds, pid]
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-sm font-bold text-black">SẢN PHẨM LIÊN QUAN</h2>
        {selected.length > 0 && (
          <span className="text-xs text-black font-bold border border-black rounded px-2 py-0.5">
            {selected.length} đã chọn
          </span>
        )}
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map(p => (
            <div
              key={p.id}
              className="flex items-center gap-1.5 bg-gray-100 border border-gray-300 text-black font-semibold text-xs px-2.5 py-1 rounded"
            >
              {p.thumbnailUrl && (
                <img src={p.thumbnailUrl} alt={p.name} className="w-4 h-4 rounded-sm object-cover" />
              )}
              <span className="max-w-[150px] truncate">{p.name}</span>
              <button
                type="button"
                onClick={() => toggle(p.id)}
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
          placeholder="Tìm sản phẩm..."
          className="w-full h-9 pl-9 pr-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black transition-all"
        />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <p className="col-span-2 text-sm font-medium text-gray-500 text-center py-5">
            Không tìm thấy sản phẩm
          </p>
        ) : (
          filtered.map(p => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggle(p.id)}
                className={`flex items-center gap-3 p-2.5 rounded-md border text-left transition-all ${
                  isSelected
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="shrink-0 relative">
                  <img
                    src={p.thumbnailUrl || 'https://placehold.co/32x32/f9fafb/6b7280?text=...'}
                    alt={p.name}
                    className="w-8 h-8 rounded-sm object-cover border border-gray-200"
                  />
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-black" />
                    </div>
                  )}
                </div>
                <span className={`text-xs truncate font-bold ${isSelected ? 'text-black' : 'text-gray-600'}`}>
                  {p.name}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
