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
            case 'success': return <CheckCircleIcon color="success" />;
            case 'warning': return <WarningIcon color="warning" />;
            default: return <InfoIcon color="info" />;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight={600} color="#1E2A32">
                    Notifications
                </Typography>
                <Button
                    startIcon={<DoneAllIcon />}
                    onClick={handleMarkAllRead}
                    variant="outlined"
                >
                    Tout marquer comme lu
                </Button>
            </Box>

            <Paper sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                <List sx={{ p: 0 }}>
                    {notifications.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">Aucune notification</Typography>
                        </Box>
                    ) : (
                        notifications.map((notif, index) => (
                            <React.Fragment key={notif.id}>
                                <ListItem
                                    alignItems="flex-start"
                                    sx={{
                                        bgcolor: notif.is_read ? 'transparent' : 'rgba(50, 130, 184, 0.08)',
                                        transition: 'background-color 0.3s'
                                    }}
                                >
                                    <ListItemIcon sx={{ mt: 0.5 }}>
                                        {getIcon(notif.type)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="subtitle1" fontWeight={notif.is_read ? 400 : 700}>
                                                    {notif.message}
                                                </Typography>
                                                {!notif.is_read && (
                                                    <Chip label="Nouveau" color="primary" size="small" sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.secondary">
                                                {dayjs(notif.created_at).format('DD MMMM YYYY à HH:mm')}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                {index < notifications.length - 1 && <Divider component="li" />}
                            </React.Fragment>
                        ))
                    )}
                </List>
            </Paper>
        </Container>
    );
};

export default Notifications;
