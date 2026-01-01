import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';

/**
 * Composant Boutons d'Action Rapide
 * Pour le dashboard admin - actions principales
 */
const QuickActions = ({ onNewFormation, onNewSession, onNewFormateur }) => {
    const actions = [
        {
            label: 'Nouvelle Formation',
            icon: <SchoolIcon />,
            onClick: onNewFormation,
            color: '#0F4C75'
        },
        {
            label: 'Planifier Session',
            icon: <EventIcon />,
            onClick: onNewSession,
            color: '#3282B8'
        },
        {
            label: 'Ajouter Formateur',
            icon: <PeopleIcon />,
            onClick: onNewFormateur,
            color: '#0F4C75'
        }
    ];

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                mb: 3
            }}
        >
            <Typography variant="h6" fontWeight={600} color="#1E2A32" gutterBottom>
                Actions Rapides
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        variant="contained"
                        startIcon={action.icon}
                        onClick={action.onClick}
                        sx={{
                            backgroundColor: action.color,
                            color: '#FFFFFF',
                            textTransform: 'none',
                            fontWeight: 500,
                            px: 3,
                            py: 1.5,
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: action.color === '#0F4C75' ? '#0A3552' : '#25628F'
                            }
                        }}
                    >
                        {action.label}
                    </Button>
                ))}
            </Box>
        </Paper>
    );
};

export default QuickActions;
