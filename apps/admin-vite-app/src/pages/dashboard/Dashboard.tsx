import { useProducts } from '@/queries/products';
import { useCategories } from '@/queries/categories';
import { useProjects } from '@/queries/projects';
import { useLeads } from '@/queries/leads';
import { Package, FolderTree, Presentation, Phone, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function StatCard({ title, value, icon: Icon, href }: { title: string; value: number | string; icon: any; href: string }) {
  return (
    <Link to={href} className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:border-gray-300 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-black mt-2">{value}</p>
        </div>
        <div className="p-2.5 rounded-md bg-gray-50 border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex items-center gap-1 mt-4 text-xs font-medium text-gray-400 group-hover:text-black transition-colors">
        <span>Xem tất cả</span>
        <ArrowUpRight className="h-3 w-3" />
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { data: products } = useProducts({ limit: 5, page: 1 });
  const { data: categories } = useCategories({ limit: 100 });
  const { data: projects } = useProjects({ limit: 5 });
  const { data: leads } = useLeads({ limit: 10 });
  const pendingLeads = leads?.items?.filter(l => l.status === 'PENDING').length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-black">Tổng quan</h1>
        <p className="text-xs text-gray-500 mt-1">Chào mừng trở lại! Đây là tổng quan hệ thống hôm nay.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng sản phẩm" value={products?.meta?.totalItems || 0} icon={Package} href="/products" />
        <StatCard title="Danh mục" value={Array.isArray(categories) ? categories.length : 0} icon={FolderTree} href="/categories" />
        <StatCard title="Dự án" value={projects?.meta?.totalItems || 0} icon={Presentation} href="/projects" />
        <StatCard title="Liên hệ mới" value={pendingLeads} icon={Phone} href="/leads" />
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Recent products */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-black">Sản phẩm mới nhất</h2>
            <Link to="/products" className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">Xem tất cả →</Link>
          </div>
          <div className="space-y-4">
            {(products?.items || []).slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.thumbnailUrl || 'https://placehold.co/32x32/f9fafb/6b7280?text=...'} alt={p.name}
                  className="w-10 h-10 rounded border border-gray-200 object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-black truncate">{p.name}</p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">{p.price ? `${p.price.toLocaleString('vi-VN')} ₫` : 'Liên hệ'}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                  p.status ? 'border-gray-200 text-black' : 'border-gray-200 text-gray-400 bg-gray-50'
                }`}>{p.status ? 'HIỆN' : 'ẨN'}</span>
              </div>
            ))}
            {(products?.items || []).length === 0 && <p className="text-xs text-gray-500 text-center py-4">Chưa có sản phẩm</p>}
          </div>
        </div>

        {/* Recent leads */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-black">Liên hệ gần đây</h2>
            <Link to="/leads" className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">Xem tất cả →</Link>
          </div>
          <div className="space-y-4">
            {(leads?.items || []).slice(0, 5).map(l => (
              <div key={l.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-xs font-bold text-black shrink-0">
                  {l.fullName?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-black">{l.fullName}</p>
                  <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{l.message}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded border shrink-0 ${
                  l.status === 'PENDING' ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-500'
                }`}>{l.status === 'PENDING' ? 'MỚI' : l.status === 'CONTACTED' ? 'ĐÃ LH' : 'SPAM'}</span>
              </div>
            ))}
            {(leads?.items || []).length === 0 && <p className="text-xs text-gray-500 text-center py-4">Chưa có liên hệ</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
