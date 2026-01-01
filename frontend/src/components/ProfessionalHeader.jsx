import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Composant Header professionnel
 * Couleur Primary (#1E2A32)
 */
const ProfessionalHeader = ({ title, onMenuClick }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        handleClose();
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: '#1E2A32',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}
        >
            <Toolbar>
                {onMenuClick && (
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onMenuClick}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                <Typography
                    variant="h6"
                    component="h1"
                    sx={{
                        flexGrow: 1,
                        fontWeight: 600,
                        color: '#FFFFFF'
                    }}
                >
                    {title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
                            {user?.prenom} {user?.nom}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#BBE1FA', textTransform: 'capitalize' }}>
                            {user?.role}
                        </Typography>
                    </Box>

                    <IconButton
                        onClick={handleMenu}
                        sx={{
                            p: 0.5,
                            '&:hover': {
                                backgroundColor: 'rgba(187, 225, 250, 0.1)'
                            }
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                backgroundColor: '#3282B8',
                                fontSize: '0.875rem',
                                fontWeight: 600
                            }}
                        >
                            {user?.prenom?.[0]}{user?.nom?.[0]}
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                minWidth: 200,
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }
                        }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                                {user?.prenom} {user?.nom}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {user?.email}
                            </Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
                            <PersonIcon fontSize="small" sx={{ mr: 1.5, color: '#3282B8' }} />
                            Mon profil
                        </MenuItem>
                        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: '#DC2626' }}>
                            <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                            Déconnexion
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default ProfessionalHeader;
