import express from 'express';
import { register, login, getProfile, forgotPassword, resetPassword } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Routes d'authentification
 */

// POST /api/auth/register - Inscription
router.post('/register', register);

// POST /api/auth/login - Connexion
router.post('/login', login);

// GET /api/auth/profile - Profil utilisateur (protégé)
router.get('/profile', authMiddleware, getProfile);

// POST /api/auth/forgot-password - Demande de réinitialisation
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password - Réinitialisation du mot de passe
router.post('/reset-password', resetPassword);

export default router;
