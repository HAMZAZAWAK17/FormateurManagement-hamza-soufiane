import pool from '../config/database.js';

/**
 * Inscription d'un participant à une session
 */
export const inscrireParticipant = async (req, res) => {
    try {
        const { session_id } = req.body;
        const participant_id = req.user.id; // ID de l'utilisateur connecté

        // Vérifier si la session existe et a des places disponibles
        const [sessions] = await pool.query(
            'SELECT places_disponibles FROM sessions WHERE id = ?',
            [session_id]
        );

        if (sessions.length === 0) {
            return res.status(404).json({
                message: 'Session non trouvée'
            });
        }

        if (sessions[0].places_disponibles <= 0) {
            return res.status(400).json({
                message: 'Aucune place disponible pour cette session'
            });
        }

        // Vérifier si déjà inscrit
        const [existing] = await pool.query(
            'SELECT id FROM inscriptions WHERE session_id = ? AND participant_id = ?',
            [session_id, participant_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: 'Vous êtes déjà inscrit à cette session'
            });
        }

        // Créer l'inscription
        const [result] = await pool.query(
            'INSERT INTO inscriptions (session_id, participant_id, statut) VALUES (?, ?, ?)',
            [session_id, participant_id, 'confirmee']
        );

        // Décrémenter les places disponibles
        await pool.query(
            'UPDATE sessions SET places_disponibles = places_disponibles - 1 WHERE id = ?',
            [session_id]
        );

        res.status(201).json({
            message: 'Inscription réussie',
            inscriptionId: result.insertId
        });

    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Récupérer les inscriptions d'un participant
 */
export const getMesInscriptions = async (req, res) => {
    try {
        const participant_id = req.user.id;

        const [inscriptions] = await pool.query(`
      SELECT 
        i.id, i.statut, i.date_inscription,
        s.id as session_id, s.date_debut as session_date_debut, s.date_fin as session_date_fin, s.lieu,
        f.id as formation_id, f.titre as formation_titre, f.description, f.heures,
        CONCAT(u.prenom, ' ', u.nom) as formateur_nom,
        (SELECT COUNT(*) FROM evaluations e WHERE e.inscription_id = i.id) > 0 as a_evalue
      FROM inscriptions i
      INNER JOIN sessions s ON i.session_id = s.id
      INNER JOIN formations f ON s.formation_id = f.id
      LEFT JOIN formateurs fmt ON s.formateur_id = fmt.id
      LEFT JOIN users u ON fmt.user_id = u.id
      WHERE i.participant_id = ?
      ORDER BY s.date_debut DESC
    `, [participant_id]);

        res.json(inscriptions);

    } catch (error) {
        console.error('Erreur lors de la récupération des inscriptions:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Annuler une inscription
 */
export const annulerInscription = async (req, res) => {
    try {
        const { id } = req.params;
        const participant_id = req.user.id;

        // Vérifier que l'inscription appartient bien au participant
        const [inscriptions] = await pool.query(
            'SELECT session_id FROM inscriptions WHERE id = ? AND participant_id = ?',
            [id, participant_id]
        );

        if (inscriptions.length === 0) {
            return res.status(404).json({
                message: 'Inscription non trouvée'
            });
        }

        // Supprimer l'inscription
        await pool.query(
            'DELETE FROM inscriptions WHERE id = ?',
            [id]
        );

        // Incrémenter les places disponibles
        await pool.query(
            'UPDATE sessions SET places_disponibles = places_disponibles + 1 WHERE id = ?',
            [inscriptions[0].session_id]
        );

        res.json({
            message: 'Inscription annulée avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de l\'annulation de l\'inscription:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

/**
 * Récupérer toutes les inscriptions (Admin uniquement)
 */
export const getAllInscriptions = async (req, res) => {
    try {
        const [inscriptions] = await pool.query(`
      SELECT 
        i.id, i.statut, i.date_inscription,
        s.date_debut, s.date_fin,
        f.titre as formation_titre,
        CONCAT(u.prenom, ' ', u.nom) as participant_nom,
        u.email as participant_email
      FROM inscriptions i
      INNER JOIN sessions s ON i.session_id = s.id
      INNER JOIN formations f ON s.formation_id = f.id
      INNER JOIN users u ON i.participant_id = u.id
      ORDER BY i.date_inscription DESC
    `);

        res.json(inscriptions);

    } catch (error) {
        console.error('Erreur lors de la récupération des inscriptions:', error);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};
