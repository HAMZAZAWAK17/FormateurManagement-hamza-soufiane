import pool from '../config/database.js';

// Enregistrer une nouvelle évaluation
export const createEvaluation = async (req, res) => {
    const { formation_id, formateur_id, participant_email, qualite_pedagogique, rythme, support_cours, maitrise_sujet, commentaire } = req.body;

    // Validation simple
    if (!formation_id || !formateur_id || !qualite_pedagogique) {
        return res.status(400).json({ message: "Les champs obligatoires sont manquants." });
    }

    try {
        const query = `
            INSERT INTO evaluations 
            (formation_id, formateur_id, participant_email, qualite_pedagogique, rythme, support_cours, maitrise_sujet, commentaire) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await pool.execute(query, [
            formation_id,
            formateur_id,
            participant_email || 'Anonyme',
            qualite_pedagogique,
            rythme,
            support_cours,
            maitrise_sujet,
            commentaire
        ]);

        res.status(201).json({ message: "Merci ! Votre évaluation a bien été enregistrée." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'enregistrement de l'évaluation." });
    }
};

// Récupérer les évaluations pour une formation donnée (optionnel, pour l'admin)
export const getEvaluationsByFormation = async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT * FROM evaluations WHERE formation_id = ? ORDER BY created_at DESC
        `, [req.params.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer la moyenne d'un formateur (Statistiques)
export const getFormateurStats = async (req, res) => {
    try {
        const query = `
            SELECT 
                AVG(qualite_pedagogique) as moy_pedagogie,
                AVG(rythme) as moy_rythme,
                AVG(support_cours) as moy_support,
                AVG(maitrise_sujet) as moy_maitrise,
                COUNT(*) as total_avis
            FROM evaluations 
            WHERE formateur_id = ?
        `;
        const [rows] = await pool.execute(query, [req.params.id]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer TOUTES les évaluations (Pour l'Admin)
export const getAllEvaluations = async (req, res) => {
    try {
        // Note: Cette requête suppose que la table 'formateurs' a une liaison avec 'utilisateurs' ou contient directement les noms
        // Si formateurs a utilisateur_id, on fait une jointure supplémentaire.
        // D'après votre schéma: formateurs (id, utilisateur_id, nom, prenom...) -> OK

        const query = `
            SELECT 
                e.*,
                f.titre as formation_titre,
                frmt.nom as formateur_nom,
                frmt.prenom as formateur_prenom
            FROM evaluations e
            JOIN formations f ON e.formation_id = f.id
            JOIN formateurs frmt ON e.formateur_id = frmt.id
            ORDER BY e.created_at DESC
        `;
        const [rows] = await pool.execute(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
