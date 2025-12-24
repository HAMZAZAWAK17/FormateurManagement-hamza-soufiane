import pool from '../config/database.js';

// Créer une nouvelle entreprise
export const createEntreprise = async (req, res) => {
    const { nom, adresse, telephone, url, email } = req.body;

    try {
        // Validation des champs requis
        if (!nom || !adresse || !telephone || !email) {
            return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
        }

        // Validation du format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Format d\'email invalide.' });
        }

        // Validation du format téléphone (basique)
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(telephone)) {
            return res.status(400).json({ message: 'Format de téléphone invalide.' });
        }

        // Insérer l'entreprise
        const [result] = await pool.execute(
            'INSERT INTO entreprises (nom, adresse, telephone, url, email) VALUES (?, ?, ?, ?, ?)',
            [nom, adresse, telephone, url || null, email]
        );

        res.status(201).json({
            message: 'Entreprise créée avec succès.',
            entreprise: {
                id: result.insertId,
                nom,
                adresse,
                telephone,
                url,
                email
            }
        });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Une entreprise avec cet email existe déjà.' });
        }
        res.status(500).json({ message: 'Erreur lors de la création de l\'entreprise.' });
    }
};

// Récupérer toutes les entreprises
export const getAllEntreprises = async (req, res) => {
    try {
        const [entreprises] = await pool.execute('SELECT * FROM entreprises ORDER BY id ASC');
        res.json(entreprises);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des entreprises.' });
    }
};

// Récupérer une entreprise par ID
export const getEntrepriseById = async (req, res) => {
    const { id } = req.params;

    try {
        const [entreprises] = await pool.execute('SELECT * FROM entreprises WHERE id = ?', [id]);

        if (entreprises.length === 0) {
            return res.status(404).json({ message: 'Entreprise non trouvée.' });
        }

        res.json(entreprises[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'entreprise.' });
    }
};

// Mettre à jour une entreprise
export const updateEntreprise = async (req, res) => {
    const { id } = req.params;
    const { nom, adresse, telephone, url, email } = req.body;

    try {
        // Vérifier si l'entreprise existe
        const [entreprises] = await pool.execute('SELECT * FROM entreprises WHERE id = ?', [id]);
        if (entreprises.length === 0) {
            return res.status(404).json({ message: 'Entreprise non trouvée.' });
        }

        // Validation des champs requis
        if (!nom || !adresse || !telephone || !email) {
            return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
        }

        // Validation du format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Format d\'email invalide.' });
        }

        // Validation du format téléphone
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(telephone)) {
            return res.status(400).json({ message: 'Format de téléphone invalide.' });
        }

        // Mettre à jour l'entreprise
        await pool.execute(
            'UPDATE entreprises SET nom = ?, adresse = ?, telephone = ?, url = ?, email = ? WHERE id = ?',
            [nom, adresse, telephone, url || null, email, id]
        );

        res.json({ message: 'Entreprise mise à jour avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'entreprise.' });
    }
};

// Supprimer une entreprise
export const deleteEntreprise = async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier si l'entreprise existe
        const [entreprises] = await pool.execute('SELECT * FROM entreprises WHERE id = ?', [id]);
        if (entreprises.length === 0) {
            return res.status(404).json({ message: 'Entreprise non trouvée.' });
        }

        // Supprimer l'entreprise
        await pool.execute('DELETE FROM entreprises WHERE id = ?', [id]);

        res.json({ message: 'Entreprise supprimée avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'entreprise.' });
    }
};
