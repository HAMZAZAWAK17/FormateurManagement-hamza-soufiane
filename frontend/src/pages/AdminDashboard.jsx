import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Alert,
    IconButton,
    InputAdornment,
    Chip,
    Grid,
    Divider
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfessionalSidebar from '../components/ProfessionalSidebar';
import ProfessionalCalendar from '../components/ProfessionalCalendar';
import ProfessionalTable from '../components/ProfessionalTable';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { formationService, sessionService, formateurService, authService, inscriptionService } from '../services/api';
import dayjs from 'dayjs';

/**
 * Dashboard Admin Moderne
 */
const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [currentTab, setCurrentTab] = useState(0);
    const [sessions, setSessions] = useState([]);
    const [formations, setFormations] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [inscriptions, setInscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Dialog states (CRUD Forms)
    const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
    const [formationDialogOpen, setFormationDialogOpen] = useState(false);
    const [formateurDialogOpen, setFormateurDialogOpen] = useState(false);

    // Dialog details states
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [formateurDetailsOpen, setFormateurDetailsOpen] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    // Selected Items
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [selectedFormateur, setSelectedFormateur] = useState(null);

    // Forms
    const [sessionForm, setSessionForm] = useState({
        formation_id: '',
        formateur_id: '',
        date_debut: '',
        date_fin: '',
        lieu: ''
    });

    const [formationForm, setFormationForm] = useState({
        titre: '',
        description: '',
        categorie: '',
        heures: '',
        cout: '',
        ville: '',
        objectifs: '',
        programme: '',
        formateur_id: ''
    });

    const [formateurForm, setFormateurForm] = useState({
        prenom: '',
        nom: '',
        email: '',
        password: '',
        telephone: '',
        specialite: '',
        bio: ''
    });

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: <DashboardIcon /> },
        { path: '/admin/formations', label: 'Formations', icon: <SchoolIcon /> },
        { path: '/admin/formateurs', label: 'Formateurs', icon: <PeopleIcon /> },
        { path: '/admin/sessions', label: 'Sessions', icon: <EventIcon /> },
        { path: '/admin/inscriptions', label: 'Inscriptions', icon: <AssignmentIcon /> }
    ];

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/formations')) {
            setCurrentTab(1);
        } else if (path.includes('/formateurs')) {
            setCurrentTab(2);
        } else if (path.includes('/inscriptions')) {
            setCurrentTab(3);
        } else {
            setCurrentTab(0);
        }
    }, [location.pathname]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [sessionsRes, formationsRes, formateursRes, inscriptionsRes] = await Promise.all([
                sessionService.getAll(),
                formationService.getAll(),
                formateurService.getAll(),
                inscriptionService.getAll()
            ]);
            setSessions(sessionsRes.data || []);
            setFormations(formationsRes.data || []);
            setFormateurs(formateursRes.data || []);
            setInscriptions(inscriptionsRes.data || []);
        } catch (err) {
            setError('Erreur lors du chargement des données');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Calendar Events
    const calendarEvents = sessions.map(session => {
        const formation = formations.find(f => f.id === session.formation_id);
        const formateur = formateurs.find(f => f.id === session.formateur_id);
        return {
            id: session.id,
            title: formation?.titre || 'Formation',
            start: session.date_debut,
            end: session.date_fin,
            formateur: formateur ? `${formateur.prenom} ${formateur.nom}` : '',
            lieu: session.lieu,
            color: '#0F4C75'
        };
    });

    // Handlers
    const handleViewFormation = (formation) => {
        setSelectedFormation(formation);
        setDetailsDialogOpen(true);
    };

    const handleViewFormateur = (formateur) => {
        setSelectedFormateur(formateur);
        setFormateurDetailsOpen(true);
    };

    const handleCreateSession = async () => {
        try {
            await sessionService.create(sessionForm);
            setSuccess('Session créée avec succès');
            setSessionDialogOpen(false);
            setSessionForm({ formation_id: '', formateur_id: '', date_debut: '', date_fin: '', lieu: '' });
            loadData();
        } catch (err) {
            setError('Erreur lors de la création de la session');
        }
    };

    const handleCreateFormation = async () => {
        try {
            const payload = {
                ...formationForm,
                heures: parseInt(formationForm.heures),
                cout: parseFloat(formationForm.cout)
            };
            await formationService.create(payload);
            setSuccess('Formation créée avec succès');
            setFormationDialogOpen(false);
            setFormationForm({ titre: '', description: '', categorie: '', heures: '', cout: '', ville: '', objectifs: '', programme: '', formateur_id: '' });
            loadData();
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la création de la formation.");
        }
    };

    const handleCreateFormateur = async () => {
        try {
            // Attention: specialite envoyé au backend qui le mappe sur 'competences'
            await authService.register({ ...formateurForm, role: 'formateur' });
            setSuccess('Formateur créé avec succès');
            setFormateurDialogOpen(false);
            setFormateurForm({ prenom: '', nom: '', email: '', password: '', telephone: '', specialite: '', bio: '' });
            loadData();
        } catch (err) {
            setError("Erreur lors de la création du formateur (Email peut-être déjà utilisé)");
        }
    };

    const handleTabChange = (e, newValue) => {
        setCurrentTab(newValue);
        switch (newValue) {
            case 0: navigate('/admin'); break;
            case 1: navigate('/admin/formations'); break;
            case 2: navigate('/admin/formateurs'); break;
            case 3: navigate('/admin/inscriptions'); break;
            default: break;
        }
    };

    // Colonnes
    const formationColumns = [
        { id: 'titre', label: 'Titre' },
        { id: 'formateur_nom', label: 'Formateur Responsable', render: r => r.formateur_nom || 'Non assigné' },
        { id: 'categorie', label: 'Catégorie' },
        { id: 'heures', label: 'Durée (h)', render: r => `${r.heures}h` },
        { id: 'cout', label: 'Prix', render: r => `${r.cout} €` }
    ];

    const formateurColumns = [
        { id: 'nom', label: 'Nom', render: r => `${r.prenom} ${r.nom}` },
        { id: 'email', label: 'Email' },
        { id: 'competences', label: 'Spécialité' } // Corrigé : 'competences' au lieu de 'specialite'
    ];

    const inscriptionColumns = [
        { id: 'formation_titre', label: 'Formation' },
        { id: 'participant_nom', label: 'Participant' },
        { id: 'date_inscription', label: 'Date', render: r => dayjs(r.date_inscription).format('DD/MM/YYYY') },
        {
            id: 'statut',
            label: 'Statut',
            render: r => (
                <Chip
                    label={r.statut}
                    color={r.statut === 'confirmee' ? 'success' : r.statut === 'en_attente' ? 'warning' : 'error'}
                    size="small"
                />
            )
        }
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <ProfessionalSidebar
                open={true}
                menuItems={menuItems}
                user={user}
                title="Dashboard Admin"
            />

            <Box component="main" sx={{ flexGrow: 1, backgroundColor: '#BBE1FA', minHeight: '100vh', p: 3 }}>
                <Container maxWidth="xl" sx={{ mt: 8 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

                    <Paper sx={{ width: '100%', mb: 2, borderRadius: '12px', overflow: 'hidden' }}>
                        <Tabs
                            value={currentTab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered={false}
                            sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}
                        >
                            <Tab label="Planning" />
                            <Tab label="Formations" />
                            <Tab label="Formateurs" />
                            <Tab label="Inscriptions" />
                        </Tabs>

                        <Box sx={{ p: 3 }}>
                            {/* PLANNING */}
                            {currentTab === 0 && (
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                        <Typography variant="h6" fontWeight={600} color="#1E2A32">Planning des Sessions</Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            onClick={() => setSessionDialogOpen(true)}
                                            sx={{ backgroundColor: '#0F4C75' }}
                                        >
                                            Nouvelle Session
                                        </Button>
                                    </Box>
                                    <ProfessionalCalendar events={calendarEvents} height="600px" />
                                </Box>
                            )}

                            {/* FORMATIONS */}
                            {currentTab === 1 && (
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                        <Typography variant="h6" fontWeight={600} color="#1E2A32">Liste des Formations</Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<SchoolIcon />}
                                            onClick={() => setFormationDialogOpen(true)}
                                            sx={{ backgroundColor: '#0F4C75' }}
                                        >
                                            Nouvelle Formation
                                        </Button>
                                    </Box>
                                    <ProfessionalTable
                                        columns={formationColumns}
                                        data={formations}
                                        onView={handleViewFormation}
                                        emptyMessage="Aucune formation trouvée"
                                    />
                                </Box>
                            )}

                            {/* FORMATEURS */}
                            {currentTab === 2 && (
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                        <Typography variant="h6" fontWeight={600} color="#1E2A32">Liste des Formateurs</Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<PeopleIcon />}
                                            onClick={() => setFormateurDialogOpen(true)}
                                            sx={{ backgroundColor: '#0F4C75' }}
                                        >
                                            Nouveau Formateur
                                        </Button>
                                    </Box>
                                    <ProfessionalTable
                                        columns={formateurColumns}
                                        data={formateurs}
                                        onView={handleViewFormateur}
                                        emptyMessage="Aucun formateur trouvé"
                                    />
                                </Box>
                            )}

                            {/* INSCRIPTIONS */}
                            {currentTab === 3 && (
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                        <Typography variant="h6" fontWeight={600} color="#1E2A32">Dernières Inscriptions</Typography>
                                    </Box>
                                    <ProfessionalTable
                                        columns={inscriptionColumns}
                                        data={inscriptions}
                                        emptyMessage="Aucune inscription trouvée"
                                    />
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Container>
            </Box>

            {/* DIALOG SESSION */}
            <Dialog open={sessionDialogOpen} onClose={() => setSessionDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Nouvelle Session</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            select label="Formation"
                            value={sessionForm.formation_id}
                            onChange={e => setSessionForm({ ...sessionForm, formation_id: e.target.value })}
                            fullWidth
                        >
                            {formations.map(f => <MenuItem key={f.id} value={f.id}>{f.titre}</MenuItem>)}
                        </TextField>
                        <TextField
                            select label="Formateur"
                            value={sessionForm.formateur_id}
                            onChange={e => setSessionForm({ ...sessionForm, formateur_id: e.target.value })}
                            fullWidth
                        >
                            {formateurs.map(f => <MenuItem key={f.id} value={f.id}>{f.prenom} {f.nom}</MenuItem>)}
                        </TextField>
                        <TextField
                            type="datetime-local" label="Début" InputLabelProps={{ shrink: true }}
                            value={sessionForm.date_debut}
                            onChange={e => setSessionForm({ ...sessionForm, date_debut: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            type="datetime-local" label="Fin" InputLabelProps={{ shrink: true }}
                            value={sessionForm.date_fin}
                            onChange={e => setSessionForm({ ...sessionForm, date_fin: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Lieu"
                            value={sessionForm.lieu}
                            onChange={e => setSessionForm({ ...sessionForm, lieu: e.target.value })}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSessionDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleCreateSession} variant="contained">Créer</Button>
                </DialogActions>
            </Dialog>

            {/* DIALOG FORMATION */}
            <Dialog open={formationDialogOpen} onClose={() => setFormationDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Nouvelle Formation</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Titre"
                            value={formationForm.titre}
                            onChange={e => setFormationForm({ ...formationForm, titre: e.target.value })}
                            fullWidth required
                        />

                        {/* Assignation Formateur */}
                        <TextField
                            select label="Formateur Responsable"
                            value={formationForm.formateur_id}
                            onChange={e => setFormationForm({ ...formationForm, formateur_id: e.target.value })}
                            fullWidth
                        >
                            <MenuItem value=""><em>Aucun</em></MenuItem>
                            {formateurs.map(f => (
                                <MenuItem key={f.id} value={f.id}>{f.prenom} {f.nom}</MenuItem>
                            ))}
                        </TextField>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Catégorie"
                                    value={formationForm.categorie}
                                    onChange={e => setFormationForm({ ...formationForm, categorie: e.target.value })}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Ville"
                                    value={formationForm.ville}
                                    onChange={e => setFormationForm({ ...formationForm, ville: e.target.value })}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    type="number" label="Heures (h)"
                                    value={formationForm.heures}
                                    onChange={e => setFormationForm({ ...formationForm, heures: e.target.value })}
                                    fullWidth required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    type="number" label="Coût (€)"
                                    value={formationForm.cout}
                                    onChange={e => setFormationForm({ ...formationForm, cout: e.target.value })}
                                    fullWidth required
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            label="Description" multiline rows={2}
                            value={formationForm.description}
                            onChange={e => setFormationForm({ ...formationForm, description: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Objectifs" multiline rows={2}
                            value={formationForm.objectifs}
                            onChange={e => setFormationForm({ ...formationForm, objectifs: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Programme" multiline rows={2}
                            value={formationForm.programme}
                            onChange={e => setFormationForm({ ...formationForm, programme: e.target.value })}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFormationDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleCreateFormation} variant="contained">Créer</Button>
                </DialogActions>
            </Dialog>

            {/* DIALOG DETAILS FORMATION */}
            <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ backgroundColor: '#0F4C75', color: 'white' }}>
                    {selectedFormation?.titre}
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {selectedFormation && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Chip label={selectedFormation.categorie} color="primary" />
                                <Typography fontWeight="bold">{selectedFormation.heures} heures | {selectedFormation.cout} €</Typography>
                            </Box>

                            <Divider />

                            {selectedFormation.formateur_nom && (
                                <Typography variant="subtitle2" color="text.secondary">
                                    Formateur Responsable : {selectedFormation.formateur_nom}
                                </Typography>
                            )}

                            <Box>
                                <Typography variant="h6" color="#0F4C75">Description</Typography>
                                <Typography variant="body1">{selectedFormation.description}</Typography>
                            </Box>

                            {selectedFormation.objectifs && (
                                <Box>
                                    <Typography variant="h6" color="#0F4C75">Objectifs</Typography>
                                    <Typography variant="body2">{selectedFormation.objectifs}</Typography>
                                </Box>
                            )}

                            {selectedFormation.programme && (
                                <Box>
                                    <Typography variant="h6" color="#0F4C75">Programme</Typography>
                                    <Typography variant="body2">{selectedFormation.programme}</Typography>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Typography variant="caption" color="text.secondary">Ville : {selectedFormation.ville || 'Non spécifiée'}</Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsDialogOpen(false)}>Fermer</Button>
                </DialogActions>
            </Dialog>

            {/* DIALOG CREATION FORMATEUR */}
            <Dialog open={formateurDialogOpen} onClose={() => setFormateurDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Nouveau Formateur</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Prénom"
                                value={formateurForm.prenom}
                                onChange={e => setFormateurForm({ ...formateurForm, prenom: e.target.value })}
                                fullWidth required
                            />
                            <TextField
                                label="Nom"
                                value={formateurForm.nom}
                                onChange={e => setFormateurForm({ ...formateurForm, nom: e.target.value })}
                                fullWidth required
                            />
                        </Box>
                        <TextField
                            type="email" label="Email"
                            value={formateurForm.email}
                            onChange={e => setFormateurForm({ ...formateurForm, email: e.target.value })}
                            fullWidth required
                        />
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            label="Mot de passe"
                            value={formateurForm.password}
                            onChange={e => setFormateurForm({ ...formateurForm, password: e.target.value })}
                            fullWidth required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            label="Téléphone"
                            value={formateurForm.telephone}
                            onChange={e => setFormateurForm({ ...formateurForm, telephone: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Spécialité"
                            value={formateurForm.specialite}
                            onChange={e => setFormateurForm({ ...formateurForm, specialite: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Bio" multiline rows={2}
                            value={formateurForm.bio}
                            onChange={e => setFormateurForm({ ...formateurForm, bio: e.target.value })}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFormateurDialogOpen(false)}>Annuler</Button>
                    <Button onClick={handleCreateFormateur} variant="contained">Créer</Button>
                </DialogActions>
            </Dialog>

            {/* DIALOG DETAILS FORMATEUR (NOUVEAU) */}
            <Dialog open={formateurDetailsOpen} onClose={() => setFormateurDetailsOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ backgroundColor: '#0F4C75', color: 'white' }}>
                    Détails Formateur
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {selectedFormateur && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="h5" fontWeight="bold">
                                {selectedFormateur.prenom} {selectedFormateur.nom}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip label={selectedFormateur.competences || 'Spécialité non renseignée'} color="secondary" />
                            </Box>

                            <Divider />

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Contact :</Typography>
                                <Typography>{selectedFormateur.email}</Typography>
                                <Typography>{selectedFormateur.telephone}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Biographie :</Typography>
                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                    {selectedFormateur.remarques || 'Aucune biographie disponible.'}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Inscrit le : {new Date(selectedFormateur.created_at).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFormateurDetailsOpen(false)}>Fermer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminDashboard;
