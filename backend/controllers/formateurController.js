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
        console.error('Erreur getAllFormateurs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
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
            return res.status(404).json({ message: 'Formateur non trouvé' });
        }
        res.json(formateurs[0]);
    } catch (error) {
        console.error('Erreur getFormateurById:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Mettre à jour un formateur
 */
export const updateFormateur = async (req, res) => {
    try {
        const { competences, remarques } = req.body;
        const [result] = await pool.query(
            'UPDATE formateurs SET competences = ?, remarques = ? WHERE id = ?',
            [competences, remarques, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Formateur non trouvé' });
        res.json({ message: 'Mis à jour succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Récupérer les formations assignées au formateur (via user_id)
 */
export const getMesFormations = async (req, res) => {
    try {
        // req.params.id est user_id ici
        const [formations] = await pool.query(`
            SELECT f.*, 
            (SELECT COUNT(*) FROM sessions s WHERE s.formation_id = f.id) as sessions_count
            FROM formations f
            JOIN formateurs fmt ON f.formateur_id = fmt.id
            WHERE fmt.user_id = ?
        `, [req.params.id]);
        res.json(formations);
    } catch (error) {
        console.error('Erreur getMesFormations:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Récupérer les étudiants inscrits aux sessions du formateur
 */
export const getMesEtudiants = async (req, res) => {
    try {
        // On récupère les inscriptions liées aux sessions animées par ce formateur
        const [inscriptions] = await pool.query(`
            SELECT 
                i.id as inscription_id, i.date_inscription, i.statut,
                u.nom, u.prenom, u.email, u.telephone,
                f.titre as formation_titre,
                s.date_debut
            FROM inscriptions i
            JOIN users u ON i.participant_id = u.id
            JOIN sessions s ON i.session_id = s.id
            JOIN formations f ON s.formation_id = f.id
            JOIN formateurs fmt ON s.formateur_id = fmt.id
            WHERE fmt.user_id = ?
            ORDER BY i.date_inscription DESC
        `, [req.params.id]);
        res.json(inscriptions);
    } catch (error) {
        console.error('Erreur getMesEtudiants:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Récupérer les sessions d'un formateur (Legacy name)
 * Note: Basé sur user_id comme getMesFormations
 */
export const getFormateurFormations = async (req, res) => {
    try {
        const [sessions] = await pool.query(`
            SELECT s.*, f.titre as formation_titre
            FROM sessions s
            JOIN formations f ON s.formation_id = f.id
            JOIN formateurs fmt ON s.formateur_id = fmt.id
            WHERE fmt.user_id = ?
            ORDER BY s.date_debut DESC
        `, [req.params.id]);
        res.json(sessions);
    } catch (error) {
        console.error('Erreur getFormateurFormations:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Récupérer les évaluations d'un formateur
 */
export const getFormateurEvaluations = async (req, res) => {
    try {
        const userId = req.params.id;
        const [evaluations] = await pool.query(`
            SELECT 
                e.id, e.note, e.commentaire, e.created_at,
                f.titre as formation_titre,
                CONCAT(u.prenom, ' ', u.nom) as participant_nom
            FROM evaluations e
            INNER JOIN inscriptions i ON e.inscription_id = i.id
            INNER JOIN sessions s ON i.session_id = s.id
            INNER JOIN formations f ON s.formation_id = f.id
            INNER JOIN users u ON i.participant_id = u.id
            INNER JOIN formateurs fmt ON s.formateur_id = fmt.id
            WHERE fmt.user_id = ?
            ORDER BY e.created_at DESC
        `, [userId]);
        res.json(evaluations);
    } catch (error) {
        console.error('Erreur getFormateurEvaluations:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// --- GESTION RESSOURCES ---

/**
 * Ajouter une ressource à une formation
 */
export const addRessource = async (req, res) => {
    try {
        const { formation_id, titre, type, url, description } = req.body;
        await pool.query(
            'INSERT INTO ressources (formation_id, titre, type, url, description) VALUES (?, ?, ?, ?, ?)',
            [formation_id, titre, type, url, description]
        );
        res.status(201).json({ message: 'Ressource ajoutée' });
    } catch (error) {
        console.error('Erreur addRessource:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Récupérer les ressources d'une formation
 */
export const getRessources = async (req, res) => {
    try {
        const [ressources] = await pool.query(
            'SELECT * FROM ressources WHERE formation_id = ? ORDER BY created_at DESC',
            [req.params.formationId]
        );
        res.json(ressources);
    } catch (error) {
        console.error('Erreur getRessources:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Supprimer une ressource
 */
export const deleteRessource = async (req, res) => {
    try {
        await pool.query('DELETE FROM ressources WHERE id = ?', [req.params.id]);
        res.json({ message: 'Ressource supprimée' });
    } catch (error) {
        console.error('Erreur deleteRessource:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
