import { useState } from 'react';
import { 
  ShieldCheck, UserPlus, KeyRound, LogOut, Trash2, Lock, CheckCircle2,
  AlertTriangle, Monitor, Clock, Info, ShieldAlert, Radio, Mail, User
} from 'lucide-react';
import { DataTable, ColumnDef } from '@/components/common/DataTable';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useUsersList, useCreateAdmin, useResetPassword, useKickUser, useDeleteUser, UserAdminItem } from '@/queries/users/useUsers';
import { useMe } from '@/queries/auth/useMe';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button, Input, Label, Spinner } from 'shared-ui';
import { useForm } from 'react-hook-form';
import { USER_ROLES } from 'shared-api';

export default function UsersList() {
  const { data: currentUser } = useMe();
  const { data: users = [], isLoading } = useUsersList();
  
  const createAdminMutation = useCreateAdmin();
  const resetPasswordMutation = useResetPassword();
  const kickUserMutation = useKickUser();
  const deleteUserMutation = useDeleteUser();

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [resetTargetUser, setResetTargetUser] = useState<UserAdminItem | null>(null);
  const [kickTargetUser, setKickTargetUser] = useState<UserAdminItem | null>(null);
  const [deleteTargetUser, setDeleteTargetUser] = useState<UserAdminItem | null>(null);
  const [viewDevicesUser, setViewDevicesUser] = useState<UserAdminItem | null>(null);
  const [viewDetailUser, setViewDetailUser] = useState<UserAdminItem | null>(null);

  // Forms
  const createForm = useForm({
    defaultValues: { email: '', password: '', fullName: '' },
  });
  const resetForm = useForm({
    defaultValues: { newPassword: '' },
  });

  const handleCreateAdmin = (data: { email: string; password: string; fullName: string }) => {
    createAdminMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateOpen(false);
        createForm.reset();
      },
    });
  };

  const handleResetPassword = (data: { newPassword: string }) => {
    if (!resetTargetUser) return;
    resetPasswordMutation.mutate(
      { id: resetTargetUser.id, dto: { newPassword: data.newPassword } },
      {
        onSuccess: () => {
          setResetTargetUser(null);
          resetForm.reset();
        },
      }
    );
  };

  const handleConfirmKick = () => {
    if (!kickTargetUser) return;
    kickUserMutation.mutate(kickTargetUser.id, {
      onSuccess: () => setKickTargetUser(null),
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetUser) return;
    deleteUserMutation.mutate(deleteTargetUser.id, {
      onSuccess: () => setDeleteTargetUser(null),
    });
  };

  const isSuperAdmin = currentUser?.role === USER_ROLES.SUPER_ADMIN;

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'Chưa có';
    const date = new Date(isoString);
    return `${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${date.toLocaleDateString('vi-VN')}`;
  };

  const columns: ColumnDef<UserAdminItem>[] = [
    {
      key: 'fullName',
      header: 'HỌ VÀ TÊN & EMAIL',
      cell: (user) => (
        <div 
          onClick={() => setViewDetailUser(user)}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Click để xem chi tiết tài khoản"
        >
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs uppercase group-hover:bg-purple-600 transition-colors">
              {user.fullName?.charAt(0) || user.email.charAt(0)}
            </div>
            {/* Chấm Online xanh 🟢 */}
            <span 
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                user.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'
              }`}
              title={user.isOnline ? 'Đang Trực tuyến' : 'Ngoại tuyến'}
            />
          </div>
          <div>
            <div className="font-semibold text-gray-900 flex items-center gap-1.5 group-hover:text-purple-600 transition-colors">
              {user.fullName}
              {user.isOnline && (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-medium">
                  Online
                </span>
              )}
            </div>
            <div className="text-xs font-mono font-medium text-gray-700 flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3 text-purple-600 shrink-0" />
              {user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'VAI TRÒ',
      cell: (user) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            user.role === USER_ROLES.SUPER_ADMIN
              ? 'bg-purple-100 text-purple-700 border border-purple-200'
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}
        >
          {user.role === USER_ROLES.SUPER_ADMIN ? (
            <>
              <ShieldCheck className="w-3 h-3" /> Super Admin
            </>
          ) : (
            'Admin'
          )}
        </span>
      ),
    },
    {
      key: 'deviceQuota',
      header: 'THIẾT BỊ DÙNG',
      cell: (user) => {
        const isSuperAdminRole = user.role === USER_ROLES.SUPER_ADMIN;
        const count = user.deviceCount || 0;
        const isMaxed = !isSuperAdminRole && (count >= 3 || user.isLocked);
        const isWarning = !isSuperAdminRole && count === 2;

        return (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold border ${
                isSuperAdminRole
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : isMaxed
                  ? 'bg-red-100 text-red-700 border-red-200 animate-pulse'
                  : isWarning
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              {isMaxed ? (
                <ShieldAlert className="w-3 h-3 text-red-600" />
              ) : isWarning ? (
                <AlertTriangle className="w-3 h-3 text-amber-600" />
              ) : (
                <Monitor className="w-3 h-3 text-purple-600" />
              )}
              {isSuperAdminRole ? `${count} Thiết bị (Không giới hạn)` : `${count}/3 Thiết bị`}
              {user.isLocked && ' (ĐÃ KHÓA)'}
            </span>

            {/* Nút xem chi tiết thiết bị */}
            {count > 0 && (
              <button
                onClick={() => setViewDevicesUser(user)}
                title="Xem danh sách thiết bị"
                className="p-1 text-gray-400 hover:text-black rounded transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      },
    },
    {
      key: 'activeSessions',
      header: 'PHIÊN HOẠT ĐỘNG',
      cell: (user) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            user.activeSessionsCount > 0
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-gray-50 text-gray-500 border border-gray-200'
          }`}
        >
          <Radio className={`w-3 h-3 ${user.activeSessionsCount > 0 ? 'text-emerald-600 animate-ping' : 'text-gray-400'}`} />
          {user.activeSessionsCount} phiên
        </span>
      ),
    },
    {
      key: 'lastActiveAt',
      header: 'HOẠT ĐỘNG CUỐI',
      cell: (user) => (
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="w-3 h-3 text-gray-400" />
          {formatDate(user.lastActiveAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'THAO TÁC',
      className: 'text-right',
      cell: (user) => {
        const isSelf = currentUser?.id === user.id;
        const canKick = user.activeSessionsCount > 0 && !isSelf;

        return (
          <div className="flex items-center justify-end gap-1.5">
            {/* Super Admin Actions */}
            {isSuperAdmin && (
              <>
                <button
                  onClick={() => setResetTargetUser(user)}
                  title="Đặt lại mật khẩu & Mở khóa 3 thiết bị"
                  className="p-1.5 rounded-md border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                </button>

                {/* Nút Kick thông minh */}
                {!isSelf && (
                  <button
                    onClick={() => canKick && setKickTargetUser(user)}
                    disabled={!canKick}
                    title={canKick ? 'Kick (Đăng xuất cưỡng chế)' : 'Tài khoản không có phiên online để Kick'}
                    className={`p-1.5 rounded-md border transition-colors ${
                      canKick
                        ? 'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 shadow-sm cursor-pointer'
                        : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}

                {!isSelf && (
                  <button
                    onClick={() => setDeleteTargetUser(user)}
                    title="Xóa tài khoản"
                    className="p-1.5 rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            Quản lý Tài khoản Admin
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kiểm soát danh sách tài khoản, trạng thái Online, mở khóa 3 thiết bị và Kick phiên làm việc cưỡng chế.
          </p>
        </div>
        {isSuperAdmin && (
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-black hover:bg-gray-800 text-white font-semibold text-sm flex items-center gap-2 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Thêm Admin mới
          </Button>
        )}
      </div>

      {/* Main Table */}
      <DataTable columns={columns} data={users} isLoading={isLoading} />

      {/* View User Details Modal */}
      <Dialog open={!!viewDetailUser} onOpenChange={(open) => !open && setViewDetailUser(null)}>
        <DialogContent className="sm:max-w-md bg-white p-5 rounded-xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-gray-900">
              <User className="w-4.5 h-4.5 text-purple-600" />
              Chi tiết Hồ sơ Tài khoản
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Thông số tài khoản, mã ID, trạng thái thiết bị và phiên làm việc.
            </DialogDescription>
          </DialogHeader>

          {viewDetailUser && (
            <div className="space-y-3 text-xs mt-1">
              {/* Profile Header */}
              <div className="flex items-center gap-3 p-3 rounded-lg border border-purple-100 bg-purple-50/50">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-black text-white font-bold text-sm flex items-center justify-center uppercase shadow-sm">
                    {viewDetailUser.fullName?.charAt(0) || viewDetailUser.email.charAt(0)}
                  </div>
                  <span 
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      viewDetailUser.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                    {viewDetailUser.fullName}
                    {viewDetailUser.isOnline ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-semibold">
                        Online
                      </span>
                    ) : (
                      <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.2 rounded font-medium">
                        Offline
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-purple-700 font-mono font-semibold select-all truncate mt-0.5 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-purple-600 shrink-0" />
                    {viewDetailUser.email}
                  </div>
                </div>
              </div>

              {/* ID Box */}
              <div className="p-2 rounded bg-gray-50 border border-gray-200">
                <div className="text-gray-500 text-[11px] font-medium flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-amber-600" /> Mã Định danh (ID):
                </div>
                <div className="font-mono text-gray-900 font-semibold text-[11px] select-all mt-0.5 truncate">
                  {viewDetailUser.id}
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-gray-50 border border-gray-200">
                  <div className="text-gray-500 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-purple-600" /> Vai trò
                  </div>
                  <div className="font-bold text-gray-900 mt-1">
                    {viewDetailUser.role === USER_ROLES.SUPER_ADMIN ? '⚡ Super Admin' : 'Admin'}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-gray-50 border border-gray-200">
                  <div className="text-gray-500 font-medium flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-600" /> Trạng thái
                  </div>
                  <div className={`font-bold mt-1 ${viewDetailUser.isLocked ? 'text-red-600' : 'text-emerald-600'}`}>
                    {viewDetailUser.isLocked ? '🔴 Bị khóa' : '🟢 Bình thường'}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-gray-50 border border-gray-200">
                  <div className="text-gray-500 font-medium flex items-center gap-1">
                    <Monitor className="w-3 h-3 text-gray-600" /> Thiết bị đã dùng
                  </div>
                  <div className="font-bold text-gray-900 mt-1">
                    {viewDetailUser.role === USER_ROLES.SUPER_ADMIN
                      ? `${viewDetailUser.deviceCount || 0} (Không giới hạn)`
                      : `${viewDetailUser.deviceCount || 0}/3 Thiết bị`}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-gray-50 border border-gray-200">
                  <div className="text-gray-500 font-medium flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-600" /> Phiên mở
                  </div>
                  <div className="font-bold text-gray-900 mt-1">
                    {viewDetailUser.activeSessionsCount || 0} phiên
                  </div>
                </div>
              </div>

              {/* Activity Timestamps */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center p-2 rounded bg-gray-50 border border-gray-200">
                  <span className="text-gray-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" /> Hoạt động lần cuối:
                  </span>
                  <span className="font-semibold text-gray-900">{formatDate(viewDetailUser.lastActiveAt)}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-gray-50 border border-gray-200">
                  <span className="text-gray-500 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-gray-400" /> Ngày tạo tài khoản:
                  </span>
                  <span className="font-semibold text-gray-900">{formatDate(viewDetailUser.createdAt)}</span>
                </div>
              </div>

              {/* Devices breakdown */}
              {viewDetailUser.devices && viewDetailUser.devices.length > 0 && (
                <div className="space-y-1 mt-1">
                  <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                    <Monitor className="w-3 h-3 text-purple-600" /> Danh sách thiết bị ({viewDetailUser.devices.length}):
                  </div>
                  <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                    {viewDetailUser.devices.map((devStr, idx) => (
                      <div key={idx} className="p-1.5 rounded bg-gray-50 border border-gray-200 text-[11px] font-medium text-gray-800 flex items-center gap-2">
                        <Monitor className="w-3 h-3 text-purple-600 shrink-0" />
                        <span className="truncate">{devStr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            {isSuperAdmin && viewDetailUser && currentUser?.id !== viewDetailUser.id ? (
              <div className="flex items-center gap-2">
                <Button 
                  size="sm"
                  variant="outline" 
                  onClick={() => {
                    setResetTargetUser(viewDetailUser);
                    setViewDetailUser(null);
                  }}
                  className="text-xs border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100"
                >
                  <KeyRound className="w-3 h-3 mr-1" /> Reset Pass
                </Button>
                {viewDetailUser.activeSessionsCount > 0 && (
                  <Button 
                    size="sm"
                    variant="outline" 
                    onClick={() => {
                      setKickTargetUser(viewDetailUser);
                      setViewDetailUser(null);
                    }}
                    className="text-xs border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100"
                  >
                    <LogOut className="w-3 h-3 mr-1" /> Kick
                  </Button>
                )}
              </div>
            ) : <div />}

            <Button variant="outline" size="sm" onClick={() => setViewDetailUser(null)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Admin Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Thêm tài khoản Admin mới</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Chỉ Super Admin mới có quyền khởi tạo tài khoản Admin mới cho hệ thống.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreateAdmin)} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                placeholder="Nguyễn Văn A"
                {...createForm.register('fullName', { required: 'Vui lòng nhập họ và tên' })}
              />
              {createForm.formState.errors.fullName && (
                <p className="text-xs text-red-500 font-medium">{createForm.formState.errors.fullName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email đăng nhập</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@kiendinhecm.com"
                {...createForm.register('email', { 
                  required: 'Vui lòng nhập email',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email không đúng định dạng',
                  }
                })}
              />
              {createForm.formState.errors.email && (
                <p className="text-xs text-red-500 font-medium">{createForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Mật khẩu khởi tạo (tối thiểu 6 ký tự)</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mật khẩu bảo mật"
                {...createForm.register('password', { 
                  required: 'Vui lòng nhập mật khẩu',
                  minLength: { value: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên' }
                })}
              />
              {createForm.formState.errors.password && (
                <p className="text-xs text-red-500 font-medium">{createForm.formState.errors.password.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-black text-white hover:bg-gray-800" disabled={createAdminMutation.isPending}>
                {createAdminMutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
                Tạo Admin
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password & Unlock Modal */}
      <Dialog open={!!resetTargetUser} onOpenChange={(open) => !open && setResetTargetUser(null)}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-amber-600 flex items-center gap-2">
              <KeyRound className="w-5 h-5" />
              Đặt lại mật khẩu & Mở khóa 3 thiết bị
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Cấp lại mật khẩu mới cho tài khoản <strong className="text-black">{resetTargetUser?.email}</strong>. Lịch sử 3 thiết bị đăng nhập trên Redis sẽ tự động bị xóa sạch để khôi phục hạn ngạch sử dụng.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Nhập mật khẩu mới"
                {...resetForm.register('newPassword', { 
                  required: 'Vui lòng nhập mật khẩu mới',
                  minLength: { value: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên' }
                })}
              />
              {resetForm.formState.errors.newPassword && (
                <p className="text-xs text-red-500 font-medium">{resetForm.formState.errors.newPassword.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={() => setResetTargetUser(null)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-amber-600 text-white hover:bg-amber-700" disabled={resetPasswordMutation.isPending}>
                {resetPasswordMutation.isPending && <Spinner className="mr-2 h-4 w-4" />}
                Reset & Mở khóa
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Device Details Dialog */}
      <Dialog open={!!viewDevicesUser} onOpenChange={(open) => !open && setViewDevicesUser(null)}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Monitor className="w-5 h-5 text-gray-700" />
              Danh sách Thiết bị đã sử dụng
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Tài khoản: <strong className="text-black">{viewDevicesUser?.email}</strong> ({viewDevicesUser?.devices?.length || 0}/3 thiết bị).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-3 max-h-60 overflow-y-auto">
            {viewDevicesUser?.devices && viewDevicesUser.devices.length > 0 ? (
              viewDevicesUser.devices.map((deviceStr, idx) => {
                const hasColon = deviceStr.includes(':');
                const [dId, fp] = hasColon ? deviceStr.split(':') : [deviceStr, null];

                return (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 text-xs">
                    <div className="w-8 h-8 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">
                        {hasColon ? `Thiết bị #${idx + 1}: ${dId}` : deviceStr}
                      </div>
                      {hasColon && fp && (
                        <div className="text-[11px] text-gray-500 font-mono truncate mt-0.5">
                          Fingerprint: {fp}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-gray-400 text-center py-4">Chưa có lịch sử thiết bị trên Redis.</div>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setViewDevicesUser(null)}>Đóng</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Kick Modal */}
      <ConfirmModal
        isOpen={!!kickTargetUser}
        onOpenChange={(open) => !open && setKickTargetUser(null)}
        title="Xác nhận Kick (Đăng xuất cưỡng chế)"
        description={`Bạn có chắc chắn muốn Kick tài khoản ${kickTargetUser?.email}? (${kickTargetUser?.activeSessionsCount || 1} phiên online đang mở sẽ bị ngắt tức thì).`}
        onConfirm={handleConfirmKick}
        isLoading={kickUserMutation.isPending}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetUser}
        onOpenChange={(open) => !open && setDeleteTargetUser(null)}
        title="Xác nhận Xóa tài khoản"
        description={`Hành động này không thể đảo ngược. Tài khoản ${deleteTargetUser?.email} sẽ bị xóa vĩnh viễn khỏi hệ thống.`}
        onConfirm={handleConfirmDelete}
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  );
}
