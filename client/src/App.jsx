import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useEffect, useLayoutEffect } from 'react';
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
import MyResumesPage from './pages/resumes/MyResumesPage';
import { useThemeStore } from './store/useThemeStore';
import AnimatedBackground from './components/layout/AnimatedBackground';

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const theme = useThemeStore((state) => state.theme);

  useLayoutEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
        {
          path: 'resumes/new',
          element: <ProtectedRoute><CreateResumeProxy /></ProtectedRoute>,
        },
        {
          path: 'resumes',
          element: <ProtectedRoute><MyResumesPage /></ProtectedRoute>,
        },
        {
          path: 'analyze',
          element: <ProtectedRoute><div className="animate-fade-in"><h1 className="text-3xl font-display font-bold dark:text-white">AI Optimizer</h1><p className="mt-2 text-slate-500">Coming soon utilizing Gemini Flash API.</p></div></ProtectedRoute>,
        },
        {
          path: 'settings',
          element: <ProtectedRoute><div className="animate-fade-in"><h1 className="text-3xl font-display font-bold dark:text-white">Settings</h1><p className="mt-2 text-slate-500">Coming soon.</p></div></ProtectedRoute>,
        }
      ]
    },
    {
      path: '/editor',
      element: <ProtectedRoute><EditorLayout /></ProtectedRoute>,
      children: [
        {
          path: ':id',
          element: <EditorEntryPoint />
        }
      ]
    },
    {
      path: '*',
      element: <Navigate to="/" replace />
    }
  ]);

  return (
    <>
      <AnimatedBackground />
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
