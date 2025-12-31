import db from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

        // Vérifier si l'utilisateur est connecté via le token
        let utilisateur_id = null;
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123');
                utilisateur_id = decoded.id;
            } catch (err) {
                // Token invalide ou expiré, on continue sans lier (inscription anonyme)
                console.log('Token invalide lors de l\'inscription, inscription en tant qu\'invité');
            }
        }

        // Vérifier que la formation existe
        const [formation] = await db.query('SELECT id, titre FROM formations WHERE id = ?', [formation_id]);
        if (formation.length === 0) {
            return res.status(404).json({ message: 'Formation non trouvée' });
        }

        // Vérifier si l'email existe déjà pour cette formation
        const [existing] = await db.query(
            'SELECT id, utilisateur_id, statut FROM participants WHERE email = ? AND formation_id = ?',
            [email, formation_id]
        );

        if (existing.length > 0) {
            const existingRecord = existing[0];

            // Si l'inscription précédente était annulée, on la supprime pour permettre une nouvelle inscription
            if (existingRecord.statut === 'annule') {
                await db.query('DELETE FROM participants WHERE id = ?', [existingRecord.id]);
            }
            // Si l'inscription existe mais n'est pas liée à un compte utilisateur, et qu'on est connecté
            else if (!existingRecord.utilisateur_id && utilisateur_id) {
                // On met à jour l'enregistrement existant pour le lier à ce compte
                await db.query(`
                    UPDATE participants 
                    SET utilisateur_id = ?, nom = ?, prenom = ?, date_naissance = ?, ville = ?, telephone = ?
                    WHERE id = ?
                `, [utilisateur_id, nom, prenom, date_naissance, ville, telephone, existingRecord.id]);

                return res.status(200).json({
                    message: 'Votre inscription existante a été liée à votre compte avec succès.',
                    participantId: existingRecord.id
                });
            }
            // Sinon, c'est un vrai conflit
            else {
                return res.status(409).json({
                    message: 'Vous êtes déjà inscrit à cette formation'
                });
            }
        }

        // Insérer le participant
        const query = `
            INSERT INTO participants 
            (nom, prenom, date_naissance, ville, email, telephone, formation_id, utilisateur_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [
            nom,
            prenom,
            date_naissance,
            ville,
            email,
            telephone,
            formation_id,
            utilisateur_id
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
    const { id } = req.params;
    const { statut, createAccount, password } = req.body;

    if (!['en_attente', 'confirme', 'annule'].includes(statut)) {
        return res.status(400).json({ message: 'Statut invalide' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Récupérer les informations du participant
        const [participant] = await connection.execute(
            'SELECT * FROM participants WHERE id = ?',
            [id]
        );

        if (participant.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Participant non trouvé' });
        }

        // Si approuvé (confirme) et création de compte demandée
        if (statut === 'confirme' && createAccount) {
            const { nom, prenom, email } = participant[0];
            const passwordToUse = password || 'participant123';

            // Vérifier si l'utilisateur existe déjà
            const [existingUser] = await connection.execute(
                'SELECT id FROM utilisateurs WHERE email = ?',
                [email]
            );

            let utilisateur_id = null;

            if (existingUser.length === 0) {
                // Hacher le mot de passe
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(passwordToUse, salt);

                // Créer le compte utilisateur
                const [userResult] = await connection.execute(
                    'INSERT INTO utilisateurs (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)',
                    [nom, prenom, email, hashedPassword, 'participant']
                );
                utilisateur_id = userResult.insertId;

                // Mettre à jour le participant avec l'ID utilisateur ET le mot de passe temporaire
                await connection.execute(
                    'UPDATE participants SET utilisateur_id = ?, statut = ?, password_temporaire = ? WHERE id = ?',
                    [utilisateur_id, statut, passwordToUse, id]
                );
            } else {
                // Juste mettre à jour le statut et le mot de passe temporaire
                await connection.execute(
                    'UPDATE participants SET statut = ?, password_temporaire = ? WHERE id = ?',
                    [statut, passwordToUse, id]
                );
            }
        } else {
            // Mettre à jour uniquement le statut
            await connection.execute(
                'UPDATE participants SET statut = ? WHERE id = ?',
                [statut, id]
            );
        }

        await connection.commit();
        res.json({ message: 'Statut mis à jour avec succès' });
    } catch (error) {
        await connection.rollback();
        console.error('Erreur lors de la mise à jour du statut:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        connection.release();
    }
};

// Créer/Mettre à jour le mot de passe d'un participant confirmé
export const createPassword = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Récupérer les informations du participant
        const [participant] = await connection.execute(
            'SELECT * FROM participants WHERE id = ?',
            [id]
        );

        if (participant.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Participant non trouvé' });
        }

        const participantData = participant[0];

        // Vérifier que le participant est confirmé
        if (participantData.statut !== 'confirme') {
            await connection.rollback();
            return res.status(400).json({
                message: 'Le participant doit être confirmé avant de créer un mot de passe'
            });
        }

        const passwordToUse = password || `participant${Math.floor(Math.random() * 10000)}`;

        // Vérifier si l'utilisateur existe déjà
        const [existingUser] = await connection.execute(
            'SELECT id FROM utilisateurs WHERE email = ?',
            [participantData.email]
        );

        let utilisateur_id = participantData.utilisateur_id;

        if (existingUser.length === 0 && !utilisateur_id) {
            // Créer le compte utilisateur
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(passwordToUse, salt);

            const [userResult] = await connection.execute(
                'INSERT INTO utilisateurs (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)',
                [participantData.nom, participantData.prenom, participantData.email, hashedPassword, 'participant']
            );
            utilisateur_id = userResult.insertId;

            // Mettre à jour le participant avec l'ID utilisateur et le mot de passe temporaire
            await connection.execute(
                'UPDATE participants SET utilisateur_id = ?, password_temporaire = ? WHERE id = ?',
                [utilisateur_id, passwordToUse, id]
            );
        } else {
            // Juste mettre à jour le mot de passe temporaire et éventuellement le mot de passe utilisateur
            if (utilisateur_id || existingUser.length > 0) {
                const userId = utilisateur_id || existingUser[0].id;

                // Mettre à jour le mot de passe de l'utilisateur
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(passwordToUse, salt);

                await connection.execute(
                    'UPDATE utilisateurs SET password = ? WHERE id = ?',
                    [hashedPassword, userId]
                );
            }

            await connection.execute(
                'UPDATE participants SET password_temporaire = ? WHERE id = ?',
                [passwordToUse, id]
            );
        }

        await connection.commit();
        res.json({
            message: 'Mot de passe créé avec succès',
            password: passwordToUse
        });
    } catch (error) {
        await connection.rollback();
        console.error('Erreur lors de la création du mot de passe:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        connection.release();
    }
};

// Supprimer un participant (Admin/Assistant)
// Supprimer un participant (Admin/Assistant ou le participant lui-même)
export const deleteParticipant = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // 1. Récupérer le participant pour vérifier les droits
        const [participant] = await db.query('SELECT utilisateur_id FROM participants WHERE id = ?', [id]);

        if (participant.length === 0) {
            return res.status(404).json({ message: 'Participant non trouvé' });
        }

        // 2. Vérification des permissions
        // L'admin et l'assistant peuvent tout supprimer
        const isAdminOrAssistant = userRole === 'admin' || userRole === 'assistant';
        // Le participant ne peut supprimer que sa propre inscription
        const isOwner = participant[0].utilisateur_id === userId;

        if (!isAdminOrAssistant && !isOwner) {
            return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer cette inscription' });
        }

        // 3. Suppression
        await db.query('DELETE FROM participants WHERE id = ?', [id]);

        res.json({ message: 'Inscription supprimée avec succès' });
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

// Vérifier le statut d'un participant par email
export const checkStatutByEmail = async (req, res) => {
    const { email } = req.body;

    // Validation de l'email
    if (!email) {
        return res.status(400).json({ message: 'L\'email est requis.' });
    }

    try {
        // Récupérer la demande du participant
        // Note: On suppose qu'un email peut avoir plusieurs inscriptions (différentes formations)
        // Mais pour simplifier ici, on prend la plus récente
        const [participant] = await db.execute(
            `SELECT p.id, p.nom, p.prenom, p.email, p.statut, p.created_at, p.password_temporaire, 
                    f.titre as formation_titre
            FROM participants p
            JOIN formations f ON p.formation_id = f.id
            WHERE p.email = ?
            ORDER BY p.created_at DESC
            LIMIT 1`,
            [email]
        );

        if (participant.length === 0) {
            return res.status(404).json({
                message: 'Aucune inscription trouvée avec cet email.',
                found: false
            });
        }

        const info = participant[0];

        // Mappage des statuts pour correspondre à l'UI
        // 'confirme' -> 'approuve' pour correspondre à la logique de la page StatutDemande
        let statutUI = info.statut;
        if (statutUI === 'confirme') statutUI = 'approuve';

        const response = {
            found: true,
            demande: {
                nom: info.nom,
                prenom: info.prenom,
                email: info.email,
                statut: statutUI,
                created_at: info.created_at,
                mots_cles: info.formation_titre // On utilise formation_titre à la place de mots_cles pour l'affichage
            }
        };

        if (statutUI === 'approuve' && info.password_temporaire) {
            response.demande.password_temporaire = info.password_temporaire;
        }

        res.json(response);
    } catch (error) {
        console.error('Erreur lors de la vérification du statut:', error);
        res.status(500).json({
            message: 'Erreur lors de la vérification du statut.'
        });
    }
};

// Récupérer mes formations (celles où je suis inscrit)
export const getMesFormations = async (req, res) => {
    try {
        const userId = req.user.id; // ID de la table utilisateurs

        // On cherche le participant lié à cet utilisateur
        // On essaie aussi de trouver un formateur_id associé (soit via session, soit le dernier ayant donné cette formation)
        const query = `
            SELECT p.id, p.formation_id, p.statut, 
                   f.titre, f.nombre_heures, f.cout, 
                   f.objectifs,
                   (
                       -- Priorité 1: Formateur de la session assignée
                       SELECT s.formateur_id 
                       FROM participants_sessions ps 
                       JOIN sessions_individuelles s ON ps.session_id = s.id 
                       WHERE ps.participant_id = p.id AND s.formateur_id IS NOT NULL 
                       LIMIT 1
                   ) as formateur_assigne,
                   (
                       -- Priorité 2: Dernier formateur ayant planifié cette formation (fallback)
                       SELECT plan.formateur_id 
                       FROM planifications plan 
                       WHERE plan.formation_id = p.formation_id 
                       ORDER BY plan.date_debut DESC 
                       LIMIT 1
                   ) as formateur_planif,
                   (
                       -- Priorité 3 (Fallback ultime pour test): Premier formateur dispo
                       SELECT id FROM formateurs WHERE statut = 'approuve' LIMIT 1
                   ) as formateur_default
            FROM participants p
            JOIN formations f ON p.formation_id = f.id
            WHERE p.utilisateur_id = ?
            ORDER BY p.created_at DESC
        `;

        const [participantRecords] = await db.query(query, [userId]);

        if (participantRecords.length === 0) {
            return res.json([]);
        }

        // Récupérer l'email de l'utilisateur pour vérifier les évaluations
        const [user] = await db.query('SELECT email FROM utilisateurs WHERE id = ?', [userId]);
        const userEmail = user[0].email;

        const formationsWithDetails = await Promise.all(participantRecords.map(async (record) => {
            // Déterminer le formateur ID à utiliser (Assigne > Planifié > Defaut)
            const resolvedFormateurId = record.formateur_assigne || record.formateur_planif || record.formateur_default;

            const [evals] = await db.query(
                `SELECT id FROM evaluations 
                 WHERE formation_id = ? AND participant_email = ?`,
                [record.formation_id, userEmail]
            );

            return {
                ...record,
                formateur_id: resolvedFormateurId, // On renvoie le formateur trouvé
                a_evalue: evals.length > 0
            };
        }));

        res.json(formationsWithDetails);

    } catch (error) {
        console.error('Erreur lors de la récupération de mes formations:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message, sqlMessage: error.sqlMessage });
    }
};
