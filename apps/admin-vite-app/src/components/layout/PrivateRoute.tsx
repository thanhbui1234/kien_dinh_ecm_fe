import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { TokenService } from '@/utils/token';

export function PrivateRoute() {
  const token = TokenService.getAccessToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
