import express from 'express';
import {
    createFormateur,
    getAllFormateurs,
    getFormateurById,
    updateFormateur,
    deleteFormateur,
    registerFormateurExterne,
    getFormateursEnAttente,
    updateStatutFormateur,
    checkStatutByEmail
} from '../controllers/formateurController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes publiques pour les formateurs externes (Fonctionnalité 9)
router.post('/register-externe', registerFormateurExterne);
router.post('/check-statut', checkStatutByEmail);

// Toutes les routes suivantes nécessitent une authentification
router.use(authenticate);

// Routes pour gérer les demandes de formateurs externes (admin uniquement)
router.get('/en-attente', isAdmin, getFormateursEnAttente);
router.patch('/:id/statut', isAdmin, updateStatutFormateur);

// Routes CRUD standards pour les formateurs
router.post('/', isAdmin, createFormateur);
router.get('/', getAllFormateurs);
router.get('/:id', getFormateurById);
router.put('/:id', isAdmin, updateFormateur);
router.delete('/:id', isAdmin, deleteFormateur);

export default router;
