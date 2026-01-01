import express from 'express';
import { getMyNotifications, markAllAsRead } from '../controllers/notificationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getMyNotifications);
router.put('/read-all', markAllAsRead);

export default router;
