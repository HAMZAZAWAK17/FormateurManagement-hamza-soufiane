import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Users, Edit2, Trash2, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

const Participants = () => {
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [formations, setFormations] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [filterStatut, setFilterStatut] = useState('');
    const [filterFormation, setFilterFormation] = useState('');
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [selectedParticipants, setSelectedParticipants] = useState([]);

    const [sessionFormData, setSessionFormData] = useState({
        formation_id: '',
        formateur_id: '',
        date_debut: '',
        date_fin: '',
        horaire_debut: '09:00',
        horaire_fin: '17:00',
        lieu: '',
        nombre_places: 20,
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

            const [participantsRes, formateursRes, formationsRes, sessionsRes, statsRes] = await Promise.all([
                axios.get(`${API_URL}/participants`, config),
                axios.get(`${API_URL}/formateurs`, config),
                axios.get(`${API_URL}/formations`, config),
                axios.get(`${API_URL}/participants/sessions/list`, config),
                axios.get(`${API_URL}/participants/stats`, config)
            ]);

            setParticipants(participantsRes.data);
            setFormateurs(formateursRes.data);
            setFormations(formationsRes.data);
            setSessions(sessionsRes.data);
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

    const handleChangeStatut = async (id, newStatut) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/participants/${id}/statut`,
                { statut: newStatut },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
            toast.success('Statut mis à jour avec succès !');
        } catch (error) {
            console.error('Erreur lors du changement de statut:', error);
            toast.error('Erreur lors du changement de statut');
        }
    };

    const handleDelete = async (id) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">Êtes-vous sûr de vouloir supprimer ce participant ?</p>
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
                                await axios.delete(`${API_URL}/participants/${id}`, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                fetchData();
                                toast.success('Participant supprimé avec succès !');
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

    const filteredParticipants = participants.filter(p => {
        if (filterStatut && p.statut !== filterStatut) return false;
        if (filterFormation && p.formation_id !== parseInt(filterFormation)) return false;
        return true;
    });

    const getStatutBadge = (statut) => {
        const badges = {
            'en_attente': { text: 'En attente', class: 'bg-yellow-600/20 text-yellow-400' },
            'confirme': { text: 'Confirmé', class: 'bg-green-600/20 text-green-400' },
            'annule': { text: 'Annulé', class: 'bg-red-600/20 text-red-400' }
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
                            <Users className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Participants Individuels</h1>
                            <p className="text-sm text-slate-400">Gestion des inscriptions publiques</p>
                        </div>
                    </div>
                </div>

                {/* Statistiques */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-4">
                            <div className="text-slate-400 text-sm mb-1">Total</div>
                            <div className="text-2xl font-bold text-white">{stats.total}</div>
                        </div>
                        <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-4">
                            <div className="text-slate-400 text-sm mb-1">En attente</div>
                            <div className="text-2xl font-bold text-yellow-400">{stats.en_attente}</div>
                        </div>
                        <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-4">
                            <div className="text-slate-400 text-sm mb-1">Confirmés</div>
                            <div className="text-2xl font-bold text-green-400">{stats.confirme}</div>
                        </div>
                        <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-4">
                            <div className="text-slate-400 text-sm mb-1">Annulés</div>
                            <div className="text-2xl font-bold text-red-400">{stats.annule}</div>
                        </div>
                    </div>
                )}

                {/* Filtres */}
                <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-300">Filtres</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-2">Statut</label>
                            <select
                                value={filterStatut}
                                onChange={(e) => setFilterStatut(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="en_attente">En attente</option>
                                <option value="confirme">Confirmé</option>
                                <option value="annule">Annulé</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-2">Formation</label>
                            <select
                                value={filterFormation}
                                onChange={(e) => setFilterFormation(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="">Toutes les formations</option>
                                {formations.map(f => (
                                    <option key={f.id} value={f.id}>{f.titre}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-700/50">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Participant</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ville</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Formation</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                <AnimatePresence mode='popLayout'>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                                                    <span>Chargement des participants...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredParticipants.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                                Aucun participant trouvé.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredParticipants.map((participant) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                key={participant.id}
                                                className="hover:bg-slate-700/20 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-white">
                                                        {participant.prenom} {participant.nom}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        Né(e) le {new Date(participant.date_naissance).toLocaleDateString('fr-FR')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-slate-300">{participant.email}</div>
                                                    <div className="text-xs text-slate-400">{participant.telephone}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-300">{participant.ville}</td>
                                                <td className="px-6 py-4 text-sm text-slate-300">{participant.formation_titre}</td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={participant.statut}
                                                        onChange={(e) => handleChangeStatut(participant.id, e.target.value)}
                                                        className="bg-slate-700 text-white text-xs px-2 py-1 rounded border border-slate-600 focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option value="en_attente">En attente</option>
                                                        <option value="confirme">Confirmé</option>
                                                        <option value="annule">Annulé</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleDelete(participant.id)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Supprimer
                                                    </button>
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

export default Participants;
