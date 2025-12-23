import { useAuth } from '../context/AuthContext';
import { LayoutDashboard } from 'lucide-react';
import Layout from '../components/Layout';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <Layout>
            <div className="flex-1 p-6 md:p-10 transition-colors">
                <div className="max-w-5xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                            Tableau de bord
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                            Vue d'ensemble de votre espace de gestion.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                        <div className="bg-white dark:bg-[#1e293b]/60 p-6 rounded-3xl border border-slate-200 dark:border-[#334155] shadow-sm">
                            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-300">Profil</h2>
                            <div className="space-y-4 text-sm">
                                <p className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                    <span className="text-slate-500 font-medium">Nom complet</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{user?.nom} {user?.prenom}</span>
                                </p>
                                <p className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                    <span className="text-slate-500 font-medium">Email</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{user?.email}</span>
                                </p>
                                <p className="flex justify-between items-center pb-2">
                                    <span className="text-slate-500 font-medium">Rôle</span>
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest">
                                        {user?.role}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1e293b]/60 p-6 rounded-3xl border border-slate-200 dark:border-[#334155] shadow-sm flex flex-col justify-center">
                            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-300">Statut système</h2>
                            <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl">
                                <p className="text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-sm font-bold">
                                    <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    Session active et sécurisée
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
