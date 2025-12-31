import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ParticipantLayout from '../components/ParticipantLayout';
import { Building2, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const API_URL = 'http://localhost:5000/api';

const ParticipantEntreprises = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [entreprises, setEntreprises] = useState([]);

    useEffect(() => {
        fetchEntreprises();
    }, []);

    const fetchEntreprises = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/entreprises`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEntreprises(response.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Erreur:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
            setLoading(false);
        }
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
                        Entreprises Partenaires
                    </h1>
                    <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                        Découvrez nos entreprises partenaires
                    </p>
                </div>

                {/* Entreprises Grid */}
                {entreprises.length === 0 ? (
                    <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                        } border rounded-xl p-12 text-center`}>
                        <Building2 className={`w-20 h-20 mx-auto mb-4 ${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'
                            }`} />
                        <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>
                            Aucune entreprise
                        </h3>
                        <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                            Aucune entreprise partenaire pour le moment
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {entreprises.map((entreprise) => (
                            <div
                                key={entreprise.id}
                                className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                                    } border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300`}
                            >
                                {/* Header with gradient */}
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                                    <Building2 className="w-12 h-12 mb-3" />
                                    <h3 className="text-xl font-bold mb-1">{entreprise.nom}</h3>
                                    <p className="text-indigo-100 text-sm">{entreprise.secteur_activite}</p>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    {/* Email */}
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-500/10 rounded-lg">
                                            <Mail className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                                }`}>
                                                Email
                                            </p>
                                            <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                                }`}>
                                                {entreprise.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Téléphone */}
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-500/10 rounded-lg">
                                            <Phone className="w-4 h-4 text-green-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                                }`}>
                                                Téléphone
                                            </p>
                                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                                }`}>
                                                {entreprise.telephone}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Adresse */}
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-red-500/10 rounded-lg">
                                            <MapPin className="w-4 h-4 text-red-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                                }`}>
                                                Adresse
                                            </p>
                                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                                }`}>
                                                {entreprise.adresse}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Site Web */}
                                    {entreprise.site_web && (
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                                <Globe className="w-4 h-4 text-purple-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                                    }`}>
                                                    Site Web
                                                </p>
                                                <a
                                                    href={entreprise.site_web}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-blue-500 hover:text-blue-400 truncate block"
                                                >
                                                    {entreprise.site_web}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ParticipantLayout>
    );
};

export default ParticipantEntreprises;
