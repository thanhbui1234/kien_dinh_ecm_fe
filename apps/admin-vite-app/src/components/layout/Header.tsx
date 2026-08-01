import { useState } from 'react';
import { User, Globe, ShieldCheck, Mail, Calendar, Key, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { ENV } from '@/config/env';
import { useMe } from '@/queries/auth/useMe';
import { USER_ROLES } from 'shared-api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button } from 'shared-ui';

const routeLabels: Record<string, string> = {
  '/': 'Tổng quan',
  '/products': 'Sản phẩm',
  '/categories': 'Danh mục',
  '/projects': 'Dự án',
  '/jobs': 'Tuyển dụng',
  '/leads': 'Liên hệ',
  '/media': 'Thư viện ảnh',
  '/about-us': 'Về doanh nghiệp',
  '/users': 'Quản lý Tài khoản Admin',
  '/settings': 'Cài đặt',
};

export function Header() {
  const location = useLocation();
  const { data: currentUser } = useMe();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getLabel = () => {
    for (const [key, label] of Object.entries(routeLabels).reverse()) {
      if (location.pathname.startsWith(key) && key !== '/') return label;
    }
    return routeLabels['/'];
  };

  const frontendUrl = ENV.FRONTEND_URL;
  const initial = currentUser?.fullName?.charAt(0) || currentUser?.email?.charAt(0) || 'A';
  const isSuperAdmin = currentUser?.role === USER_ROLES.SUPER_ADMIN;

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-6 z-10">
      <div className="flex-1">
        <h2 className="text-sm font-semibold text-black">{getLabel()}</h2>
      </div>

      <div className="flex items-center gap-3">
        <a 
          href={frontendUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          title="Xem trang Live"
          className="flex items-center gap-1.5 px-3 h-8 rounded-md border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-colors text-xs font-medium text-gray-600 hover:text-black"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>View Live Site</span>
        </a>

        {/* User profile button */}
        <button 
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer group"
          title="Xem thông tin cá nhân"
        >
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-black text-white font-bold flex items-center justify-center text-xs uppercase">
              {initial}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-black leading-none group-hover:text-purple-600 transition-colors">
              {currentUser?.fullName || 'Admin User'}
            </div>
            <div className="text-[11px] font-medium text-gray-600 leading-tight mt-1 flex items-center gap-1 font-mono">
              <Mail className="w-3 h-3 text-purple-600 shrink-0" />
              <span className="truncate max-w-[180px]">{currentUser?.email}</span>
            </div>
          </div>
        </button>
      </div>

      {/* User Profile Modal */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Thông tin Tài khoản Admin
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Chi tiết hồ sơ đang đăng nhập trên hệ thống Admin ECM.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {/* Header info */}
            <div className="flex items-center gap-3.5 p-4 rounded-xl border border-purple-100 bg-purple-50/50">
              <div className="w-12 h-12 rounded-full bg-black text-white font-bold text-lg flex items-center justify-center uppercase shadow-md shrink-0">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-base flex items-center gap-1.5">
                  {currentUser?.fullName || 'Admin User'}
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
                <div className="text-xs text-gray-500 truncate mt-0.5 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-gray-400" />
                  {currentUser?.email}
                </div>
              </div>
            </div>

            {/* Account meta */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="text-gray-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Vai trò Hạn ngạch
                </div>
                <div className="font-bold text-gray-900 mt-1">
                  {isSuperAdmin ? '⚡ Super Admin' : 'Admin'}
                </div>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="text-gray-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Trạng thái
                </div>
                <div className="font-bold text-emerald-600 mt-1 flex items-center gap-1">
                  🟢 Đang hoạt động
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 text-xs">
              <div className="text-gray-400 font-medium flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-amber-600" /> Mã Định danh Tài khoản (ID)
              </div>
              <div className="font-mono text-gray-800 font-semibold mt-1 text-[11px] truncate">
                {currentUser?.id || 'N/A'}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
