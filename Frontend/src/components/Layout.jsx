import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, LogOut, Home, Sun, Moon } from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white flex transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-50 dark:bg-[#020617] border-r border-slate-200 dark:border-[#1f2937] flex flex-col p-6 gap-6 fixed h-full z-50 transition-colors duration-300">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-3">
                            <LayoutDashboard className="w-6 h-6 text-blue-500" />
                            <span className="text-lg font-bold text-slate-900 dark:text-white transition-colors">Tableau de bord</span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all shadow-sm"
                            title={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
                        >
                            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                        Connecté en tant que <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{user?.role}</span>
                    </p>
                </div>

                <nav className="flex flex-col gap-2">
                    {/* Premier bouton: Accueil */}
                    <button
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive('/') || isActive('/dashboard')
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#111827]'
                            }`}
                    >
                        <Home className="w-5 h-5" />
                        <span>Accueil</span>
                    </button>

                    <button
                        onClick={() => navigate('/formations')}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive('/formations')
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#111827]'
                            }`}
                    >
                        <BookOpen className="w-5 h-5" />
                        <span>Formations</span>
                    </button>

                    <button
                        onClick={() => navigate('/formateurs')}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive('/formateurs') || isActive('/formateurs/ajouter')
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#111827]'
                            }`}
                    >
                        <div className="w-5 h-5 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </div>
                        <span>Formateurs</span>
                    </button>
                </nav>

                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-[#1f2937]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 border border-red-500/20 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Contenu principal */}
            <main className="flex-1 ml-72 min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
                {children}
            </main>
        </div>
    );
};

export default Layout;
