import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Calendar, Plus, Edit2, Trash2, Building2, User, BookOpen, Link } from 'lucide-react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

const Planifications = () => {
    const navigate = useNavigate();
    const [planifications, setPlanifications] = useState([]);
    const [formations, setFormations] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [entreprises, setEntreprises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentPlanification, setCurrentPlanification] = useState(null);
    const [stats, setStats] = useState(null);

    const [formData, setFormData] = useState({
        formation_id: '',
        formateur_id: '',
        entreprise_id: '',
        date_debut: '',
        date_fin: '',
        horaire_debut: '09:00',
        horaire_fin: '17:00',
        remarques: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const [planifRes, formationsRes, formateursRes, entreprisesRes, statsRes] = await Promise.all([
                axios.get(`${API_URL}/planifications`, config),
                axios.get(`${API_URL}/formations`, config),
                axios.get(`${API_URL}/formateurs`, config),
                axios.get(`${API_URL}/entreprises`, config),
                axios.get(`${API_URL}/planifications/stats`, config)
            ]);

            setPlanifications(planifRes.data);
            setFormations(formationsRes.data);
            setFormateurs(formateursRes.data);
            setEntreprises(entreprisesRes.data);
            setStats(statsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
            toast.error('Erreur lors du chargement des données');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            if (editMode) {
                await axios.put(`${API_URL}/planifications/${currentPlanification.id}`, formData, config);
                toast.success('Planification modifiée avec succès !');
            } else {
                await axios.post(`${API_URL}/planifications`, formData, config);
                toast.success('Planification créée avec succès !');
            }

            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            if (error.response?.status === 409) {
                toast.error('Conflit de disponibilité : ' + error.response.data.message);
            } else {
                toast.error('Erreur lors de la sauvegarde de la planification');
            }
        }
    };

    const handleEdit = (planification) => {
        setCurrentPlanification(planification);
        setFormData({
            formation_id: planification.formation_id,
            formateur_id: planification.formateur_id,
            entreprise_id: planification.entreprise_id,
            date_debut: planification.date_debut.split('T')[0],
            date_fin: planification.date_fin.split('T')[0],
            horaire_debut: planification.horaire_debut,
            horaire_fin: planification.horaire_fin,
            remarques: planification.remarques || ''
        });
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">Êtes-vous sûr de vouloir supprimer cette planification ?</p>
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
                                const token = localStorage.getItem('token');
                                await axios.delete(`${API_URL}/planifications/${id}`, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                fetchData();
                                toast.success('Planification supprimée avec succès !');
                            } catch (error) {
                                console.error('Erreur lors de la suppression:', error);
                                toast.error('Erreur lors de la suppression');
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

    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/planifications/${id}`,
                { statut: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
            toast.success('Statut mis à jour avec succès !');
        } catch (error) {
            console.error('Erreur lors du changement de statut:', error);
            toast.error('Erreur lors du changement de statut');
        }
    };

    const copyEvaluationLink = (planif) => {
        const link = `${window.location.origin}/evaluer?formationId=${planif.formation_id}&formateurId=${planif.formateur_id}`;
        navigator.clipboard.writeText(link);
        toast.success('Lien d\'évaluation copié !');
    };

    const resetForm = () => {
        setFormData({
            formation_id: '',
            formateur_id: '',
            entreprise_id: '',
            date_debut: '',
            date_fin: '',
            horaire_debut: '09:00',
            horaire_fin: '17:00',
            remarques: ''
        });
        setEditMode(false);
        setCurrentPlanification(null);
    };

    const openModal = () => {
        resetForm();
        setShowModal(true);
    };

    const getStatusBadge = (statut) => {
        const badges = {
            'planifiee': { text: 'Planifiée', class: 'bg-blue-600/20 text-blue-400' },
            'en_cours': { text: 'En cours', class: 'bg-yellow-600/20 text-yellow-400' },
            'terminee': { text: 'Terminée', class: 'bg-green-600/20 text-green-400' },
            'annulee': { text: 'Annulée', class: 'bg-red-600/20 text-red-400' }
        };
        const badge = badges[statut] || { text: statut, class: 'bg-slate-600/20 text-slate-400' };
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.class}`}>{badge.text}</span>;
    };

    return (
        <Layout>
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Planifications</h1>
                            <p className="text-sm text-slate-400">Gestion des planifications de formations</p>
                        </div>
                    </div>

                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nouvelle planification</span>
                    </button>
                </div>

                {/* Statistiques */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-4">
                            <div className="text-slate-400 text-sm mb-1">Total</div>
                            <div className="text-2xl font-bold text-white">{stats.total}</div>
                        </div>
                        <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-4">
                            <div className="text-slate-400 text-sm mb-1">Planifiées</div>
                            <div className="text-2xl font-bold text-blue-400">{stats.planifiees}</div>
                        </div>
                        <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-4">
                            <div className="text-slate-400 text-sm mb-1">En cours</div>
                            <div className="text-2xl font-bold text-yellow-400">{stats.en_cours}</div>
                        </div>
                        <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-4">
                            <div className="text-slate-400 text-sm mb-1">Terminées</div>
                            <div className="text-2xl font-bold text-green-400">{stats.terminees}</div>
                        </div>
                    </div>
                )}

                {/* Table Section */}
                <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-700/50">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Formation</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Formateur</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Entreprise</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Période</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Horaires</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Statut</th>
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
                                                    <span>Chargement des planifications...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : planifications.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                                Aucune planification trouvée.
                                            </td>
                                        </tr>
                                    ) : (
                                        planifications.map((planif) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                key={planif.id}
                                                className="hover:bg-slate-700/20 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="w-4 h-4 text-blue-400" />
                                                        <span className="text-sm font-medium text-white">
                                                            {planif.formation_titre}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                        <span className="text-sm text-slate-300">
                                                            {planif.formateur_prenom} {planif.formateur_nom}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-slate-400" />
                                                        <span className="text-sm text-slate-300">
                                                            {planif.entreprise_nom}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-300">
                                                    {new Date(planif.date_debut).toLocaleDateString('fr-FR')} - {new Date(planif.date_fin).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-300">
                                                    {planif.horaire_debut} - {planif.horaire_fin}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={planif.statut}
                                                        onChange={(e) => handleStatusChange(planif.id, e.target.value)}
                                                        className="bg-slate-700 text-white text-xs px-2 py-1 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option value="planifiee">Planifiée</option>
                                                        <option value="en_cours">En cours</option>
                                                        <option value="terminee">Terminée</option>
                                                        <option value="annulee">Annulée</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => copyEvaluationLink(planif)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
                                                            title="Copier le lien d'évaluation"
                                                        >
                                                            <Link className="w-3.5 h-3.5" />
                                                            Test & Lien
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(planif)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                            Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(planif.id)}
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-700/50">
                            <h2 className="text-xl font-bold text-white">
                                {editMode ? 'Modifier la planification' : 'Nouvelle planification'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Formation *</label>
                                    <select
                                        name="formation_id"
                                        value={formData.formation_id}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Sélectionner une formation</option>
                                        {formations.map(f => (
                                            <option key={f.id} value={f.id}>
                                                {f.titre} ({f.nombre_heures}h)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Formateur *</label>
                                    <select
                                        name="formateur_id"
                                        value={formData.formateur_id}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Sélectionner un formateur</option>
                                        {formateurs.map(f => (
                                            <option key={f.id} value={f.id}>
                                                {f.prenom} {f.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Entreprise *</label>
                                    <select
                                        name="entreprise_id"
                                        value={formData.entreprise_id}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Sélectionner une entreprise</option>
                                        {entreprises.map(e => (
                                            <option key={e.id} value={e.id}>
                                                {e.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Date de début *</label>
                                    <input
                                        type="date"
                                        name="date_debut"
                                        value={formData.date_debut}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Date de fin *</label>
                                    <input
                                        type="date"
                                        name="date_fin"
                                        value={formData.date_fin}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Horaire de début *</label>
                                    <input
                                        type="time"
                                        name="horaire_debut"
                                        value={formData.horaire_debut}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Horaire de fin *</label>
                                    <input
                                        type="time"
                                        name="horaire_fin"
                                        value={formData.horaire_fin}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Remarques</label>
                                <textarea
                                    name="remarques"
                                    value={formData.remarques}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Remarques ou notes supplémentaires..."
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium text-sm transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-colors"
                                >
                                    {editMode ? 'Mettre à jour' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Planifications;
