import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection, initDatabase } from './config/database.js';

// Import des routes
import authRoutes from './routes/authRoutes.js';
import formationRoutes from './routes/formationRoutes.js';
import formateurRoutes from './routes/formateurRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import inscriptionRoutes from './routes/inscriptionRoutes.js';
import evaluationRoutes from './routes/evaluationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Middlewares globaux
 */
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Routes API
 */
app.use('/api/auth', authRoutes);
app.use('/api/formations', formationRoutes);
app.use('/api/formateurs', formateurRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/inscriptions', inscriptionRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/notifications', notificationRoutes);

/**
 * Route de santé (health check)
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API de gestion de formation opérationnelle',
        timestamp: new Date().toISOString()
    });
});

/**
 * Route 404
 */
app.use((req, res) => {
    res.status(404).json({
        message: 'Route non trouvée'
    });
});

/**
 * Gestionnaire d'erreurs global
 */
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

/**
 * Démarrage du serveur
 */
const startServer = async () => {
    try {
        // Tester la connexion à la base de données
        const isConnected = await testConnection();

        if (!isConnected) {
            console.error('❌ Impossible de se connecter à MySQL');
            console.log('📝 Vérifiez votre fichier .env et assurez-vous que MySQL est démarré');
            process.exit(1);
        }

        // Initialiser la base de données (créer les tables)
        await initDatabase();

        // Démarrer le serveur
        app.listen(PORT, () => {
            console.log('\n🚀 ========================================');
            console.log(`✅ Serveur démarré sur le port ${PORT}`);
            console.log(`🌐 API disponible sur http://localhost:${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
            console.log('🔐 Authentification JWT activée');
            console.log('========================================\n');
        });

    } catch (error) {
        console.error('❌ Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
};

// Lancer le serveur
startServer();
