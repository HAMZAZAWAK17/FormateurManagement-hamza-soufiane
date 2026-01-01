import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Link as MuiLink,
    InputAdornment,
    IconButton
} from '@mui/material';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../services/api';
import LockIcon from '@mui/icons-material/Lock';
import LockResetIcon from '@mui/icons-material/LockReset';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * Page de réinitialisation de mot de passe
 */
const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (!tokenFromUrl) {
            setError('Token manquant. Veuillez utiliser le lien reçu par email.');
        } else {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

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

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword({
                token,
                newPassword: formData.newPassword
            });
            setSuccess(true);

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la réinitialisation');
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
                    {success ? (
                        <>
                            <CheckCircleIcon sx={{ fontSize: 120, mb: 3, opacity: 0.9 }} />
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                                }}
                            >
                                Succès !
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    opacity: 0.9,
                                    fontWeight: 300
                                }}
                            >
                                Votre mot de passe a été réinitialisé
                            </Typography>
                        </>
                    ) : (
                        <>
                            <LockResetIcon sx={{ fontSize: 120, mb: 3, opacity: 0.9 }} />
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                                }}
                            >
                                Nouveau mot de passe
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    opacity: 0.9,
                                    fontWeight: 300
                                }}
                            >
                                Choisissez un mot de passe sécurisé
                            </Typography>
                        </>
                    )}
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
                            Réinitialiser le mot de passe
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Entrez votre nouveau mot de passe
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert
                            severity="success"
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                '& .MuiAlert-icon': {
                                    fontSize: 28
                                }
                            }}
                        >
                            <Typography variant="body1" fontWeight={600} gutterBottom>
                                Mot de passe réinitialisé avec succès !
                            </Typography>
                            <Typography variant="body2">
                                Redirection vers la page de connexion...
                            </Typography>
                        </Alert>
                    )}

                    {!success && token && (
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
                                    NOUVEAU MOT DE PASSE
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Minimum 6 caractères"
                                    autoFocus
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

                            <Box mb={3}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 1,
                                        fontWeight: 600,
                                        color: '#2d3748'
                                    }}
                                >
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
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                                    }
                                }}
                            >
                                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                            </Button>

                            <Box textAlign="center" mt={3}>
                                <Typography variant="body2">
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
                                        Retour à la connexion
                                    </MuiLink>
                                </Typography>
                            </Box>
                        </form>
                    )}

                    {!token && (
                        <Box textAlign="center">
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                Lien invalide ou expiré
                            </Alert>
                            <Button
                                variant="contained"
                                component={Link}
                                to="/forgot-password"
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)'
                                    }
                                }}
                            >
                                Demander un nouveau lien
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ResetPassword;
