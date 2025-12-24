import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, Plus, Edit2, Trash2, Mail, Phone, Globe, MapPin } from 'lucide-react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

const Entreprises = () => {
    const [entreprises, setEntreprises] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchEntreprises = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/entreprises');
            setEntreprises(response.data || []);
        } catch (err) {
            toast.error('Erreur lors du chargement des entreprises.');
        } finally {
            setLoading(false);
        }
    };

    const handleModifier = (id) => {
        navigate(`/entreprises/modifier/${id}`);
    };

    const handleSupprimer = async (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">Êtes-vous sûr de vouloir supprimer cette entreprise ?</p>
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
                                await axios.delete(`http://localhost:5000/api/entreprises/${id}`);
                                setEntreprises(entreprises.filter(e => e.id !== id));
                                toast.success('Entreprise supprimée avec succès !');
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
        fetchEntreprises();
    }, []);

    return (
        <Layout>
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Entreprises</h1>
                            <p className="text-sm text-slate-400">Liste des entreprises clientes</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/entreprises/ajouter')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter une entreprise</span>
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-700/50">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nom</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Adresse</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Téléphone</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">URL</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                <AnimatePresence mode='popLayout'>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-8 h-8 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
                                                    <span>Chargement des entreprises...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : entreprises.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                                Aucune entreprise trouvée.
                                            </td>
                                        </tr>
                                    ) : (
                                        entreprises.map((entreprise) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                key={entreprise.id}
                                                className="hover:bg-slate-700/20 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                                                    {entreprise.id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-purple-400" />
                                                        <span className="text-sm font-medium text-white">
                                                            {entreprise.nom}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start gap-2">
                                                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm text-slate-300 max-w-xs line-clamp-2">
                                                            {entreprise.adresse}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-green-400" />
                                                        <span className="text-sm text-slate-300">
                                                            {entreprise.telephone}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4 text-blue-400" />
                                                        <span className="text-sm text-slate-300">
                                                            {entreprise.email}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {entreprise.url ? (
                                                        <div className="flex items-center gap-2">
                                                            <Globe className="w-4 h-4 text-cyan-400" />
                                                            <a
                                                                href={entreprise.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                                                            >
                                                                Visiter
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-slate-500">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleModifier(entreprise.id)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                            Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => handleSupprimer(entreprise.id)}
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

export default Entreprises;
