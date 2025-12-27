import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Star, MessageSquare, User, BookOpen, Calendar } from 'lucide-react';

const ListeEvaluations = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvaluations();
    }, []);

    const fetchEvaluations = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/evaluations');
            setEvaluations(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors du chargement des évaluations", error);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    // Calculer la moyenne globale d'une évaluation
    const calculateAverage = (ev) => {
        return ((ev.qualite_pedagogique + ev.rythme + ev.support_cours + ev.maitrise_sujet) / 4).toFixed(1);
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                    <Star className="mr-3 text-yellow-500" />
                    Évaluations reçues
                </h1>

                {loading ? (
                    <div className="text-center py-10">Chargement...</div>
                ) : evaluations.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg shadow">
                        Aucune évaluation pour le moment.
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {evaluations.map((ev) => (
                            <div key={ev.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-100">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar size={16} className="mr-1" />
                                            {formatDate(ev.created_at)}
                                        </div>
                                        <div className="flex items-center bg-blue-50 px-2 py-1 rounded-lg text-blue-700 font-bold">
                                            <Star size={16} className="mr-1 fill-blue-700" />
                                            {calculateAverage(ev)}/5
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-lg text-gray-800 mb-1 flex items-center">
                                        <BookOpen size={18} className="mr-2 text-gray-400" />
                                        {ev.formation_titre}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 flex items-center">
                                        <User size={16} className="mr-2 text-gray-400" />
                                        Formateur : {ev.formateur_prenom} {ev.formateur_nom}
                                    </p>

                                    <div className="border-t border-gray-100 pt-4">
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                                            <div>Pédagogie: <span className="font-semibold">{ev.qualite_pedagogique}/5</span></div>
                                            <div>Rythme: <span className="font-semibold">{ev.rythme}/5</span></div>
                                            <div>Support: <span className="font-semibold">{ev.support_cours}/5</span></div>
                                            <div>Maîtrise: <span className="font-semibold">{ev.maitrise_sujet}/5</span></div>
                                        </div>

                                        {ev.commentaire && (
                                            <div className="bg-gray-50 p-3 rounded-lg text-gray-700 text-sm italic relative">
                                                <MessageSquare size={16} className="absolute top-2 left-2 text-gray-300" />
                                                <span className="pl-6 block">"{ev.commentaire}"</span>
                                            </div>
                                        )}

                                        <div className="mt-3 text-xs text-gray-400 text-right">
                                            De : {ev.participant_email || 'Anonyme'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ListeEvaluations;
