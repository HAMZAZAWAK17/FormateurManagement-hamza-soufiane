import express from 'express';
import {
    createEvaluation,
    getMesEvaluations,
    getAllEvaluations
} from '../controllers/evaluationController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Routes pour les évaluations
 */

// POST /api/evaluations - Créer une évaluation (Participant)
router.post('/', authMiddleware, roleMiddleware('participant'), createEvaluation);

// GET /api/evaluations/mes-evaluations - Mes évaluations (Participant)
router.get('/mes-evaluations', authMiddleware, roleMiddleware('participant'), getMesEvaluations);

// GET /api/evaluations - Toutes les évaluations (Admin)
router.get('/', authMiddleware, roleMiddleware('admin'), getAllEvaluations);

export default router;
