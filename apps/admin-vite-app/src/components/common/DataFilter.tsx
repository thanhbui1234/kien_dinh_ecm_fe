import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Filter } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type FilterFieldType = 'search' | 'select';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterField {
  key: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: FilterOption[];
  className?: string;
}

interface DataFilterProps {
  fields: FilterField[];
}

export function DataFilter({ fields }: DataFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const [searchValue, setSearchValue] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchValue, 500);

  useEffect(() => {
    if (debouncedSearch !== initialSearch) {
      const newParams = new URLSearchParams(searchParams);
      if (debouncedSearch) {
        newParams.set('search', debouncedSearch);
      } else {
        newParams.delete('search');
      }
      newParams.set('page', '1');
      setSearchParams(newParams);
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const hasActiveFilters = Array.from(searchParams.keys()).some(k => k !== 'page' && k !== 'limit');

  const clearFilters = () => {
    setSearchValue('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm mb-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 border-r border-gray-200 pr-3">
        <Filter className="w-4 h-4 text-gray-500" /> Lọc dữ liệu
      </div>
      
      {fields.map((field) => {
        if (field.type === 'search' && field.key === 'search') {
          return (
            <div key={field.key} className={`relative flex-1 min-w-[200px] max-w-sm ${field.className || ''}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="block w-full pl-9 pr-8 py-1.5 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                placeholder={field.placeholder || 'Tìm kiếm...'}
              />
              {searchValue && (
                <button
                  onClick={() => setSearchValue('')}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        }

        if (field.type === 'select') {
          const currentValue = searchParams.get(field.key) || 'all';
          return (
            <div key={field.key} className={field.className || 'w-[160px]'}>
              <Select value={currentValue} onValueChange={(val) => handleSelectChange(field.key, val)}>
                <SelectTrigger className="h-8 bg-white">
                  <SelectValue placeholder={field.placeholder || 'Tất cả'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{field.placeholder || 'Tất cả'}</SelectItem>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }

        return null;
      })}

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="ml-auto text-xs font-semibold text-white bg-red-500 hover:bg-red-600 shadow-sm flex items-center gap-1.5 transition-all px-3 py-1.5 rounded-md"
        >
          <X className="w-3.5 h-3.5" /> Xóa bộ lọc
        </button>
      )}
    </div>
  );
}
