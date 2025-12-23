import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { User, Mail, Tag, MessageSquare, ArrowLeft, CheckCircle, AlertCircle, UserPlus, Key } from 'lucide-react';
import Layout from '../components/Layout';

const AjouterFormateur = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        mots_cles: '',
        remarques: '',
        createAccount: true,
        password: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.post('http://localhost:5000/api/formateurs', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Formateur ajouté avec succès !');
            setTimeout(() => navigate('/formateurs'), 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout.');
        } finally {
            setIsLoading(false);
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center transition-colors">
                <div className="text-center p-8 bg-white dark:bg-[#1e293b] rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Accès refusé</h2>
                    <p className="text-slate-500 dark:text-slate-400">Vous devez être administrateur pour cette action.</p>
                </div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="p-4 md:p-8 space-y-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-3 bg-white dark:bg-[#1e293b] text-slate-600 dark:text-slate-400 rounded-xl hover:text-blue-600 dark:hover:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-800 transition-all"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white">
                                Ajouter un <span className="text-blue-600 dark:text-blue-400">Formateur</span>
                            </h1>
                            <p className="text-slate-500 font-medium">Enregistrez un nouveau membre pédagogique</p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-[#1e293b]/50 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200 dark:border-[#334155]/50 shadow-xl shadow-slate-200/50 dark:shadow-none"
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                        <User className="w-4 h-4 text-blue-500" />
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white px-5 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                        placeholder="Ex: Jean"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                        <User className="w-4 h-4 text-blue-500" />
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white px-5 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                        placeholder="Ex: Dupont"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                    <Mail className="w-4 h-4 text-emerald-500" />
                                    Email Professionnel
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white px-5 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="Ex: jean.dupont@email.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                    <Tag className="w-4 h-4 text-amber-500" />
                                    Mots clés (Compétences)
                                </label>
                                <input
                                    type="text"
                                    name="mots_cles"
                                    value={formData.mots_cles}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white px-5 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                    placeholder="Ex: React, Node.js, PHP, Gestion de projet"
                                    required
                                />
                                <p className="text-xs text-slate-500 font-medium mt-2 ml-1">Séparez les compétences par des virgules.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                                    Remarques additionnelles
                                </label>
                                <textarea
                                    name="remarques"
                                    value={formData.remarques}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white px-5 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-400"
                                    placeholder="Informations complémentaires sur le formateur..."
                                />
                            </div>

                            <div className="p-6 bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 rounded-3xl space-y-6">
                                <div className="flex items-center gap-4 cursor-pointer">
                                    <div className="relative inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            id="createAccount"
                                            name="createAccount"
                                            checked={formData.createAccount}
                                            onChange={handleChange}
                                            className="w-6 h-6 rounded-lg border-slate-300 dark:border-[#334155] bg-white dark:bg-[#0f172a] text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                                        />
                                    </div>
                                    <label htmlFor="createAccount" className="text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                                        Créer automatiquement un compte utilisateur
                                    </label>
                                </div>

                                {formData.createAccount && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-3 pt-2"
                                    >
                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 ml-1">
                                            <Key className="w-4 h-4 text-blue-500" />
                                            Mot de passe temporaire
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full bg-white dark:bg-[#0f172a]/50 border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white px-5 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                            placeholder="Par défaut: formateur123"
                                        />
                                    </motion.div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="flex-1 bg-slate-100 dark:bg-[#334155] hover:bg-slate-200 dark:hover:bg-[#475569] text-slate-700 dark:text-white font-bold py-4 rounded-2xl transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Confirmer l'ajout</span>
                                            <UserPlus className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default AjouterFormateur;
