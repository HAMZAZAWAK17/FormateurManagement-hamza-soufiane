import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { BookOpen, Clock, DollarSign, Target, Calendar, User, Mail, Phone, MapPin, Cake, CheckCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Accueil = () => {
    const [formations, setFormations] = useState([]);
    const [filteredFormations, setFilteredFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInscriptionModal, setShowInscriptionModal] = useState(false);
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [filters, setFilters] = useState({
        categorie: '',
        ville: '',
        date: ''
    });

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        date_naissance: '',
        ville: '',
        email: '',
        telephone: ''
    });

    useEffect(() => {
        fetchFormations();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, formations]);

    const fetchFormations = async () => {
        try {
            const response = await axios.get(`${API_URL}/formations/catalogue`);
            setFormations(response.data);
            setFilteredFormations(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des formations:', error);
            toast.error('Erreur lors du chargement des formations');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let results = formations;

        if (filters.categorie) {
            results = results.filter(f => f.categorie === filters.categorie);
        }

        if (filters.ville) {
            results = results.filter(f =>
                f.sessions && f.sessions.some(s => s.lieu && s.lieu.toLowerCase().includes(filters.ville.toLowerCase()))
            );
        }

        if (filters.date) {
            results = results.filter(f =>
                f.sessions && f.sessions.some(s => s.date_debut && s.date_debut >= filters.date)
            );
        }

        setFilteredFormations(results);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const openInscriptionModal = (formation) => {
        setSelectedFormation(formation);
        setShowInscriptionModal(true);
    };

    const closeModal = () => {
        setShowInscriptionModal(false);
        setSelectedFormation(null);
        setFormData({
            nom: '',
            prenom: '',
            date_naissance: '',
            ville: '',
            email: '',
            telephone: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axios.post(`${API_URL}/participants/inscrire`, {
                ...formData,
                formation_id: selectedFormation.id
            });

            toast.success('Inscription réussie ! Nous vous contacterons bientôt.', {
                duration: 5000,
                icon: '🎉'
            });

            closeModal();
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            if (error.response?.status === 409) {
                toast.error('Vous êtes déjà inscrit à cette formation');
            } else {
                toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Centre de Formation</h1>
                                <p className="text-xs text-slate-400">Développez vos compétences</p>
                            </div>
                        </div>
                        <a
                            href="/login"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Connexion
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                            Nos <span className="text-blue-400">Formations</span>
                        </h2>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                            Découvrez notre catalogue de formations professionnelles et inscrivez-vous dès maintenant
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="py-4 px-4 sticky top-[73px] z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                                name="categorie"
                                value={filters.categorie}
                                onChange={handleFilterChange}
                                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 appearance-none"
                            >
                                <option value="">Toutes les catégories</option>
                                <option value="Informatique">Informatique</option>
                                <option value="Gestion">Gestion</option>
                                <option value="Design">Design</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Langues">Langues</option>
                                <option value="Soft Skills">Soft Skills</option>
                            </select>
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                name="ville"
                                value={filters.ville}
                                onChange={handleFilterChange}
                                placeholder="Filtrer par ville..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="date"
                                name="date"
                                value={filters.date}
                                onChange={handleFilterChange}
                                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Formations Grid */}
            <section className="py-8 px-4 pb-20">
                <div className="container mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                    ) : filteredFormations.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-slate-400 text-lg">Aucune formation ne correspond à vos critères</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredFormations.map((formation, index) => (
                                <motion.div
                                    key={formation.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all group"
                                >
                                    <div className="p-6 space-y-4">
                                        {/* Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                                                <BookOpen className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold">
                                                <Clock className="w-4 h-4" />
                                                {formation.nombre_heures}h
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {formation.titre}
                                        </h3>

                                        {/* Objectifs */}
                                        <p className="text-sm text-slate-400 line-clamp-3">
                                            {formation.objectifs}
                                        </p>

                                        {/* Categorie */}
                                        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                                            <Target className="w-3.5 h-3.5" />
                                            {formation.categorie || 'SANS CATÉGORIE'}
                                        </div>

                                        {/* Sessions Info */}
                                        {formation.sessions && formation.sessions.length > 0 && (
                                            <div className="pt-2 border-t border-slate-700/50">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Prochaines sessions :</p>
                                                <div className="space-y-2">
                                                    {formation.sessions.slice(0, 2).map((session, idx) => (
                                                        <div key={idx} className="flex items-center justify-between text-xs">
                                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                                <Calendar className="w-3 h-3 text-blue-400" />
                                                                {new Date(session.date_debut).toLocaleDateString()}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                                <MapPin className="w-3 h-3 text-red-400" />
                                                                {session.lieu || 'TBD'}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Prix */}
                                        <div className="flex items-center gap-2 text-green-400 font-bold text-2xl">
                                            <DollarSign className="w-5 h-5" />
                                            {formation.cout} DH
                                        </div>

                                        {/* Button */}
                                        <button
                                            onClick={() => openInscriptionModal(formation)}
                                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            S'inscrire
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Modal d'inscription */}
            {showInscriptionModal && selectedFormation && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-slate-700">
                            <h2 className="text-2xl font-bold text-white">
                                Inscription à la formation
                            </h2>
                            <p className="text-blue-400 font-medium mt-1">{selectedFormation.titre}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                        <User className="w-4 h-4 text-blue-400" />
                                        Prénom *
                                    </label>
                                    <input
                                        type="text"
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                        placeholder="Votre prénom"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                        <User className="w-4 h-4 text-blue-400" />
                                        Nom *
                                    </label>
                                    <input
                                        type="text"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                        placeholder="Votre nom"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                        <Cake className="w-4 h-4 text-blue-400" />
                                        Date de naissance *
                                    </label>
                                    <input
                                        type="date"
                                        name="date_naissance"
                                        value={formData.date_naissance}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                        <MapPin className="w-4 h-4 text-blue-400" />
                                        Ville *
                                    </label>
                                    <input
                                        type="text"
                                        name="ville"
                                        value={formData.ville}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                        placeholder="Votre ville"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                        <Mail className="w-4 h-4 text-blue-400" />
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                        placeholder="votre.email@exemple.com"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                        <Phone className="w-4 h-4 text-blue-400" />
                                        Téléphone *
                                    </label>
                                    <input
                                        type="tel"
                                        name="telephone"
                                        value={formData.telephone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                        placeholder="06XXXXXXXX"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Inscription...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            <span>Confirmer l'inscription</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Accueil;
