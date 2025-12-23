import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export const createFormateur = async (req, res) => {
    const { nom, prenom, email, mots_cles, remarques, createAccount, password } = req.body;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let utilisateur_id = null;

        // Check if user already exists
        const [existingUser] = await connection.execute('SELECT id FROM utilisateurs WHERE email = ?', [email]);

        if (createAccount) {
            if (existingUser.length > 0) {
                return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
            }

            // Hacher le mot de passe
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password || 'formateur123', salt);

            // Créer le compte utilisateur
            const [userResult] = await connection.execute(
                'INSERT INTO utilisateurs (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)',
                [nom, prenom, email, hashedPassword, 'formateur']
            );
            utilisateur_id = userResult.insertId;
        } else if (existingUser.length > 0) {
            utilisateur_id = existingUser[0].id;
        }

        // Insérer les détails du formateur
        await connection.execute(
            'INSERT INTO formateurs (utilisateur_id, nom, prenom, email, mots_cles, remarques) VALUES (?, ?, ?, ?, ?, ?)',
            [utilisateur_id, nom, prenom, email, mots_cles, remarques]
        );

        await connection.commit();
        res.status(201).json({ message: 'Formateur ajouté avec succès.' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du formateur.' });
    } finally {
        connection.release();
    }
};

export const getAllFormateurs = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM formateurs ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des formateurs.' });
    }
};

export const getFormateurById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.execute('SELECT * FROM formateurs WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Formateur non trouvé.' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération du formateur.' });
    }
};

export const updateFormateur = async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, email, mots_cles, remarques } = req.body;

    try {
        await pool.execute(
            'UPDATE formateurs SET nom = ?, prenom = ?, email = ?, mots_cles = ?, remarques = ? WHERE id = ?',
            [nom, prenom, email, mots_cles, remarques, id]
        );
        res.json({ message: 'Formateur mis à jour avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du formateur.' });
    }
};

export const deleteFormateur = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM formateurs WHERE id = ?', [id]);
        res.json({ message: 'Formateur supprimé avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression du formateur.' });
    }
};
