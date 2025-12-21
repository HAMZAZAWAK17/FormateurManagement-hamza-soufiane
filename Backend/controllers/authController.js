import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const register = async (req, res) => {
    const { nom, prenom, email, password, role } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const [rows] = await pool.execute('SELECT * FROM utilisateurs WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        // Hacher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insérer l'utilisateur
        await pool.execute(
            'INSERT INTO utilisateurs (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [nom, prenom, email, hashedPassword, role]
        );

        res.status(201).json({ message: 'Utilisateur créé avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription.' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const [rows] = await pool.execute('SELECT * FROM utilisateurs WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Identifiants invalides.' });
        }

        const user = rows[0];

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Identifiants invalides.' });
        }

        // Créer le token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret_key_123',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la connexion.' });
    }
};

export const verifyEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const [rows] = await pool.execute('SELECT * FROM utilisateurs WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Aucun compte trouvé avec cet email.' });
        }
        res.json({ message: 'Email vérifié.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la vérification.' });
    }
};

export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await pool.execute('UPDATE utilisateurs SET password = ? WHERE email = ?', [hashedPassword, email]);
        res.json({ message: 'Mot de passe mis à jour avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du mot de passe.' });
    }
};
