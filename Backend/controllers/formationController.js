import pool from '../config/database.js';

export const createFormation = async (req, res) => {
    const { titre, nombre_heures, cout, objectifs, programme_detaille } = req.body;

    try {
        // Validation des champs requis
        if (!titre || !nombre_heures || !cout || !objectifs || !programme_detaille) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        // Validation des types
        if (isNaN(nombre_heures) || nombre_heures <= 0) {
            return res.status(400).json({ message: 'Le nombre d\'heures doit être un nombre positif.' });
        }

        if (isNaN(cout) || cout < 0) {
            return res.status(400).json({ message: 'Le coût doit être un nombre positif ou zéro.' });
        }

        // Insérer la formation
        const [result] = await pool.execute(
            'INSERT INTO formations (titre, nombre_heures, cout, objectifs, programme_detaille) VALUES (?, ?, ?, ?, ?)',
            [titre, nombre_heures, cout, objectifs, programme_detaille]
        );

        res.status(201).json({
            message: 'Formation créée avec succès.',
            formation: {
                id: result.insertId,
                titre,
                nombre_heures,
                cout,
                objectifs,
                programme_detaille
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création de la formation.' });
    }
};

export const getAllFormations = async (req, res) => {
    try {
        const [formations] = await pool.execute('SELECT * FROM formations ORDER BY id ASC');
        res.json(formations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des formations.' });
    }
};

export const getFormationById = async (req, res) => {
    const { id } = req.params;

    try {
        const [formations] = await pool.execute('SELECT * FROM formations WHERE id = ?', [id]);

        if (formations.length === 0) {
            return res.status(404).json({ message: 'Formation non trouvée.' });
        }

        res.json(formations[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la formation.' });
    }
};

export const updateFormation = async (req, res) => {
    const { id } = req.params;
    const { titre, nombre_heures, cout, objectifs, programme_detaille } = req.body;

    try {
        // Vérifier si la formation existe
        const [formations] = await pool.execute('SELECT * FROM formations WHERE id = ?', [id]);
        if (formations.length === 0) {
            return res.status(404).json({ message: 'Formation non trouvée.' });
        }

        // Validation des champs requis
        if (!titre || !nombre_heures || !cout || !objectifs || !programme_detaille) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        // Validation des types
        if (isNaN(nombre_heures) || nombre_heures <= 0) {
            return res.status(400).json({ message: 'Le nombre d\'heures doit être un nombre positif.' });
        }

        if (isNaN(cout) || cout < 0) {
            return res.status(400).json({ message: 'Le coût doit être un nombre positif ou zéro.' });
        }

        // Mettre à jour la formation
        await pool.execute(
            'UPDATE formations SET titre = ?, nombre_heures = ?, cout = ?, objectifs = ?, programme_detaille = ? WHERE id = ?',
            [titre, nombre_heures, cout, objectifs, programme_detaille, id]
        );

        res.json({ message: 'Formation mise à jour avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la formation.' });
    }
};

export const deleteFormation = async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier si la formation existe
        const [formations] = await pool.execute('SELECT * FROM formations WHERE id = ?', [id]);
        if (formations.length === 0) {
            return res.status(404).json({ message: 'Formation non trouvée.' });
        }

        // Supprimer la formation
        await pool.execute('DELETE FROM formations WHERE id = ?', [id]);

        res.json({ message: 'Formation supprimée avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la formation.' });
    }
};


