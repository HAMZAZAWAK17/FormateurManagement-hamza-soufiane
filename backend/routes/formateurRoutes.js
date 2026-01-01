import express from 'express';
import {
    getAllFormateurs,
    getFormateurById,
    updateFormateur,
    getFormateurFormations,
    getFormateurEvaluations,
    getMesFormations,
    getMesEtudiants,
    addRessource,
    getRessources,
    deleteRessource,
    deleteFormateur
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

// DELETE /api/formateurs/:id - Supprimer un formateur (Admin uniquement)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteFormateur);

// GET /api/formateurs/:id/formations - Récupérer les SESSIONS d'un formateur (Legacy name)
router.get('/:id/formations', authMiddleware, getFormateurFormations);

// GET /api/formateurs/:id/evaluations - Récupérer les évaluations d'un formateur
router.get('/:id/evaluations', authMiddleware, getFormateurEvaluations);

// --- NOUVELLES ROUTES DASHBOARD FORMATEUR ---

// GET /api/formateurs/:id/my-formations - Récupérer les FORMATIONS assignées (fiches)
router.get('/:id/my-formations', authMiddleware, getMesFormations);

// GET /api/formateurs/:id/etudiants - Récupérer les étudiants inscrits
router.get('/:id/etudiants', authMiddleware, getMesEtudiants);

// --- GESTION RESSOURCES ---
// POST /api/formateurs/ressources
router.post('/ressources', authMiddleware, addRessource);

// GET /api/formateurs/formations/:formationId/ressources
router.get('/formations/:formationId/ressources', authMiddleware, getRessources);

// DELETE /api/formateurs/ressources/:id
router.delete('/ressources/:id', authMiddleware, deleteRessource);

export default router;
