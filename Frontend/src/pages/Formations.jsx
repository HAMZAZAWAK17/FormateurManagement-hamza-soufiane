import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Plus, Edit2, Trash2, Clock, DollarSign, Target, FileText } from 'lucide-react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

const Formations = () => {
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleModifier = (id) => {
        navigate(`/formations/modifier/${id}`);
    };

    const handleSupprimer = async (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">Êtes-vous sûr de vouloir supprimer cette formation ?</p>
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
                                await axios.delete(`http://localhost:5000/api/formations/${id}`);
                                setFormations(formations.filter(f => f.id !== id));
                                toast.success('Formation supprimée avec succès !');
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

    useEffect(() => {
        const fetchFormations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/formations');
                setFormations(response.data || []);
            } catch (err) {
                toast.error('Erreur lors du chargement des formations.');
            } finally {
                setLoading(false);
            }
        };

        fetchFormations();
    }, []);

    return (
        <Layout>
            <div className="p-4 md:p-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600/10 dark:bg-blue-600/20 flex items-center justify-center border border-blue-600/20">
                            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Formations</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Catalogue des formations disponibles</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/formations/ajouter')}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Ajouter une formation</span>
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-[#1f2937]/50 border-b border-slate-200 dark:border-[#334155]/50">
                                    <th className="px-6 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Formation</th>
                                    <th className="px-6 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Détails</th>
                                    <th className="px-6 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Objectifs</th>
                                    <th className="px-6 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-[#334155]/30">
                                <AnimatePresence mode='popLayout'>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                                                    <span>Chargement des formations...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : formations.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                                Aucune formation trouvée.
                                            </td>
                                        </tr>
                                    ) : (
                                        formations.map((formation) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                key={formation.id}
                                                className="hover:bg-slate-50 dark:hover:bg-[#0f172a]/40 transition-colors group"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                            {formation.titre}
                                                        </span>
                                                        <span className="text-xs text-slate-400 mt-1">ID: #{formation.id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                                                            <Clock className="w-3.5 h-3.5 text-emerald-500" />
                                                            {formation.nombre_heures} heures
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                                                            <DollarSign className="w-3.5 h-3.5" />
                                                            {Number(formation.cout).toFixed(2)} €
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start gap-2 max-w-sm">
                                                        <Target className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 italic">
                                                            {formation.objectifs}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button
                                                            onClick={() => handleModifier(formation.id)}
                                                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-600/10 rounded-lg transition-all"
                                                            title="Modifier"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleSupprimer(formation.id)}
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-600/10 rounded-lg transition-all"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
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

export default Formations;
