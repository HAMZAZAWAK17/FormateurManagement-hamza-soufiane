import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Chip,
    Button,
    Divider
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { notificationService } from '../services/api';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const res = await notificationService.getAll();
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllRead();
            loadNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircleIcon sx={{ color: '#05CD99' }} />;
            case 'warning': return <WarningIcon sx={{ color: '#FFB547' }} />;
            default: return <InfoIcon sx={{ color: '#4318FF' }} />;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight={700} color="#1B254B">
                    Notifications
                </Typography>
                <Button
                    startIcon={<DoneAllIcon />}
                    onClick={handleMarkAllRead}
                    sx={{
                        color: '#4318FF',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { bgcolor: 'rgba(67, 24, 255, 0.1)' }
                    }}
                >
                    Tout marquer comme lu
                </Button>
            </Box>

            <Paper sx={{
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)',
                border: 'none',
                bgcolor: 'white'
            }}>
                <List sx={{ p: 0 }}>
                    {notifications.length === 0 ? (
                        <Box sx={{ p: 6, textAlign: 'center' }}>
                            <Typography color="#A3AED0">Aucune notification pour le moment.</Typography>
                        </Box>
                    ) : (
                        notifications.map((notif, index) => (
                            <React.Fragment key={notif.id}>
                                <ListItem
                                    alignItems="flex-start"
                                    sx={{
                                        bgcolor: notif.is_read ? 'transparent' : '#F4F7FE',
                                        transition: 'background-color 0.3s',
                                        py: 3,
                                        px: 3,
                                        borderLeft: notif.is_read ? '4px solid transparent' : '4px solid #4318FF'
                                    }}
                                >
                                    <ListItemIcon sx={{ mt: 0.5, minWidth: 40 }}>
                                        {getIcon(notif.type)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="subtitle1" fontWeight={notif.is_read ? 600 : 700} color="#1B254B">
                                                    {notif.message}
                                                </Typography>
                                                {!notif.is_read && (
                                                    <Chip
                                                        label="Nouveau"
                                                        size="small"
                                                        sx={{
                                                            ml: 1, height: 20, fontSize: '0.65rem', fontWeight: 700,
                                                            bgcolor: '#4318FF', color: 'white'
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="#A3AED0" fontWeight={500}>
                                                {dayjs(notif.created_at).locale('fr').format('DD MMMM YYYY à HH:mm')}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                {index < notifications.length - 1 && <Divider component="li" sx={{ borderColor: '#E9EDF7' }} />}
                            </React.Fragment>
                        ))
                    )}
                </List>
            </Paper>
        </Container>
    );
};

export default Notifications;
