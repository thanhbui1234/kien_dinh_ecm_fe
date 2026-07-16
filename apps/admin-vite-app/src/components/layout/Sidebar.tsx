import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Settings, Package, FolderTree,
  Briefcase, Phone, Presentation, Hexagon, LogOut, Image
} from 'lucide-react';
import { useLogout } from '@/queries/auth/useLogout';
import { TokenService } from '@/utils/token';

const mainNav = [
  { name: 'Tổng quan', path: '/', icon: LayoutDashboard },
  { name: 'Sản phẩm', path: '/products', icon: Package },
  { name: 'Danh mục', path: '/categories', icon: FolderTree },
  { name: 'Dự án', path: '/projects', icon: Presentation },
  { name: 'Tuyển dụng', path: '/jobs', icon: Briefcase },
];
const systemNav = [
  { name: 'Liên hệ', path: '/leads', icon: Phone },
  { name: 'Thư viện ảnh', path: '/media', icon: Image },
  { name: 'Cài đặt', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        TokenService.clearTokens();
        navigate('/login');
      },
      onError: () => {
        // Fallback clear just in case API fails
        TokenService.clearTokens();
        navigate('/login');
      }
    });
  };

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const NavLink = ({ item }: { item: typeof mainNav[0] }) => {
    const active = isActive(item.path);
    const Icon = item.icon;
    return (
      <Link
        to={item.path}
        className={`group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150 ${
          active
            ? 'bg-black text-white'
            : 'text-gray-700 hover:bg-gray-100 hover:text-black'
        }`}
      >
        <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-gray-500 group-hover:text-black'}`} />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-full w-60 shrink-0 flex-col bg-white border-r border-gray-200 z-20">
      {/* Logo */}
      <div className="flex h-14 items-center px-5 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-black">
            <Hexagon className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-black tracking-tight">Kiến Định ECM</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-5">
        <div>
          <p className="px-3 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Nội dung</p>
          <nav className="space-y-0.5">
            {mainNav.map(item => <NavLink key={item.path} item={item} />)}
          </nav>
        </div>

        <div>
          <p className="px-3 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Hệ thống</p>
          <nav className="space-y-0.5">
            {systemNav.map(item => <NavLink key={item.path} item={item} />)}
          </nav>
        </div>
      </div>

      {/* User footer */}
      <div className="p-3 border-t border-gray-200 shrink-0">
        <div 
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100 cursor-pointer group transition-colors"
        >
          <div className="w-7 h-7 rounded-md bg-black flex items-center justify-center text-xs font-bold text-white">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-black truncate">Admin</div>
            <div className="text-[10px] text-gray-500 truncate">admin@kiendinh.vn</div>
          </div>
          <LogOut className={`w-3.5 h-3.5 text-gray-400 group-hover:text-black transition-colors shrink-0 ${isPending ? 'opacity-50 animate-pulse' : ''}`} />
        </div>
      </div>
    </div>
  );
}
