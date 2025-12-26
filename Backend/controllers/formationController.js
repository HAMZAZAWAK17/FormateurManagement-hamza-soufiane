import pool from '../config/database.js';

export const createFormation = async (req, res) => {
    const { titre, categorie, nombre_heures, cout, objectifs, programme_detaille } = req.body;

    try {
        // Validation des champs requis
        if (!titre || !nombre_heures || !cout || !objectifs || !programme_detaille) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        // Validation des types
        if (isNaN(nombre_heures) || nombre_heures <= 0) {
            return res.status(400).json({ message: 'Le nombre d\'heures doit être un nombre positif.' });
        }

        if (isNaN(cout) || cout < 0) {
            return res.status(400).json({ message: 'Le coût doit être un nombre positif ou zéro.' });
        }

        // Insérer la formation
        const [result] = await pool.execute(
            'INSERT INTO formations (titre, categorie, nombre_heures, cout, objectifs, programme_detaille) VALUES (?, ?, ?, ?, ?, ?)',
            [titre, categorie || 'Informatique', nombre_heures, cout, objectifs, programme_detaille]
        );

        res.status(201).json({
            message: 'Formation créée avec succès.',
            formation: {
                id: result.insertId,
                titre,
                nombre_heures,
                cout,
                objectifs,
                programme_detaille
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création de la formation.' });
    }
};

export const getAllFormations = async (req, res) => {
    try {
        const [formations] = await pool.execute('SELECT * FROM formations ORDER BY id ASC');
        res.json(formations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des formations.' });
    }
};

export const getFormationById = async (req, res) => {
    const { id } = req.params;

    try {
        const [formations] = await pool.execute('SELECT * FROM formations WHERE id = ?', [id]);

        if (formations.length === 0) {
            return res.status(404).json({ message: 'Formation non trouvée.' });
        }

        res.json(formations[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la formation.' });
    }
};

export const updateFormation = async (req, res) => {
    const { id } = req.params;
    const { titre, categorie, nombre_heures, cout, objectifs, programme_detaille } = req.body;

    try {
        // Vérifier si la formation existe
        const [formations] = await pool.execute('SELECT * FROM formations WHERE id = ?', [id]);
        if (formations.length === 0) {
            return res.status(404).json({ message: 'Formation non trouvée.' });
        }

        // Validation des champs requis
        if (!titre || !nombre_heures || !cout || !objectifs || !programme_detaille) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        // Validation des types
        if (isNaN(nombre_heures) || nombre_heures <= 0) {
            return res.status(400).json({ message: 'Le nombre d\'heures doit être un nombre positif.' });
        }

        if (isNaN(cout) || cout < 0) {
            return res.status(400).json({ message: 'Le coût doit être un nombre positif ou zéro.' });
        }

        // Mettre à jour la formation
        await pool.execute(
            'UPDATE formations SET titre = ?, categorie = ?, nombre_heures = ?, cout = ?, objectifs = ?, programme_detaille = ? WHERE id = ?',
            [titre, categorie || 'Informatique', nombre_heures, cout, objectifs, programme_detaille, id]
        );

        res.json({ message: 'Formation mise à jour avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la formation.' });
    }
};

export const deleteFormation = async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier si la formation existe
        const [formations] = await pool.execute('SELECT * FROM formations WHERE id = ?', [id]);
        if (formations.length === 0) {
            return res.status(404).json({ message: 'Formation non trouvée.' });
        }

        // Supprimer la formation
        await pool.execute('DELETE FROM formations WHERE id = ?', [id]);

        res.json({ message: 'Formation supprimée avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la formation.' });
    }
};
export const getPublicFormations = async (req, res) => {
    try {
        const query = `
            SELECT f.*, 
                   s.id as session_id, s.date_debut, s.lieu, s.statut as session_statut
            FROM formations f
            LEFT JOIN sessions_individuelles s ON f.id = s.formation_id AND s.statut = 'planifiee'
            ORDER BY f.id ASC, s.date_debut ASC
        `;

        const [rows] = await pool.query(query);

        // Groupement par formation
        const formationsMap = new Map();

        rows.forEach(row => {
            if (!formationsMap.has(row.id)) {
                formationsMap.set(row.id, {
                    id: row.id,
                    titre: row.titre,
                    categorie: row.categorie,
                    nombre_heures: row.nombre_heures,
                    cout: row.cout,
                    objectifs: row.objectifs,
                    programme_detaille: row.programme_detaille,
                    sessions: []
                });
            }

            if (row.session_id) {
                formationsMap.get(row.id).sessions.push({
                    id: row.session_id,
                    date_debut: row.date_debut,
                    lieu: row.lieu,
                    statut: row.session_statut
                });
            }
        });

        const formations = Array.from(formationsMap.values());
        res.json(formations);
    } catch (error) {
        console.error('Erreur getPublicFormations:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des formations publiques.',
            error: error.message
        });
    }
};
