import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import dayjs from 'dayjs';

/**
 * Composant Calendrier Professionnel avec FullCalendar
 * Design sobre avec palette professionnelle
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
    const calendarEvents = events.map(event => ({
        id: event.id,
        title: event.titre || event.title,
        start: event.date_debut || event.start,
        end: event.date_fin || event.end,
        backgroundColor: event.color || '#0F4C75',
        borderColor: event.color || '#0F4C75',
        extendedProps: {
            ...event
        }
    }));

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

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    '& .fc': {
                        fontFamily: 'Inter, Roboto, sans-serif'
                    },
                    '& .fc-toolbar-title': {
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: '#1E2A32'
                    },
                    '& .fc-button': {
                        backgroundColor: '#0F4C75',
                        border: 'none',
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': {
                            backgroundColor: '#0A3552'
                        },
                        '&:focus': {
                            boxShadow: 'none'
                        }
                    },
                    '& .fc-button-active': {
                        backgroundColor: '#0A3552'
                    },
                    '& .fc-daygrid-day-number': {
                        color: '#1E2A32',
                        fontWeight: 500
                    },
                    '& .fc-col-header-cell-cushion': {
                        color: '#6B7280',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '0.75rem'
                    },
                    '& .fc-event': {
                        borderRadius: '4px',
                        padding: '2px 4px',
                        fontSize: '0.813rem',
                        fontWeight: 500,
                        cursor: 'pointer'
                    },
                    '& .fc-daygrid-day-top': {
                        justifyContent: 'center'
                    },
                    '& .fc-daygrid-day.fc-day-today': {
                        backgroundColor: 'rgba(50, 130, 184, 0.1)'
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
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
                    editable={editable}
                    selectable={selectable}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    height={height}
                    contentHeight="auto"
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
                        <DialogTitle sx={{ pb: 1 }}>
                            <Typography variant="h6" fontWeight={600} color="#1E2A32">
                                {selectedEvent.title}
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Date de début
                                    </Typography>
                                    <Typography variant="body1">
                                        {dayjs(selectedEvent.start).format('DD/MM/YYYY HH:mm')}
                                    </Typography>
                                </Box>
                                {selectedEvent.end && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Date de fin
                                        </Typography>
                                        <Typography variant="body1">
                                            {dayjs(selectedEvent.end).format('DD/MM/YYYY HH:mm')}
                                        </Typography>
                                    </Box>
                                )}
                                {selectedEvent.extendedProps.formateur && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Formateur
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedEvent.extendedProps.formateur}
                                        </Typography>
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
