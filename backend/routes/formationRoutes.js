import express from 'express';
import {
    getAllFormations,
    getFormationById,
    createFormation,
    updateFormation,
    deleteFormation
} from '../controllers/formationController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Routes pour les formations
 */

// GET /api/formations - Récupérer toutes les formations (public)
router.get('/', getAllFormations);

// GET /api/formations/:id - Récupérer une formation par ID (public)
router.get('/:id', getFormationById);

// POST /api/formations - Créer une formation (Admin uniquement)
router.post('/', authMiddleware, roleMiddleware('admin'), createFormation);

// PUT /api/formations/:id - Mettre à jour une formation (Admin uniquement)
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateFormation);

// DELETE /api/formations/:id - Supprimer une formation (Admin uniquement)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteFormation);

export default router;
