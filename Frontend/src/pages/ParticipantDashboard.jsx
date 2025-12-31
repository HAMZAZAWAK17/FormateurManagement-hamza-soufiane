import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ParticipantLayout from '../components/ParticipantLayout';
import { BookOpen, Calendar, Star, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'http://localhost:5000/api';

const ParticipantDashboard = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalFormations: 0,
        sessionsEnCours: 0,
        sessionsTerminees: 0,
        evaluationsEnAttente: 0
    });
    const [formations, setFormations] = useState([]);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [formationsRes, sessionsRes] = await Promise.all([
                axios.get(`${API_URL}/participants/mes-formations`, config),
                axios.get(`${API_URL}/participants/mes-sessions`, config)
            ]);

            setFormations(formationsRes.data || []);
            setSessions(sessionsRes.data || []);

            // Calculate stats
            const sessionsEnCours = sessionsRes.data?.filter(s => s.statut === 'en_cours').length || 0;
            const sessionsTerminees = sessionsRes.data?.filter(s => s.statut === 'terminee').length || 0;

            setStats({
                totalFormations: formationsRes.data?.length || 0,
                sessionsEnCours,
                sessionsTerminees,
                evaluationsEnAttente: sessionsTerminees
            });

            setLoading(false);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
            setLoading(false);
        }
    };

    const statsCards = [
        {
            title: 'Mes Formations',
            value: stats.totalFormations,
            icon: BookOpen,
            color: 'from-blue-500 to-blue-600',
            bgColor: theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50',
            textColor: 'text-blue-500'
        },
        {
            title: 'Sessions en cours',
            value: stats.sessionsEnCours,
            icon: Clock,
            color: 'from-green-500 to-green-600',
            bgColor: theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50',
            textColor: 'text-green-500'
        },
        {
            title: 'Sessions terminées',
            value: stats.sessionsTerminees,
            icon: CheckCircle,
            color: 'from-purple-500 to-purple-600',
            bgColor: theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50',
            textColor: 'text-purple-500'
        },
        {
            title: 'Évaluations en attente',
            value: stats.evaluationsEnAttente,
            icon: Star,
            color: 'from-yellow-500 to-yellow-600',
            bgColor: theme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50',
            textColor: 'text-yellow-500'
        }
    ];

    if (loading) {
        return (
            <ParticipantLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                        <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                            Chargement...
                        </p>
                    </div>
                </div>
            </ParticipantLayout>
        );
    }

    return (
        <ParticipantLayout>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    } rounded-xl p-6 text-white`}>
                    <h1 className="text-3xl font-bold mb-2">
                        Bienvenue sur votre espace formation ! 👋
                    </h1>
                    <p className="text-blue-100">
                        Suivez vos formations, consultez vos sessions et évaluez vos formateurs
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                                    } border rounded-xl p-6 hover:shadow-lg transition-shadow`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                        <Icon className={`w-6 h-6 ${stat.textColor}`} />
                                    </div>
                                    <TrendingUp className={`w-5 h-5 ${stat.textColor}`} />
                                </div>
                                <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                    }`}>
                                    {stat.title}
                                </h3>
                                <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                    }`}>
                                    {stat.value}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Formations */}
                <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    } border rounded-xl p-6`}>
                    <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                        Mes Formations Récentes
                    </h2>
                    {formations.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'
                                }`} />
                            <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                                Vous n'êtes inscrit à aucune formation pour le moment
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {formations.slice(0, 3).map((formation) => (
                                <div
                                    key={formation.id}
                                    className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                                        } border rounded-lg p-4 hover:shadow-md transition-shadow`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                                }`}>
                                                {formation.titre}
                                            </h3>
                                            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                                }`}>
                                                {formation.nombre_heures}h • {formation.cout} DH
                                            </p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${formation.statut === 'confirme'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {formation.statut === 'confirme' ? 'Confirmé' : 'En attente'}
                                            </span>
                                        </div>
                                        <BookOpen className="w-8 h-8 text-blue-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Upcoming Sessions */}
                <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    } border rounded-xl p-6`}>
                    <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                        Prochaines Sessions
                    </h2>
                    {sessions.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'
                                }`} />
                            <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                                Aucune session planifiée
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sessions.slice(0, 3).map((session) => (
                                <div
                                    key={session.id}
                                    className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                                        } border rounded-lg p-4`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                                }`}>
                                                {session.formation_titre}
                                            </h3>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                                }`}>
                                                📅 {new Date(session.date_debut).toLocaleDateString('fr-FR')} - {new Date(session.date_fin).toLocaleDateString('fr-FR')}
                                            </p>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                                }`}>
                                                🕐 {session.horaire_debut} - {session.horaire_fin}
                                            </p>
                                        </div>
                                        <Calendar className="w-8 h-8 text-green-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ParticipantLayout>
    );
};

export default ParticipantDashboard;
