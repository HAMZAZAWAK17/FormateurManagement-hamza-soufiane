import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Formations from './pages/Formations';
import AjouterFormation from './pages/AjouterFormation';
import ModifierFormation from './pages/ModifierFormation';
import AjouterFormateur from './pages/AjouterFormateur';
import Formateurs from './pages/Formateurs';
import Entreprises from './pages/Entreprises';
import AjouterEntreprise from './pages/AjouterEntreprise';
import ModifierEntreprise from './pages/ModifierEntreprise';
import Planifications from './pages/Planifications';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid #334155',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/formations"
                element={
                  <ProtectedRoute>
                    <Formations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/formations/ajouter"
                element={
                  <AdminRoute>
                    <AjouterFormation />
                  </AdminRoute>
                }
              />
              <Route
                path="/formations/modifier/:id"
                element={
                  <AdminRoute>
                    <ModifierFormation />
                  </AdminRoute>
                }
              />
              <Route
                path="/formateurs/ajouter"
                element={
                  <AdminRoute>
                    <AjouterFormateur />
                  </AdminRoute>
                }
              />
              <Route
                path="/formateurs"
                element={
                  <ProtectedRoute>
                    <Formateurs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/entreprises"
                element={
                  <ProtectedRoute>
                    <Entreprises />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/entreprises/ajouter"
                element={
                  <ProtectedRoute>
                    <AjouterEntreprise />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/entreprises/modifier/:id"
                element={
                  <ProtectedRoute>
                    <ModifierEntreprise />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/planifications"
                element={
                  <ProtectedRoute>
                    <Planifications />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
