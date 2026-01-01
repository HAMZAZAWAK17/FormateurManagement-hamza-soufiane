import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Link as MuiLink,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    IconButton
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import LoginIllustration from '../components/LoginIllustration';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

/**
 * Page de connexion avec design moderne en deux colonnes
 */
const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

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
        setLoading(true);

        try {
            const response = await authService.login(formData);
            const { token, user } = response.data;

            login(user, token);

            switch (user.role) {
                case 'admin':
                    navigate('/admin');
                    break;
                case 'formateur':
                    navigate('/formateur');
                    break;
                case 'participant':
                    navigate('/participant');
                    break;
                default:
                    navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la connexion');
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
                    },
                    '@keyframes moveBackground': {
                        '0%': { transform: 'translate(0, 0)' },
                        '100%': { transform: 'translate(30px, 30px)' }
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
                        Centre de Formation
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            opacity: 0.9,
                            fontWeight: 300,
                            mb: 4
                        }}
                    >
                        Développez vos compétences avec nos formations professionnelles
                    </Typography>
                    <LoginIllustration />
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
                    p: { xs: 3, sm: 4 }
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '450px'
                    }}
                >
                    {/* Logo et titre */}
                    <Box textAlign="center" mb={4}>
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
                            Bienvenue !
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Connectez-vous pour accéder à votre espace
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Box mb={3}>
                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 1,
                                    fontWeight: 600,
                                    color: '#2d3748'
                                }}
                            >
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
                                        backgroundColor: '#f7fafc',
                                        '&:hover': {
                                            backgroundColor: '#edf2f7'
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: '#ffffff'
                                        }
                                    }
                                }}
                            />
                        </Box>

                        <Box mb={2}>
                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 1,
                                    fontWeight: 600,
                                    color: '#2d3748'
                                }}
                            >
                                MOT DE PASSE
                            </Typography>
                            <TextField
                                fullWidth
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
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
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: '#f7fafc',
                                        '&:hover': {
                                            backgroundColor: '#edf2f7'
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: '#ffffff'
                                        }
                                    }
                                }}
                            />
                        </Box>

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={3}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        sx={{
                                            color: '#667eea',
                                            '&.Mui-checked': {
                                                color: '#667eea'
                                            }
                                        }}
                                    />
                                }
                                label={
                                    <Typography variant="body2" color="text.secondary">
                                        Se souvenir de moi
                                    </Typography>
                                }
                            />
                            <MuiLink
                                component={Link}
                                to="/forgot-password"
                                underline="none"
                                sx={{
                                    color: '#667eea',
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    '&:hover': {
                                        color: '#764ba2'
                                    }
                                }}
                            >
                                Mot de passe oublié ?
                            </MuiLink>
                        </Box>

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
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
                                },
                                '&:disabled': {
                                    background: '#cbd5e0'
                                }
                            }}
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </Button>

                        <Box textAlign="center" mt={3}>
                            <Typography variant="body2" color="text.secondary">
                                Vous n'avez pas de compte ?{' '}
                                <MuiLink
                                    component={Link}
                                    to="/register"
                                    underline="none"
                                    sx={{
                                        color: '#667eea',
                                        fontWeight: 600,
                                        '&:hover': {
                                            color: '#764ba2'
                                        }
                                    }}
                                >
                                    S'inscrire
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

            {/* Animation CSS */}
            <style>
                {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}
            </style>
        </Box>
    );
};

export default Login;
