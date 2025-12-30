import express from 'express';
import * as participantController from '../controllers/participantController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route publique pour l'inscription
router.post('/inscrire', participantController.inscrireParticipant);
router.post('/check-statut', participantController.checkStatutByEmail);

// Routes protégées (Admin/Assistant)
router.use(authenticate);

router.get('/', participantController.getAllParticipants);
router.get('/mes-formations', participantController.getMesFormations);
router.get('/stats', participantController.getStatsParticipants);
router.get('/:id', participantController.getParticipantById);
router.put('/:id/statut', participantController.updateParticipantStatut);
router.delete('/:id', participantController.deleteParticipant);

// Routes pour les sessions individuelles
router.post('/sessions', participantController.createSessionIndividuelle);
router.get('/sessions/list', participantController.getAllSessionsIndividuelles);
router.put('/sessions/:id/affecter-formateur', participantController.affecterFormateurSession);
router.post('/sessions/affecter-participants', participantController.affecterParticipantsSession);



export default router;
