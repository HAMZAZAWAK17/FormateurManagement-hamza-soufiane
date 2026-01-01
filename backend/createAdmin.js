import bcrypt from 'bcryptjs';
import pool from './config/database.js';

/**
 * Script pour créer un utilisateur admin
 * Usage: node createAdmin.js
 */

const createAdmin = async () => {
    try {
        console.log('🔐 Création d\'un utilisateur admin...\n');

        // Données de l'admin
        const adminData = {
            nom: 'Admin',
            prenom: 'Super',
            email: 'admin@formation.com',
            password: 'admin123',
            role: 'admin',
            telephone: '0612345678'
        };

        // Vérifier si l'admin existe déjà
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [adminData.email]
        );

        if (existing.length > 0) {
            console.log('⚠️  Un admin avec cet email existe déjà !');
            console.log('📧 Email:', adminData.email);
            process.exit(0);
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(adminData.password, 10);

        // Insérer l'admin
        await pool.query(
            `INSERT INTO users (nom, prenom, email, password, role, telephone) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                adminData.nom,
                adminData.prenom,
                adminData.email,
                hashedPassword,
                adminData.role,
                adminData.telephone
            ]
        );

        console.log('✅ Utilisateur admin créé avec succès !\n');
        console.log('📧 Email:', adminData.email);
        console.log('🔑 Mot de passe:', adminData.password);
        console.log('\n⚠️  Changez ce mot de passe après la première connexion !');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de la création de l\'admin:', error.message);
        process.exit(1);
    }
};

createAdmin();
