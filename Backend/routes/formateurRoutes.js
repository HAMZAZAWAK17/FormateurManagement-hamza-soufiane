import express from 'express';
import {
    createFormateur,
    getAllFormateurs,
    getFormateurById,
    updateFormateur,
    deleteFormateur
} from '../controllers/formateurController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Toutes les routes pour les formateurs nécessitent une authentification admin ou assistant
// Mais pour simplifier selon la demande (L'admin ajoute...), on peut restreindre à isAdmin pour la création
router.use(authenticate);

router.post('/', isAdmin, createFormateur);
router.get('/', getAllFormateurs);
router.get('/:id', getFormateurById);
router.put('/:id', isAdmin, updateFormateur);
router.delete('/:id', isAdmin, deleteFormateur);

export default router;
