import pool from '../config/database.js';

/**
 * Récupérer toutes les formations (route publique)
 */
export const getAllFormations = async (req, res) => {
    try {
        const { categorie, ville } = req.query;

        let query = `
            SELECT f.*, CONCAT(u.prenom, ' ', u.nom) as formateur_nom
            FROM formations f
            LEFT JOIN formateurs fmt ON f.formateur_id = fmt.id
            LEFT JOIN users u ON fmt.user_id = u.id
            WHERE 1=1
        `;
        const params = [];

        // Filtres optionnels
        if (categorie) {
            query += ' AND f.categorie = ?';
            params.push(categorie);
        }

        if (ville) {
            query += ' AND f.ville = ?';
            params.push(ville);
        }

        query += ' ORDER BY f.created_at DESC';

        const [formations] = await pool.query(query, params);
        res.json(formations);

    } catch (error) {
        console.error('Erreur lors de la récupération des formations:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Récupérer une formation par ID
 */
export const getFormationById = async (req, res) => {
    try {
        const [formations] = await pool.query(
            `SELECT f.*, CONCAT(u.prenom, ' ', u.nom) as formateur_nom
             FROM formations f
             LEFT JOIN formateurs fmt ON f.formateur_id = fmt.id
             LEFT JOIN users u ON fmt.user_id = u.id
             WHERE f.id = ?`,
            [req.params.id]
        );

        if (formations.length === 0) {
            return res.status(404).json({
                message: 'Formation non trouvée'
            });
        }

        res.json(formations[0]);

    } catch (error) {
        console.error('Erreur lors de la récupération de la formation:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Créer une nouvelle formation (Admin uniquement)
 */
export const createFormation = async (req, res) => {
    try {
        const { titre, description, heures, cout, objectifs, programme, categorie, ville, formateur_id } = req.body;

        // Validation
        if (!titre || !heures || !cout) {
            return res.status(400).json({
                message: 'Titre, heures et coût sont obligatoires'
            });
        }

        const [result] = await pool.query(
            `INSERT INTO formations (titre, description, heures, cout, objectifs, programme, categorie, ville, formateur_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [titre, description, heures, cout, objectifs, programme, categorie, ville, formateur_id || null]
        );

        res.status(201).json({
            message: 'Formation créée avec succès',
            formationId: result.insertId
        });

    } catch (error) {
        console.error('Erreur lors de la création de la formation:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Mettre à jour une formation (Admin uniquement)
 */
export const updateFormation = async (req, res) => {
    try {
        const { titre, description, heures, cout, objectifs, programme, categorie, ville, formateur_id } = req.body;

        const [result] = await pool.query(
            `UPDATE formations 
       SET titre = ?, description = ?, heures = ?, cout = ?, 
           objectifs = ?, programme = ?, categorie = ?, ville = ?, formateur_id = ?
       WHERE id = ?`,
            [titre, description, heures, cout, objectifs, programme, categorie, ville, formateur_id || null, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Formation non trouvée'
            });
        }

        res.json({
            message: 'Formation mise à jour avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la mise à jour de la formation:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Supprimer une formation (Admin uniquement)
 */
export const deleteFormation = async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM formations WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Formation non trouvée'
            });
        }

        res.json({
            message: 'Formation supprimée avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la suppression de la formation:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};
