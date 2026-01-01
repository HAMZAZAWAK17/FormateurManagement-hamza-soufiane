import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (req, res) => {
    try {
        const { nom, prenom, email, password, role, telephone } = req.body;

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

        // Si c'est un formateur, créer son profil
        if (role === 'formateur') {
            await pool.query(
                'INSERT INTO formateurs (user_id) VALUES (?)',
                [result.insertId]
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
