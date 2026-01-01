import bcrypt from 'bcryptjs';

/**
 * Script pour générer des hash bcrypt pour les mots de passe
 */

const passwords = {
    admin: 'admin123',
    formateur: 'formateur123',
    participant: 'participant123'
};

const generateHashes = async () => {
    console.log('🔐 Génération des hash bcrypt...\n');

    for (const [role, password] of Object.entries(passwords)) {
        const hash = await bcrypt.hash(password, 10);
        console.log(`${role.toUpperCase()}:`);
        console.log(`  Mot de passe: ${password}`);
        console.log(`  Hash: ${hash}`);
        console.log('');
    }

    console.log('✅ Hash générés avec succès !');
    console.log('\n📝 Copiez ces hash dans votre fichier SQL');
};

generateHashes();
