import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Avatar } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import dayjs from 'dayjs';

// Modern Pastel Palette
const EVENT_COLORS = [
    { bg: '#E3F2FD', text: '#1565C0', border: '#1565C0' }, // Blue
    { bg: '#F3E5F5', text: '#7B1FA2', border: '#7B1FA2' }, // Purple
    { bg: '#E8F5E9', text: '#2E7D32', border: '#2E7D32' }, // Green
    { bg: '#FFF3E0', text: '#EF6C00', border: '#EF6C00' }, // Orange
    { bg: '#FFEBEE', text: '#C62828', border: '#C62828' }, // Red
    { bg: '#E0F2F1', text: '#00695C', border: '#00695C' }, // Teal
];

const getColorForEvent = (id) => {
    const index = typeof id === 'number' ? id % EVENT_COLORS.length : (id.charCodeAt(0) || 0) % EVENT_COLORS.length;
    return EVENT_COLORS[index];
};

/**
 * Composant Calendrier Professionnel avec FullCalendar
 * Design "Rich" avec contenu personnalisé (Event Content Injection)
 */
const ProfessionalCalendar = ({
    events = [],
    onEventClick,
    onDateClick,
    editable = false,
    selectable = false,
    height = 'auto'
}) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Transformer les événements pour FullCalendar
    const calendarEvents = events.map((event, index) => {
        const colorSet = getColorForEvent(event.id || index);
        return {
            id: event.id,
            title: event.titre || event.title,
            start: event.date_debut || event.start,
            end: event.date_fin || event.end,
            // Pass styles to extendedProps to use in render function
            extendedProps: {
                ...event,
                formateur: event.formateur || 'Non assigné',
                lieu: event.lieu || 'En ligne',
                colorSet: colorSet
            }
        };
    });

    const handleEventClick = (info) => {
        setSelectedEvent(info.event);
        setDialogOpen(true);
        if (onEventClick) {
            onEventClick(info.event.extendedProps);
        }
    };

    const handleDateClick = (info) => {
        if (onDateClick) {
            onDateClick(info.date);
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedEvent(null);
    };

    // Custom Event Rendering
    const renderEventContent = (eventInfo) => {
        const { title, extendedProps } = eventInfo.event;
        const { formateur, lieu, colorSet } = extendedProps;
        const dateStr = `${dayjs(eventInfo.event.start).format('DD MMM')} - ${dayjs(eventInfo.event.end).format('DD MMM')}`;

        return (
            <Box
                sx={{
                    backgroundColor: colorSet?.bg || '#F4F7FE',
                    borderLeft: `3px solid ${colorSet?.border || '#4318FF'}`,
                    color: '#1B254B',
                    borderRadius: '6px',
                    p: 1,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    transition: 'transform 0.1s',
                    '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                    }
                }}
            >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.75rem', lineHeight: 1.2 }}>
                    {title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Avatar
                        sx={{
                            width: 16, height: 16,
                            fontSize: '0.6rem',
                            bgcolor: colorSet?.border
                        }}
                    >
                        {formateur?.charAt(0)}
                    </Avatar>
                    <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {formateur}
                    </Typography>
                </Box>

                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: colorSet?.text, fontWeight: 600, mt: 'auto' }}>
                    {dateStr}
                </Typography>

                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#6B7280' }}>
                    📍 {lieu}
                </Typography>
            </Box>
        );
    };

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: '20px',
                    backgroundColor: 'white',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                    '& .fc': {
                        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif"
                    },
                    '& .fc-theme-standard td, & .fc-theme-standard th': {
                        borderColor: '#E9EDF7'
                    },
                    '& .fc-col-header-cell': {
                        padding: '12px 0',
                        backgroundColor: '#FAFCFE'
                    },
                    '& .fc-col-header-cell-cushion': {
                        color: '#A3AED0',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px'
                    },
                    '& .fc-toolbar-title': {
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: '#1B254B',
                        textTransform: 'capitalize'
                    },
                    '& .fc-button': {
                        backgroundColor: '#F4F7FE',
                        color: '#4318FF',
                        border: 'none',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: '10px',
                        padding: '8px 16px',
                        boxShadow: 'none',
                        transition: 'all 0.2s',
                        '&:hover': {
                            backgroundColor: '#4318FF',
                            color: 'white'
                        },
                        '&:focus': {
                            boxShadow: 'none'
                        }
                    },
                    '& .fc-button-active': {
                        backgroundColor: '#4318FF !important',
                        color: 'white !important'
                    },
                    '& .fc-daygrid-day-number': {
                        color: '#1B254B',
                        fontWeight: 600,
                        padding: '8px 12px'
                    },
                    '& .fc-daygrid-day.fc-day-today': {
                        backgroundColor: '#F4F7FE !important'
                    },
                    // Reset default event styling so our custom content takes over cleanly
                    '& .fc-event': {
                        background: 'transparent',
                        border: 'none',
                        boxShadow: 'none',
                        '&:hover': { background: 'transparent' }
                    }
                }}
            >
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale={frLocale}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek'
                    }}
                    buttonText={{
                        today: "Aujourd'hui",
                        month: 'Mois',
                        week: 'Semaine'
                    }}
                    events={calendarEvents}
                    eventContent={renderEventContent}
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
                    editable={editable}
                    selectable={selectable}
                    selectMirror={true}
                    weekends={true}
                    height={height}
                    contentHeight="auto"
                    dayMaxEvents={3}
                />
            </Paper>

            {/* Dialog Détails Événement */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px'
                    }
                }}
            >
                {selectedEvent && (
                    <>
                        <DialogTitle sx={{ pb: 1, backgroundColor: selectedEvent.extendedProps.colorSet?.bg || 'white' }}>
                            <Typography variant="h6" fontWeight={600} color={selectedEvent.extendedProps.colorSet?.text || '#1E2A32'}>
                                {selectedEvent.title}
                            </Typography>
                        </DialogTitle>
                        <DialogContent sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Date
                                    </Typography>
                                    <Typography variant="body1">
                                        Du {dayjs(selectedEvent.start).format('DD/MM/YYYY HH:mm')} au {dayjs(selectedEvent.end).format('DD/MM/YYYY HH:mm')}
                                    </Typography>
                                </Box>

                                {selectedEvent.extendedProps.formateur && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Formateur
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem', bgcolor: selectedEvent.extendedProps.colorSet?.border }}>
                                                {selectedEvent.extendedProps.formateur?.charAt(0)}
                                            </Avatar>
                                            <Typography variant="body1">
                                                {selectedEvent.extendedProps.formateur}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}

                                {selectedEvent.extendedProps.lieu && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Lieu
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedEvent.extendedProps.lieu}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Button onClick={handleCloseDialog}>
                                Fermer
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
};

export default ProfessionalCalendar;
