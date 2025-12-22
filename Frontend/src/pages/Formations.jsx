import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Plus, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';

const Formations = () => {
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFormations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/formations');
                setFormations(response.data || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Erreur lors du chargement des formations.');
            } finally {
                setLoading(false);
            }
        };

        fetchFormations();
    }, []);

    return (
        <Layout>
            <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">Formations</h1>
                                <p className="text-slate-400 text-sm">
                                    Liste des formations disponibles.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/formations/ajouter')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Ajouter une formation</span>
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="bg-[#020617]/60 border border-[#1e293b] rounded-2xl overflow-hidden overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-[#020617] border-b border-[#1f2937]">
                                <tr>
                                    <th className="text-left px-4 py-3 text-slate-400 font-medium">ID</th>
                                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Titre</th>
                                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Nombre heures</th>
                                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Coût</th>
                                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Objectifs</th>
                                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Programme détaillé</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                                            Chargement des formations...
                                        </td>
                                    </tr>
                                ) : formations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                                            Aucune formation pour le moment.
                                        </td>
                                    </tr>
                                ) : (
                                    formations.map((formation) => (
                                        <tr
                                            key={formation.id}
                                            className="border-t border-[#111827] hover:bg-[#020617] transition-colors"
                                        >
                                            <td className="px-4 py-3 text-slate-300">{formation.id}</td>
                                            <td className="px-4 py-3">{formation.titre}</td>
                                            <td className="px-4 py-3 text-slate-300">{formation.nombre_heures}</td>
                                            <td className="px-4 py-3 text-slate-300">
                                                {Number(formation.cout).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-slate-300 min-w-[200px] max-w-md">
                                                <div className="whitespace-normal break-words">
                                                    {formation.objectifs}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-300 min-w-[300px] max-w-2xl">
                                                <div className="whitespace-normal break-words">
                                                    {formation.programme_detaille?.split('\n')
                                                        .filter(line => line.trim())
                                                        .map((line, idx) => (
                                                            <div key={idx} className="mb-1">
                                                                {line.trim()}
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Formations;
