import jwt from 'jsonwebtoken';

/**
 * Middleware d'authentification JWT
 * Vérifie la présence et la validité du token
 */
export const authMiddleware = (req, res, next) => {
    try {
        // Récupérer le token depuis le header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Accès non autorisé - Token manquant'
            });
        }

        // Extraire le token
        const token = authHeader.split(' ')[1];

        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ajouter les informations de l'utilisateur à la requête
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token invalide ou expiré'
        });
    }
};

/**
 * Middleware de vérification de rôle
 * @param {Array} roles - Rôles autorisés
 */
export const roleMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'Authentification requise'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Accès interdit - Permissions insuffisantes'
            });
        }

        next();
    };
};
