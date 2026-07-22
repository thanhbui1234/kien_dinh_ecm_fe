import { User, Globe } from 'lucide-react';
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

import { ENV } from '@/config/env';

export function Header() {
  const location = useLocation();

  const getLabel = () => {
    for (const [key, label] of Object.entries(routeLabels).reverse()) {
      if (location.pathname.startsWith(key) && key !== '/') return label;
    }
    return routeLabels['/'];
  };

  const frontendUrl = ENV.FRONTEND_URL;

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-6">
      <div className="flex-1">
        <h2 className="text-sm font-semibold text-black">{getLabel()}</h2>
      </div>

      <div className="flex items-center gap-2">
        <a 
          href={frontendUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          title="Xem trang Live"
          className="flex items-center gap-1.5 px-3 h-8 rounded-md border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors text-xs font-medium text-gray-600 hover:text-black mr-2"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>View Live Site</span>
        </a>
        <button className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-600 hover:text-black">
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
