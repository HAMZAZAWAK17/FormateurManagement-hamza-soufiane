import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    MenuItem,
    Link as MuiLink,
    InputAdornment,
    IconButton,
    Grid
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import RegisterIllustration from '../components/RegisterIllustration';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

/**
 * Page d'inscription avec design moderne
 */
const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'participant',
        telephone: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...dataToSend } = formData;
            await authService.register(dataToSend);
            setSuccess(true);

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
        >
            {/* Partie gauche - Illustration */}
            <Box
                sx={{
                    flex: 1,
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #1a237e 0%, #4a148c 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        width: '200%',
                        height: '200%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '30px 30px',
                        animation: 'moveBackground 20s linear infinite'
                    }
                }}
            >
                <Box
                    sx={{
                        textAlign: 'center',
                        color: 'white',
                        zIndex: 1,
                        p: 4
                    }}
                >
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 800,
                            mb: 2,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}
                    >
                        Rejoignez-nous !
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            opacity: 0.9,
                            fontWeight: 300,
                            mb: 4
                        }}
                    >
                        Créez votre compte et commencez votre parcours de formation
                    </Typography>
                    <RegisterIllustration />
                </Box>
            </Box>

            {/* Partie droite - Formulaire */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                    p: { xs: 3, sm: 4 },
                    overflowY: 'auto'
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '500px',
                        my: 4
                    }}
                >
                    {/* Logo et titre */}
                    <Box textAlign="center" mb={3}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1
                            }}
                        >
                            FORMATION
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                color: '#2d3748',
                                fontWeight: 600,
                                mb: 1
                            }}
                        >
                            Créer un compte
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Remplissez le formulaire pour vous inscrire
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                            Inscription réussie ! Redirection vers la page de connexion...
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>
                                    NOM
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                    placeholder="Votre nom"
                                    size="small"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon sx={{ color: '#a0aec0' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: '#f7fafc'
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>
                                    PRÉNOM
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    required
                                    placeholder="Votre prénom"
                                    size="small"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon sx={{ color: '#a0aec0' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: '#f7fafc'
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>
                                    EMAIL
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="votre.email@example.com"
                                    size="small"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon sx={{ color: '#a0aec0' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: '#f7fafc'
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>
                                    TÉLÉPHONE
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    placeholder="06XXXXXXXX"
                                    size="small"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PhoneIcon sx={{ color: '#a0aec0' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: '#f7fafc'
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>
                                    RÔLE
                                </Typography>
                                <TextField
                                    fullWidth
                                    select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    size="small"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <WorkIcon sx={{ color: '#a0aec0' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: '#f7fafc'
                                        }
                                    }}
                                >
                                    <MenuItem value="participant">Participant</MenuItem>
                                    <MenuItem value="formateur">Formateur</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>
                                    MOT DE PASSE
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Minimum 6 caractères"
                                    size="small"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: '#a0aec0' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: '#f7fafc'
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#2d3748' }}>
                                    CONFIRMER LE MOT DE PASSE
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirmez votre mot de passe"
                                    size="small"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: '#a0aec0' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    edge="end"
                                                    size="small"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: '#f7fafc'
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading || success}
                            sx={{
                                mt: 3,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)'
                                }
                            }}
                        >
                            {loading ? 'Inscription...' : 'S\'inscrire'}
                        </Button>

                        <Box textAlign="center" mt={3}>
                            <Typography variant="body2" color="text.secondary">
                                Vous avez déjà un compte ?{' '}
                                <MuiLink
                                    component={Link}
                                    to="/login"
                                    underline="none"
                                    sx={{
                                        color: '#667eea',
                                        fontWeight: 600,
                                        '&:hover': {
                                            color: '#764ba2'
                                        }
                                    }}
                                >
                                    Se connecter
                                </MuiLink>
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                <MuiLink
                                    component={Link}
                                    to="/"
                                    underline="none"
                                    sx={{
                                        color: '#a0aec0',
                                        '&:hover': {
                                            color: '#667eea'
                                        }
                                    }}
                                >
                                    ← Retour à l'accueil
                                </MuiLink>
                            </Typography>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default Register;
