import express from 'express';
import {
    getAllSessions,
    createSession,
    updateSession,
    deleteSession
} from '../controllers/sessionController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Routes pour les sessions (planification)
 */

// GET /api/sessions - Récupérer toutes les sessions
router.get('/', getAllSessions);

// POST /api/sessions - Créer une session (Admin uniquement)
router.post('/', authMiddleware, roleMiddleware('admin'), createSession);

// PUT /api/sessions/:id - Mettre à jour une session (Admin uniquement)
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateSession);

// DELETE /api/sessions/:id - Supprimer une session (Admin uniquement)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteSession);

export default router;
