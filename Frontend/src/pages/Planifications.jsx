import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Planifications.css';

const API_URL = 'http://localhost:5000/api';

const Planifications = () => {
    const navigate = useNavigate();
    const [planifications, setPlanifications] = useState([]);
    const [formations, setFormations] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [entreprises, setEntreprises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentPlanification, setCurrentPlanification] = useState(null);
    const [filter, setFilter] = useState('all');
    const [stats, setStats] = useState(null);

    const [formData, setFormData] = useState({
        formation_id: '',
        formateur_id: '',
        entreprise_id: '',
        date_debut: '',
        date_fin: '',
        horaire_debut: '09:00',
        horaire_fin: '17:00',
        remarques: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const [planifRes, formationsRes, formateursRes, entreprisesRes, statsRes] = await Promise.all([
                axios.get(`${API_URL}/planifications`, config),
                axios.get(`${API_URL}/formations`, config),
                axios.get(`${API_URL}/formateurs`, config),
                axios.get(`${API_URL}/entreprises`, config),
                axios.get(`${API_URL}/planifications/stats`, config)
            ]);

            setPlanifications(planifRes.data);
            setFormations(formationsRes.data);
            setFormateurs(formateursRes.data);
            setEntreprises(entreprisesRes.data);
            setStats(statsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            if (editMode) {
                await axios.put(`${API_URL}/planifications/${currentPlanification.id}`, formData, config);
            } else {
                await axios.post(`${API_URL}/planifications`, formData, config);
            }

            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            if (error.response?.status === 409) {
                alert('Conflit de disponibilité : ' + error.response.data.message);
            } else {
                alert('Erreur lors de la sauvegarde de la planification');
            }
        }
    };

    const handleEdit = (planification) => {
        setCurrentPlanification(planification);
        setFormData({
            formation_id: planification.formation_id,
            formateur_id: planification.formateur_id,
            entreprise_id: planification.entreprise_id,
            date_debut: planification.date_debut.split('T')[0],
            date_fin: planification.date_fin.split('T')[0],
            horaire_debut: planification.horaire_debut,
            horaire_fin: planification.horaire_fin,
            remarques: planification.remarques || ''
        });
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette planification ?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/planifications/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchData();
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                alert('Erreur lors de la suppression de la planification');
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/planifications/${id}`,
                { statut: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
        } catch (error) {
            console.error('Erreur lors du changement de statut:', error);
            alert('Erreur lors du changement de statut');
        }
    };

    const resetForm = () => {
        setFormData({
            formation_id: '',
            formateur_id: '',
            entreprise_id: '',
            date_debut: '',
            date_fin: '',
            horaire_debut: '09:00',
            horaire_fin: '17:00',
            remarques: ''
        });
        setEditMode(false);
        setCurrentPlanification(null);
    };

    const openModal = () => {
        resetForm();
        setShowModal(true);
    };

    const getStatusBadge = (statut) => {
        const badges = {
            'planifiee': { text: 'Planifiée', class: 'status-planifiee' },
            'en_cours': { text: 'En cours', class: 'status-en-cours' },
            'terminee': { text: 'Terminée', class: 'status-terminee' },
            'annulee': { text: 'Annulée', class: 'status-annulee' }
        };
        const badge = badges[statut] || { text: statut, class: '' };
        return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
    };

    const filteredPlanifications = planifications.filter(p => {
        if (filter === 'all') return true;
        return p.statut === filter;
    });

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="planifications-container">
            <div className="planifications-header">
                <div>
                    <h1>📅 Planification des Formations</h1>
                    <p className="subtitle">Gérez les planifications de formations avec les formateurs et entreprises</p>
                </div>
                <button className="btn-primary" onClick={openModal}>
                    ➕ Nouvelle Planification
                </button>
            </div>

            {/* Statistiques */}
            {stats && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-info">
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Total</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📋</div>
                        <div className="stat-info">
                            <div className="stat-value">{stats.planifiees}</div>
                            <div className="stat-label">Planifiées</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-info">
                            <div className="stat-value">{stats.en_cours}</div>
                            <div className="stat-label">En cours</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <div className="stat-value">{stats.terminees}</div>
                            <div className="stat-label">Terminées</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filtres */}
            <div className="filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Toutes
                </button>
                <button
                    className={`filter-btn ${filter === 'planifiee' ? 'active' : ''}`}
                    onClick={() => setFilter('planifiee')}
                >
                    Planifiées
                </button>
                <button
                    className={`filter-btn ${filter === 'en_cours' ? 'active' : ''}`}
                    onClick={() => setFilter('en_cours')}
                >
                    En cours
                </button>
                <button
                    className={`filter-btn ${filter === 'terminee' ? 'active' : ''}`}
                    onClick={() => setFilter('terminee')}
                >
                    Terminées
                </button>
            </div>

            {/* Liste des planifications */}
            <div className="planifications-grid">
                {filteredPlanifications.length === 0 ? (
                    <div className="no-data">
                        <p>Aucune planification trouvée</p>
                    </div>
                ) : (
                    filteredPlanifications.map(planif => (
                        <div key={planif.id} className="planification-card">
                            <div className="card-header">
                                <h3>{planif.formation_titre}</h3>
                                {getStatusBadge(planif.statut)}
                            </div>

                            <div className="card-body">
                                <div className="info-row">
                                    <span className="icon">👨‍🏫</span>
                                    <span><strong>Formateur:</strong> {planif.formateur_prenom} {planif.formateur_nom}</span>
                                </div>
                                <div className="info-row">
                                    <span className="icon">🏢</span>
                                    <span><strong>Entreprise:</strong> {planif.entreprise_nom}</span>
                                </div>
                                <div className="info-row">
                                    <span className="icon">📅</span>
                                    <span><strong>Période:</strong> {new Date(planif.date_debut).toLocaleDateString('fr-FR')} - {new Date(planif.date_fin).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="info-row">
                                    <span className="icon">⏰</span>
                                    <span><strong>Horaires:</strong> {planif.horaire_debut} - {planif.horaire_fin}</span>
                                </div>
                                {planif.remarques && (
                                    <div className="info-row">
                                        <span className="icon">📝</span>
                                        <span><strong>Remarques:</strong> {planif.remarques}</span>
                                    </div>
                                )}
                            </div>

                            <div className="card-footer">
                                <div className="status-actions">
                                    <select
                                        value={planif.statut}
                                        onChange={(e) => handleStatusChange(planif.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="planifiee">Planifiée</option>
                                        <option value="en_cours">En cours</option>
                                        <option value="terminee">Terminée</option>
                                        <option value="annulee">Annulée</option>
                                    </select>
                                </div>
                                <div className="card-actions">
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(planif)}
                                    >
                                        ✏️ Modifier
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(planif.id)}
                                    >
                                        🗑️ Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editMode ? '✏️ Modifier la planification' : '➕ Nouvelle planification'}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Formation *</label>
                                    <select
                                        name="formation_id"
                                        value={formData.formation_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Sélectionner une formation</option>
                                        {formations.map(f => (
                                            <option key={f.id} value={f.id}>
                                                {f.titre} ({f.nombre_heures}h - {f.cout}€)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Formateur *</label>
                                    <select
                                        name="formateur_id"
                                        value={formData.formateur_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Sélectionner un formateur</option>
                                        {formateurs.map(f => (
                                            <option key={f.id} value={f.id}>
                                                {f.prenom} {f.nom} - {f.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Entreprise *</label>
                                    <select
                                        name="entreprise_id"
                                        value={formData.entreprise_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Sélectionner une entreprise</option>
                                        {entreprises.map(e => (
                                            <option key={e.id} value={e.id}>
                                                {e.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Date de début *</label>
                                    <input
                                        type="date"
                                        name="date_debut"
                                        value={formData.date_debut}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Date de fin *</label>
                                    <input
                                        type="date"
                                        name="date_fin"
                                        value={formData.date_fin}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Horaire de début *</label>
                                    <input
                                        type="time"
                                        name="horaire_debut"
                                        value={formData.horaire_debut}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Horaire de fin *</label>
                                    <input
                                        type="time"
                                        name="horaire_fin"
                                        value={formData.horaire_fin}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Remarques</label>
                                    <textarea
                                        name="remarques"
                                        value={formData.remarques}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Remarques ou notes supplémentaires..."
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editMode ? 'Mettre à jour' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Planifications;
