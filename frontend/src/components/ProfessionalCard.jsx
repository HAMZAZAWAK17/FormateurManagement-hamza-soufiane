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
                borderRadius: '20px',
                boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)',
                backgroundColor: '#FFFFFF',
                border: 'none',
                '&:hover': onClick ? {
                    transform: 'translateY(-5px)',
                    boxShadow: '0px 25px 50px rgba(112, 144, 176, 0.2)'
                } : {}
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: '24px !important' }}>
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
                                    width: 56,
                                    height: 56,
                                    borderRadius: '50%', // Circular icon
                                    backgroundColor: '#F4F7FE', // Light background for icon
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#4318FF', // Brand Blue
                                    fontSize: '1.5rem'
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
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    borderRadius: '8px'
                                }}
                            />
                        )}
                    </Box>
                )}

                {/* Titre */}
                {title && (
                    <Typography
                        variant="h5" // Bigger title
                        component="h3"
                        sx={{
                            fontWeight: 700,
                            color: '#1B254B', // Dark Navy
                            mb: 0.5,
                            letterSpacing: '-0.02em'
                        }}
                    >
                        {title}
                    </Typography>
                )}

                {/* Sous-titre - Moved below title generally, generally small */}
                {subtitle && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#A3AED0',
                            fontWeight: 500,
                            fontSize: '0.875rem'
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}

                {/* Description */}
                {description && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#A3AED0',
                            lineHeight: 1.6,
                            mt: 2
                        }}
                    >
                        {description}
                    </Typography>
                )}

                {/* Contenu personnalisé */}
                {children && <Box sx={{ mt: 2 }}>{children}</Box>}
            </CardContent>

            {/* Actions */}
            {actions && (
                <CardActions sx={{ p: 3, pt: 0 }}>
                    {actions}
                </CardActions>
            )}
        </Card>
    );
};

export default ProfessionalCard;
