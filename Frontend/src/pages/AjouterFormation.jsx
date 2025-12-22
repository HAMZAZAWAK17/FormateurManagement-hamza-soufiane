import { useState } from 'react';
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
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        titre: '',
        nombre_heures: '',
        cout: '',
        objectifs: '',
        programme_detaille: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/formations', {
                ...formData,
                nombre_heures: parseInt(formData.nombre_heures),
                cout: parseFloat(formData.cout)
            });

            setSuccess(true);
            setFormData({
                titre: '',
                nombre_heures: '',
                cout: '',
                objectifs: '',
                programme_detaille: ''
            });

            setTimeout(() => {
                navigate('/formations');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'ajout de la formation.');
        } finally {
            setIsLoading(false);
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Accès refusé</h2>
                    <p className="text-slate-400">Vous devez être administrateur pour accéder à cette page.</p>
                </div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => navigate('/formations')}
                            className="p-2 hover:bg-[#1e293b] rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            Ajouter une Formation
                        </h1>
                    </div>

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3 mb-6"
                        >
                            <CheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0" />
                            <p className="text-emerald-500 text-sm font-semibold">
                                Formation ajoutée avec succès ! Redirection en cours...
                            </p>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 mb-6"
                        >
                            <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
                            <p className="text-red-500 text-sm font-semibold">{error}</p>
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1e293b]/50 backdrop-blur-2xl p-8 rounded-3xl border border-[#334155]/50"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                                    <BookOpen className="w-4 h-4 text-blue-400" />
                                    Titre de la formation
                                </label>
                                <input
                                    type="text"
                                    name="titre"
                                    value={formData.titre}
                                    onChange={handleChange}
                                    className="w-full bg-[#0f172a]/50 border border-[#334155]/50 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Ex: Formation en Développement Web"
                                    required
                                />
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                                        <Clock className="w-4 h-4 text-emerald-400" />
                                        Nombre d'heures
                                    </label>
                                    <input
                                        type="number"
                                        name="nombre_heures"
                                        value={formData.nombre_heures}
                                        onChange={handleChange}
                                        className="w-full bg-[#0f172a]/50 border border-[#334155]/50 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Ex: 40"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                                        <DollarSign className="w-4 h-4 text-yellow-400" />
                                        Coût (€)
                                    </label>
                                    <input
                                        type="number"
                                        name="cout"
                                        value={formData.cout}
                                        onChange={handleChange}
                                        className="w-full bg-[#0f172a]/50 border border-[#334155]/50 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Ex: 500"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                                    <Target className="w-4 h-4 text-red-400" />
                                    Objectifs
                                </label>
                                <textarea
                                    name="objectifs"
                                    value={formData.objectifs}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full bg-[#0f172a]/50 border border-[#334155]/50 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-none"
                                    placeholder="Décrivez les objectifs pédagogiques de la formation..."
                                    required
                                />
                            </div>

                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                                    <FileText className="w-4 h-4 text-indigo-400" />
                                    Programme détaillé
                                </label>
                                <textarea
                                    name="programme_detaille"
                                    value={formData.programme_detaille}
                                    onChange={handleChange}
                                    rows="8"
                                    className="w-full bg-[#0f172a]/50 border border-[#334155]/50 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-none"
                                    placeholder="Détaillez le programme de la formation, les modules, les sujets abordés..."
                                    required
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="flex-1 bg-[#334155] hover:bg-[#475569] text-white font-bold py-3 rounded-xl transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/25 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Ajouter la formation</span>
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
