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
                    {success ? (
                        <>
                            <CheckCircleIcon sx={{ fontSize: 120, mb: 3, opacity: 0.9 }} />
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                }}
                            >
                                Succès !
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    opacity: 0.8,
                                    fontWeight: 400
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
                                }}
                            >
                                Nouveau mot de passe
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    opacity: 0.8,
                                    fontWeight: 400
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
                    backgroundColor: '#F4F7FE',
                    p: { xs: 3, sm: 4 }
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '450px',
                        bgcolor: 'white',
                        p: 5,
                        borderRadius: '20px',
                        boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)'
                    }}
                >
                    {/* Logo et titre */}
                    <Box textAlign="start" mb={4}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                color: '#1B254B',
                                mb: 1,
                                fontSize: '2rem'
                            }}
                        >
                            Réinitialisation
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                color: '#1B254B',
                                fontWeight: 600,
                                mb: 1,
                                fontSize: '1.2rem'
                            }}
                        >
                            Définitir un nouveau mot de passe
                        </Typography>
                        <Typography variant="body2" color="#A3AED0">
                            Entrez votre nouveau mot de passe ci-dessous
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert
                            severity="success"
                            sx={{
                                mb: 3,
                                borderRadius: '12px',
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
                                        fontWeight: 500,
                                        color: '#1B254B'
                                    }}
                                >
                                    Nouveau mot de passe*
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
                            </Box>

                            <Box mb={3}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 1,
                                        fontWeight: 500,
                                        color: '#1B254B'
                                    }}
                                >
                                    Confirmer le mot de passe*
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirmez votre mot de passe"
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
                            </Box>

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
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
                                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                            </Button>

                            <Box textAlign="center" mt={3}>
                                <Typography variant="body2">
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
                                    backgroundColor: '#4318FF',
                                    '&:hover': {
                                        backgroundColor: '#3814D6'
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
