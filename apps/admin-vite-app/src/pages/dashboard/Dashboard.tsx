import { useMemo } from 'react';
import { useProducts } from '@/queries/products';
import { useCategories } from '@/queries/categories';
import { useProjects } from '@/queries/projects';
import { useLeads } from '@/queries/leads';
import { useDashboardStats } from '@/queries/dashboard';
import { Package, FolderTree, Presentation, Phone, ArrowUpRight, Plus, Eye, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

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
  const navigate = useNavigate();
  const { data: categories } = useCategories({ limit: 100 });
  const { data: projects } = useProjects({ limit: 5 });
  const { data: leadsData } = useLeads({ limit: 100 }); // fetch 100 for stats
  const { data: topProducts } = useProducts({ limit: 5, sortBy: 'viewCount' });
  const { data: trafficData } = useDashboardStats();

  const pendingLeadsCount = leadsData?.items?.filter(l => l.status === 'PENDING').length || 0;

  const leadStatusStats = useMemo(() => {
    if (!leadsData?.items) return [];
    let pending = 0, contacted = 0, spam = 0;
    leadsData.items.forEach(l => {
      if (l.status === 'PENDING') pending++;
      else if (l.status === 'CONTACTED') contacted++;
      else if (l.status === 'SPAM') spam++;
    });
    
    const result = [];
    if (pending > 0) result.push({ name: 'Mới', value: pending, color: '#eab308' });
    if (contacted > 0) result.push({ name: 'Đã xử lý', value: contacted, color: '#22c55e' });
    if (spam > 0) result.push({ name: 'Spam', value: spam, color: '#ef4444' });
    return result;
  }, [leadsData]);

  // Fallback traffic if API is empty or not yet implemented correctly
  const finalTraffic = Array.isArray(trafficData) ? trafficData : [];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-bold text-black">Tổng quan</h1>
        <p className="text-xs text-gray-500 mt-1">Chào mừng trở lại! Đây là tổng quan hệ thống hôm nay.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Danh mục" value={Array.isArray(categories) ? categories.length : 0} icon={FolderTree} href="/categories" />
        <StatCard title="Dự án" value={projects?.meta?.totalItems || 0} icon={Presentation} href="/projects" />
        <StatCard title="Liên hệ mới" value={pendingLeadsCount} icon={Phone} href="/leads" />
        <StatCard title="Tổng sản phẩm" value={topProducts?.meta?.totalItems || 0} icon={Package} href="/products" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Biểu đồ Lưu lượng 30 ngày (Line Chart) */}
        <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-black">Lưu lượng 30 ngày qua</h2>
            <p className="text-xs text-gray-500 mt-0.5">Thống kê số lượng Liên hệ và Sản phẩm được quan tâm.</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={finalTraffic} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" name="Liên hệ" dataKey="leads" stroke="#4f46e5" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Sản phẩm" dataKey="products" stroke="#0ea5e9" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ Trạng thái Liên hệ (Donut Chart) */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-black">Trạng thái Liên hệ</h2>
            <p className="text-xs text-gray-500 mt-0.5">Tỷ lệ xử lý các yêu cầu.</p>
          </div>
          <div className="flex-1 h-[250px] w-full flex items-center justify-center">
            {leadStatusStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadStatusStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {leadStatusStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-sm">Chưa có dữ liệu liên hệ</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top 5 Sản phẩm Hot */}
        <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-black">Top 5 Sản phẩm Hot nhất</h2>
            <Link to="/products" className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">Xem tất cả →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 font-semibold text-gray-500 w-12">Hạng</th>
                  <th className="pb-3 font-semibold text-gray-500">Sản phẩm</th>
                  <th className="pb-3 font-semibold text-gray-500">Danh mục</th>
                  <th className="pb-3 font-semibold text-gray-500 text-right">Lượt xem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(topProducts?.items || []).slice(0, 5).map((p, idx) => (
                  <tr key={p.id} className="group hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/products/${p.id}`)}>
                    <td className="py-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                        idx === 1 ? 'bg-gray-200 text-gray-700' : 
                        idx === 2 ? 'bg-orange-100 text-orange-700' : 
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {idx + 1}
                      </div>
                    </td>
                    <td className="py-3 font-medium text-black group-hover:text-blue-600 transition-colors flex items-center gap-2">
                      {p.thumbnailUrl && <img src={p.thumbnailUrl} className="w-8 h-8 rounded object-cover border border-gray-200" alt={p.name} />}
                      {p.name}
                    </td>
                    <td className="py-3 text-gray-600">{Array.isArray(categories) ? categories.find((c: any) => c.id === p.categoryId)?.name || '---' : '---'}</td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                        <Eye className="w-3.5 h-3.5" />
                        {p.viewCount || 0}
                      </div>
                    </td>
                  </tr>
                ))}
                {(topProducts?.items || []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500 text-xs">Chưa có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-black">Thao tác nhanh</h2>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/products/new')} className="flex items-center gap-3 w-full p-3 rounded-lg border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors text-left group">
              <div className="w-8 h-8 rounded bg-indigo-200 flex items-center justify-center text-indigo-700 group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold">Thêm Sản phẩm</p>
                <p className="text-xs font-medium opacity-80 mt-0.5">Tạo mới một sản phẩm</p>
              </div>
            </button>
            <button onClick={() => navigate('/projects/new')} className="flex items-center gap-3 w-full p-3 rounded-lg border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors text-left group">
              <div className="w-8 h-8 rounded bg-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold">Thêm Dự án</p>
                <p className="text-xs font-medium opacity-80 mt-0.5">Tạo mới một dự án</p>
              </div>
            </button>
            <button onClick={() => navigate('/leads')} className="flex items-center gap-3 w-full p-3 rounded-lg border border-orange-100 bg-orange-50 hover:bg-orange-100 text-orange-700 transition-colors text-left group">
              <div className="w-8 h-8 rounded bg-orange-200 flex items-center justify-center text-orange-700 group-hover:scale-110 transition-transform">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold">Xử lý Liên hệ</p>
                <p className="text-xs font-medium opacity-80 mt-0.5">Phản hồi khách hàng ({pendingLeadsCount})</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
