
import pool from '../config/database.js';

const createTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                message TEXT NOT NULL,
                type VARCHAR(20) DEFAULT 'info',
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await pool.query(query);
        console.log('✅ Table notifications créée avec succès');
        process.exit(0);
    } catch (err) {
        console.error('❌ Erreur:', err);
        process.exit(1);
    }
};

createTable();
