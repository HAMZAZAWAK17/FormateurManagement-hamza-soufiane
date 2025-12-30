import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';

const EvaluerFormation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Récupérer les IDs depuis l'URL (ex: /evaluer?formationId=1&formateurId=2)
    const formationId = searchParams.get('formationId');
    const formateurId = searchParams.get('formateurId');
    const urlEmail = searchParams.get('participantEmail'); // Email pré-rempli si dispo

    const [formData, setFormData] = useState({
        qualite_pedagogique: 0,
        rythme: 0,
        support_cours: 0,
        maitrise_sujet: 0,
        commentaire: '',
        participant_email: urlEmail || ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Critères d'évaluation
    const criteres = [
        { key: 'qualite_pedagogique', label: 'Qualité Pédagogique' },
        { key: 'rythme', label: 'Rythme de la formation' },
        { key: 'support_cours', label: 'Qualité du support de cours & TP' },
        { key: 'maitrise_sujet', label: 'Maîtrise du sujet par le formateur' }
    ];

    const handleStarClick = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formationId || !formateurId) {
            setError("Lien invalide : Informations de formation manquantes.");
            return;
        }

        // Validation basique : tous les critères doivent être notés
        if (Object.values(formData).some(val => val === 0 && typeof val === 'number')) {
            setError("Merci de donner une note pour chaque critère.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:5000/api/evaluations', {
                formation_id: formationId,
                formateur_id: formateurId,
                ...formData
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || "Une erreur est survenue lors de l'envoi.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                    <div className="bg-green-100 p-6 rounded-full mb-6 animate-bounce">
                        <CheckCircle size={64} className="text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Merci !</h2>
                    <p className="text-gray-600 text-lg mb-8 max-w-md">
                        Votre évaluation a bien été enregistrée. Votre retour est précieux pour améliorer nos formations.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
                    >
                        Retour à l'accueil
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Évaluation de la formation</h1>
                    <p className="text-gray-500">
                        Aidez-nous à améliorer la qualité de nos services en notant votre expérience.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-center text-red-700 rounded shadow-sm">
                        <AlertCircle size={24} className="mr-3 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {(!formationId || !formateurId) ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center text-yellow-800">
                        <AlertCircle className="mx-auto mb-2" size={32} />
                        paramètres manquants dans l'URL. Veuillez utiliser le lien fourni dans votre email d'invitation.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">

                        {/* Champs Email */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Votre Email (Optionnel)</label>
                            <input
                                type="email"
                                value={formData.participant_email}
                                onChange={(e) => setFormData({ ...formData, participant_email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
                                placeholder="exemple@email.com"
                            />
                        </div>

                        {/* Critères de notation */}
                        <div className="space-y-8 mb-8">
                            {criteres.map((critere) => (
                                <div key={critere.key} className="border-b border-gray-100 pb-6 last:border-0">
                                    <label className="block text-lg font-medium text-gray-800 mb-3">{critere.label}</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => handleStarClick(critere.key, star)}
                                                onMouseEnter={() => { }} // Optionnel: hover effect state
                                                className="focus:outline-none transform hover:scale-110 transition-transform"
                                            >
                                                <Star
                                                    size={32}
                                                    className={`${star <= formData[critere.key]
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-300'
                                                        } transition-colors duration-200`}
                                                />
                                            </button>
                                        ))}
                                        <span className="ml-4 text-sm font-medium text-gray-500 self-center">
                                            {formData[critere.key] > 0 ? `${formData[critere.key]}/5` : ''}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Commentaire */}
                        <div className="mb-8">
                            <label className="block text-lg font-medium text-gray-800 mb-3">Commentaire (Avis global)</label>
                            <textarea
                                rows="4"
                                value={formData.commentaire}
                                onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none text-gray-900 bg-white"
                                placeholder="Qu'avez-vous le plus apprécié ? Qu'est-ce qui pourrait être amélioré ?"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transform active:scale-[0.98] transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? (
                                <span className="animate-pulse">Envoi en cours...</span>
                            ) : (
                                <>
                                    Envoyer mon évaluation
                                    <Send className="ml-2 -mb-1" size={20} />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </Layout>
    );
};

export default EvaluerFormation;
