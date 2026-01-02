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
                        padding: '12px 0'
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
                    '& .fc-prev-button, & .fc-next-button': {
                        backgroundColor: '#F4F7FE',
                        color: '#1B254B',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                            backgroundColor: '#E9EDF7',
                            color: '#4318FF'
                        }
                    },
                    '& .fc-daygrid-day-number': {
                        color: '#1B254B',
                        fontWeight: 600,
                        padding: '8px 12px'
                    },
                    '& .fc-daygrid-day': {
                        transition: 'background-color 0.2s',
                        '&:hover': {
                            backgroundColor: '#F7F9FF'
                        }
                    },
                    '& .fc-daygrid-day.fc-day-today': {
                        backgroundColor: '#F4F7FE !important'
                    },
                    '& .fc-event': {
                        borderRadius: '6px',
                        padding: '4px 8px',
                        border: 'none',
                        boxShadow: '0 2px 4px rgba(67, 24, 255, 0.15)',
                        fontSize: '0.813rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'transform 0.1s',
                        '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 8px rgba(67, 24, 255, 0.25)'
                        }
                    },
                    '& .fc-event-main': {
                        color: 'white'
                    },
                    // Remove today yellow highlight default
                    '& .fc-highlight': {
                        backgroundColor: '#E9EDF7'
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
                    dayMaxEvents={2}
                    moreLinkContent={(args) => `+ ${args.num} autres`}
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
