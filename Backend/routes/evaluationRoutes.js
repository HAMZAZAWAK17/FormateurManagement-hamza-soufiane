import express from 'express';
import { createEvaluation, getEvaluationsByFormation, getFormateurStats, getAllEvaluations } from '../controllers/evaluationController.js';

const router = express.Router();

// Route publique pour soumettre une évaluation
router.post('/', createEvaluation);

// Route Admin pour tout voir
router.get('/', getAllEvaluations);

// Routes pour consulter
router.get('/formation/:id', getEvaluationsByFormation);
router.get('/formateur/:id/stats', getFormateurStats);

export default router;
