import { lazy, Suspense } from 'react';
import { createBrowserRouter, useRouteError } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import AuthLayout from '@/layouts/AuthLayout';
import { PrivateRoute } from '@/components/layout/PrivateRoute';

// Lazy load pages
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const Login = lazy(() => import('@/pages/auth/Login'));
const ProductsList = lazy(() => import('@/pages/products/ProductsList'));
const ProductForm = lazy(() => import('@/pages/products/ProductForm'));
const ProductView = lazy(() => import('@/pages/products/ProductView'));
const CategoriesList = lazy(() => import('@/pages/categories/CategoriesList'));
const CategoryForm = lazy(() => import('@/pages/categories/CategoryForm'));
const ProjectsList = lazy(() => import('@/pages/projects/ProjectsList'));
const ProjectForm = lazy(() => import('@/pages/projects/ProjectForm'));
const JobsList = lazy(() => import('@/pages/jobs/JobsList'));
const JobForm = lazy(() => import('@/pages/jobs/JobForm'));
const LeadsList = lazy(() => import('@/pages/leads/LeadsList'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const MediaGallery = lazy(() => import('@/pages/media/MediaGallery'));
const AboutPage = lazy(() => import('@/pages/about/AboutPage'));

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

const RootErrorBoundary = () => {
  const error = useRouteError() as Error;
  
  // If it's a dynamic import error (chunk load failed due to new deployment), force a reload
  if (
    error?.message?.includes('Failed to fetch dynamically imported module') ||
    error?.message?.includes('Importing a module script failed')
  ) {
    window.location.reload();
    return <PageLoader />;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center p-4 text-center bg-white dark:bg-zinc-950">
      <h1 className="mb-4 text-2xl font-bold text-red-600">Đã xảy ra lỗi</h1>
      <p className="mb-4 text-zinc-600 dark:text-zinc-400">{error?.message || 'Lỗi không xác định'}</p>
      <button 
        onClick={() => window.location.reload()}
        className="rounded bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
      >
        Tải lại trang
      </button>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        path: '/',
        element: <AdminLayout />,
        children: [
          { index: true, element: withSuspense(Dashboard) },
      { path: 'products', element: withSuspense(ProductsList) },
      { path: 'products/create', element: withSuspense(ProductForm) },
      { path: 'products/:id', element: withSuspense(ProductView) },
      { path: 'products/:id/edit', element: withSuspense(ProductForm) },
      { path: 'categories', element: withSuspense(CategoriesList) },
      { path: 'categories/create', element: withSuspense(CategoryForm) },
      { path: 'categories/:id/edit', element: withSuspense(CategoryForm) },
      { path: 'projects', element: withSuspense(ProjectsList) },
      { path: 'projects/create', element: withSuspense(ProjectForm) },
      { path: 'projects/:id/edit', element: withSuspense(ProjectForm) },
      { path: 'jobs', element: withSuspense(JobsList) },
      { path: 'jobs/create', element: withSuspense(JobForm) },
      { path: 'jobs/:id/edit', element: withSuspense(JobForm) },
      { path: 'leads', element: withSuspense(LeadsList) },
      { path: 'media', element: withSuspense(MediaGallery) },
      { path: 'about-us', element: withSuspense(AboutPage) },
          { path: 'settings', element: withSuspense(SettingsPage) },
        ],
      }
    ]
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
