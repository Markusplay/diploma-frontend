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
import { PlanPage } from './screens/PlanPage.tsx';
import { Toaster } from './components/ui/toaster';
import { HomePage } from '@/screens/home-page/HomePage.tsx';
import { CreationPage } from '@/screens/creation-page/CreationPage.tsx';
import { K4Page } from '@/screens/K4Page.tsx';
import { K2Page } from '@/screens/K2Page.tsx';
import { GroupPage } from '@/screens/GroupPage.tsx';

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: '/creation',
            element: <CreationPage />,
          },
          {
            path: '/k2',
            element: <K2Page />,
          },
          {
            path: '/k3',
            element: <K3Page />,
          },
          {
            path: '/k4',
            element: <K4Page />,
          },
          {
            path: '/plan',
            element: <PlanPage />,
          },
          {
            path: '/group',
            element: <GroupPage />,
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
