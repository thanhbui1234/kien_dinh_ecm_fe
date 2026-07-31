import { Navigate, Outlet } from 'react-router-dom';
import { useMe } from '@/queries/auth/useMe';
import { toast } from '@/utils/toast';
import { useEffect } from 'react';
import { USER_ROLES, AUTH_MESSAGES } from 'shared-api';

export function SuperAdminRoute() {
  const { data: currentUser, isLoading } = useMe();

  const isSuperAdmin = currentUser?.role === USER_ROLES.SUPER_ADMIN;

  useEffect(() => {
    if (!isLoading && currentUser && !isSuperAdmin) {
      toast.error(AUTH_MESSAGES.FORBIDDEN_SUPER_ADMIN);
    }
  }, [isLoading, currentUser, isSuperAdmin]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900" />
      </div>
    );
  }

  if (!currentUser || !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
