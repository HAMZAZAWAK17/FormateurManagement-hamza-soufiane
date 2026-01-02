import pool from '../config/database.js';

/**
 * Helper interne pour créer une notification
 */
export const createNotificationHelper = async (userId, message, type = 'info') => {
    try {
        await pool.query(
            'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
            [userId, message, type]
        );
    } catch (error) {
        console.error('Erreur lors de la création de la notification interne:', error);
    }
};

/**
 * Récupérer mes notifications
 */
export const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const [notifications] = await pool.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        res.json(notifications);
    } catch (error) {
        console.error('Erreur récupération notifications:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Marquer toutes les notifications comme lues
 */
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await pool.query(
            'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
            [userId]
        );
        res.json({ message: 'Notifications marquées comme lues' });
    } catch (error) {
        console.error('Erreur markAsRead:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Créer une notification (Admin)
 */
export const createNotificationHandler = async (req, res) => {
    try {
        const { user_id, message, type } = req.body;
        if (!user_id || !message) {
            return res.status(400).json({ message: 'User ID et message requis' });
        }
        await createNotificationHelper(user_id, message, type);
        res.status(201).json({ message: 'Notification envoyée' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Supprimer une notification
 */
export const deleteNotification = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifId = req.params.id;

        const [result] = await pool.query(
            'DELETE FROM notifications WHERE id = ? AND user_id = ?',
            [notifId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Notification non trouvée' });
        }

        res.json({ message: 'Notification supprimée' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
