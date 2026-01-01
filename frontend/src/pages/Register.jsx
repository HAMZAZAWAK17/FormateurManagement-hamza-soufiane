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
                background: '#F4F7FE'
            }}
        >
            {/* Partie gauche - Illustration */}
            <Box
                sx={{
                    flex: 1,
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#4318FF',
                    position: 'relative',
                    overflow: 'hidden',
                    borderBottomRightRadius: '100px'
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
                        }}
                    >
                        Gestion Formation
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            opacity: 0.8,
                            fontWeight: 400,
                            mb: 4
                        }}
                    >
                        Rejoignez la communauté dès aujourd'hui
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
                    backgroundColor: '#F4F7FE',
                    p: { xs: 3, sm: 4 },
                    overflowY: 'auto'
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '550px',
                        my: 4,
                        bgcolor: 'white',
                        p: 5,
                        borderRadius: '20px',
                        boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)'
                    }}
                >
                    {/* Logo et titre */}
                    <Box textAlign="start" mb={3}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                color: '#1B254B',
                                mb: 1,
                                fontSize: '2rem'
                            }}
                        >
                            Créer un compte
                        </Typography>
                        <Typography variant="body2" color="#A3AED0">
                            Remplissez le formulaire ci-dessous pour vous inscrire
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>
                            Inscription réussie ! Redirection vers la page de connexion...
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#1B254B' }}>
                                    Nom*
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                    placeholder="Votre nom"
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <PersonIcon sx={{ color: '#A3AED0' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px',
                                            '& fieldset': { borderColor: '#E0E5F2' },
                                            '&:hover fieldset': { borderColor: '#4318FF' },
                                            '&.Mui-focused fieldset': { borderColor: '#4318FF' }
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#1B254B' }}>
                                    Prénom*
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    required
                                    placeholder="Votre prénom"
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <PersonIcon sx={{ color: '#A3AED0' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px',
                                            '& fieldset': { borderColor: '#E0E5F2' },
                                            '&:hover fieldset': { borderColor: '#4318FF' },
                                            '&.Mui-focused fieldset': { borderColor: '#4318FF' }
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#1B254B' }}>
                                    Email*
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="mail@exemple.com"
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <EmailIcon sx={{ color: '#A3AED0' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px',
                                            '& fieldset': { borderColor: '#E0E5F2' },
                                            '&:hover fieldset': { borderColor: '#4318FF' },
                                            '&.Mui-focused fieldset': { borderColor: '#4318FF' }
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#1B254B' }}>
                                    Téléphone
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    placeholder="06XXXXXXXX"
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <PhoneIcon sx={{ color: '#A3AED0' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px',
                                            '& fieldset': { borderColor: '#E0E5F2' },
                                            '&:hover fieldset': { borderColor: '#4318FF' },
                                            '&.Mui-focused fieldset': { borderColor: '#4318FF' }
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#1B254B' }}>
                                    Rôle*
                                </Typography>
                                <TextField
                                    fullWidth
                                    select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <WorkIcon sx={{ color: '#A3AED0', mr: 2 }} />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px',
                                            '& fieldset': { borderColor: '#E0E5F2' },
                                            '&:hover fieldset': { borderColor: '#4318FF' },
                                            '&.Mui-focused fieldset': { borderColor: '#4318FF' }
                                        }
                                    }}
                                >
                                    <MenuItem value="participant">Participant</MenuItem>
                                    <MenuItem value="formateur">Formateur</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#1B254B' }}>
                                    Mot de passe*
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Minimum 6 caractères"
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    sx={{ color: '#A3AED0' }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px',
                                            '& fieldset': { borderColor: '#E0E5F2' },
                                            '&:hover fieldset': { borderColor: '#4318FF' },
                                            '&.Mui-focused fieldset': { borderColor: '#4318FF' }
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#1B254B' }}>
                                    Confirmer le mot de passe*
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Répétez le mot de passe"
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    edge="end"
                                                    sx={{ color: '#A3AED0' }}
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px',
                                            '& fieldset': { borderColor: '#E0E5F2' },
                                            '&:hover fieldset': { borderColor: '#4318FF' },
                                            '&.Mui-focused fieldset': { borderColor: '#4318FF' }
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={loading || success}
                            sx={{
                                mt: 4,
                                py: 1.5,
                                borderRadius: '16px',
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 700,
                                backgroundColor: '#4318FF',
                                boxShadow: '0 4px 15px rgba(67, 24, 255, 0.4)',
                                '&:hover': {
                                    backgroundColor: '#3814D6'
                                },
                                '&:disabled': {
                                    backgroundColor: '#E0E5F2',
                                    color: '#A3AED0'
                                }
                            }}
                        >
                            {loading ? 'Inscription...' : 'S\'inscrire'}
                        </Button>

                        <Box textAlign="center" mt={3}>
                            <Typography variant="body2" color="#1B254B">
                                Vous avez déjà un compte ?{' '}
                                <MuiLink
                                    component={Link}
                                    to="/login"
                                    underline="none"
                                    sx={{
                                        color: '#4318FF',
                                        fontWeight: 700,
                                        '&:hover': {
                                            color: '#2B3674'
                                        }
                                    }}
                                >
                                    Se connecter
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
