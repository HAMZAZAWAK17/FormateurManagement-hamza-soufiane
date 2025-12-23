import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BookOpen, Clock, DollarSign, Target, FileText, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';

const AjouterFormation = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        titre: '',
        nombre_heures: '',
        cout: '',
        objectifs: '',
        programme_detaille: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.post('http://localhost:5000/api/formations', {
                ...formData,
                nombre_heures: parseInt(formData.nombre_heures),
                cout: parseFloat(formData.cout)
            });

            toast.success('Formation ajoutée avec succès !');
            setTimeout(() => navigate('/formations'), 1500);
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
                    <p className="text-slate-500 dark:text-slate-400">Section réservée aux administrateurs.</p>
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
                                Nouvelle <span className="text-emerald-600 dark:text-emerald-400">Formation</span>
                            </h1>
                            <p className="text-slate-500 font-medium">Créez un nouveau programme pédagogique</p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-[#1e293b]/50 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200 dark:border-[#334155]/50 shadow-xl shadow-slate-200/50 dark:shadow-none"
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                    <BookOpen className="w-4 h-4 text-blue-500" />
                                    Titre de la formation
                                </label>
                                <input
                                    type="text"
                                    name="titre"
                                    value={formData.titre}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white px-5 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="Ex: Expert React & Next.js"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                        <Clock className="w-4 h-4 text-emerald-500" />
                                        Nombre d'heures
                                    </label>
                                    <input
                                        type="number"
                                        name="nombre_heures"
                                        value={formData.nombre_heures}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white px-5 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="Ex: 40"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                        <DollarSign className="w-4 h-4 text-amber-500" />
                                        Coût total (€)
                                    </label>
                                    <input
                                        type="number"
                                        name="cout"
                                        value={formData.cout}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white px-5 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                    <Target className="w-4 h-4 text-red-500" />
                                    Objectifs pédagogiques
                                </label>
                                <textarea
                                    name="objectifs"
                                    value={formData.objectifs}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white px-5 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none"
                                    placeholder="Qu'est-ce que l'étudiant saura faire ?"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                    <FileText className="w-4 h-4 text-indigo-500" />
                                    Programme détaillé
                                </label>
                                <textarea
                                    name="programme_detaille"
                                    value={formData.programme_detaille}
                                    onChange={handleChange}
                                    rows="6"
                                    className="w-full bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white px-5 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none"
                                    placeholder="Détaillez les modules de la formation..."
                                    required
                                />
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
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-600/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Enregistrer la formation</span>
                                            <CheckCircle className="w-5 h-5" />
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

export default AjouterFormation;
