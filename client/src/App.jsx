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
import AnalyzePage from './pages/analyzer/AnalyzePage';
import AnalysisResultsPage from './pages/analyzer/AnalysisResultsPage';
import AnalysisHistoryPage from './pages/analyzer/AnalysisHistoryPage';
import SettingsPage from './pages/SettingsPage';

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
          element: <ProtectedRoute><AnalyzePage /></ProtectedRoute>,
        },
        {
          path: 'analyze/results/:id',
          element: <ProtectedRoute><AnalysisResultsPage /></ProtectedRoute>,
        },
        {
          path: 'analyze/history',
          element: <ProtectedRoute><AnalysisHistoryPage /></ProtectedRoute>,
        },
        {
          path: 'settings',
          element: <ProtectedRoute><SettingsPage /></ProtectedRoute>,
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
            color: '#111111',
          }
        }}
      />
    </>
  );
}

export default App;
