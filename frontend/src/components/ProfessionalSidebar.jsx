import React from 'react';
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    Divider
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Composant Sidebar professionnel
 * Design moderne avec fond #1E2A32
 */
const ProfessionalSidebar = ({ open, onClose, menuItems, user, title, onNavigate }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        if (onNavigate) {
            onNavigate(path);
        } else {
            navigate(path);
        }
        if (onClose) onClose();
    };

    return (
        <Drawer
            variant="permanent"
            open={open}
            sx={{
                width: 290,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 290,
                    boxSizing: 'border-box',
                    backgroundColor: '#111C44', // Dark Navy from image
                    color: '#FFFFFF',
                    borderRight: 'none',
                    padding: '0 16px',
                }
            }}
        >
            {/* Brand / Logo Area */}
            <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', mb: 2 }}>
                <Box
                    sx={{
                        width: 40, height: 40,
                        backgroundColor: '#4318FF', // Brand Blue
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '20px'
                    }}
                >
                    GF
                </Box>
                <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1, letterSpacing: '0.5px' }}>
                        GESTION
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#A3AED0', fontWeight: 500 }}>
                        FORMATION
                    </Typography>
                </Box>
            </Box>

            {/* Menu Items */}
            <List sx={{ px: 0 }}>
                <Typography variant="caption" sx={{ pl: 2, mb: 1, display: 'block', color: '#A3AED0', fontWeight: 600, textTransform: 'uppercase' }}>
                    MENU PRINCIPAL
                </Typography>

                {menuItems.map((item) => {
                    // Vérification flexible pour l'état actif (exact match ou query param)
                    const isSelected = location.pathname === item.path ||
                        (location.search && item.path.includes(location.search));

                    return (
                        <ListItemButton
                            key={item.label}
                            selected={isSelected}
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                borderRadius: '12px',
                                mb: 1,
                                py: 1.5,
                                px: 2.5,
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
                                    minWidth: 40
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontWeight: isSelected ? 600 : 500,
                                    fontSize: '0.95rem',
                                    color: isSelected ? 'white' : '#A3AED0'
                                }}
                            />
                            {/* Active Indicator on right */}
                            {isSelected && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        right: -16, // to touch edge
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: 4,
                                        height: 36,
                                        backgroundColor: '#fff',
                                        borderRadius: '4px 0 0 4px',
                                        display: 'none' // Hidden for now, simpler design
                                    }}
                                />
                            )}
                        </ListItemButton>
                    );
                })}
            </List>

            {/* User Info / Footer */}
            <Box sx={{ mt: 'auto', mb: 4, p: 2, borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                {user && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                width: 40, height: 40,
                                borderRadius: '50%',
                                backgroundColor: '#1B254B',
                                border: '2px solid white',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                fontWeight: 'bold'
                            }}
                        >
                            {user.prenom?.charAt(0)}
                        </Box>
                        <Box>
                            <Typography variant="button" display="block" sx={{ fontWeight: 700, textTransform: 'none' }}>
                                {user.prenom} {user.nom}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#A3AED0', textTransform: 'capitalize' }}>
                                {user.role}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

export default ProfessionalSidebar;
