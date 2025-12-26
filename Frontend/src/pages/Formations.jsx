import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Plus, Edit2, Trash2 } from 'lucide-react';
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
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Formations</h1>
                            <p className="text-sm text-slate-400">Liste des formations disponibles</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/formations/ajouter')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter une formation</span>
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-700/50">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Titre</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Catégorie</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombre heures</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Coût</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Objectifs</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Programme détaillé</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                <AnimatePresence mode='popLayout'>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                                                    <span>Chargement des formations...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : formations.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
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
                                                className="hover:bg-slate-700/20 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                                                    {formation.id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-medium text-white">
                                                        {formation.titre}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-1 text-[10px] font-bold bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20 uppercase">
                                                        {formation.categorie || 'Info'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-300">
                                                    {formation.nombre_heures}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                                                    {Number(formation.cout).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-slate-300 max-w-xs line-clamp-3">
                                                        {formation.objectifs}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-slate-300 max-w-md line-clamp-3 whitespace-pre-line">
                                                        {formation.programme_detaille}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleModifier(formation.id)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                            Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => handleSupprimer(formation.id)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            Supprimer
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
