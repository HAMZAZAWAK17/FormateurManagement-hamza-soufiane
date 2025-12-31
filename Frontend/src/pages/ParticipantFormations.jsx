import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ParticipantLayout from '../components/ParticipantLayout';
import { BookOpen, Clock, DollarSign, Target, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'http://localhost:5000/api';

const ParticipantFormations = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [formations, setFormations] = useState([]);
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchFormations();
    }, []);

    const fetchFormations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/participants/mes-formations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormations(response.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Erreur:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
            setLoading(false);
        }
    };

    const openModal = (formation) => {
        setSelectedFormation(formation);
        setShowModal(true);
    };

    if (loading) {
        return (
            <ParticipantLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                </div>
            </ParticipantLayout>
        );
    }

    return (
        <ParticipantLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    } border rounded-xl p-6`}>
                    <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                        Mes Formations
                    </h1>
                    <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                        Consultez toutes les formations auxquelles vous êtes inscrit
                    </p>
                </div>

                {/* Formations Grid */}
                {formations.length === 0 ? (
                    <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        } border rounded-xl p-12 text-center`}>
                        <BookOpen className={`w-20 h-20 mx-auto mb-4 ${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'
                            }`} />
                        <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>
                            Aucune formation
                        </h3>
                        <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                            Vous n'êtes inscrit à aucune formation pour le moment
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {formations.map((formation) => (
                            <div
                                key={formation.id}
                                className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                                    } border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer`}
                                onClick={() => openModal(formation)}
                            >
                                {/* Header with gradient */}
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                                    <BookOpen className="w-12 h-12 mb-3" />
                                    <h3 className="text-xl font-bold mb-2">{formation.titre}</h3>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${formation.statut === 'confirme'
                                        ? 'bg-green-500/30 text-green-100'
                                        : 'bg-yellow-500/30 text-yellow-100'
                                        }`}>
                                        {formation.statut === 'confirme' ? '✓ Confirmé' : '⏳ En attente'}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/10 rounded-lg">
                                            <Clock className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                                }`}>
                                                Durée
                                            </p>
                                            <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                                }`}>
                                                {formation.nombre_heures} heures
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/10 rounded-lg">
                                            <DollarSign className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                                }`}>
                                                Coût
                                            </p>
                                            <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                                }`}>
                                                {formation.cout} DH
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openModal(formation)}
                                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                        >
                                            Voir les détails
                                        </button>
                                        {formation.statut === 'confirme' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate('/evaluer', {
                                                        state: {
                                                            formationId: formation.formation_id,
                                                            formationTitre: formation.titre
                                                        }
                                                    });
                                                }}
                                                className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Star className="w-4 h-4" />
                                                Évaluer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && selectedFormation && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
                    <div
                        className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                            } border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                            <h2 className="text-2xl font-bold mb-2">{selectedFormation.titre}</h2>
                            <p className="text-blue-100">Détails de la formation</p>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
                                    } p-4 rounded-lg`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                            }`}>
                                            Durée
                                        </span>
                                    </div>
                                    <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                        }`}>
                                        {selectedFormation.nombre_heures}h
                                    </p>
                                </div>

                                <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
                                    } p-4 rounded-lg`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-5 h-5 text-green-500" />
                                        <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                            }`}>
                                            Coût
                                        </span>
                                    </div>
                                    <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                        }`}>
                                        {selectedFormation.cout} DH
                                    </p>
                                </div>
                            </div>

                            {/* Objectifs */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Target className="w-5 h-5 text-purple-500" />
                                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                        }`}>
                                        Objectifs
                                    </h3>
                                </div>
                                <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                    } whitespace-pre-line`}>
                                    {selectedFormation.objectifs}
                                </p>
                            </div>

                            {/* Programme */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                        }`}>
                                        Programme détaillé
                                    </h3>
                                </div>
                                <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                    } whitespace-pre-line`}>
                                    {selectedFormation.programme_detaille}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                            } border-t p-6`}>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ParticipantLayout>
    );
};

export default ParticipantFormations;
