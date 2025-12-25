import db from '../config/database.js';

// Créer une nouvelle planification
export const createPlanification = async (req, res) => {
    try {
        const {
            formation_id,
            formateur_id,
            entreprise_id,
            date_debut,
            date_fin,
            horaire_debut,
            horaire_fin,
            remarques
        } = req.body;

        const created_by = req.user.id; // ID de l'utilisateur connecté (admin ou assistant)

        // Vérifier que l'utilisateur est admin ou assistant
        if (req.user.role !== 'admin' && req.user.role !== 'assistant') {
            return res.status(403).json({
                message: 'Accès refusé. Seuls les admins et assistants peuvent planifier des formations.'
            });
        }

        // Vérifier que la formation existe
        const [formation] = await db.query('SELECT id FROM formations WHERE id = ?', [formation_id]);
        if (formation.length === 0) {
            return res.status(404).json({ message: 'Formation non trouvée' });
        }

        // Vérifier que le formateur existe
        const [formateur] = await db.query('SELECT id FROM formateurs WHERE id = ?', [formateur_id]);
        if (formateur.length === 0) {
            return res.status(404).json({ message: 'Formateur non trouvé' });
        }

        // Vérifier que l'entreprise existe
        const [entreprise] = await db.query('SELECT id FROM entreprises WHERE id = ?', [entreprise_id]);
        if (entreprise.length === 0) {
            return res.status(404).json({ message: 'Entreprise non trouvée' });
        }

        // Vérifier les conflits de disponibilité du formateur
        const [conflits] = await db.query(
            `SELECT * FROM planifications 
             WHERE formateur_id = ? 
             AND statut != 'annulee'
             AND (
                 (date_debut BETWEEN ? AND ?) OR
                 (date_fin BETWEEN ? AND ?) OR
                 (? BETWEEN date_debut AND date_fin)
             )`,
            [formateur_id, date_debut, date_fin, date_debut, date_fin, date_debut]
        );

        if (conflits.length > 0) {
            return res.status(409).json({
                message: 'Le formateur a déjà une planification sur cette période',
                conflits
            });
        }

        // Insérer la planification
        const query = `
            INSERT INTO planifications 
            (formation_id, formateur_id, entreprise_id, date_debut, date_fin, 
             horaire_debut, horaire_fin, remarques, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [
            formation_id,
            formateur_id,
            entreprise_id,
            date_debut,
            date_fin,
            horaire_debut,
            horaire_fin,
            remarques || null,
            created_by
        ]);

        // Récupérer la planification créée avec toutes les informations
        const [newPlanification] = await db.query(
            `SELECT p.*, 
                    f.titre as formation_titre,
                    fr.nom as formateur_nom, fr.prenom as formateur_prenom,
                    e.nom as entreprise_nom,
                    u.nom as created_by_nom, u.prenom as created_by_prenom
             FROM planifications p
             JOIN formations f ON p.formation_id = f.id
             JOIN formateurs fr ON p.formateur_id = fr.id
             JOIN entreprises e ON p.entreprise_id = e.id
             JOIN utilisateurs u ON p.created_by = u.id
             WHERE p.id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            message: 'Planification créée avec succès',
            planification: newPlanification[0]
        });
    } catch (error) {
        console.error('Erreur lors de la création de la planification:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Récupérer toutes les planifications
export const getAllPlanifications = async (req, res) => {
    try {
        const { statut, formateur_id, entreprise_id, date_debut, date_fin } = req.query;

        let query = `
            SELECT p.*, 
                   f.titre as formation_titre, f.nombre_heures, f.cout,
                   fr.nom as formateur_nom, fr.prenom as formateur_prenom, fr.email as formateur_email,
                   e.nom as entreprise_nom, e.email as entreprise_email,
                   u.nom as created_by_nom, u.prenom as created_by_prenom
            FROM planifications p
            JOIN formations f ON p.formation_id = f.id
            JOIN formateurs fr ON p.formateur_id = fr.id
            JOIN entreprises e ON p.entreprise_id = e.id
            JOIN utilisateurs u ON p.created_by = u.id
            WHERE 1=1
        `;

        const params = [];

        if (statut) {
            query += ' AND p.statut = ?';
            params.push(statut);
        }

        if (formateur_id) {
            query += ' AND p.formateur_id = ?';
            params.push(formateur_id);
        }

        if (entreprise_id) {
            query += ' AND p.entreprise_id = ?';
            params.push(entreprise_id);
        }

        if (date_debut && date_fin) {
            query += ' AND ((p.date_debut BETWEEN ? AND ?) OR (p.date_fin BETWEEN ? AND ?))';
            params.push(date_debut, date_fin, date_debut, date_fin);
        }

        query += ' ORDER BY p.date_debut DESC';

        const [planifications] = await db.query(query, params);

        res.json(planifications);
    } catch (error) {
        console.error('Erreur lors de la récupération des planifications:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Récupérer une planification par ID
export const getPlanificationById = async (req, res) => {
    try {
        const { id } = req.params;

        const [planification] = await db.query(
            `SELECT p.*, 
                    f.titre as formation_titre, f.nombre_heures, f.cout, f.objectifs, f.programme_detaille,
                    fr.nom as formateur_nom, fr.prenom as formateur_prenom, fr.email as formateur_email, fr.mots_cles,
                    e.nom as entreprise_nom, e.adresse as entreprise_adresse, e.telephone as entreprise_telephone, e.email as entreprise_email,
                    u.nom as created_by_nom, u.prenom as created_by_prenom
             FROM planifications p
             JOIN formations f ON p.formation_id = f.id
             JOIN formateurs fr ON p.formateur_id = fr.id
             JOIN entreprises e ON p.entreprise_id = e.id
             JOIN utilisateurs u ON p.created_by = u.id
             WHERE p.id = ?`,
            [id]
        );

        if (planification.length === 0) {
            return res.status(404).json({ message: 'Planification non trouvée' });
        }

        res.json(planification[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de la planification:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Mettre à jour une planification
export const updatePlanification = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            formation_id,
            formateur_id,
            entreprise_id,
            date_debut,
            date_fin,
            horaire_debut,
            horaire_fin,
            statut,
            remarques
        } = req.body;

        // Vérifier que l'utilisateur est admin ou assistant
        if (req.user.role !== 'admin' && req.user.role !== 'assistant') {
            return res.status(403).json({
                message: 'Accès refusé. Seuls les admins et assistants peuvent modifier des planifications.'
            });
        }

        // Vérifier que la planification existe
        const [existing] = await db.query('SELECT * FROM planifications WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Planification non trouvée' });
        }

        // Si le formateur ou les dates changent, vérifier les conflits
        if (formateur_id || date_debut || date_fin) {
            const newFormateurId = formateur_id || existing[0].formateur_id;
            const newDateDebut = date_debut || existing[0].date_debut;
            const newDateFin = date_fin || existing[0].date_fin;

            const [conflits] = await db.query(
                `SELECT * FROM planifications 
                 WHERE formateur_id = ? 
                 AND id != ?
                 AND statut != 'annulee'
                 AND (
                     (date_debut BETWEEN ? AND ?) OR
                     (date_fin BETWEEN ? AND ?) OR
                     (? BETWEEN date_debut AND date_fin)
                 )`,
                [newFormateurId, id, newDateDebut, newDateFin, newDateDebut, newDateFin, newDateDebut]
            );

            if (conflits.length > 0) {
                return res.status(409).json({
                    message: 'Le formateur a déjà une planification sur cette période',
                    conflits
                });
            }
        }

        // Construire la requête de mise à jour
        const updates = [];
        const params = [];

        if (formation_id) {
            updates.push('formation_id = ?');
            params.push(formation_id);
        }
        if (formateur_id) {
            updates.push('formateur_id = ?');
            params.push(formateur_id);
        }
        if (entreprise_id) {
            updates.push('entreprise_id = ?');
            params.push(entreprise_id);
        }
        if (date_debut) {
            updates.push('date_debut = ?');
            params.push(date_debut);
        }
        if (date_fin) {
            updates.push('date_fin = ?');
            params.push(date_fin);
        }
        if (horaire_debut) {
            updates.push('horaire_debut = ?');
            params.push(horaire_debut);
        }
        if (horaire_fin) {
            updates.push('horaire_fin = ?');
            params.push(horaire_fin);
        }
        if (statut) {
            updates.push('statut = ?');
            params.push(statut);
        }
        if (remarques !== undefined) {
            updates.push('remarques = ?');
            params.push(remarques);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'Aucune modification fournie' });
        }

        params.push(id);

        const query = `UPDATE planifications SET ${updates.join(', ')} WHERE id = ?`;
        await db.query(query, params);

        // Récupérer la planification mise à jour
        const [updated] = await db.query(
            `SELECT p.*, 
                    f.titre as formation_titre,
                    fr.nom as formateur_nom, fr.prenom as formateur_prenom,
                    e.nom as entreprise_nom,
                    u.nom as created_by_nom, u.prenom as created_by_prenom
             FROM planifications p
             JOIN formations f ON p.formation_id = f.id
             JOIN formateurs fr ON p.formateur_id = fr.id
             JOIN entreprises e ON p.entreprise_id = e.id
             JOIN utilisateurs u ON p.created_by = u.id
             WHERE p.id = ?`,
            [id]
        );

        res.json({
            message: 'Planification mise à jour avec succès',
            planification: updated[0]
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la planification:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Supprimer une planification
export const deletePlanification = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier que l'utilisateur est admin ou assistant
        if (req.user.role !== 'admin' && req.user.role !== 'assistant') {
            return res.status(403).json({
                message: 'Accès refusé. Seuls les admins et assistants peuvent supprimer des planifications.'
            });
        }

        const [result] = await db.query('DELETE FROM planifications WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Planification non trouvée' });
        }

        res.json({ message: 'Planification supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la planification:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

// Récupérer les statistiques des planifications
export const getStatistiques = async (req, res) => {
    try {
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN statut = 'planifiee' THEN 1 ELSE 0 END) as planifiees,
                SUM(CASE WHEN statut = 'en_cours' THEN 1 ELSE 0 END) as en_cours,
                SUM(CASE WHEN statut = 'terminee' THEN 1 ELSE 0 END) as terminees,
                SUM(CASE WHEN statut = 'annulee' THEN 1 ELSE 0 END) as annulees
            FROM planifications
        `);

        res.json(stats[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};
