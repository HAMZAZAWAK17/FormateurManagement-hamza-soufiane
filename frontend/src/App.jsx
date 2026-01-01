import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import theme from './theme';

// Pages
import Accueil from './pages/Accueil';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import FormateurDashboard from './pages/FormateurDashboard';
import ParticipantDashboard from './pages/ParticipantDashboard';

/**
 * Composant principal de l'application
 */
function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Routes publiques */}
                        <Route path="/" element={<Accueil />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        {/* Routes protégées - Admin */}
                        <Route
                            path="/admin/*"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Routes protégées - Formateur */}
                        <Route
                            path="/formateur/*"
                            element={
                                <ProtectedRoute allowedRoles={['formateur']}>
                                    <FormateurDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Routes protégées - Participant */}
                        <Route
                            path="/participant/*"
                            element={
                                <ProtectedRoute allowedRoles={['participant']}>
                                    <ParticipantDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Route 404 */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
