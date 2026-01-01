import pool from '../config/database.js';

/**
 * Récupérer tous les formateurs
 */
export const getAllFormateurs = async (req, res) => {
    try {
        const [formateurs] = await pool.query(`
      SELECT 
        f.id, f.competences, f.remarques, f.created_at,
        u.nom, u.prenom, u.email, u.telephone
      FROM formateurs f
      INNER JOIN users u ON f.user_id = u.id
      ORDER BY u.nom, u.prenom
    `);

        res.json(formateurs);

    } catch (error) {
        console.error('Erreur lors de la récupération des formateurs:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Récupérer un formateur par ID
 */
export const getFormateurById = async (req, res) => {
    try {
        const [formateurs] = await pool.query(`
      SELECT 
        f.id, f.competences, f.remarques, f.created_at,
        u.nom, u.prenom, u.email, u.telephone
      FROM formateurs f
      INNER JOIN users u ON f.user_id = u.id
      WHERE f.id = ?
    `, [req.params.id]);

        if (formateurs.length === 0) {
            return res.status(404).json({
                message: 'Formateur non trouvé'
            });
        }

        res.json(formateurs[0]);

    } catch (error) {
        console.error('Erreur lors de la récupération du formateur:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Mettre à jour un formateur (Admin uniquement)
 */
export const updateFormateur = async (req, res) => {
    try {
        const { competences, remarques } = req.body;

        const [result] = await pool.query(
            'UPDATE formateurs SET competences = ?, remarques = ? WHERE id = ?',
            [competences, remarques, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Formateur non trouvé'
            });
        }

        res.json({
            message: 'Formateur mis à jour avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la mise à jour du formateur:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Récupérer les formations d'un formateur
 */
export const getFormateurFormations = async (req, res) => {
    try {
        const [sessions] = await pool.query(`
      SELECT 
        s.id as session_id, s.date_debut, s.date_fin, s.lieu, s.statut,
        f.titre, f.description, f.heures
      FROM sessions s
      INNER JOIN formations f ON s.formation_id = f.id
      WHERE s.formateur_id = ?
      ORDER BY s.date_debut DESC
    `, [req.params.id]);

        res.json(sessions);

    } catch (error) {
        console.error('Erreur lors de la récupération des formations du formateur:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Récupérer les évaluations d'un formateur
 */
export const getFormateurEvaluations = async (req, res) => {
    try {
        const [evaluations] = await pool.query(`
      SELECT 
        e.note, e.commentaire, e.created_at,
        f.titre as formation_titre,
        CONCAT(u.prenom, ' ', u.nom) as participant_nom
      FROM evaluations e
      INNER JOIN inscriptions i ON e.inscription_id = i.id
      INNER JOIN sessions s ON i.session_id = s.id
      INNER JOIN formations f ON s.formation_id = f.id
      INNER JOIN users u ON i.participant_id = u.id
      WHERE s.formateur_id = ?
      ORDER BY e.created_at DESC
    `, [req.params.id]);

        res.json(evaluations);

    } catch (error) {
        console.error('Erreur lors de la récupération des évaluations:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};
