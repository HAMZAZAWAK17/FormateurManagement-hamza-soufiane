import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Chip
} from '@mui/material';

/**
 * Composant Card professionnel
 * Design épuré avec ombres légères
 */
const ProfessionalCard = ({
    title,
    subtitle,
    description,
    status,
    statusColor = 'default',
    actions,
    icon,
    children,
    onClick
}) => {
    return (
        <Card
            onClick={onClick}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease-in-out',
                cursor: onClick ? 'pointer' : 'default',
                '&:hover': onClick ? {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                } : {}
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                {/* Header avec icône */}
                {(icon || status) && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 2
                        }}
                    >
                        {icon && (
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '8px',
                                    backgroundColor: '#BBE1FA',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#0F4C75'
                                }}
                            >
                                {icon}
                            </Box>
                        )}
                        {status && (
                            <Chip
                                label={status}
                                size="small"
                                color={statusColor}
                                sx={{
                                    fontWeight: 500,
                                    fontSize: '0.75rem'
                                }}
                            />
                        )}
                    </Box>
                )}

                {/* Titre */}
                {title && (
                    <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{
                            fontWeight: 600,
                            color: '#1E2A32',
                            mb: 1
                        }}
                    >
                        {title}
                    </Typography>
                )}

                {/* Sous-titre */}
                {subtitle && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                        sx={{ mb: 1.5 }}
                    >
                        {subtitle}
                    </Typography>
                )}

                {/* Description */}
                {description && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#6B7280',
                            lineHeight: 1.6
                        }}
                    >
                        {description}
                    </Typography>
                )}

                {/* Contenu personnalisé */}
                {children}
            </CardContent>

            {/* Actions */}
            {actions && (
                <CardActions sx={{ p: 2, pt: 0 }}>
                    {actions}
                </CardActions>
            )}
        </Card>
    );
};

export default ProfessionalCard;
