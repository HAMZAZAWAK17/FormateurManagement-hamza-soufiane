import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        Tableau de Bord
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-2 rounded-xl border border-red-500/20 transition-all font-medium"
                    >
                        Déconnexion
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#1e293b]/50 p-6 rounded-2xl border border-[#334155]">
                        <h2 className="text-xl font-semibold mb-4 text-slate-300">Profil</h2>
                        <div className="space-y-3">
                            <p><span className="text-slate-500">Nom:</span> {user?.nom} {user?.prenom}</p>
                            <p><span className="text-slate-500">Email:</span> {user?.email}</p>
                            <p>
                                <span className="text-slate-500">Rôle:</span>
                                <span className="ml-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase">
                                    {user?.role}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#1e293b]/50 p-6 rounded-2xl border border-[#334155]">
                        <h2 className="text-xl font-semibold mb-4 text-slate-300">Statut</h2>
                        <p className="text-emerald-400 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            Session active
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
