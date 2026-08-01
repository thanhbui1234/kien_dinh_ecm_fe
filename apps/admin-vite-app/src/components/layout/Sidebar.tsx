import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Settings, Package, FolderTree,
  Briefcase, Phone, Presentation, Hexagon, LogOut, Image, Building2, ShieldCheck
} from 'lucide-react';
import { useLogout } from '@/queries/auth/useLogout';
import { useMe } from '@/queries/auth/useMe';
import { TokenService } from '@/utils/token';
import { USER_ROLES } from 'shared-api';

const mainNav = [
  { name: 'Tổng quan', path: '/', icon: LayoutDashboard },
  { name: 'Sản phẩm', path: '/products', icon: Package },
  { name: 'Danh mục', path: '/categories', icon: FolderTree },
  { name: 'Dự án', path: '/projects', icon: Presentation },
  { name: 'Tuyển dụng', path: '/jobs', icon: Briefcase },
  { name: 'Về doanh nghiệp', path: '/about-us', icon: Building2 },
];

const systemNav = [
  { name: 'Liên hệ', path: '/leads', icon: Phone },
  { name: 'Thư viện ảnh', path: '/media', icon: Image },
  { name: 'Cài đặt', path: '/settings', icon: Settings },
];

const superAdminNav = [
  { name: 'Quản lý Tài khoản', path: '/users', icon: ShieldCheck },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: currentUser } = useMe();
  const { mutate: logout, isPending } = useLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isSuperAdmin = currentUser?.role === USER_ROLES.SUPER_ADMIN;

  const handleLogout = () => {
    if (isLoggingOut || isPending) return;
    setIsLoggingOut(true);
    logout(undefined, {
      onSettled: () => {
        TokenService.clearTokens();
        navigate('/login', { replace: true });
      },
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
          <span className="text-sm font-semibold text-black tracking-tight">TB ADMIN ECM</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-5">
        {/* Độc lập section dành cho Super Admin */}
        {isSuperAdmin && (
          <div>
            <p className="px-3 mb-1.5 text-[10px] font-semibold text-purple-600 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-purple-600 inline" /> Quản trị Cao cấp
            </p>
            <nav className="space-y-0.5">
              {superAdminNav.map(item => <NavLink key={item.path} item={item} />)}
            </nav>
          </div>
        )}

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
          <div className="w-7 h-7 rounded-md bg-black flex items-center justify-center text-xs font-bold text-white uppercase">
            {currentUser?.fullName?.charAt(0) || currentUser?.email?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-black truncate">
              {currentUser?.fullName || 'Admin User'}
            </div>
            <div className="text-[10px] text-gray-500 truncate">
              {currentUser?.role === USER_ROLES.SUPER_ADMIN ? '⚡ Super Admin' : 'Admin'}
            </div>
          </div>
          <LogOut className={`w-3.5 h-3.5 text-gray-400 group-hover:text-black transition-colors shrink-0 ${isLoggingOut || isPending ? 'opacity-50 animate-pulse' : ''}`} />
        </div>
      </div>

      {/* Fullscreen Logout Overlay to prevent white flash */}
      {(isLoggingOut || isPending) && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xl">
            <div className="relative flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-gray-200 border-t-black" />
              <LogOut className="w-4 h-4 text-black absolute" />
            </div>
            <p className="text-xs font-bold text-gray-800 tracking-wide">Đang đăng xuất khỏi hệ thống...</p>
          </div>
        </div>
      )}
    </div>
  );
}
