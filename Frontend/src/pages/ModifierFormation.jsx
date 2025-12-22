import { useState, useEffect } from 'react';
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
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        titre: '',
        nombre_heures: '',
        cout: '',
        objectifs: '',
        programme_detaille: ''
    });

    useEffect(() => {
        // Redirection si non admin
        if (user?.role !== 'admin') {
            navigate('/');
            return;
        }

        // Charger les données de la formation
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
                setError('Erreur lors du chargement de la formation.');
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
        setError('');

        try {
            await axios.put(`http://localhost:5000/api/formations/${id}`, formData);

            setSuccess(true);
            setTimeout(() => {
                navigate('/formations');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la modification de la formation.');
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center py-12">
                            <div className="text-slate-400">Chargement...</div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => navigate('/formations')}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Retour
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Modifier une Formation</h1>
                            <p className="text-slate-400 text-sm mt-1">Modifiez les informations de la formation</p>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <span className="text-red-200">{error}</span>
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl flex items-center gap-3"
                        >
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-green-200">Formation modifiée avec succès !</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-[#020617]/60 border border-[#1e293b] rounded-2xl p-6 md:p-8 space-y-6">
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
                                        placeholder="Ex: 350.00"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                                    <Target className="w-4 h-4 text-pink-400" />
                                    Objectifs
                                </label>
                                <textarea
                                    name="objectifs"
                                    value={formData.objectifs}
                                    onChange={handleChange}
                                    className="w-full bg-[#0f172a]/50 border border-[#334155]/50 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-none"
                                    placeholder="Ex: Comprendre les bases du développement web..."
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                                    <FileText className="w-4 h-4 text-cyan-400" />
                                    Programme détaillé
                                </label>
                                <textarea
                                    name="programme_detaille"
                                    value={formData.programme_detaille}
                                    onChange={handleChange}
                                    className="w-full bg-[#0f172a]/50 border border-[#334155]/50 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-none"
                                    placeholder="Ex: Module 1 : Introduction&#10;Module 2 : HTML & CSS&#10;Module 3 : JavaScript..."
                                    rows="8"
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-2">Séparez chaque module/ligne par un retour à la ligne (Entrée)</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/formations')}
                                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Enregistrer les modifications
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default ModifierFormation;
