import bcrypt from 'bcryptjs';
import pool from './config/database.js';

/**
 * Script pour mettre à jour le mot de passe de l'admin
 */

const updateAdminPassword = async () => {
    try {
        console.log('🔐 Mise à jour du mot de passe admin...\n');

        const email = 'admin@formation.com';
        const newPassword = 'admin123';

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe
        const [result] = await pool.query(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, email]
        );

        if (result.affectedRows === 0) {
            console.log('❌ Aucun utilisateur trouvé avec cet email');
            console.log('💡 Créez d\'abord l\'admin avec le script SQL ou via /register');
        } else {
            console.log('✅ Mot de passe mis à jour avec succès !\n');
            console.log('📧 Email:', email);
            console.log('🔑 Mot de passe:', newPassword);
            console.log('\n🎯 Vous pouvez maintenant vous connecter !');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
};

updateAdminPassword();
