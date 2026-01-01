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
        <Box sx={{ backgroundColor: '#F4F7FE', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Barre de navigation Moderne */}
            <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', pt: 2 }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ width: 40, height: 40, bgcolor: '#4318FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                            GF
                        </Box>
                        <Typography variant="h6" fontWeight={800} color="#1B254B">
                            GESTION FORMATION
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            onClick={() => navigate('/login')}
                            sx={{ color: '#1B254B', fontWeight: 700, mr: 2 }}
                        >
                            Connexion
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/register')}
                            sx={{
                                bgcolor: '#4318FF',
                                borderRadius: '30px',
                                px: 3,
                                boxShadow: '0px 4px 12px rgba(67, 24, 255, 0.4)',
                                '&:hover': { bgcolor: '#3814D6' }
                            }}
                        >
                            Inscription
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
                {/* Hero Section Simplifiée */}
                <Box textAlign="center" mb={8}>
                    <Typography variant="h3" component="h1" gutterBottom fontWeight={800} color="#1B254B">
                        Catalogue de Formations
                    </Typography>
                    <Typography variant="h6" color="#A3AED0" paragraph maxWidth="md" mx="auto">
                        Explorez nos formations professionnelles et boostez votre carrière avec des experts certifiés.
                    </Typography>
                </Box>

                {/* Filtres Card */}
                <Box mb={6} p={3} sx={{ bgcolor: 'white', borderRadius: '20px', boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Catégorie"
                                name="categorie"
                                value={filtres.categorie}
                                onChange={handleFiltreChange}
                                variant="outlined"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
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
                                variant="outlined"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
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
                    <Typography textAlign="center" color="#A3AED0">Chargement...</Typography>
                ) : formations.length === 0 ? (
                    <Typography textAlign="center" color="#A3AED0">
                        Aucune formation disponible pour le moment.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {formations.map((formation) => {
                            const formationSessions = getSessionsForFormation(formation.id);
                            return (
                                <Grid item xs={12} md={6} lg={4} key={formation.id}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderRadius: '20px',
                                            backgroundColor: 'white',
                                            boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)',
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: '0px 25px 50px rgba(112, 144, 176, 0.2)'
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                                                <Box
                                                    sx={{
                                                        width: 50, height: 50,
                                                        borderRadius: '50%',
                                                        bgcolor: '#F4F7FE',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: '#4318FF'
                                                    }}
                                                >
                                                    <SchoolIcon />
                                                </Box>
                                                {formation.categorie && (
                                                    <Chip
                                                        label={formation.categorie}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: '#F4F7FE',
                                                            color: '#4318FF',
                                                            fontWeight: 700,
                                                            borderRadius: '8px'
                                                        }}
                                                    />
                                                )}
                                            </Box>

                                            <Typography variant="h6" component="h2" gutterBottom fontWeight={700} color="#1B254B">
                                                {formation.titre}
                                            </Typography>

                                            <Typography variant="body2" color="#A3AED0" paragraph sx={{ mb: 3 }}>
                                                {formation.description || 'Description non disponible'}
                                            </Typography>

                                            <Box sx={{ mt: 'auto' }}>
                                                <Box display="flex" alignItems="center" mb={1} gap={1} color="#A3AED0">
                                                    <AccessTimeIcon fontSize="small" />
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {formation.heures} heures
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center" mb={1} gap={1} color="#A3AED0">
                                                    <EuroIcon fontSize="small" />
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {formation.cout} DH
                                                    </Typography>
                                                </Box>
                                                {formation.ville && (
                                                    <Box display="flex" alignItems="center" gap={1} color="#A3AED0">
                                                        <LocationOnIcon fontSize="small" />
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {formation.ville}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </CardContent>

                                        <CardActions sx={{ p: 3, pt: 0 }}>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={() => navigate('/login')}
                                                sx={{
                                                    bgcolor: '#4318FF',
                                                    borderRadius: '12px',
                                                    fontWeight: 700,
                                                    py: 1.5,
                                                    boxShadow: '0px 4px 12px rgba(67, 24, 255, 0.4)',
                                                    '&:hover': { bgcolor: '#3814D6' }
                                                }}
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

            {/* Footer Simple */}
            <Box py={4} textAlign="center" color="#A3AED0">
                <Typography variant="body2">© 2025 Gestion Formation. Tous droits réservés.</Typography>
            </Box>
        </Box>
    );
};

export default Accueil;
