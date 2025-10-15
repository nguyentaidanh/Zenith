import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from './AdminLayout';

export const ProtectedAdminRoute: React.FC = () => {
    const { state } = useStore();
    const { isAuthenticated, isAdmin } = state.auth;

    if (!isAuthenticated) {
        // User is not logged in, redirect to login page.
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        // User is logged in but not an admin, redirect to home page.
        return <Navigate to="/" replace />;
    }

    // If authorized, render the AdminLayout which contains the Outlet for nested routes.
    return <AdminLayout />;
};