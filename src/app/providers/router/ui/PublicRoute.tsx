import { RootState } from 'app/providers/store/config/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { token, isAuthenticated } = useSelector((state: RootState) => state.user);

    // Если пользователь уже авторизован, редирект на главную страницу
    if (token && isAuthenticated && token.trim() !== '') {
        return <Navigate to="/admin" replace />;
    }

    // Если не авторизован, показываем страницу (login)
    return <>{children}</>;
};

export default PublicRoute;
