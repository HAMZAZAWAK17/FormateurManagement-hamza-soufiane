import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Star, Calendar, Clock, CheckCircle, AlertCircle, PlayCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const MesFormations = () => {
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMesFormations();
    }, []);

    const fetchMesFormations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/participants/mes-formations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormations(response.data);
        } catch (err) {
            console.error(err);
            setError('Impossible de charger vos formations.');
        } finally {
            setLoading(false);
        }
    };

    const handleEvaluer = (formation) => {
        if (!formation.formateur_id) {
            // Cas rare où aucun formateur n'est trouvé
            alert("Impossible de trouver le formateur associé à cette formation pour le moment. Veuillez contacter l'administration.");
            return;
        }
        navigate(`/evaluer?formationId=${formation.formation_id}&formateurId=${formation.formateur_id}&participantEmail=${user.email}`);
    };

    const handleDelete = async (inscriptionId) => {
        if (confirm('Êtes-vous sûr de vouloir vous désinscrire de cette formation ?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/participants/${inscriptionId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Mettre à jour la liste locale
                setFormations(formations.filter(f => f.id !== inscriptionId));
            } catch (err) {
                console.error(err);
                alert("Erreur lors de la désinscription.");
            }
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.16))]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-blue-500" />
                        Mes Formations
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Retrouvez ici toutes les formations auxquelles vous êtes inscrit et donnez votre avis.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 mb-6">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {formations.length === 0 ? (
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
                        <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Aucune formation trouvée</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            Vous n'êtes inscrit à aucune formation pour le moment.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
                        >
                            Parcourir le catalogue
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {formations.map((formation) => (
                            <div key={formation.id} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                                <div className="h-48 bg-slate-100 dark:bg-[#0f172a] relative">
                                    {formation.image ? (
                                        <img
                                            src={`http://localhost:5000${formation.image}`}
                                            alt={formation.titre}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${formation.statut === 'confirme' || formation.statut === 'approuve'
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                            : formation.statut === 'en_attente'
                                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                                : 'bg-red-500 text-white'
                                            }`}>
                                            {formation.statut === 'confirme' ? 'Confirmé' :
                                                formation.statut === 'approuve' ? 'Confirmé' :
                                                    formation.statut === 'en_attente' ? 'En attente' : 'Annulé'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(formation.id)}
                                        className="absolute top-4 left-4 p-2 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                        title="Se désinscrire"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                                        {formation.titre}
                                    </h3>

                                    <div className="space-y-3 mb-6 flex-1">
                                        <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                                            <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                            <span>{formation.nombre_heures} heures</span>
                                        </div>
                                        {formation.date_debut && (
                                            <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                                                <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                                                <span>
                                                    {new Date(formation.date_debut).toLocaleDateString('fr-FR')} au {new Date(formation.date_fin).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                        {(formation.statut === 'confirme' || formation.statut === 'approuve') ? (
                                            formation.a_evalue ? (
                                                <div className="text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm">
                                                    <CheckCircle className="w-5 h-5" />
                                                    Évaluation envoyée
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleEvaluer(formation)}
                                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                                                >
                                                    <Star className="w-5 h-5" />
                                                    Évaluer la formation
                                                </button>
                                            )
                                        ) : (
                                            <div className="text-center text-sm text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-[#0f172a] p-3 rounded-xl">
                                                Inscription en cours de traitement
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MesFormations;
