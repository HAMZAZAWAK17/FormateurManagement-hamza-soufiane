import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    UserCheck,
    UserX,
    Mail,
    Phone,
    MapPin,
    Calendar,
    AlertCircle,
    CheckCircle,
    XCircle,
    Eye,
    Clock,
    BookOpen,
    Key
} from 'lucide-react';

const GestionDemandesParticipants = () => {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDemande, setSelectedDemande] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [createAccount, setCreateAccount] = useState(false);
    const [password, setPassword] = useState('');

    useEffect(() => {
        fetchDemandes();
    }, []);

    const fetchDemandes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                'http://localhost:5000/api/participants?statut=en_attente',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setDemandes(response.data);
        } catch (err) {
            setError('Erreur lors du chargement des demandes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, statut) => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                statut,
                createAccount: statut === 'confirme' ? createAccount : false,
                password: statut === 'confirme' && createAccount ? password : undefined
            };

            await axios.put(
                `http://localhost:5000/api/participants/${id}/statut`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Rafraîchir la liste
            await fetchDemandes();
            setShowModal(false);
            setSelectedDemande(null);
            setCreateAccount(false);
            setPassword('');
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de l\'action');
        } finally {
            setActionLoading(false);
        }
    };

    const openModal = (demande) => {
        setSelectedDemande(demande);
        setShowModal(true);
        setCreateAccount(false);
        setPassword('');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Chargement des demandes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Demandes Participants
                    </h1>
                    <p className="text-gray-400">
                        Gérez les inscriptions des participants aux formations
                    </p>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6 flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                        <p className="text-red-200">{error}</p>
                    </div>
                )}

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Total en attente</p>
                                <p className="text-3xl font-bold text-blue-400">{demandes.length}</p>
                            </div>
                            <Clock className="w-12 h-12 text-blue-400 opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Liste des demandes */}
                {demandes.length === 0 ? (
                    <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
                        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Aucune demande en attente</h3>
                        <p className="text-gray-400">
                            Toutes les inscriptions ont été traitées !
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {demandes.map((demande) => (
                            <div
                                key={demande.id}
                                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    {/* Informations */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <h3 className="text-xl font-bold text-white">
                                                {demande.prenom} {demande.nom}
                                            </h3>
                                            <span className="px-3 py-1 bg-yellow-900/50 text-yellow-400 rounded-full text-sm font-medium flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                En attente
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="flex items-center text-gray-300">
                                                <Mail className="w-4 h-4 mr-2 text-blue-400" />
                                                <span className="text-sm">{demande.email}</span>
                                            </div>
                                            <div className="flex items-center text-gray-300">
                                                <Phone className="w-4 h-4 mr-2 text-green-400" />
                                                <span className="text-sm">{demande.telephone}</span>
                                            </div>
                                            <div className="flex items-center text-gray-300">
                                                <BookOpen className="w-4 h-4 mr-2 text-purple-400" />
                                                <span className="text-sm font-semibold text-purple-200">{demande.formation_titre}</span>
                                            </div>
                                            <div className="flex items-center text-gray-300">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                <span className="text-sm">{formatDate(demande.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex lg:flex-col gap-3">
                                        <button
                                            onClick={() => openModal(demande)}
                                            className="flex-1 lg:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Détails
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedDemande(demande);
                                                handleAction(demande.id, 'confirme');
                                            }}
                                            disabled={actionLoading}
                                            className="flex-1 lg:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                                        >
                                            <UserCheck className="w-4 h-4 mr-2" />
                                            Approuver
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Êtes-vous sûr de vouloir rejeter cette inscription ?')) {
                                                    handleAction(demande.id, 'annule');
                                                }
                                            }}
                                            disabled={actionLoading}
                                            className="flex-1 lg:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                                        >
                                            <UserX className="w-4 h-4 mr-2" />
                                            Rejeter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de détails */}
            {showModal && selectedDemande && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Détails de l'inscription</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Formation demandée */}
                            <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4">
                                <h3 className="text-lg font-bold text-blue-400 mb-2 flex items-center">
                                    <BookOpen className="w-5 h-5 mr-2" />
                                    Formation : {selectedDemande.formation_titre}
                                </h3>
                                <div className="flex gap-4 text-sm text-gray-300">
                                    <span>Durée: {selectedDemande.nombre_heures}h</span>
                                    <span>Coût: {selectedDemande.cout} DH</span>
                                </div>
                            </div>

                            {/* Informations personnelles */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Informations Participant</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Nom</p>
                                        <p className="text-white font-medium">{selectedDemande.nom}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Prénom</p>
                                        <p className="text-white font-medium">{selectedDemande.prenom}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Email</p>
                                        <p className="text-white font-medium">{selectedDemande.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Téléphone</p>
                                        <p className="text-white font-medium">{selectedDemande.telephone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Ville</p>
                                        <p className="text-white font-medium">{selectedDemande.ville}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Date de naissance</p>
                                        <p className="text-white font-medium">{new Date(selectedDemande.date_naissance).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Options d'approbation */}
                            <div className="border-t border-gray-700 pt-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Options d'approbation</h3>

                                <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={createAccount}
                                            onChange={(e) => setCreateAccount(e.target.checked)}
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="ml-3 text-white font-medium">
                                            Créer un compte utilisateur Participant
                                        </span>
                                    </label>
                                    <p className="text-sm text-gray-400 mt-2 ml-8">
                                        Permet au participant de se connecter pour évaluer la formation
                                    </p>
                                </div>

                                {createAccount && (
                                    <div className="bg-gray-700/50 rounded-lg p-4">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            <Key className="w-4 h-4 inline mr-2" />
                                            Mot de passe temporaire
                                        </label>
                                        <input
                                            type="text"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Laisser vide pour générer automatiquement"
                                            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <p className="text-xs text-gray-400 mt-2">
                                            Si vide, le mot de passe par défaut sera : participant123
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => handleAction(selectedDemande.id, 'confirme')}
                                    disabled={actionLoading}
                                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                                >
                                    {actionLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Traitement...
                                        </>
                                    ) : (
                                        <>
                                            <UserCheck className="w-5 h-5 mr-2" />
                                            Approuver
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('Êtes-vous sûr de vouloir rejeter cette inscription ?')) {
                                            handleAction(selectedDemande.id, 'annule');
                                        }
                                    }}
                                    disabled={actionLoading}
                                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                                >
                                    <UserX className="w-5 h-5 mr-2" />
                                    Rejeter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionDemandesParticipants;
