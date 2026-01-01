import express from 'express';
import {
    getAllFormateurs,
    getFormateurById,
    updateFormateur,
    getFormateurFormations,
    getFormateurEvaluations
} from '../controllers/formateurController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Routes pour les formateurs
 */

// GET /api/formateurs - Récupérer tous les formateurs
router.get('/', authMiddleware, getAllFormateurs);

// GET /api/formateurs/:id - Récupérer un formateur par ID
router.get('/:id', authMiddleware, getFormateurById);

// PUT /api/formateurs/:id - Mettre à jour un formateur (Admin uniquement)
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateFormateur);

// GET /api/formateurs/:id/formations - Récupérer les formations d'un formateur
router.get('/:id/formations', authMiddleware, getFormateurFormations);

// GET /api/formateurs/:id/evaluations - Récupérer les évaluations d'un formateur
router.get('/:id/evaluations', authMiddleware, getFormateurEvaluations);

export default router;
