import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Calendar,
    Star,
    User,
    Lock,
    LogOut,
    Menu,
    X,
    GraduationCap
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ParticipantLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = [
        {
            path: '/participant/dashboard',
            icon: LayoutDashboard,
            label: 'Accueil',
            color: 'text-blue-400'
        },
        {
            path: '/participant/formations',
            icon: BookOpen,
            label: 'Formations',
            color: 'text-purple-400'
        },
        {
            path: '/participant/planifications',
            icon: Calendar,
            label: 'Planifications',
            color: 'text-green-400'
        },
        {
            path: '/participant/evaluations',
            icon: Star,
            label: 'Mes Évaluations',
            color: 'text-yellow-400'
        },
        {
            path: '/participant/entreprises',
            icon: GraduationCap,
            label: 'Entreprises',
            color: 'text-indigo-400'
        }
    ];

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    } border-r transition-all duration-300 z-50 ${sidebarOpen ? 'w-72' : 'w-20'
                    }`}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
                    <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        {sidebarOpen && (
                            <div>
                                <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                    Espace Participant
                                </h1>
                                <p className="text-xs text-slate-400">Formation Management</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`p-2 rounded-lg ${theme === 'dark'
                            ? 'hover:bg-slate-800 text-slate-400'
                            : 'hover:bg-slate-100 text-slate-600'
                            } transition-colors ${!sidebarOpen && 'hidden'}`}
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* User Info */}
                {sidebarOpen && (
                    <div className={`p-4 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    {user.prenom?.[0]}{user.nom?.[0]}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                    {user.prenom} {user.nom}
                                </p>
                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                                    Participant
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Menu Items */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? theme === 'dark'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-blue-500 text-white'
                                    : theme === 'dark'
                                        ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    } ${!sidebarOpen && 'justify-center'}`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
                                {sidebarOpen && (
                                    <span className="font-medium">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${theme === 'dark'
                            ? 'text-red-400 hover:bg-red-500/10'
                            : 'text-red-600 hover:bg-red-50'
                            } ${!sidebarOpen && 'justify-center'}`}
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span className="font-medium">Déconnexion</span>}
                    </button>
                </div>

                {/* Toggle Button when closed */}
                {!sidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                )}
            </aside>

            {/* Main Content */}
            <main
                className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'
                    }`}
            >
                {/* Top Bar */}
                <header className={`h-16 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    } border-b flex items-center justify-between px-6`}>
                    <div>
                        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-lg ${theme === 'dark'
                            ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            } transition-colors`}
                    >
                        {theme === 'dark' ? '🌙' : '☀️'}
                    </button>
                </header>

                {/* Page Content */}
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default ParticipantLayout;
