import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    UserPlus,
    Mail,
    User,
    Phone,
    MapPin,
    Calendar,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    BookOpen,
    Cake
} from 'lucide-react';

const InscriptionParticipant = () => {
    const navigate = useNavigate();
    const [formations, setFormations] = useState([]);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        date_naissance: '',
        ville: '',
        email: '',
        telephone: '',
        formation_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchingFormations, setFetchingFormations] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchFormations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/formations/catalogue');
                setFormations(response.data);
            } catch (err) {
                console.error('Erreur lors du chargement des formations:', err);
                setError('Impossible de charger la liste des formations.');
            } finally {
                setFetchingFormations(false);
            }
        };
        fetchFormations();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(
                'http://localhost:5000/api/participants/inscrire',
                formData
            );

            if (response.status === 201) {
                setSuccess(true);
                setFormData({
                    nom: '',
                    prenom: '',
                    date_naissance: '',
                    ville: '',
                    email: '',
                    telephone: '',
                    formation_id: ''
                });
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Une erreur est survenue lors de votre inscription.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRetourAccueil = () => {
        navigate('/');
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="bg-green-100 rounded-full p-6">
                            <CheckCircle className="w-16 h-16 text-green-600" />
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Inscription reçue !
                    </h1>

                    <p className="text-lg text-gray-600 mb-8">
                        Votre demande d'inscription en tant que participant a été enregistrée avec succès.
                        Notre équipe vous contactera très prochainement pour confirmer les détails.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <h3 className="font-semibold text-blue-900 mb-2">Et après ?</h3>
                        <ul className="text-left text-blue-800 space-y-2">
                            <li className="flex items-start">
                                <span className="mr-2">1.</span>
                                <span>Vérification de vos informations par l'administration</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">2.</span>
                                <span>Envoi d'un email de confirmation avec les détails de la session</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">3.</span>
                                <span>Vous pourrez ensuite suivre le statut de votre demande</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/statut-demande')}
                            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Vérifier mon statut
                        </button>
                        <button
                            onClick={handleRetourAccueil}
                            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Retour à l'accueil
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-sky-600 rounded-full mb-6 shadow-xl">
                        <UserPlus className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Rejoignez nos formations
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Inscrivez-vous dès aujourd'hui pour booster votre carrière avec nos experts
                    </p>
                </div>

                {/* Formulaire */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-sky-600 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <BookOpen className="w-7 h-7 mr-3" />
                            Formulaire d'inscription Participant
                        </h2>
                        <p className="text-blue-50 mt-2">
                            Remplissez vos informations pour réserver votre place
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start">
                                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Formation Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Choisir une formation <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    name="formation_id"
                                    value={formData.formation_id}
                                    onChange={handleChange}
                                    required
                                    disabled={fetchingFormations}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white disabled:bg-gray-50"
                                >
                                    <option value="">{fetchingFormations ? 'Chargement...' : 'Sélectionnez une formation'}</option>
                                    {formations.map(f => (
                                        <option key={f.id} value={f.id}>
                                            {f.titre} ({f.nombre_heures}h) - {f.cout} DH
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Informations personnelles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nom <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Votre nom"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Prénom <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Votre prénom"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dates and Ville */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Date de naissance <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Cake className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        name="date_naissance"
                                        value={formData.date_naissance}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Ville <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="ville"
                                        value={formData.ville}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Ex: Casablanca, Rabat..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="votre.email@exemple.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Téléphone <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="telephone"
                                        value={formData.telephone}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="06 12 34 56 78"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Boutons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                type="button"
                                onClick={handleRetourAccueil}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Retour
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Inscription...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5 mr-2" />
                                        Confirmer mon inscription
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Information supplémentaire */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Notes aux participants
                    </h3>
                    <ul className="text-blue-800 space-y-2 text-sm">
                        <li>• Votre inscription est soumise à validation par notre centre de formation.</li>
                        <li>• Une fois validé, vous recevrez vos accès pour évaluer la formation.</li>
                        <li>• Veillez à fournir des informations de contact valides pour recevoir les notifications.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default InscriptionParticipant;
