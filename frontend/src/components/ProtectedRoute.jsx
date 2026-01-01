import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

/**
 * Composant de protection des routes
 * Redirige vers /login si non authentifié
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user, loading } = useAuth();

    // Afficher un loader pendant le chargement
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    // Rediriger vers login si non authentifié
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Vérifier le rôle si spécifié
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
