import { lazy, memo, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import RequireAuthRoute from './RequireAuth';
import { Loader } from 'shared/ui/Loader/Loader';

const HomePage = lazy(() => import('pages/HomePage/HomePage'));
const AdminPage = lazy(() => import('pages/AdminPage/AdminPage'));
const LoginPage = lazy(() => import('pages/LoginPage/LoginPage'));
const NotFoundPage = lazy(() => import('pages/NotFoundPage/NotFoundPage'));
const ErrorPage = lazy(() => import('pages/ErrorPage/ErrorPage'));

function AppRouter() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Suspense fallback={<Loader />}>
                        <AdminPage />
                    </Suspense>
                }
            />
            <Route
                path="/admin"
                element={
                    <Suspense fallback={<Loader />}>
                        <AdminPage />
                    </Suspense>
                }
            />
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Suspense fallback={<Loader />}>
                            <LoginPage />
                        </Suspense>
                    </PublicRoute>
                }
            />
            <Route
                path="/error"
                element={
                    <Suspense fallback={<Loader />}>
                        <ErrorPage />
                    </Suspense>
                }
            />
            <Route
                path="/*"
                element={
                    <Suspense fallback={<Loader />}>
                        <NotFoundPage />
                    </Suspense>
                }
            />
        </Routes>
    );
}

export default memo(AppRouter);
