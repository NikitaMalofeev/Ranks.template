import { RootState } from 'app/providers/store/config/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

interface RequireAuthRouteProps {
    children: React.ReactNode;
}

const RequireAuthRoute: React.FC<RequireAuthRouteProps> = ({ children }) => {
    const { token, isAuthenticated } = useSelector((state: RootState) => state.user);

    // Проверяем и токен, и флаг isAuthenticated
    if (!token || !isAuthenticated || token.trim() === '') {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default RequireAuthRoute;
