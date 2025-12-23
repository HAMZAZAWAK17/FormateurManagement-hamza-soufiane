import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BookOpen, Clock, DollarSign, Target, FileText, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';

const ModifierFormation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        titre: '',
        nombre_heures: '',
        cout: '',
        objectifs: '',
        programme_detaille: ''
    });

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchFormation = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/formations/${id}`);
                setFormData({
                    titre: response.data.titre || '',
                    nombre_heures: response.data.nombre_heures || '',
                    cout: response.data.cout || '',
                    objectifs: response.data.objectifs || '',
                    programme_detaille: response.data.programme_detaille || ''
                });
            } catch (err) {
                toast.error('Erreur lors du chargement.');
            } finally {
                setLoading(false);
            }
        };

        fetchFormation();
    }, [id, user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.put(`http://localhost:5000/api/formations/${id}`, formData);
            toast.success('Formation mise à jour !');
            setTimeout(() => navigate('/formations'), 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour.');
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold animate-pulse">Chargement des données...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-4 md:p-8 space-y-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => navigate('/formations')}
                            className="p-3 bg-white dark:bg-[#1e293b] text-slate-600 dark:text-slate-400 rounded-xl hover:text-blue-600 dark:hover:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-800 transition-all"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white">
                                Modifier <span className="text-blue-600 dark:text-blue-400">Formation</span>
                            </h1>
                            <p className="text-slate-500 font-medium tracking-tight">ID: #{id} • Mise à jour des informations</p>
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
                                    className="w-full bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white px-5 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                        <Clock className="w-4 h-4 text-emerald-500" />
                                        Heures
                                    </label>
                                    <input
                                        type="number"
                                        name="nombre_heures"
                                        value={formData.nombre_heures}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white px-5 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                        <DollarSign className="w-4 h-4 text-amber-500" />
                                        Coût (€)
                                    </label>
                                    <input
                                        type="number"
                                        name="cout"
                                        value={formData.cout}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white px-5 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                    <Target className="w-4 h-4 text-red-500" />
                                    Objectifs
                                </label>
                                <textarea
                                    name="objectifs"
                                    value={formData.objectifs}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white px-5 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                                    <FileText className="w-4 h-4 text-indigo-500" />
                                    Programme
                                </label>
                                <textarea
                                    name="programme_detaille"
                                    value={formData.programme_detaille}
                                    onChange={handleChange}
                                    rows="6"
                                    className="w-full bg-slate-50 dark:bg-[#0f172a]/50 border border-slate-200 dark:border-[#334155]/50 text-slate-900 dark:text-white px-5 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none"
                                    required
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/formations')}
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
                                            <span>Enregistrer les modifications</span>
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

export default ModifierFormation;
