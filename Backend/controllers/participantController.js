import db from '../config/database.js';

// Inscription publique d'un participant
export const inscrireParticipant = async (req, res) => {
    try {
        const {
            nom,
            prenom,
            date_naissance,
            ville,
            email,
            telephone,
            formation_id
        } = req.body;

        // Validation
        if (!nom || !prenom || !date_naissance || !ville || !email || !telephone || !formation_id) {
            return res.status(400).json({
                message: 'Tous les champs sont obligatoires'
            });
        }

        // Vérifier que la formation existe
        const [formation] = await db.query('SELECT id, titre FROM formations WHERE id = ?', [formation_id]);
        if (formation.length === 0) {
            return res.status(404).json({ message: 'Formation non trouvée' });
        }

        // Vérifier si l'email existe déjà pour cette formation
        const [existing] = await db.query(
            'SELECT id FROM participants WHERE email = ? AND formation_id = ?',
            [email, formation_id]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: 'Vous êtes déjà inscrit à cette formation'
            });
        }

        // Insérer le participant
        const query = `
            INSERT INTO participants 
            (nom, prenom, date_naissance, ville, email, telephone, formation_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [
            nom,
            prenom,
            date_naissance,
            ville,
            email,
            telephone,
            formation_id
        ]);

        res.status(201).json({
            message: 'Inscription réussie ! Nous vous contacterons bientôt.',
            participantId: result.insertId
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer tous les participants (Admin/Assistant)
export const getAllParticipants = async (req, res) => {
    try {
        const { formation_id, statut } = req.query;

        let query = `
            SELECT p.*, f.titre as formation_titre, f.nombre_heures, f.cout
            FROM participants p
            JOIN formations f ON p.formation_id = f.id
            WHERE 1=1
        `;

        const params = [];

        if (formation_id) {
            query += ' AND p.formation_id = ?';
            params.push(formation_id);
        }

        if (statut) {
            query += ' AND p.statut = ?';
            params.push(statut);
        }

        query += ' ORDER BY p.created_at DESC';

        const [participants] = await db.query(query, params);
        res.json(participants);
    } catch (error) {
        console.error('Erreur lors de la récupération des participants:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer un participant par ID
export const getParticipantById = async (req, res) => {
    try {
        const { id } = req.params;

        const [participant] = await db.query(
            `SELECT p.*, f.titre as formation_titre, f.nombre_heures, f.cout, f.objectifs
             FROM participants p
             JOIN formations f ON p.formation_id = f.id
             WHERE p.id = ?`,
            [id]
        );

        if (participant.length === 0) {
            return res.status(404).json({ message: 'Participant non trouvé' });
        }

        res.json(participant[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du participant:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour le statut d'un participant (Admin/Assistant)
export const updateParticipantStatut = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;

        if (!['en_attente', 'confirme', 'annule'].includes(statut)) {
            return res.status(400).json({ message: 'Statut invalide' });
        }

        const [result] = await db.query(
            'UPDATE participants SET statut = ? WHERE id = ?',
            [statut, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Participant non trouvé' });
        }

        res.json({ message: 'Statut mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer un participant (Admin/Assistant)
export const deleteParticipant = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query('DELETE FROM participants WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Participant non trouvé' });
        }

        res.json({ message: 'Participant supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Créer une session individuelle (Admin/Assistant)
export const createSessionIndividuelle = async (req, res) => {
    try {
        const {
            formation_id,
            formateur_id,
            date_debut,
            date_fin,
            horaire_debut,
            horaire_fin,
            lieu,
            nombre_places,
            remarques
        } = req.body;

        const created_by = req.user.id;

        const query = `
            INSERT INTO sessions_individuelles 
            (formation_id, formateur_id, date_debut, date_fin, horaire_debut, horaire_fin, lieu, nombre_places, remarques, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [
            formation_id,
            formateur_id || null,
            date_debut,
            date_fin,
            horaire_debut,
            horaire_fin,
            lieu || null,
            nombre_places || 20,
            remarques || null,
            created_by
        ]);

        res.status(201).json({
            message: 'Session créée avec succès',
            sessionId: result.insertId
        });
    } catch (error) {
        console.error('Erreur lors de la création de la session:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer toutes les sessions individuelles
export const getAllSessionsIndividuelles = async (req, res) => {
    try {
        const query = `
            SELECT s.*, 
                   f.titre as formation_titre, f.nombre_heures,
                   CONCAT(form.prenom, ' ', form.nom) as formateur_nom,
                   u.nom as created_by_nom, u.prenom as created_by_prenom,
                   (SELECT COUNT(*) FROM participants_sessions ps WHERE ps.session_id = s.id AND ps.statut_inscription != 'annule') as nombre_inscrits
            FROM sessions_individuelles s
            JOIN formations f ON s.formation_id = f.id
            LEFT JOIN formateurs form ON s.formateur_id = form.id
            JOIN utilisateurs u ON s.created_by = u.id
            ORDER BY s.date_debut DESC
        `;

        const [sessions] = await db.query(query);
        res.json(sessions);
    } catch (error) {
        console.error('Erreur lors de la récupération des sessions:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Affecter un formateur à une session (Admin/Assistant)
export const affecterFormateurSession = async (req, res) => {
    try {
        const { id } = req.params;
        const { formateur_id } = req.body;

        // Vérifier que le formateur existe
        if (formateur_id) {
            const [formateur] = await db.query('SELECT id FROM formateurs WHERE id = ?', [formateur_id]);
            if (formateur.length === 0) {
                return res.status(404).json({ message: 'Formateur non trouvé' });
            }
        }

        const [result] = await db.query(
            'UPDATE sessions_individuelles SET formateur_id = ? WHERE id = ?',
            [formateur_id || null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Session non trouvée' });
        }

        res.json({ message: 'Formateur affecté avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'affectation du formateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Affecter des participants à une session (Admin/Assistant)
export const affecterParticipantsSession = async (req, res) => {
    try {
        const { session_id, participant_ids } = req.body;

        if (!session_id || !Array.isArray(participant_ids) || participant_ids.length === 0) {
            return res.status(400).json({ message: 'Paramètres invalides' });
        }

        // Vérifier que la session existe
        const [session] = await db.query('SELECT id, nombre_places FROM sessions_individuelles WHERE id = ?', [session_id]);
        if (session.length === 0) {
            return res.status(404).json({ message: 'Session non trouvée' });
        }

        // Compter les inscriptions actuelles
        const [count] = await db.query(
            'SELECT COUNT(*) as total FROM participants_sessions WHERE session_id = ? AND statut_inscription != "annule"',
            [session_id]
        );

        const placesDisponibles = session[0].nombre_places - count[0].total;
        if (participant_ids.length > placesDisponibles) {
            return res.status(400).json({
                message: `Pas assez de places disponibles. Places restantes: ${placesDisponibles}`
            });
        }

        // Insérer les affectations
        const values = participant_ids.map(pid => [pid, session_id]);
        const query = 'INSERT IGNORE INTO participants_sessions (participant_id, session_id) VALUES ?';

        await db.query(query, [values]);

        res.json({ message: 'Participants affectés avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'affectation des participants:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Statistiques des participants
export const getStatsParticipants = async (req, res) => {
    try {
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN statut = 'en_attente' THEN 1 ELSE 0 END) as en_attente,
                SUM(CASE WHEN statut = 'confirme' THEN 1 ELSE 0 END) as confirme,
                SUM(CASE WHEN statut = 'annule' THEN 1 ELSE 0 END) as annule
            FROM participants
        `);

        res.json(stats[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
