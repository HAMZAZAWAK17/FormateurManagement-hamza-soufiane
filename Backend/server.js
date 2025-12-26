import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';

import authRoutes from './routes/authRoutes.js';
import formationsRoutes from './routes/formationsRoutes.js';
import formateurRoutes from './routes/formateurRoutes.js';
import entrepriseRoutes from './routes/entrepriseRoutes.js';
import planificationRoutes from './routes/planificationRoutes.js';
import participantRoutes from './routes/participantRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/formations', formationsRoutes);
app.use('/api/formateurs', formateurRoutes);
app.use('/api/entreprises', entrepriseRoutes);
app.use('/api/planifications', planificationRoutes);
app.use('/api/participants', participantRoutes);

// Route de test
app.get('/', (req, res) => {
    res.json({
        message: 'API Formateur Management - Backend is running!',
        status: 'success'
    });
});

// Route de santé
app.get('/health', async (req, res) => {
    const dbConnected = await testConnection();
    res.json({
        status: 'ok',
        database: dbConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Démarrage du serveur
app.listen(PORT, async () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    await testConnection();
});
