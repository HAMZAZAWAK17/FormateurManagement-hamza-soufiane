import pool from '../config/database.js';

/**
 * Créer une évaluation pour une formation suivie
 */
export const createEvaluation = async (req, res) => {
    try {
        const { inscription_id, note, commentaire } = req.body;
        const participant_id = req.user.id;

        // Validation
        if (!inscription_id || !note) {
            return res.status(400).json({
                message: 'Inscription et note sont obligatoires'
            });
        }

        if (note < 1 || note > 5) {
            return res.status(400).json({
                message: 'La note doit être entre 1 et 5'
            });
        }

        // Vérifier que l'inscription appartient au participant
        const [inscriptions] = await pool.query(
            'SELECT id FROM inscriptions WHERE id = ? AND participant_id = ?',
            [inscription_id, participant_id]
        );

        if (inscriptions.length === 0) {
            return res.status(404).json({
                message: 'Inscription non trouvée'
            });
        }

        // Vérifier si une évaluation existe déjà
        const [existing] = await pool.query(
            'SELECT id FROM evaluations WHERE inscription_id = ?',
            [inscription_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: 'Vous avez déjà évalué cette formation'
            });
        }

        // Créer l'évaluation
        const [result] = await pool.query(
            'INSERT INTO evaluations (inscription_id, note, commentaire) VALUES (?, ?, ?)',
            [inscription_id, note, commentaire]
        );

        res.status(201).json({
            message: 'Évaluation enregistrée avec succès',
            evaluationId: result.insertId
        });

    } catch (error) {
        console.error('Erreur lors de la création de l\'évaluation:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Récupérer les évaluations d'un participant
 */
export const getMesEvaluations = async (req, res) => {
    try {
        const participant_id = req.user.id;

        const [evaluations] = await pool.query(`
      SELECT 
        e.id, e.note, e.commentaire, e.created_at,
        f.titre as formation_titre,
        s.date_debut, s.date_fin
      FROM evaluations e
      INNER JOIN inscriptions i ON e.inscription_id = i.id
      INNER JOIN sessions s ON i.session_id = s.id
      INNER JOIN formations f ON s.formation_id = f.id
      WHERE i.participant_id = ?
      ORDER BY e.created_at DESC
    `, [participant_id]);

        res.json(evaluations);

    } catch (error) {
        console.error('Erreur lors de la récupération des évaluations:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Récupérer toutes les évaluations (Admin uniquement)
 */
export const getAllEvaluations = async (req, res) => {
    try {
        const [evaluations] = await pool.query(`
      SELECT 
        e.id, e.note, e.commentaire, e.created_at,
        f.titre as formation_titre,
        CONCAT(u.prenom, ' ', u.nom) as participant_nom,
        CONCAT(fmt_user.prenom, ' ', fmt_user.nom) as formateur_nom
      FROM evaluations e
      INNER JOIN inscriptions i ON e.inscription_id = i.id
      INNER JOIN sessions s ON i.session_id = s.id
      INNER JOIN formations f ON s.formation_id = f.id
      INNER JOIN users u ON i.participant_id = u.id
      LEFT JOIN formateurs fmt ON s.formateur_id = fmt.id
      LEFT JOIN users fmt_user ON fmt.user_id = fmt_user.id
      ORDER BY e.created_at DESC
    `);

        res.json(evaluations);

    } catch (error) {
        console.error('Erreur lors de la récupération des évaluations:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};
