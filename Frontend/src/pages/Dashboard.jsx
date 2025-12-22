import { useAuth } from '../context/AuthContext';
import { LayoutDashboard } from 'lucide-react';
import Layout from '../components/Layout';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <Layout>
            <div className="flex-1 p-6 md:p-10 bg-[#0f172a]">
                <div className="max-w-5xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Tableau de bord
                        </h1>
                        <p className="text-slate-400 text-sm">
                            Vue d'ensemble de votre espace de gestion.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                        <div className="bg-[#1e293b]/60 p-6 rounded-2xl border border-[#334155]">
                            <h2 className="text-xl font-semibold mb-4 text-slate-300">Profil</h2>
                            <div className="space-y-3 text-sm">
                                <p><span className="text-slate-500">Nom :</span> {user?.nom} {user?.prenom}</p>
                                <p><span className="text-slate-500">Email :</span> {user?.email}</p>
                                <p>
                                    <span className="text-slate-500">Rôle :</span>
                                    <span className="ml-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase">
                                        {user?.role}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#1e293b]/60 p-6 rounded-2xl border border-[#334155]">
                            <h2 className="text-xl font-semibold mb-4 text-slate-300">Statut</h2>
                            <p className="text-emerald-400 flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                Session active et sécurisée
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
