import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export const createFormateur = async (req, res) => {
    const { nom, prenom, email, mots_cles, remarques, createAccount, password } = req.body;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let utilisateur_id = null;

        // Check if user already exists
        const [existingUser] = await connection.execute('SELECT id FROM utilisateurs WHERE email = ?', [email]);

        if (createAccount) {
            if (existingUser.length > 0) {
                return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
            }

            // Hacher le mot de passe
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password || 'formateur123', salt);

            // Créer le compte utilisateur
            const [userResult] = await connection.execute(
                'INSERT INTO utilisateurs (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)',
                [nom, prenom, email, hashedPassword, 'formateur']
            );
            utilisateur_id = userResult.insertId;
        } else if (existingUser.length > 0) {
            utilisateur_id = existingUser[0].id;
        }

        // Insérer les détails du formateur
        await connection.execute(
            'INSERT INTO formateurs (utilisateur_id, nom, prenom, email, mots_cles, remarques) VALUES (?, ?, ?, ?, ?, ?)',
            [utilisateur_id, nom, prenom, email, mots_cles, remarques]
        );

        await connection.commit();
        res.status(201).json({ message: 'Formateur ajouté avec succès.' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du formateur.' });
    } finally {
        connection.release();
    }
};

export const getAllFormateurs = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM formateurs ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des formateurs.' });
    }
};

export const getFormateurById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.execute('SELECT * FROM formateurs WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Formateur non trouvé.' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération du formateur.' });
    }
};

export const updateFormateur = async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, email, mots_cles, remarques } = req.body;

    try {
        await pool.execute(
            'UPDATE formateurs SET nom = ?, prenom = ?, email = ?, mots_cles = ?, remarques = ? WHERE id = ?',
            [nom, prenom, email, mots_cles, remarques, id]
        );
        res.json({ message: 'Formateur mis à jour avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du formateur.' });
    }
};

export const deleteFormateur = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM formateurs WHERE id = ?', [id]);
        res.json({ message: 'Formateur supprimé avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression du formateur.' });
    }
};

