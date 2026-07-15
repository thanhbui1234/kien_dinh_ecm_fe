import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Lazy load pages
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const Login = lazy(() => import('@/pages/auth/Login'));
const ProductsList = lazy(() => import('@/pages/products/ProductsList'));
const CategoriesList = lazy(() => import('@/pages/categories/CategoriesList'));
const ProjectsList = lazy(() => import('@/pages/projects/ProjectsList'));
const JobsList = lazy(() => import('@/pages/jobs/JobsList'));
const LeadsList = lazy(() => import('@/pages/leads/LeadsList'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));

// Simple loading fallback
const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center p-8">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
  </div>
);

// Wrapper for Suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: withSuspense(Dashboard) },
      { path: 'products', element: withSuspense(ProductsList) },
      { path: 'categories', element: withSuspense(CategoriesList) },
      { path: 'projects', element: withSuspense(ProjectsList) },
      { path: 'jobs', element: withSuspense(JobsList) },
      { path: 'leads', element: withSuspense(LeadsList) },
      { path: 'settings', element: withSuspense(SettingsPage) },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: withSuspense(Login),
      },
    ],
  },
  {
    path: '*',
    element: <div className="flex h-screen items-center justify-center font-bold text-2xl">404 - Not Found</div>,
  },
]);
