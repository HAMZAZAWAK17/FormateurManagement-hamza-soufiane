import express from 'express';
import { createFormation, getAllFormations, getFormationById, updateFormation, deleteFormation } from '../controllers/formationController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes publiques (lecture seule)
router.get('/', getAllFormations);
router.get('/:id', getFormationById);

// Routes protégées (admin uniquement)
router.post('/', authenticate, isAdmin, createFormation);
router.put('/:id', authenticate, isAdmin, updateFormation);
router.delete('/:id', authenticate, isAdmin, deleteFormation);

export default router;


