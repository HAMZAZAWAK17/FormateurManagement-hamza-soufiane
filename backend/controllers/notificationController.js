import pool from '../config/database.js';

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
            'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
            [userId]
        );
        res.json({ message: 'Notifications marquées comme lues' });
    } catch (error) {
        console.error('Erreur markAsRead:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
