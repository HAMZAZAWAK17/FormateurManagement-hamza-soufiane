import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Building2, Mail, Phone, Globe, MapPin, ArrowLeft, Save } from 'lucide-react';
import Layout from '../components/Layout';

const AjouterEntreprise = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: '',
        adresse: '',
        telephone: '',
        url: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('http://localhost:5000/api/entreprises', formData);
            toast.success('Entreprise ajoutée avec succès !');
            navigate('/entreprises');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'entreprise.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/entreprises')}
                        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-400" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Ajouter une entreprise</h1>
                            <p className="text-sm text-slate-400">Créer une nouvelle entreprise cliente</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nom */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Nom de l'entreprise <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
                                    placeholder="Ex: Tech Solutions SARL"
                                />
                            </div>
                        </div>

                        {/* Adresse */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Adresse <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <textarea
                                    name="adresse"
                                    value={formData.adresse}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors resize-none"
                                    placeholder="123 Rue de l'Innovation, 75001 Paris, France"
                                />
                            </div>
                        </div>

                        {/* Téléphone et Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Téléphone */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Téléphone <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="tel"
                                        name="telephone"
                                        value={formData.telephone}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
                                        placeholder="+33 1 23 45 67 89"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
                                        placeholder="contact@techsolutions.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* URL */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Site Web (optionnel)
                            </label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
                                    placeholder="https://www.techsolutions.com"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-700/50">
                            <button
                                type="button"
                                onClick={() => navigate('/entreprises')}
                                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Ajout en cours...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Ajouter l'entreprise</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </Layout>
    );
};

export default AjouterEntreprise;
