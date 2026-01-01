import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    Chip,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Rating,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfessionalSidebar from '../components/ProfessionalSidebar';
import ProfessionalHeader from '../components/ProfessionalHeader';
import ProfessionalCalendar from '../components/ProfessionalCalendar';
import ProfessionalCard from '../components/ProfessionalCard';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import EventIcon from '@mui/icons-material/Event';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExploreIcon from '@mui/icons-material/Explore';
import { inscriptionService, evaluationService, formationService, sessionService } from '../services/api';
import Notifications from './Notifications';
import NotificationsIcon from '@mui/icons-material/Notifications';
import dayjs from 'dayjs';

const ParticipantDashboard = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Data States
    const [inscriptions, setInscriptions] = useState([]);
    const [mesEvaluations, setMesEvaluations] = useState([]);
    const [formations, setFormations] = useState([]); // Pour le catalogue
    const [sessions, setSessions] = useState([]);     // Pour le catalogue

    // UI States
    const [stats, setStats] = useState({ total: 0, confirmees: 0, terminees: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Dialog States
    const [evalDialogOpen, setEvalDialogOpen] = useState(false);
    const [catalogueOpen, setCatalogueOpen] = useState(false);

    const [selectedInscription, setSelectedInscription] = useState(null);
    const [evalForm, setEvalForm] = useState({ note: 0, commentaire: '' });

    const isEvaluationsPage = location.pathname.includes('/evaluations');
    const isNotificationsPage = location.pathname.includes('/notifications');

    const menuItems = [
        { path: '/participant', label: 'Mes Formations', icon: <DashboardIcon /> },
        { path: '/participant/evaluations', label: 'Mes Évaluations', icon: <StarIcon /> },
        { path: '/participant/notifications', label: 'Notifications', icon: <NotificationsIcon /> }
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [inscriptionsRes, evaluationsRes, formationsRes, sessionsRes] = await Promise.all([
                inscriptionService.getMesInscriptions(),
                evaluationService.getMesEvaluations(),
                formationService.getAll(),
                sessionService.getAll()
            ]);

            const inscriptionsData = inscriptionsRes.data || [];
            setInscriptions(inscriptionsData);
            setMesEvaluations(evaluationsRes.data || []);
            setFormations(formationsRes.data || []);
            setSessions(sessionsRes.data || []);

            // Stats
            const confirmees = inscriptionsData.filter(i => i.statut === 'confirmee').length;
            const now = new Date();
            const terminees = inscriptionsData.filter(i => i.statut === 'confirmee' && new Date(i.session_date_fin) < now).length;
            setStats({ total: inscriptionsData.length, confirmees, terminees });

        } catch (err) {
            console.error(err);
            setError('Erreur chargement données');
        } finally {
            setLoading(false);
        }
    };

    const handleEvaluer = (inscription) => {
        setSelectedInscription(inscription);
        setEvalDialogOpen(true);
    };

    const handleSubmitEvaluation = async () => {
        try {
            await evaluationService.create({
                inscription_id: selectedInscription.id,
                note: evalForm.note,
                commentaire: evalForm.commentaire
            });
            setSuccess('Évaluation envoyée !');
            setEvalDialogOpen(false);
            setEvalForm({ note: 0, commentaire: '' });
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'évaluation");
        }
    };

    const handleInscription = async (sessionId) => {
        try {
            await inscriptionService.inscrire({ session_id: sessionId });
            setSuccess('Demande d\'inscription envoyée !');
            setCatalogueOpen(false);
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'inscription");
        }
    };

    const handleAnnuler = async (inscriptionId) => {
        if (!window.confirm("Voulez-vous vraiment annuler cette inscription ?")) return;
        try {
            await inscriptionService.annuler(inscriptionId);
            setSuccess('Inscription annulée.');
            loadData();
        } catch (err) {
            setError("Erreur lors de l'annulation");
        }
    };

    // Helpers
    const getStatutColor = (statut) => {
        switch (statut) {
            case 'confirmee': return 'success';
            case 'en_attente': return 'warning';
            case 'annulee': return 'error';
            default: return 'default';
        }
    };
    const isSessionTerminee = (i) => new Date(i.session_date_fin) < new Date();

    // Calendar Events
    const calendarEvents = inscriptions
        .filter(i => i.statut === 'confirmee')
        .map(i => ({
            id: i.id,
            title: i.formation_titre,
            start: i.session_date_debut,
            end: i.session_date_fin,
            color: new Date(i.session_date_fin) < new Date() ? '#6B7280' : '#3282B8'
        }));

    return (
        <Box sx={{ display: 'flex' }}>
            <ProfessionalSidebar open={true} menuItems={menuItems} user={user} title="Dashboard Participant" />

            <Box component="main" sx={{ flexGrow: 1, backgroundColor: '#F4F7FE', minHeight: '100vh', p: 3 }}>
                <Container maxWidth="xl" sx={{ mt: 8 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

                    {/* View: DASHBOARD */}
                    {!isEvaluationsPage && !isNotificationsPage && (
                        <>
                            {/* Header Actions */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<ExploreIcon />}
                                    onClick={() => setCatalogueOpen(true)}
                                    sx={{ backgroundColor: '#0F4C75', '&:hover': { backgroundColor: '#3282B8' } }}
                                >
                                    S'inscrire à une formation
                                </Button>
                            </Box>

                            {/* Stats */}
                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={4}>
                                    <ProfessionalCard icon={<SchoolIcon />}>
                                        <Typography variant="h3" fontWeight={600} color="#1E2A32">{stats.total}</Typography>
                                        <Typography variant="body2" color="text.secondary">Inscriptions</Typography>
                                    </ProfessionalCard>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <ProfessionalCard icon={<EventIcon />}>
                                        <Typography variant="h3" fontWeight={600} color="#1E2A32">{stats.confirmees}</Typography>
                                        <Typography variant="body2" color="text.secondary">Confirmées</Typography>
                                    </ProfessionalCard>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <ProfessionalCard icon={<StarIcon />}>
                                        <Typography variant="h3" fontWeight={600} color="#1E2A32">{stats.terminees}</Typography>
                                        <Typography variant="body2" color="text.secondary">Terminées</Typography>
                                    </ProfessionalCard>
                                </Grid>
                            </Grid>

                            {/* Calendar */}
                            <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Mon Planning</Typography>
                                <ProfessionalCalendar events={calendarEvents} height="400px" />
                            </Paper>

                            {/* Inscriptions List */}
                            <Paper sx={{ p: 3, borderRadius: '12px' }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Mes Inscriptions</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {inscriptions.length === 0 ? (
                                        <Typography color="text.secondary" align="center">Aucune inscription.</Typography>
                                    ) : (
                                        inscriptions.map(inscription => (
                                            <Paper key={inscription.id} elevation={0} sx={{ p: 2, bgcolor: '#F9FAFB', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={600}>{inscription.formation_titre}</Typography>
                                                    <Typography variant="body2">
                                                        {dayjs(inscription.session_date_debut).format('DD/MM/YYYY')} - {dayjs(inscription.session_date_fin).format('DD/MM/YYYY')}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">Avec {inscription.formateur_nom}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    <Chip label={inscription.statut} color={getStatutColor(inscription.statut)} size="small" />

                                                    {inscription.statut === 'en_attente' && (
                                                        <Button size="small" color="error" onClick={() => handleAnnuler(inscription.id)}>
                                                            Annuler
                                                        </Button>
                                                    )}

                                                    {inscription.statut === 'confirmee' && !inscription.a_evalue && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            color="success"
                                                            startIcon={<StarIcon />}
                                                            onClick={() => handleEvaluer(inscription)}
                                                            sx={{ ml: 1 }}
                                                        >
                                                            Évaluer
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Paper>
                                        ))
                                    )}
                                </Box>
                            </Paper>
                        </>
                    )}

                    {/* View: EVALUATIONS */}
                    {isEvaluationsPage && (
                        <Paper sx={{ p: 3, borderRadius: '12px' }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Historique de mes évaluations</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {mesEvaluations.map(e => (
                                    <Box key={e.id} sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: '8px' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography fontWeight={500}>{e.formation_titre}</Typography>
                                            <Rating value={e.note} readOnly size="small" />
                                        </Box>
                                        <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>"{e.commentaire}"</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    )}

                    {/* View: NOTIFICATIONS */}
                    {isNotificationsPage && <Notifications />}

                    {/* Dialog Catalogue */}
                    <Dialog open={catalogueOpen} onClose={() => setCatalogueOpen(false)} maxWidth="md" fullWidth>
                        <DialogTitle>Catalogue des Formations</DialogTitle>
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                                {formations.map(formation => {
                                    // Trouver les sessions futures pour cette formation
                                    const futureSessions = sessions.filter(s =>
                                        s.formation_id === formation.id &&
                                        new Date(s.date_debut) > new Date()
                                    );

                                    return (
                                        <Accordion key={formation.id} disableGutters elevation={0} sx={{ border: '1px solid #E5E7EB' }}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Box>
                                                    <Typography fontWeight={600}>{formation.titre}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{formation.categorie} - {formation.duree}h - {formation.level}</Typography>
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography variant="body2" paragraph>{formation.description}</Typography>
                                                <Typography variant="subtitle2" gutterBottom>Sessions disponibles :</Typography>
                                                {futureSessions.length === 0 ? (
                                                    <Typography variant="caption" color="text.secondary">Aucune session programmée</Typography>
                                                ) : (
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                        {futureSessions.map(session => (
                                                            <Box key={session.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: '#F0F9FF', borderRadius: 1 }}>
                                                                <Typography variant="body2">
                                                                    Du {dayjs(session.date_debut).format('DD/MM/YYYY')} au {dayjs(session.date_fin).format('DD/MM/YYYY')} à {session.lieu}
                                                                </Typography>
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    onClick={() => handleInscription(session.id)}
                                                                    disabled={inscriptions.some(i => i.session_id === session.id)}
                                                                >
                                                                    {inscriptions.some(i => i.session_id === session.id) ? 'Déjà Inscrit' : "S'inscrire"}
                                                                </Button>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                )}
                                            </AccordionDetails>
                                        </Accordion>
                                    );
                                })}
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setCatalogueOpen(false)}>Fermer</Button>
                        </DialogActions>
                    </Dialog>

                    {/* Dialog Eval */}
                    <Dialog open={evalDialogOpen} onClose={() => setEvalDialogOpen(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>Évaluer la formation</DialogTitle>
                        <DialogContent>
                            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Rating
                                    value={evalForm.note}
                                    onChange={(e, v) => setEvalForm({ ...evalForm, note: v })}
                                    size="large"
                                />
                                <TextField
                                    label="Commentaire"
                                    multiline rows={3}
                                    value={evalForm.commentaire}
                                    onChange={e => setEvalForm({ ...evalForm, commentaire: e.target.value })}
                                    fullWidth
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEvalDialogOpen(false)}>Annuler</Button>
                            <Button onClick={handleSubmitEvaluation} variant="contained" disabled={evalForm.note === 0}>Envoyer</Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </Box>
    );
};

export default ParticipantDashboard;
