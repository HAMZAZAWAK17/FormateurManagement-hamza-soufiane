import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ParticipantLayout from '../components/ParticipantLayout';
import { Calendar, Clock, MapPin, Users, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'http://localhost:5000/api';

const ParticipantPlanifications = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            // Get all sessions
            const response = await axios.get(`${API_URL}/participants/sessions/list`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Filter sessions for current participant's formations
            const participantFormations = await axios.get(`${API_URL}/participants/mes-formations`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const formationIds = participantFormations.data.map(f => f.formation_id);
            const filteredSessions = response.data.filter(s => formationIds.includes(s.formation_id));

            setSessions(filteredSessions || []);
            setLoading(false);
        } catch (error) {
            console.error('Erreur:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
            setLoading(false);
        }
    };

    const getStatutBadge = (statut) => {
        const badges = {
            'planifiee': { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Planifiée' },
            'en_cours': { bg: 'bg-green-500/20', text: 'text-green-400', label: 'En cours' },
            'terminee': { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Terminée' },
            'annulee': { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Annulée' }
        };
        return badges[statut] || badges['planifiee'];
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
                        Planifications
                    </h1>
                    <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                        Consultez toutes vos sessions de formation planifiées
                    </p>
                </div>

                {/* Sessions List */}
                {sessions.length === 0 ? (
                    <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        } border rounded-xl p-12 text-center`}>
                        <Calendar className={`w-20 h-20 mx-auto mb-4 ${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'
                            }`} />
                        <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>
                            Aucune session planifiée
                        </h3>
                        <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                            Vous n'avez pas encore de sessions planifiées
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {sessions.map((session) => {
                            const badge = getStatutBadge(session.statut);
                            return (
                                <div
                                    key={session.id}
                                    className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                                        } border rounded-xl p-6 hover:shadow-lg transition-shadow`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <BookOpen className="w-6 h-6 text-purple-500" />
                                                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                                    }`}>
                                                    {session.formation_titre}
                                                </h3>
                                            </div>
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                                                {badge.label}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {/* Date */}
                                        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
                                            } p-4 rounded-lg`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="w-4 h-4 text-blue-500" />
                                                <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                                    }`}>
                                                    Dates
                                                </span>
                                            </div>
                                            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                                }`}>
                                                {new Date(session.date_debut).toLocaleDateString('fr-FR')}
                                            </p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                                }`}>
                                                au {new Date(session.date_fin).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>

                                        {/* Horaire */}
                                        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
                                            } p-4 rounded-lg`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-4 h-4 text-green-500" />
                                                <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                                    }`}>
                                                    Horaires
                                                </span>
                                            </div>
                                            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                                }`}>
                                                {session.horaire_debut} - {session.horaire_fin}
                                            </p>
                                        </div>

                                        {/* Lieu */}
                                        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
                                            } p-4 rounded-lg`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <MapPin className="w-4 h-4 text-red-500" />
                                                <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                                    }`}>
                                                    Lieu
                                                </span>
                                            </div>
                                            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                                }`}>
                                                {session.lieu || 'Non spécifié'}
                                            </p>
                                        </div>

                                        {/* Places */}
                                        <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
                                            } p-4 rounded-lg`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Users className="w-4 h-4 text-purple-500" />
                                                <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                                    }`}>
                                                    Places
                                                </span>
                                            </div>
                                            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                                }`}>
                                                {session.nombre_places} places
                                            </p>
                                        </div>
                                    </div>

                                    {session.remarques && (
                                        <div className="mt-4 pt-4 border-t border-slate-700">
                                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                                }`}>
                                                <strong>Remarques :</strong> {session.remarques}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </ParticipantLayout>
    );
};

export default ParticipantPlanifications;
