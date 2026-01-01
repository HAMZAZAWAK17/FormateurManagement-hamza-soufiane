import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * Contexte d'authentification
 */
const AuthContext = createContext(null);

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
};

/**
 * Provider d'authentification
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Charger les données depuis localStorage au démarrage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    /**
     * Connexion
     */
    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    /**
     * Déconnexion
     */
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    /**
     * Vérifier si l'utilisateur est authentifié
     */
    const isAuthenticated = () => {
        return !!token && !!user;
    };

    /**
     * Vérifier le rôle de l'utilisateur
     */
    const hasRole = (role) => {
        return user?.role === role;
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
        hasRole
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
