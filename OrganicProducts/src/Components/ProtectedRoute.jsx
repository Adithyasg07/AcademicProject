import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false, guestOnly = false }) {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50">
                <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    // 1. If it's a guest-only route (Login/Register) and user is ALREADY logged in
    if (guestOnly && isAuthenticated) {
        // Redirect them to their respective dashboard if they are already logged in
        return <Navigate to={user?.role === "Admin" ? "/admin" : "/home"} replace />;
    }

    // 2. If it's NOT a guest-only route and user is NOT logged in
    if (!guestOnly && !isAuthenticated) {
        // Redirect them to login
        return <Navigate to="/login" replace />;
    }

    // 3. If it requires Admin and user is not an Admin
    if (requireAdmin && user?.role !== 'Admin') {
        // Redirect to home if they try to access admin without permission
        return <Navigate to="/home" replace />;
    }

    return children;
}
