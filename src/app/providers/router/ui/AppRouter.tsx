import { lazy, memo, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'app/providers/store/config/store';
import PublicRoute from './PublicRoute';
import RequireAuthRoute from './RequireAuth';
import { Loader } from 'shared/ui/Loader/Loader';

const HomePage = lazy(() => import('pages/HomePage/HomePage'));
const AdminPage = lazy(() => import('pages/AdminPage/AdminPage'));
const LoginPage = lazy(() => import('pages/LoginPage/LoginPage'));
const NotFoundPage = lazy(() => import('pages/NotFoundPage/NotFoundPage'));
const ErrorPage = lazy(() => import('pages/ErrorPage/ErrorPage'));

function AppRouter() {
    const token = useSelector((state: RootState) => state.user.token);

    return (
        <Routes>
            {/* Главная страница: редирект в зависимости от наличия токена */}
            <Route
                path="/"
                element={<Navigate to={token ? "/admin" : "/login"} replace />}
            />

            {/* Защищенная страница - требует авторизацию */}
            <Route
                path="/admin"
                element={
                    <RequireAuthRoute>
                        <Suspense fallback={<Loader />}>
                            <AdminPage />
                        </Suspense>
                    </RequireAuthRoute>
                }
            />

            {/* Страница логина - только для неавторизованных */}
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

            {/* Страница ошибки */}
            <Route
                path="/error"
                element={
                    <Suspense fallback={<Loader />}>
                        <ErrorPage />
                    </Suspense>
                }
            />

            {/* 404 страница */}
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
