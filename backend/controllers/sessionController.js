import pool from '../config/database.js';

/**
 * Récupérer toutes les sessions
 */
export const getAllSessions = async (req, res) => {
    try {
        const [sessions] = await pool.query(`
      SELECT 
        s.*,
        f.titre as formation_titre,
        f.heures as formation_heures,
        CONCAT(u.prenom, ' ', u.nom) as formateur_nom
      FROM sessions s
      INNER JOIN formations f ON s.formation_id = f.id
      LEFT JOIN formateurs fmt ON s.formateur_id = fmt.id
      LEFT JOIN users u ON fmt.user_id = u.id
      ORDER BY s.date_debut DESC
    `);

        res.json(sessions);

    } catch (error) {
        console.error('Erreur lors de la récupération des sessions:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Créer une nouvelle session (Admin uniquement)
 */
export const createSession = async (req, res) => {
    try {
        const { formation_id, formateur_id, date_debut, date_fin, lieu, places_disponibles } = req.body;

        // Validation
        if (!formation_id || !date_debut || !date_fin) {
            return res.status(400).json({
                message: 'Formation, date de début et date de fin sont obligatoires'
            });
        }

        const [result] = await pool.query(
            `INSERT INTO sessions (formation_id, formateur_id, date_debut, date_fin, lieu, places_disponibles) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [formation_id, formateur_id, date_debut, date_fin, lieu, places_disponibles || 20]
        );

        res.status(201).json({
            message: 'Session créée avec succès',
            sessionId: result.insertId
        });

    } catch (error) {
        console.error('Erreur lors de la création de la session:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Mettre à jour une session (Admin uniquement)
 */
export const updateSession = async (req, res) => {
    try {
        const { formation_id, formateur_id, date_debut, date_fin, lieu, places_disponibles, statut } = req.body;

        const [result] = await pool.query(
            `UPDATE sessions 
       SET formation_id = ?, formateur_id = ?, date_debut = ?, date_fin = ?, 
           lieu = ?, places_disponibles = ?, statut = ?
       WHERE id = ?`,
            [formation_id, formateur_id, date_debut, date_fin, lieu, places_disponibles, statut, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Session non trouvée'
            });
        }

        res.json({
            message: 'Session mise à jour avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la mise à jour de la session:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Supprimer une session (Admin uniquement)
 */
export const deleteSession = async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM sessions WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Session non trouvée'
            });
        }

        res.json({
            message: 'Session supprimée avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la suppression de la session:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};
