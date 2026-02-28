import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';
import EditorLayout from './components/editor/EditorLayout';
import CreateResumeProxy from './pages/resumes/CreateResumeProxy';
import EditorEntryPoint from './pages/resumes/EditorEntryPoint';

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const router = createBrowserRouter([
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/signup',
      element: <SignupPage />,
    },
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            {
              index: true,
              element: <DashboardPage />,
            },
            {
              path: 'resumes/new',
              element: <CreateResumeProxy />,
            },
            {
              path: 'analyze',
              element: <div className="animate-fade-in"><h1 className="text-3xl font-display font-bold dark:text-white">AI Optimizer</h1><p className="mt-2 text-slate-500">Coming soon utilizing Gemini Flash API.</p></div>,
            },
            {
              path: 'settings',
              element: <div className="animate-fade-in"><h1 className="text-3xl font-display font-bold dark:text-white">Settings</h1><p className="mt-2 text-slate-500">Coming soon.</p></div>,
            }
          ]
        },
        {
          path: 'editor',
          element: <EditorLayout />,
          children: [
            {
              path: ':id',
              element: <EditorEntryPoint />
            }
          ]
        }
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-slate-800 dark:text-white',
          style: {
            borderRadius: '1rem',
            background: '#ffffff',
            color: '#0f172a',
          }
        }}
      />
    </>
  );
}

export default App;
