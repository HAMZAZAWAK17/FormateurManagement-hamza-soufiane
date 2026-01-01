import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Alert,
    Chip,
    Tabs,
    Tab,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    InputAdornment,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Badge,
    Divider
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfessionalSidebar from '../components/ProfessionalSidebar';
import ProfessionalCalendar from '../components/ProfessionalCalendar';
import ProfessionalTable from '../components/ProfessionalTable';
import ProfessionalCard from '../components/ProfessionalCard';

// Icons
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import LinkIcon from '@mui/icons-material/Link';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DeleteIcon from '@mui/icons-material/Delete';

import { sessionService, evaluationService, formateurService } from '../services/api';
import dayjs from 'dayjs';
import Notifications from './Notifications';

const FormateurDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState(0);

    // Data States
    const [sessions, setSessions] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const [myFormations, setMyFormations] = useState([]);
    const [myStudents, setMyStudents] = useState([]);
    const [stats, setStats] = useState({ totalSessions: 0, nextSession: null, avgNote: 0, totalStudents: 0 });
    const [notifications, setNotifications] = useState([]);

    // UI States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Resources Dialog States
    const [resourceDialogOpen, setResourceDialogOpen] = useState(false); // Add Resource Form
    const [viewResourceDialogOpen, setViewResourceDialogOpen] = useState(false); // List Resources
    const [selectedFormationId, setSelectedFormationId] = useState(null);
    const [currentResources, setCurrentResources] = useState([]);
    const [resourceForm, setResourceForm] = useState({ titre: '', type: 'PDF', url: '', description: '' });

    // ...

    const menuItems = [
        { path: '?tab=0', label: 'Dashboard', icon: <DashboardIcon /> },
        { path: '?tab=1', label: 'Mes Formations', icon: <SchoolIcon /> },
        { path: '?tab=2', label: 'Mes Étudiants', icon: <GroupIcon /> },
        { path: '?tab=3', label: 'Évaluations', icon: <StarIcon /> },
        { path: '?tab=4', label: 'Notifications', icon: <NotificationsActiveIcon /> }
    ];

    useEffect(() => {
        if (user) loadData();
    }, [user]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [sessionsRes, evaluationsRes, formationsRes, studentsRes] = await Promise.all([
                sessionService.getByFormateur(user.id),
                evaluationService.getByFormateur(user.id),
                formateurService.getMyFormations(user.id),
                formateurService.getMyStudents(user.id)
            ]);

            const sData = sessionsRes.data || [];
            const eData = evaluationsRes.data || [];
            const fData = formationsRes.data || [];
            const stData = studentsRes.data || [];

            setSessions(sData);
            setEvaluations(eData);
            setMyFormations(fData);
            setMyStudents(stData);

            // Stats Logic
            const futureSessions = sData.filter(s => new Date(s.date_debut) > new Date());
            const notes = eData.map(e => e.note);
            const avg = notes.length ? (notes.reduce((a, b) => a + b, 0) / notes.length).toFixed(1) : 0;

            setStats({
                totalSessions: sData.length,
                nextSession: futureSessions[0],
                avgNote: avg,
                totalStudents: stData.length
            });

            // Notifications Logic (Inscrits depuis moins de 3 jours)
            const recent = stData.filter(s => dayjs(s.date_inscription).isAfter(dayjs().subtract(3, 'day')));
            setNotifications(recent);

        } catch (err) {
            console.error(err);
            setError('Erreur de chargement des données.');
        } finally {
            setLoading(false);
        }
    };

    // --- Tab Change Handler ---
    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    // --- Resources Handlers ---
    const handleOpenResources = async (formationId) => {
        setSelectedFormationId(formationId);
        try {
            const res = await formateurService.getRessources(formationId);
            setCurrentResources(res.data);
            setViewResourceDialogOpen(true);
        } catch (err) {
            setError('Impossible de charger les ressources.');
        }
    };

    const handleAddResource = async () => {
        try {
            await formateurService.addRessource({ ...resourceForm, formation_id: selectedFormationId });
            setSuccess('Ressource ajoutée !');
            setResourceDialogOpen(false);
            setResourceForm({ titre: '', type: 'PDF', url: '', description: '' });
            // Reload list
            const res = await formateurService.getRessources(selectedFormationId);
            setCurrentResources(res.data);
        } catch (err) {
            setError("Erreur d'ajout.");
        }
    };

    const handleDeleteResource = async (id) => {
        try {
            await formateurService.deleteRessource(id);
            const res = await formateurService.getRessources(selectedFormationId);
            setCurrentResources(res.data);
        } catch (err) {
            setError('Erreur de suppression.');
        }
    };

    // --- Render Helpers ---

    const calendarEvents = sessions.map(session => ({
        id: session.id,
        title: session.formation_titre || 'Formation',
        start: session.date_debut,
        end: session.date_fin,
        color: new Date(session.date_fin) < new Date() ? '#6B7280' : '#0F4C75'
    }));

    const formationColumns = [
        { id: 'titre', label: 'Titre' },
        { id: 'categorie', label: 'Catégorie' },
        { id: 'heures', label: 'Durée', render: r => `${r.heures}h` },
        {
            id: 'actions',
            label: 'Ressources',
            render: (r) => (
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DescriptionIcon />}
                    onClick={() => handleOpenResources(r.id)}
                >
                    Gérer
                </Button>
            )
        }
    ];

    const studentColumns = [
        { id: 'nom', label: 'Étudiant', render: r => `${r.prenom} ${r.nom}` },
        { id: 'email', label: 'Email' },
        { id: 'formation_titre', label: 'Formation Inscrite' },
        { id: 'date_inscription', label: 'Date', render: r => dayjs(r.date_inscription).format('DD/MM/YYYY') },
        { id: 'statut', label: 'Statut', render: r => <Chip label={r.statut} color="success" size="small" /> }
    ];

    if (!user) return null;

    return (
        <Box sx={{ display: 'flex' }}>
            <ProfessionalSidebar
                open={true}
                menuItems={menuItems}
                user={user}
                title="Espace Formateur"
                onNavigate={(path) => {
                    // Quick fix to handle tab navigation via sidebar if needed, 
                    // though Tabs are better for internal views. 
                    // Parsing param ?tab=X 
                    const t = parseInt(path.split('=')[1]);
                    if (!isNaN(t)) setCurrentTab(t);
                }}
            />

            <Box component="main" sx={{ flexGrow: 1, backgroundColor: '#F3F4F6', minHeight: '100vh', p: 3, display: 'flex', flexDirection: 'column' }}>
                <Container maxWidth="xl" sx={{ mt: 8 }}>

                    {/* Header Messages */}
                    {notifications.length > 0 && (
                        <Alert severity="info" icon={<NotificationsActiveIcon />} sx={{ mb: 3 }}>
                            Vous avez {notifications.length} nouvelles inscriptions ces 3 derniers jours ! Checkez l'onglet "Mes Étudiants".
                        </Alert>
                    )}

                    {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

                    {/* Main Content Area */}
                    <Paper sx={{ width: '100%', mb: 2, borderRadius: '12px', overflow: 'hidden' }}>
                        <Tabs
                            value={currentTab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2, bgcolor: 'white' }}
                        >
                            <Tab icon={<DashboardIcon />} label="Dashboard" iconPosition="start" />
                            <Tab icon={<SchoolIcon />} label="Mes Formations" iconPosition="start" />
                            <Tab icon={<GroupIcon />} label="Mes Étudiants" iconPosition="start" />
                            <Tab icon={<StarIcon />} label="Évaluations" iconPosition="start" />
                            <Tab icon={<NotificationsActiveIcon />} label="Notifications" iconPosition="start" />
                        </Tabs>

                        <Box sx={{ p: 4, minHeight: '500px' }}>
                            {/* TAB 0: DASHBOARD */}
                            {currentTab === 0 && (
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={3}>
                                        <ProfessionalCard icon={<SchoolIcon />} title={stats.totalSessions} subtitle="Sessions Totales" />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <ProfessionalCard icon={<GroupIcon />} title={stats.totalStudents} subtitle="Étudiants Inscrits" />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <ProfessionalCard icon={<StarIcon />} title={`${stats.avgNote}/5`} subtitle="Note Moyenne" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Planning des Sessions</Typography>
                                        <ProfessionalCalendar events={calendarEvents} height="500px" />
                                    </Grid>
                                </Grid>
                            )}

                            {/* TAB 1: MES FORMATIONS */}
                            {currentTab === 1 && (
                                <Box>
                                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                        Gérez les ressources (PDF, Vidéos) pour vos formations assignées.
                                    </Typography>
                                    <ProfessionalTable
                                        columns={formationColumns}
                                        data={myFormations}
                                        emptyMessage="Aucune formation ne vous est assignée pour le moment."
                                    />
                                </Box>
                            )}

                            {/* TAB 2: MES ÉTUDIANTS */}
                            {currentTab === 2 && (
                                <Box>
                                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                        Liste complète des étudiants inscrits à vos sessions.
                                    </Typography>
                                    <ProfessionalTable
                                        columns={studentColumns}
                                        data={myStudents}
                                        emptyMessage="Aucun étudiant inscrit."
                                    />
                                </Box>
                            )}

                            {/* TAB 3: ÉVALUATIONS */}
                            {currentTab === 3 && (
                                <Grid container spacing={2}>
                                    {evaluations.length === 0 ? (
                                        <Typography p={4} color="text.secondary">Aucune évaluation.</Typography>
                                    ) : evaluations.map(ev => (
                                        <Grid item xs={12} key={ev.created_at}>
                                            <Paper elevation={1} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: '#0F4C75' }}>{ev.participant_nom?.charAt(0)}</Avatar>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography fontWeight="bold">{ev.formation_titre}</Typography>
                                                    <Typography variant="body2">{ev.commentaire || "Pas de commentaire"}</Typography>
                                                </Box>
                                                <Chip label={`${ev.note}/5`} color="primary" />
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {/* TAB 4: NOTIFICATIONS */}
                            {currentTab === 4 && <Notifications />}
                        </Box>
                    </Paper>
                </Container>
            </Box>

            {/* --- DIALOGS RESSOURCES --- */}

            {/* View Resources Dialog */}
            <Dialog open={viewResourceDialogOpen} onClose={() => setViewResourceDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ bgcolor: '#0F4C75', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                    Ressources Pédagogiques
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={() => setResourceDialogOpen(true)}
                        sx={{ bgcolor: '#3282B8' }}
                    >
                        Ajouter
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <List>
                        {currentResources.length === 0 ? (
                            <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>Aucune ressource disponible.</Typography>
                        ) : currentResources.map(res => (
                            <React.Fragment key={res.id}>
                                <ListItem secondaryAction={
                                    <IconButton edge="end" color="error" onClick={() => handleDeleteResource(res.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: res.type === 'VIDEO' ? '#F44336' : '#2196F3' }}>
                                            {res.type === 'VIDEO' ? <VideoLibraryIcon /> : <DescriptionIcon />}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<a href={res.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#1E2A32', fontWeight: 'bold' }}>{res.titre}</a>}
                                        secondary={`${res.type} - Ajouté le ${dayjs(res.created_at).format('DD/MM/YYYY')}`}
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewResourceDialogOpen(false)}>Fermer</Button>
                </DialogActions>
            </Dialog>

            {/* Add Resource Dialog */}
            <Dialog open={resourceDialogOpen} onClose={() => setResourceDialogOpen(false)}>
                <DialogTitle>Ajouter une ressource</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 400 }}>
                        <TextField
                            label="Titre" fullWidth
                            value={resourceForm.titre}
                            onChange={e => setResourceForm({ ...resourceForm, titre: e.target.value })}
                        />
                        <TextField
                            select label="Type" fullWidth
                            value={resourceForm.type}
                            onChange={e => setResourceForm({ ...resourceForm, type: e.target.value })}
                        >
                            <MenuItem value="PDF">Document PDF</MenuItem>
                            <MenuItem value="VIDEO">Vidéo</MenuItem>
                            <MenuItem value="DOC">Document Word</MenuItem>
                            <MenuItem value="LINK">Lien Web</MenuItem>
                        </TextField>
                        <TextField
                            label="URL / Lien" fullWidth
                            value={resourceForm.url}
                            onChange={e => setResourceForm({ ...resourceForm, url: e.target.value })}
                            helperText="Lien vers le fichier (Drive, Dropbox, YouTube...)"
                        />
                        <TextField
                            label="Description" fullWidth multiline rows={2}
                            value={resourceForm.description}
                            onChange={e => setResourceForm({ ...resourceForm, description: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResourceDialogOpen(false)}>Annuler</Button>
                    <Button variant="contained" onClick={handleAddResource}>Ajouter</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default FormateurDashboard;
