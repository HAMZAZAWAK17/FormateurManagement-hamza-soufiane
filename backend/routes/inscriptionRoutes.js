import express from 'express';
import {
    inscrireParticipant,
    getMesInscriptions,
    annulerInscription,
    getAllInscriptions
} from '../controllers/inscriptionController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Routes pour les inscriptions
 */

// POST /api/inscriptions - S'inscrire à une session (Participant)
router.post('/', authMiddleware, roleMiddleware('participant'), inscrireParticipant);

// GET /api/inscriptions/mes-inscriptions - Mes inscriptions (Participant)
router.get('/mes-inscriptions', authMiddleware, roleMiddleware('participant'), getMesInscriptions);

// DELETE /api/inscriptions/:id - Annuler une inscription (Participant)
router.delete('/:id', authMiddleware, roleMiddleware('participant'), annulerInscription);

// GET /api/inscriptions - Toutes les inscriptions (Admin)
router.get('/', authMiddleware, roleMiddleware('admin'), getAllInscriptions);

export default router;
