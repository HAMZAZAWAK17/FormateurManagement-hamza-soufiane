import pool from './config/database.js';

const createTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS ressources (
                id INT AUTO_INCREMENT PRIMARY KEY,
                formation_id INT,
                titre VARCHAR(255),
                type VARCHAR(50),
                url TEXT,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE
            )
        `);
        console.log('Table ressources créée avec succès');
    } catch (error) {
        console.error('Erreur:', error);
    }
    process.exit();
};

createTable();
