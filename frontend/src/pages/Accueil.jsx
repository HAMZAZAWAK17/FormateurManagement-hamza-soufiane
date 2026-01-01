import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Chip,
    AppBar,
    Toolbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formationService, sessionService } from '../services/api';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EuroIcon from '@mui/icons-material/Euro';
import LocationOnIcon from '@mui/icons-material/LocationOn';

/**
 * Page d'accueil publique
 * Affiche toutes les formations avec filtres
 */
const Accueil = () => {
    const navigate = useNavigate();
    const [formations, setFormations] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [filtres, setFiltres] = useState({
        categorie: '',
        ville: ''
    });
    const [loading, setLoading] = useState(true);

    // Charger les formations et sessions
    useEffect(() => {
        chargerDonnees();
    }, [filtres]);

    const chargerDonnees = async () => {
        try {
            setLoading(true);
            const [formationsRes, sessionsRes] = await Promise.all([
                formationService.getAll(filtres),
                sessionService.getAll()
            ]);
            setFormations(formationsRes.data);
            setSessions(sessionsRes.data);
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFiltreChange = (e) => {
        setFiltres({
            ...filtres,
            [e.target.name]: e.target.value
        });
    };

    const getSessionsForFormation = (formationId) => {
        return sessions.filter(s => s.formation_id === formationId);
    };

    return (
        <>
            {/* Barre de navigation */}
            <AppBar position="static" sx={{ mb: 4 }}>
                <Toolbar>
                    <SchoolIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Centre de Formation
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/login')}>
                        Connexion
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/register')}>
                        Inscription
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* En-tête */}
                <Box textAlign="center" mb={6}>
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                        Catalogue de Formations
                    </Typography>
                    <Typography variant="h6" color="text.secondary" paragraph>
                        Découvrez nos formations professionnelles et développez vos compétences
                    </Typography>
                </Box>

                {/* Filtres */}
                <Box mb={4}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Catégorie"
                                name="categorie"
                                value={filtres.categorie}
                                onChange={handleFiltreChange}
                            >
                                <MenuItem value="">Toutes les catégories</MenuItem>
                                <MenuItem value="Informatique">Informatique</MenuItem>
                                <MenuItem value="Management">Management</MenuItem>
                                <MenuItem value="Marketing">Marketing</MenuItem>
                                <MenuItem value="Langues">Langues</MenuItem>
                                <MenuItem value="Comptabilité">Comptabilité</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Ville"
                                name="ville"
                                value={filtres.ville}
                                onChange={handleFiltreChange}
                            >
                                <MenuItem value="">Toutes les villes</MenuItem>
                                <MenuItem value="Casablanca">Casablanca</MenuItem>
                                <MenuItem value="Rabat">Rabat</MenuItem>
                                <MenuItem value="Marrakech">Marrakech</MenuItem>
                                <MenuItem value="Tanger">Tanger</MenuItem>
                                <MenuItem value="Fès">Fès</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </Box>

                {/* Liste des formations */}
                {loading ? (
                    <Typography textAlign="center">Chargement...</Typography>
                ) : formations.length === 0 ? (
                    <Typography textAlign="center" color="text.secondary">
                        Aucune formation disponible
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {formations.map((formation) => {
                            const formationSessions = getSessionsForFormation(formation.id);
                            return (
                                <Grid item xs={12} md={6} lg={4} key={formation.id}>
                                    <Card
                                        elevation={3}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 6
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                                                {formation.titre}
                                            </Typography>

                                            {formation.categorie && (
                                                <Chip
                                                    label={formation.categorie}
                                                    size="small"
                                                    color="primary"
                                                    sx={{ mb: 2 }}
                                                />
                                            )}

                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                {formation.description || 'Description non disponible'}
                                            </Typography>

                                            <Box sx={{ mt: 2 }}>
                                                <Box display="flex" alignItems="center" mb={1}>
                                                    <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                                                    <Typography variant="body2">
                                                        {formation.heures} heures
                                                    </Typography>
                                                </Box>

                                                <Box display="flex" alignItems="center" mb={1}>
                                                    <EuroIcon fontSize="small" sx={{ mr: 1 }} />
                                                    <Typography variant="body2">
                                                        {formation.cout} DH
                                                    </Typography>
                                                </Box>

                                                {formation.ville && (
                                                    <Box display="flex" alignItems="center">
                                                        <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                                                        <Typography variant="body2">
                                                            {formation.ville}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>

                                            {formationSessions.length > 0 && (
                                                <Box mt={2}>
                                                    <Typography variant="caption" color="success.main" fontWeight="bold">
                                                        {formationSessions.length} session(s) disponible(s)
                                                    </Typography>
                                                </Box>
                                            )}
                                        </CardContent>

                                        <CardActions>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                fullWidth
                                                onClick={() => navigate('/login')}
                                            >
                                                S'inscrire
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Container>
        </>
    );
};

export default Accueil;
