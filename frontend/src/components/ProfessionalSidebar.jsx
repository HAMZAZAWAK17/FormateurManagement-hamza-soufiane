import React, { useState } from 'react';
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    Divider,
    IconButton,
    Avatar,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Chip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';

/**
 * Composant Sidebar professionnel
 * Design moderne avec fond #1E2A32
 */
const ProfessionalSidebar = ({ open, onClose, menuItems, user, title, onNavigate }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    // Local state for collapse
    const [collapsed, setCollapsed] = useState(false);

    // State for Profile Modal
    const [profileOpen, setProfileOpen] = useState(false);

    const sidebarWidth = collapsed ? 88 : 290; // Slightly wider collapsed for better visual

    const handleNavigation = (path) => {
        if (onNavigate) {
            onNavigate(path);
        } else {
            navigate(path);
        }
        if (window.innerWidth < 600 && onClose) onClose(); // Auto close on mobile
    };

    const handleLogout = () => {
        if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
            logout();
            navigate('/login');
        }
    };

    return (
        <>
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: sidebarWidth,
                    flexShrink: 0,
                    transition: 'width 0.3s ease',
                    '& .MuiDrawer-paper': {
                        width: sidebarWidth,
                        boxSizing: 'border-box',
                        backgroundColor: '#111C44', // Dark Navy from image
                        color: '#FFFFFF',
                        borderRight: 'none',
                        padding: '0 16px',
                        overflowX: 'hidden',
                        transition: 'width 0.3s ease',
                    }
                }}
            >
                {/* Brand / Logo Area */}
                <Box sx={{
                    py: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: 2,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    mb: 2,
                    position: 'relative'
                }}>
                    <Box
                        sx={{
                            width: 40, height: 40,
                            minWidth: 40,
                            backgroundColor: '#4318FF', // Brand Blue
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '20px',
                            cursor: 'pointer'
                        }}
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        GF
                    </Box>

                    {!collapsed && (
                        <Box sx={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1, letterSpacing: '0.5px' }}>
                                GESTION
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#A3AED0', fontWeight: 500 }}>
                                FORMATION
                            </Typography>
                        </Box>
                    )}

                    {/* Toggle Button (Absolute only if not collapsed, otherwise integrated) */}
                    {!collapsed && (
                        <IconButton
                            onClick={() => setCollapsed(true)}
                            sx={{ color: '#A3AED0', position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%)' }}
                        >
                            <MenuOpenIcon />
                        </IconButton>
                    )}
                </Box>

                {/* Collapsed Toggle if hidden in header */}
                {collapsed && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <IconButton onClick={() => setCollapsed(false)} sx={{ color: '#A3AED0' }}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                )}

                {/* Menu Items */}
                <List sx={{ px: 0, flexGrow: 1 }}>
                    {!collapsed && (
                        <Typography variant="caption" sx={{ pl: 2, mb: 1, display: 'block', color: '#A3AED0', fontWeight: 600, textTransform: 'uppercase' }}>
                            MENU PRINCIPAL
                        </Typography>
                    )}

                    {menuItems.map((item) => {
                        // Vérification flexible pour l'état actif (exact match ou query param)
                        const isSelected = location.pathname === item.path ||
                            (location.search && item.path.includes(location.search));

                        return (
                            <Tooltip title={collapsed ? item.label : ""} placement="right" arrow key={item.label}>
                                <ListItemButton
                                    selected={isSelected}
                                    onClick={() => handleNavigation(item.path)}
                                    sx={{
                                        borderRadius: '12px',
                                        mb: 1,
                                        py: 1.5,
                                        px: collapsed ? 1 : 2.5,
                                        justifyContent: collapsed ? 'center' : 'flex-start',
                                        transition: 'all 0.2s',
                                        position: 'relative',
                                        '&.Mui-selected': {
                                            backgroundColor: '#4318FF', // Active Blue
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#3814D6',
                                            },
                                            '& .MuiListItemIcon-root': {
                                                color: 'white',
                                            }
                                        },
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        }
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: isSelected ? 'white' : '#A3AED0',
                                            minWidth: collapsed ? 0 : 40,
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    {!collapsed && (
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{
                                                fontWeight: isSelected ? 600 : 500,
                                                fontSize: '0.95rem',
                                                color: isSelected ? 'white' : '#A3AED0'
                                            }}
                                        />
                                    )}
                                    {/* Active Indicator */}
                                    {isSelected && !collapsed && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                right: -16,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: 4,
                                                height: 36,
                                                backgroundColor: '#fff',
                                                borderRadius: '4px 0 0 4px',
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            </Tooltip>
                        );
                    })}
                </List>

                {/* User Info / Footer */}
                <Box sx={{ mt: 'auto', mb: 2 }}>
                    {/* User Profile Box */}
                    {user && (
                        <Tooltip title="Voir mon profil" placement="top" disableHoverListener={!collapsed}>
                            <Box
                                onClick={() => setProfileOpen(true)}
                                sx={{
                                    p: 2,
                                    borderRadius: '16px',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                    gap: 2,
                                    mb: 1
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 40, height: 40,
                                        bgcolor: '#1B254B',
                                        border: '2px solid white',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {user.prenom?.charAt(0)}
                                </Avatar>

                                {!collapsed && (
                                    <Box sx={{ overflow: 'hidden' }}>
                                        <Typography variant="button" display="block" noWrap sx={{ fontWeight: 700, textTransform: 'none', color: 'white' }}>
                                            {user.prenom} {user.nom}
                                        </Typography>
                                        <Typography variant="caption" noWrap sx={{ color: '#A3AED0', textTransform: 'capitalize' }}>
                                            {user.role?.toLowerCase()}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Tooltip>
                    )}

                    {/* Logout Button */}
                    <Tooltip title="Déconnexion" placement="right">
                        <Button
                            fullWidth
                            color="error"
                            variant={collapsed ? "text" : "outlined"}
                            onClick={handleLogout}
                            startIcon={<LogoutIcon />}
                            sx={{
                                justifyContent: collapsed ? 'center' : 'flex-start',
                                minWidth: 0,
                                px: 2,
                                py: 1.5,
                                borderRadius: '12px',
                                borderColor: collapsed ? 'transparent' : 'rgba(244, 67, 54, 0.5)',
                                color: '#FF4D4D',
                                '&:hover': {
                                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                    borderColor: '#FF4D4D'
                                },
                                '& .MuiButton-startIcon': {
                                    margin: collapsed ? 0 : undefined
                                }
                            }}
                        >
                            {!collapsed && "Déconnexion"}
                        </Button>
                    </Tooltip>
                </Box>
            </Drawer>

            {/* Profile Dialog */}
            <Dialog
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ backgroundColor: '#111C44', color: 'white', textAlign: 'center' }}>
                    Mon Profil
                </DialogTitle>
                <DialogContent sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        sx={{
                            width: 80, height: 80,
                            bgcolor: '#4318FF',
                            fontSize: '2rem',
                            mb: 2
                        }}
                    >
                        {user?.prenom?.charAt(0)}
                    </Avatar>

                    <Typography variant="h5" fontWeight="bold">
                        {user?.prenom} {user?.nom}
                    </Typography>

                    <Chip
                        label={user?.role}
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                    />

                    <Box sx={{ width: '100%', mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 1.5, bgcolor: '#F4F7FE', borderRadius: '10px' }}>
                            <EmailIcon color="primary" />
                            <Box>
                                <Typography variant="caption" color="text.secondary">Email</Typography>
                                <Typography variant="body2" fontWeight={500}>{user?.email}</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, bgcolor: '#F4F7FE', borderRadius: '10px' }}>
                            <BadgeIcon color="primary" />
                            <Box>
                                <Typography variant="caption" color="text.secondary">ID Utilisateur</Typography>
                                <Typography variant="body2" fontWeight={500}>{user?.id}</Typography>
                            </Box>
                        </Box>
                    </Box>

                </DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                    <Button onClick={() => setProfileOpen(false)} color="primary">
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProfessionalSidebar;
