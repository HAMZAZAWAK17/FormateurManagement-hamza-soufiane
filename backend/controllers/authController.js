import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (req, res) => {
    try {
        const { nom, prenom, email, password, role, telephone, specialite, bio } = req.body;

        // Validation simple
        if (!nom || !prenom || !email || !password || !role) {
            return res.status(400).json({
                message: 'Tous les champs obligatoires doivent être remplis'
            });
        }

        // Vérifier si l'email existe déjà
        const [existingUsers] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                message: 'Cet email est déjà utilisé'
            });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer le nouvel utilisateur
        const [result] = await pool.query(
            `INSERT INTO users (nom, prenom, email, password, role, telephone) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [nom, prenom, email, hashedPassword, role, telephone]
        );

        // Si c'est un formateur, créer son profil avec les détails
        if (role === 'formateur') {
            await pool.query(
                'INSERT INTO formateurs (user_id, competences, remarques) VALUES (?, ?, ?)',
                [result.insertId, specialite || null, bio || null]
            );
        }

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({
            message: 'Erreur serveur lors de l\'inscription'
        });
    }
};

/**
 * Connexion d'un utilisateur
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email et mot de passe requis'
            });
        }

        // Rechercher l'utilisateur
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            });
        }

        const user = users[0];

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Générer le token JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        // Retourner les informations (sans le mot de passe)
        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role,
                telephone: user.telephone
            }
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({
            message: 'Erreur serveur lors de la connexion'
        });
    }
};

/**
 * Récupérer le profil de l'utilisateur connecté
 */
export const getProfile = async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, nom, prenom, email, role, telephone, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }

        res.json(users[0]);

    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Demande de réinitialisation de mot de passe
 * Génère un token de réinitialisation valide 1 heure
 */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email requis'
            });
        }

        // Vérifier si l'utilisateur existe
        const [users] = await pool.query(
            'SELECT id, nom, prenom, email FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            // Pour des raisons de sécurité, on ne révèle pas si l'email existe
            return res.json({
                message: 'Si cet email existe, un lien de réinitialisation a été envoyé'
            });
        }

        const user = users[0];

        // Générer un token de réinitialisation (valide 1 heure)
        const resetToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                type: 'reset_password'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Dans une vraie application, vous enverriez un email ici
        console.log(`🔐 Token de réinitialisation pour ${email}:`, resetToken);

        res.json({
            message: 'Un lien de réinitialisation a été généré',
            resetToken, // UNIQUEMENT POUR LE DÉVELOPPEMENT
            resetLink: `http://localhost:5173/reset-password?token=${resetToken}`
        });

    } catch (error) {
        console.error('Erreur lors de la demande de réinitialisation:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Réinitialisation du mot de passe avec token
 */
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                message: 'Token et nouveau mot de passe requis'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'Le mot de passe doit contenir au moins 6 caractères'
            });
        }

        // Vérifier et décoder le token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded.type !== 'reset_password') {
                return res.status(400).json({
                    message: 'Token invalide'
                });
            }
        } catch (err) {
            return res.status(400).json({
                message: 'Token invalide ou expiré'
            });
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe
        const [result] = await pool.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, decoded.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }

        res.json({
            message: 'Mot de passe réinitialisé avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la réinitialisation:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};
