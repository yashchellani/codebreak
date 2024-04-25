import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';

// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        {
          path: 'activate/:uid/:token',
          element: (
            <GuestGuard>
              <EmailConfirmation />
            </GuestGuard>
          ),
        },
        {
          path: 'send-email',
          element: (
            <AuthGuard>
              <SendEmail />
            </AuthGuard>
          ),
        },
        {
          path: 'confirm-reset/:uid/:token',
          element: (
            <GuestGuard>
              <ConfirmReset />
            </GuestGuard>
          ),
        },

        { path: 'login-unprotected', element: <Login /> },
        { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify', element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
          <DashboardLayout />
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralApp /> },
        { path: 'code', element: <CompareCode /> },
        {
          path: 'question',
          children: [
            {
              path: ':id/list', element: (
                <QuestionList />
              )
            },
            {
              path: 'new/:id', element: (
                <QuestionCreate />
              )
            },
            {
              path: ':cycleId/:id/view', element: (
                <QuestionDetail />
              )
            },
            {
              path: ':cycleId/:questionId/:id/view', element: (
                <CompareCode />
              )
            },

          ],
        },
      ],
    },
    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },

    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));
const ConfirmReset = Loadable(lazy(() => import('../pages/auth/ConfirmReset')));
const SendEmail = Loadable(lazy(() => import('../pages/auth/SendEmail')));
const EmailConfirmation = Loadable(lazy(() => import('../pages/auth/EmailConfirmation')));




// Dashboard
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));

const QuestionList = Loadable(lazy(() => import('../pages/question/QuestionList')));
const QuestionCreate = Loadable(lazy(() => import('../pages/question/QuestionCreate')));
const QuestionDetail = Loadable(lazy(() => import('../pages/question/QuestionDetail')));

// Code
const CompareCode = Loadable(lazy(() => import('../pages/code/CompareCode')));

// Main
const NotFound = Loadable(lazy(() => import('../pages/Page404')));

