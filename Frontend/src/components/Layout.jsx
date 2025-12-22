import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, LogOut, Home } from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#020617] text-white flex">
            {/* Sidebar */}
            <aside className="w-72 bg-[#020617] border-r border-[#1f2937] flex flex-col p-6 gap-6 fixed h-full z-50">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <LayoutDashboard className="w-6 h-6 text-blue-400" />
                        <span className="text-lg font-semibold">Tableau de bord</span>
                    </div>
                    <p className="text-xs text-slate-500">
                        Connecté en tant que <span className="font-semibold text-slate-300">{user?.role}</span>
                    </p>
                </div>

                <nav className="flex flex-col gap-2">
                    {/* Premier bouton: Accueil */}
                    <button
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive('/') || isActive('/dashboard')
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                            : 'text-slate-300 hover:bg-[#111827]'
                            }`}
                    >
                        <Home className="w-5 h-5" />
                        <span>Accueil</span>
                    </button>

                    {/* Deuxième bouton: Formations (liste) */}
                    <button
                        onClick={() => navigate('/formations')}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive('/formations')
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                            : 'text-slate-300 hover:bg-[#111827]'
                            }`}
                    >
                        <BookOpen className="w-5 h-5 text-slate-400" />
                        <span>Formations</span>
                    </button>




                </nav>

                <div className="mt-auto pt-4 border-t border-[#1f2937]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 border border-red-500/30 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Contenu principal */}
            <main className="flex-1 ml-72">
                {children}
            </main>
        </div>
    );
};

export default Layout;
