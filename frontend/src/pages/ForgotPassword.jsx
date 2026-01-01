import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Link as MuiLink,
    InputAdornment
} from '@mui/material';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import ForgotPasswordIllustration from '../components/ForgotPasswordIllustration';
import EmailIcon from '@mui/icons-material/Email';
import LockResetIcon from '@mui/icons-material/LockReset';

/**
 * Page de demande de réinitialisation de mot de passe
 */
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [resetLink, setResetLink] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            const response = await authService.forgotPassword({ email });
            setSuccess(true);
            if (response.data.resetLink) {
                setResetLink(response.data.resetLink);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la demande');
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
                        Mot de passe oublié ?
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            opacity: 0.9,
                            fontWeight: 300,
                            mb: 4
                        }}
                    >
                        Pas de problème, nous allons vous aider à le récupérer
                    </Typography>
                    <ForgotPasswordIllustration />
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
                            Entrez votre email pour recevoir un lien de réinitialisation
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Box>
                            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                                Un lien de réinitialisation a été généré !
                            </Alert>
                            {resetLink && (
                                <Alert
                                    severity="info"
                                    sx={{
                                        mb: 3,
                                        borderRadius: 2,
                                        '& .MuiAlert-message': {
                                            width: '100%'
                                        }
                                    }}
                                >
                                    <Typography variant="body2" gutterBottom fontWeight={600}>
                                        Mode Développement :
                                    </Typography>
                                    <Box
                                        sx={{
                                            mt: 1,
                                            p: 2,
                                            backgroundColor: '#f7fafc',
                                            borderRadius: 1,
                                            wordBreak: 'break-all'
                                        }}
                                    >
                                        <MuiLink
                                            href={resetLink}
                                            underline="hover"
                                            sx={{
                                                color: '#667eea',
                                                fontWeight: 600
                                            }}
                                        >
                                            Cliquez ici pour réinitialiser votre mot de passe
                                        </MuiLink>
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ mt: 1, display: 'block' }}
                                    >
                                        En production, ce lien serait envoyé par email
                                    </Typography>
                                </Alert>
                            )}
                        </Box>
                    )}

                    {!success && (
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
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="votre.email@example.com"
                                    autoFocus
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
                                {loading ? 'Envoi...' : 'Envoyer le lien'}
                            </Button>

                            <Box textAlign="center" mt={3}>
                                <Typography variant="body2" color="text.secondary">
                                    Vous vous souvenez de votre mot de passe ?{' '}
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
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ForgotPassword;
