import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuration de la connexion MySQL
 * Pool de connexions pour de meilleures performances
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestion_formation',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Fonction pour tester la connexion à la base de données
 */
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion MySQL établie avec succès');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:', error.message);
    return false;
  }
};

/**
 * Fonction pour initialiser la base de données
 * Crée les tables si elles n'existent pas
 */
export const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // Table users (utilisateurs du système)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'formateur', 'participant') NOT NULL,
        telephone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Table formations
    await connection.query(`
      CREATE TABLE IF NOT EXISTS formations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titre VARCHAR(255) NOT NULL,
        description TEXT,
        heures INT NOT NULL,
        cout DECIMAL(10, 2) NOT NULL,
        objectifs TEXT,
        programme TEXT,
        categorie VARCHAR(100),
        ville VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Table formateurs (profils détaillés)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS formateurs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE,
        competences TEXT,
        remarques TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Table sessions (planification des formations)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        formation_id INT NOT NULL,
        formateur_id INT,
        date_debut DATE NOT NULL,
        date_fin DATE NOT NULL,
        lieu VARCHAR(255),
        places_disponibles INT DEFAULT 20,
        statut ENUM('planifiee', 'en_cours', 'terminee', 'annulee') DEFAULT 'planifiee',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE,
        FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Table inscriptions
    await connection.query(`
      CREATE TABLE IF NOT EXISTS inscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id INT NOT NULL,
        participant_id INT NOT NULL,
        statut ENUM('en_attente', 'confirmee', 'annulee') DEFAULT 'en_attente',
        date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
        FOREIGN KEY (participant_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_inscription (session_id, participant_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Table evaluations
    await connection.query(`
      CREATE TABLE IF NOT EXISTS evaluations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        inscription_id INT NOT NULL,
        note INT CHECK (note BETWEEN 1 AND 5),
        commentaire TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (inscription_id) REFERENCES inscriptions(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('✅ Tables créées avec succès');
    connection.release();
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error.message);
    throw error;
  }
};

export default pool;
