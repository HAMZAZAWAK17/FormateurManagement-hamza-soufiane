import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ParticipantLayout from '../components/ParticipantLayout';
import { User, Mail, Phone, MapPin, Calendar, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const ParticipantProfil = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profil, setProfil] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        ville: '',
        date_naissance: ''
    });

    useEffect(() => {
        fetchProfil();
    }, []);

    const fetchProfil = async () => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            // Get participant data
            const response = await axios.get(`${API_URL}/participants`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Find current participant by email
            const currentParticipant = response.data.find(p => p.email === user.email);

            if (currentParticipant) {
                setProfil({
                    nom: currentParticipant.nom || '',
                    prenom: currentParticipant.prenom || '',
                    email: currentParticipant.email || '',
                    telephone: currentParticipant.telephone || '',
                    ville: currentParticipant.ville || '',
                    date_naissance: currentParticipant.date_naissance?.split('T')[0] || ''
                });
            }

            setLoading(false);
        } catch (error) {
            console.error('Erreur:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfil({
            ...profil,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            // Get participant ID
            const response = await axios.get(`${API_URL}/participants`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const currentParticipant = response.data.find(p => p.email === user.email);

            if (currentParticipant) {
                await axios.put(
                    `${API_URL}/participants/${currentParticipant.id}`,
                    profil,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.success('Profil mis à jour avec succès !');
            }
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors de la mise à jour du profil');
        } finally {
            setSaving(false);
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
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    } border rounded-xl p-6`}>
                    <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                        Mon Profil
                    </h1>
                    <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                        Gérez vos informations personnelles
                    </p>
                </div>

                {/* Profile Card */}
                <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    } border rounded-xl overflow-hidden`}>
                    {/* Header with Avatar */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                                <span className="text-4xl font-bold">
                                    {profil.prenom?.[0]}{profil.nom?.[0]}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-1">
                                    {profil.prenom} {profil.nom}
                                </h2>
                                <p className="text-blue-100">{profil.email}</p>
                                <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                                    Participant
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nom */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                    }`}>
                                    <User className="w-4 h-4 inline mr-2" />
                                    Nom
                                </label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={profil.nom}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark'
                                        ? 'bg-slate-800 border-slate-700 text-white'
                                        : 'bg-white border-slate-300 text-slate-900'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    required
                                />
                            </div>

                            {/* Prénom */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                    }`}>
                                    <User className="w-4 h-4 inline mr-2" />
                                    Prénom
                                </label>
                                <input
                                    type="text"
                                    name="prenom"
                                    value={profil.prenom}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark'
                                        ? 'bg-slate-800 border-slate-700 text-white'
                                        : 'bg-white border-slate-300 text-slate-900'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                    }`}>
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profil.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark'
                                        ? 'bg-slate-800 border-slate-700 text-white'
                                        : 'bg-white border-slate-300 text-slate-900'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    required
                                />
                            </div>

                            {/* Téléphone */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                    }`}>
                                    <Phone className="w-4 h-4 inline mr-2" />
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    name="telephone"
                                    value={profil.telephone}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark'
                                        ? 'bg-slate-800 border-slate-700 text-white'
                                        : 'bg-white border-slate-300 text-slate-900'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    required
                                />
                            </div>

                            {/* Ville */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                    }`}>
                                    <MapPin className="w-4 h-4 inline mr-2" />
                                    Ville
                                </label>
                                <input
                                    type="text"
                                    name="ville"
                                    value={profil.ville}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark'
                                        ? 'bg-slate-800 border-slate-700 text-white'
                                        : 'bg-white border-slate-300 text-slate-900'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    required
                                />
                            </div>

                            {/* Date de naissance */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                    }`}>
                                    <Calendar className="w-4 h-4 inline mr-2" />
                                    Date de naissance
                                </label>
                                <input
                                    type="date"
                                    name="date_naissance"
                                    value={profil.date_naissance}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${theme === 'dark'
                                        ? 'bg-slate-800 border-slate-700 text-white'
                                        : 'bg-white border-slate-300 text-slate-900'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6 border-t border-slate-700">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-5 h-5" />
                                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ParticipantLayout>
    );
};

export default ParticipantProfil;
