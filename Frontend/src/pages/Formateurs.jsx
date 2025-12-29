import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Users, Plus, Edit2, Trash2, Mail, Tag, MessageSquare, Search, Filter, CheckCircle, Clock, XCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

const Formateurs = () => {
    const [formateurs, setFormateurs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('tous');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchFormateurs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/formateurs', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFormateurs(response.data);
            } catch (err) {
                toast.error('Erreur lors du chargement des formateurs.');
            } finally {
                setLoading(false);
            }
        };
        fetchFormateurs();
    }, [token]);

    const handleSupprimer = async (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">Êtes-vous sûr de vouloir supprimer ce formateur ?</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await axios.delete(`http://localhost:5000/api/formateurs/${id}`, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                setFormateurs(formateurs.filter(f => f.id !== id));
                                toast.success('Formateur supprimé avec succès !');
                            } catch (err) {
                                toast.error('Erreur lors de la suppression.');
                            }
                        }}
                        className="px-3 py-1 text-xs bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        ), { duration: 5000 });
    };

    const filteredFormateurs = formateurs.filter(f => {
        const matchesSearch = `${f.nom} ${f.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.mots_cles.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'tous' || f.statut === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (statut) => {
        switch (statut) {
            case 'en_attente':
                return {
                    icon: Clock,
                    text: 'En attente',
                    className: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
                };
            case 'approuve':
                return {
                    icon: CheckCircle,
                    text: 'Approuvé',
                    className: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                };
            case 'rejete':
                return {
                    icon: XCircle,
                    text: 'Rejeté',
                    className: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                };
            default:
                return {
                    icon: CheckCircle,
                    text: 'Approuvé',
                    className: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                };
        }
    };

    return (
        <Layout>
            <div className="p-4 md:p-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600/10 dark:bg-blue-600/20 flex items-center justify-center border border-blue-600/20">
                            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Formateurs</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Gérez votre équipe pédagogique</p>
                        </div>
                    </div>

                    {user?.role === 'admin' && (
                        <button
                            onClick={() => navigate('/formateurs/ajouter')}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98]"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Ajouter un formateur</span>
                        </button>
                    )}
                </div>

                {/* Filters Section */}
                <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] p-4 rounded-2xl shadow-sm transition-colors duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom, email ou compétence..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white pl-12 pr-4 py-3.5 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white pl-12 pr-4 py-3.5 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium appearance-none cursor-pointer"
                            >
                                <option value="tous">Tous les statuts</option>
                                <option value="approuve">✅ Approuvés</option>
                                <option value="en_attente">⏳ En attente</option>
                                <option value="rejete">❌ Rejetés</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-[#1f2937]/50 border-b border-slate-200 dark:border-[#334155]/50">
                                    <th className="px-6 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Formateur</th>
                                    <th className="px-6 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Compétences</th>
                                    <th className="px-6 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Statut</th>
                                    <th className="px-6 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Remarques</th>
                                    {user?.role === 'admin' && (
                                        <th className="px-6 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-[#334155]/30">
                                <AnimatePresence mode='popLayout'>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={user?.role === 'admin' ? 5 : 4} className="px-6 py-12 text-center text-slate-400">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                                                    <span>Chargement des formateurs...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredFormateurs.length === 0 ? (
                                        <tr>
                                            <td colSpan={user?.role === 'admin' ? 5 : 4} className="px-6 py-12 text-center text-slate-500">
                                                Aucun formateur trouvé.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredFormateurs.map((formateur) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                key={formateur.id}
                                                className="hover:bg-slate-50 dark:hover:bg-[#0f172a]/40 transition-colors group"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                            {formateur.prenom[0]}{formateur.nom[0]}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 dark:text-white">
                                                                {formateur.prenom} {formateur.nom}
                                                            </div>
                                                            <div className="text-sm text-slate-500 flex items-center gap-1">
                                                                <Mail className="w-3 h-3" />
                                                                {formateur.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {formateur.mots_cles.split(',').map((tag, i) => (
                                                            <span
                                                                key={i}
                                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-600/20"
                                                            >
                                                                <Tag className="w-3 h-3" />
                                                                {tag.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {(() => {
                                                        const badge = getStatusBadge(formateur.statut || 'approuve');
                                                        const Icon = badge.icon;
                                                        return (
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${badge.className}`}>
                                                                <Icon className="w-3.5 h-3.5" />
                                                                {badge.text}
                                                            </span>
                                                        );
                                                    })()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start gap-2 max-w-xs">
                                                        <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 italic line-clamp-2">
                                                            {formateur.remarques || "Aucune remarque"}
                                                        </p>
                                                    </div>
                                                </td>
                                                {user?.role === 'admin' && (
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <button
                                                                onClick={() => navigate(`/formateurs/modifier/${formateur.id}`)}
                                                                className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-600/10 rounded-lg transition-all"
                                                                title="Modifier"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleSupprimer(formateur.id)}
                                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-600/10 rounded-lg transition-all"
                                                                title="Supprimer"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Formateurs;
