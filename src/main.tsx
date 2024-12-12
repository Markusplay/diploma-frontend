import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { Login } from './screens/Login';
import { Register } from './screens/Register';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { queryClient } from './lib/queryClient';
import { K3Page } from './screens/K3Page';
import { LoadPage } from './screens/LoadPage';
import { Toaster } from './components/ui/toaster';

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <K3Page />,
          },
          {
            path: '/load',
            element: <LoadPage />,
          },
        ],
      },
      {
        element: <Outlet />,
        children: [
          {
            path: '/login',
            element: <Login />,
          },
          {
            path: '/register',
            element: <Register />,
          },
        ],
      },
    ],
  },
]);

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
