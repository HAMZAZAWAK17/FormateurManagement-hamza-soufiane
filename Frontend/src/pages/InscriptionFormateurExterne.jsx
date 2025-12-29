import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    UserPlus,
    Mail,
    User,
    Phone,
    Tag,
    MessageSquare,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Briefcase
} from 'lucide-react';

const InscriptionFormateurExterne = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        mots_cles: '',
        remarques: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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
                'http://localhost:5000/api/formateurs/register-externe',
                formData
            );

            if (response.data.success) {
                setSuccess(true);
                // Réinitialiser le formulaire
                setFormData({
                    nom: '',
                    prenom: '',
                    email: '',
                    telephone: '',
                    mots_cles: '',
                    remarques: ''
                });
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Une erreur est survenue lors de l\'envoi de votre demande.'
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="bg-green-100 rounded-full p-6">
                            <CheckCircle className="w-16 h-16 text-green-600" />
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Demande envoyée avec succès !
                    </h1>

                    <p className="text-lg text-gray-600 mb-8">
                        Votre demande d'inscription en tant que formateur a été reçue.
                        Notre équipe va examiner votre profil dans les plus brefs délais.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <h3 className="font-semibold text-blue-900 mb-2">Prochaines étapes :</h3>
                        <ul className="text-left text-blue-800 space-y-2">
                            <li className="flex items-start">
                                <span className="mr-2">1.</span>
                                <span>Validation de votre profil par notre équipe</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">2.</span>
                                <span>Vérifiez le statut de votre demande sur la page dédiée</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">3.</span>
                                <span>Si approuvé, création de votre compte formateur</span>
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-6 shadow-xl">
                        <Briefcase className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Devenez Formateur
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Partagez votre expertise et rejoignez notre réseau de formateurs professionnels
                    </p>
                </div>

                {/* Formulaire */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <UserPlus className="w-7 h-7 mr-3" />
                            Formulaire d'inscription
                        </h2>
                        <p className="text-blue-100 mt-2">
                            Complétez le formulaire ci-dessous pour manifester votre intérêt
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start">
                                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

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
                                    Téléphone
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="telephone"
                                        value={formData.telephone}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="06 12 34 56 78"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mots-clés de compétences */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mots-clés de compétences <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                <textarea
                                    name="mots_cles"
                                    value={formData.mots_cles}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Ex: Java, Spring Boot, React, Développement Web, Agile, Scrum..."
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Listez vos domaines d'expertise séparés par des virgules
                            </p>
                        </div>

                        {/* Remarques */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Remarques / Présentation
                            </label>
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                <textarea
                                    name="remarques"
                                    value={formData.remarques}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Parlez-nous de votre expérience, vos certifications, vos motivations..."
                                />
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
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5 mr-2" />
                                        Envoyer ma candidature
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
                        Informations importantes
                    </h3>
                    <ul className="text-blue-800 space-y-2 text-sm">
                        <li>• Votre demande sera examinée par notre équipe dans un délai de 48 à 72 heures</li>
                        <li>• Vous recevrez une notification par email concernant le statut de votre candidature</li>
                        <li>• Les champs marqués d'un astérisque (*) sont obligatoires</li>
                        <li>• Assurez-vous que votre adresse email est correcte pour recevoir nos communications</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default InscriptionFormateurExterne;
