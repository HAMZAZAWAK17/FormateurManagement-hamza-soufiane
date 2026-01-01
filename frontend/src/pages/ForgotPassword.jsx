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
                        Mot de passe oublié ?
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            opacity: 0.8,
                            fontWeight: 400,
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
                            Mot de passe perdu
                        </Typography>
                        <Typography variant="body2" color="#A3AED0">
                            Entrez votre email pour recevoir un lien de réinitialisation
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Box>
                            <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>
                                Un lien de réinitialisation a été généré !
                            </Alert>
                            {resetLink && (
                                <Alert
                                    severity="info"
                                    sx={{
                                        mb: 3,
                                        borderRadius: '12px',
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
                                            backgroundColor: '#F4F7FE',
                                            borderRadius: '10px',
                                            wordBreak: 'break-all'
                                        }}
                                    >
                                        <MuiLink
                                            href={resetLink}
                                            underline="hover"
                                            sx={{
                                                color: '#4318FF',
                                                fontWeight: 600
                                            }}
                                        >
                                            Cliquez ici pour réinitialiser votre mot de passe
                                        </MuiLink>
                                    </Box>
                                    <Typography
                                        variant="caption"
                                        color="#A3AED0"
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
                                        fontWeight: 500,
                                        color: '#1B254B'
                                    }}
                                >
                                    Email*
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="mail@exemple.com"
                                    autoFocus
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
                                {loading ? 'Envoi...' : 'Envoyer le lien'}
                            </Button>

                            <Box textAlign="center" mt={3}>
                                <Typography variant="body2" color="#1B254B">
                                    Vous vous souvenez de votre mot de passe ?{' '}
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
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ForgotPassword;
