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
const ProfessionalSidebar = ({ open, onClose, menuItems, user, title }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        navigate(path);
        if (onClose) onClose();
    };

    return (
        <Drawer
            variant="permanent"
            open={open}
            sx={{
                width: 280,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 280,
                    boxSizing: 'border-box',
                    backgroundColor: '#1E2A32',
                    color: '#FFFFFF',
                    borderRight: 'none'
                }
            }}
        >
            {/* Header avec titre */}
            <Box
                sx={{
                    p: 3,
                    pb: 2
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                        color: '#FFFFFF',
                        mb: 0.5
                    }}
                >
                    {title || 'Dashboard'}
                </Typography>
                {user && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#BBE1FA',
                            opacity: 0.8
                        }}
                    >
                        {user.prenom} {user.nom}
                    </Typography>
                )}
            </Box>

            <Divider sx={{ borderColor: 'rgba(187, 225, 250, 0.1)', mx: 2 }} />

            {/* Menu Items */}
            <List sx={{ px: 2, py: 2 }}>
                {menuItems.map((item) => {
                    const isSelected = location.pathname === item.path;

                    return (
                        <ListItemButton
                            key={item.path}
                            selected={isSelected}
                            onClick={() => handleNavigation(item.path)}
                            sx={{
                                borderRadius: '8px',
                                mb: 1,
                                py: 1.5,
                                px: 2,
                                backgroundColor: isSelected ? 'rgba(50, 130, 184, 0.15)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: isSelected
                                        ? 'rgba(50, 130, 184, 0.25)'
                                        : 'rgba(50, 130, 184, 0.08)'
                                },
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(50, 130, 184, 0.15)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(50, 130, 184, 0.25)'
                                    }
                                }
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: isSelected ? '#5BA3D0' : '#7BA5C0',
                                    minWidth: 40
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontWeight: isSelected ? 600 : 500,
                                    fontSize: '0.938rem',
                                    color: '#FFFFFF'
                                }}
                            />
                        </ListItemButton>
                    );
                })}
            </List>
        </Drawer>
    );
};

export default ProfessionalSidebar;
