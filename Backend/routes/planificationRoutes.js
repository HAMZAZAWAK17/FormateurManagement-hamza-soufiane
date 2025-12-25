import express from 'express';
import * as planificationController from '../controllers/planificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Routes CRUD pour les planifications
router.post('/', planificationController.createPlanification);
router.get('/', planificationController.getAllPlanifications);
router.get('/stats', planificationController.getStatistiques);
router.get('/:id', planificationController.getPlanificationById);
router.put('/:id', planificationController.updatePlanification);
router.delete('/:id', planificationController.deletePlanification);

export default router;
