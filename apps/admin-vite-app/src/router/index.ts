import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    // element: <RootLayout />, // Add Layout component later
    children: [
      {
        index: true,
        // element: <Dashboard />, // Add Page component later
      },
    ],
  },
  {
    path: '/login',
    // element: <LoginPage />, // Add Login component later
  },
  {
    path: '*',
    // element: <NotFoundPage />, // Add 404 component later
  },
]);
