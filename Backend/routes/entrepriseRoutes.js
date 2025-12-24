import express from 'express';
import {
    createEntreprise,
    getAllEntreprises,
    getEntrepriseById,
    updateEntreprise,
    deleteEntreprise
} from '../controllers/entrepriseController.js';

const router = express.Router();

// Routes CRUD pour les entreprises
router.post('/', createEntreprise);           // Créer une entreprise
router.get('/', getAllEntreprises);           // Récupérer toutes les entreprises
router.get('/:id', getEntrepriseById);        // Récupérer une entreprise par ID
router.put('/:id', updateEntreprise);         // Mettre à jour une entreprise
router.delete('/:id', deleteEntreprise);      // Supprimer une entreprise

export default router;
