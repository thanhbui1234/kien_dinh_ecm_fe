import { Bell, Search, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const routeLabels: Record<string, string> = {
  '/': 'Tổng quan',
  '/products': 'Sản phẩm',
  '/categories': 'Danh mục',
  '/projects': 'Dự án',
  '/jobs': 'Tuyển dụng',
  '/leads': 'Liên hệ',
  '/settings': 'Cài đặt',
};

export function Header() {
  const location = useLocation();

  const getLabel = () => {
    for (const [key, label] of Object.entries(routeLabels).reverse()) {
      if (location.pathname.startsWith(key) && key !== '/') return label;
    }
    return routeLabels['/'];
  };

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-6">
      <div className="flex-1">
        <h2 className="text-sm font-semibold text-black">{getLabel()}</h2>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="search"
            placeholder="Tìm kiếm..."
            className="h-8 w-48 rounded-md bg-white border border-gray-300 pl-8 pr-3 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
          />
        </div>

        <button className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-600 hover:text-black relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-black rounded-full" />
        </button>

        <button className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-600 hover:text-black">
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
