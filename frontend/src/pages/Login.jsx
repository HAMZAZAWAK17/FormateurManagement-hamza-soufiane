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
                    borderBottomRightRadius: '100px' // Style moderne
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
                        Rejoignez notre plateforme d'excellence
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
                                fontSize: '2.25rem'
                            }}
                        >
                            Connexion
                        </Typography>
                        <Typography variant="body2" color="#A3AED0">
                            Entrez votre email et mot de passe pour vous connecter !
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                            {error}
                        </Alert>
                    )}

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
                                Mot de passe*
                            </Typography>
                            <TextField
                                fullWidth
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Min. 8 caractères"
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

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={4}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        sx={{
                                            color: '#4318FF',
                                            '&.Mui-checked': {
                                                color: '#4318FF'
                                            }
                                        }}
                                    />
                                }
                                label={
                                    <Typography variant="body2" color="#1B254B">
                                        Gardez-moi connecté
                                    </Typography>
                                }
                            />
                            <MuiLink
                                component={Link}
                                to="/forgot-password"
                                underline="none"
                                sx={{
                                    color: '#4318FF',
                                    fontWeight: 500,
                                    fontSize: '0.875rem',
                                    '&:hover': {
                                        color: '#2B3674'
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
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </Button>

                        <Box textAlign="start" mt={4}>
                            <Typography variant="body2" color="#1B254B">
                                Pas encore enregistré ?{' '}
                                <MuiLink
                                    component={Link}
                                    to="/register"
                                    underline="none"
                                    sx={{
                                        color: '#4318FF',
                                        fontWeight: 700,
                                        '&:hover': {
                                            color: '#2B3674'
                                        }
                                    }}
                                >
                                    Créer un compte
                                </MuiLink>
                            </Typography>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
