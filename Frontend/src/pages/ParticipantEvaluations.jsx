import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ParticipantLayout from '../components/ParticipantLayout';
import { Star, Calendar, User, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'http://localhost:5000/api';

const ParticipantEvaluations = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [evaluations, setEvaluations] = useState([]);

    useEffect(() => {
        fetchEvaluations();
    }, []);

    const fetchEvaluations = async () => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            // Get evaluations for current participant
            const response = await axios.get(`${API_URL}/evaluations`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Filter evaluations by participant email
            const myEvaluations = response.data.filter(e => e.participant_email === user.email);
            setEvaluations(myEvaluations || []);
            setLoading(false);
        } catch (error) {
            console.error('Erreur:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
            setLoading(false);
        }
    };

    const renderStars = (note) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-5 h-5 ${star <= note
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-600'
                            }`}
                    />
                ))}
            </div>
        );
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
                        Mes Évaluations
                    </h1>
                    <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                        Consultez l'historique de vos évaluations
                    </p>
                </div>

                {/* Evaluations List */}
                {evaluations.length === 0 ? (
                    <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        } border rounded-xl p-12 text-center`}>
                        <Star className={`w-20 h-20 mx-auto mb-4 ${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'
                            }`} />
                        <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>
                            Aucune évaluation
                        </h3>
                        <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                            Vous n'avez pas encore soumis d'évaluations
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {evaluations.map((evaluation) => (
                            <div
                                key={evaluation.id}
                                className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                                    } border rounded-xl p-6 hover:shadow-lg transition-shadow`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                            }`}>
                                            {evaluation.formation_titre}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-blue-500" />
                                                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                                                    {evaluation.formateur_nom}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-green-500" />
                                                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                                                    {new Date(evaluation.created_at).toLocaleDateString('fr-FR')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    {/* Note Formateur */}
                                    <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
                                        } p-4 rounded-lg`}>
                                        <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                            }`}>
                                            Note Formateur
                                        </p>
                                        {renderStars(evaluation.note_formateur)}
                                    </div>

                                    {/* Note Formation */}
                                    <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
                                        } p-4 rounded-lg`}>
                                        <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                            }`}>
                                            Note Formation
                                        </p>
                                        {renderStars(evaluation.note_formation)}
                                    </div>

                                    {/* Note Globale */}
                                    <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
                                        } p-4 rounded-lg`}>
                                        <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                            }`}>
                                            Note Globale
                                        </p>
                                        {renderStars(evaluation.note_globale)}
                                    </div>
                                </div>

                                {/* Commentaire */}
                                {evaluation.commentaire && (
                                    <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
                                        } p-4 rounded-lg`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <MessageSquare className="w-4 h-4 text-purple-500" />
                                            <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                                }`}>
                                                Commentaire
                                            </p>
                                        </div>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                            }`}>
                                            {evaluation.commentaire}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ParticipantLayout>
    );
};

export default ParticipantEvaluations;