// Fonctionnalité 9 : Inscription publique des formateurs externes
export const registerFormateurExterne = async (req, res) => {
    const { nom, prenom, email, telephone, mots_cles, remarques } = req.body;

    // Validation des champs requis
    if (!nom || !prenom || !email || !mots_cles) {
        return res.status(400).json({
            message: 'Les champs nom, prénom, email et mots-clés sont obligatoires.'
        });
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'Format d\'email invalide.'
        });
    }

    try {
        // Vérifier si un formateur avec cet email existe déjà
        const [existingFormateur] = await pool.execute(
            'SELECT id, statut FROM formateurs WHERE email = ?',
            [email]
        );

        if (existingFormateur.length > 0) {
            const statut = existingFormateur[0].statut;
            if (statut === 'en_attente') {
                return res.status(400).json({
                    message: 'Une demande d\'inscription avec cet email est déjà en attente de validation.'
                });
            } else if (statut === 'approuve') {
                return res.status(400).json({
                    message: 'Un formateur avec cet email est déjà enregistré dans notre système.'
                });
            } else if (statut === 'rejete') {
                return res.status(400).json({
                    message: 'Une demande avec cet email a été rejetée. Veuillez contacter l\'administration.'
                });
            }
        }

        // Insérer la demande d'inscription du formateur externe
        await pool.execute(
            `INSERT INTO formateurs 
            (utilisateur_id, nom, prenom, email, mots_cles, remarques, statut, type) 
            VALUES (NULL, ?, ?, ?, ?, ?, 'en_attente', 'externe')`,
            [nom, prenom, email, mots_cles, remarques || null]
        );

        res.status(201).json({
            message: 'Votre demande d\'inscription a été envoyée avec succès. Vous pouvez vérifier le statut de votre demande sur la page "Statut de ma demande".',
            success: true
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription du formateur externe:', error);
        res.status(500).json({
            message: 'Erreur lors de l\'envoi de votre demande. Veuillez réessayer plus tard.'
        });
    }
};

// Fonction pour obtenir tous les formateurs externes en attente (pour l'admin)
export const getFormateursEnAttente = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT id, nom, prenom, email, mots_cles, remarques, created_at 
            FROM formateurs 
            WHERE statut = 'en_attente' AND type = 'externe'
            ORDER BY created_at DESC`
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des demandes en attente.' });
    }
};

// Fonction pour approuver ou rejeter une demande de formateur externe
export const updateStatutFormateur = async (req, res) => {
    const { id } = req.params;
    const { statut, createAccount, password } = req.body;

    if (!['approuve', 'rejete'].includes(statut)) {
        return res.status(400).json({ message: 'Statut invalide. Utilisez "approuve" ou "rejete".' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Récupérer les informations du formateur
        const [formateur] = await connection.execute(
            'SELECT * FROM formateurs WHERE id = ?',
            [id]
        );

        if (formateur.length === 0) {
            return res.status(404).json({ message: 'Formateur non trouvé.' });
        }

        // Si approuvé et création de compte demandée
        if (statut === 'approuve' && createAccount) {
            const { nom, prenom, email } = formateur[0];
            const passwordToUse = password || 'formateur123';

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
                    [nom, prenom, email, hashedPassword, 'formateur']
                );
                utilisateur_id = userResult.insertId;

                // Mettre à jour le formateur avec l'ID utilisateur ET le mot de passe temporaire
                await connection.execute(
                    'UPDATE formateurs SET utilisateur_id = ?, statut = ?, password_temporaire = ? WHERE id = ?',
                    [utilisateur_id, statut, passwordToUse, id]
                );
            } else {
                // Juste mettre à jour le statut et le mot de passe temporaire
                await connection.execute(
                    'UPDATE formateurs SET statut = ?, password_temporaire = ? WHERE id = ?',
                    [statut, passwordToUse, id]
                );
            }
        } else {
            // Mettre à jour uniquement le statut
            await connection.execute(
                'UPDATE formateurs SET statut = ? WHERE id = ?',
                [statut, id]
            );
        }

        await connection.commit();

        const message = statut === 'approuve'
            ? 'Formateur approuvé avec succès.'
            : 'Demande rejetée.';

        res.json({ message, success: true });
    } catch (error) {
        await connection.rollback();
        console.error('Erreur lors de la mise à jour du statut:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut.' });
    } finally {
        connection.release();
    }
};

// Fonction publique pour vérifier le statut d'une demande par email
export const checkStatutByEmail = async (req, res) => {
    const { email } = req.body;

    // Validation de l'email
    if (!email) {
        return res.status(400).json({ message: 'L\'email est requis.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Format d\'email invalide.' });
    }

    try {
        // Récupérer la demande du formateur avec le mot de passe temporaire
        const [formateur] = await pool.execute(
            `SELECT id, nom, prenom, email, statut, created_at, mots_cles, remarques, password_temporaire 
            FROM formateurs 
            WHERE email = ? AND type = 'externe'
            ORDER BY created_at DESC
            LIMIT 1`,
            [email]
        );

        if (formateur.length === 0) {
            return res.status(404).json({
                message: 'Aucune demande trouvée avec cet email.',
                found: false
            });
        }

        const demandeInfo = formateur[0];

        // Préparer la réponse de base
        const response = {
            found: true,
            demande: {
                nom: demandeInfo.nom,
                prenom: demandeInfo.prenom,
                email: demandeInfo.email,
                statut: demandeInfo.statut,
                created_at: demandeInfo.created_at,
                mots_cles: demandeInfo.mots_cles
            }
        };

        // Ajouter le mot de passe temporaire UNIQUEMENT si le statut est "approuve"
        if (demandeInfo.statut === 'approuve' && demandeInfo.password_temporaire) {
            response.demande.password_temporaire = demandeInfo.password_temporaire;
        }

        res.json(response);
    } catch (error) {
        console.error('Erreur lors de la vérification du statut:', error);
        res.status(500).json({
            message: 'Erreur lors de la vérification du statut.'
        });
    }
};

