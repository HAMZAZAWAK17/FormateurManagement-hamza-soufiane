CREATE DATABASE IF NOT EXISTS formateur_management;
USE formateur_management;

CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'formateur', 'assistant') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion d'un admin par défaut (mot de passe: admin123)
-- Note: Dans une application réelle, le mot de passe doit être haché
-- Ici on utilise un hash factice ou on s'attend à ce que l'app le gère
-- Pour le test, on pourra insérer via l'API d'inscription ou manuellement si besoin.
INSERT INTO utilisateurs (nom, prenom, email, password, role) 
VALUES ('Admin', 'System', 'admin@formation.com', '$2a$12$R9h/lIPzHZ7.3m8pkOy6S.yW1493Y68u.m9Y9uPz6O.5W.3y68u', 'admin');


-- Fonctionnalité 2 : 
-- Table des formations
CREATE TABLE IF NOT EXISTS formations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    nombre_heures INT NOT NULL,
    cout DECIMAL(10, 2) NOT NULL,
    objectifs TEXT NOT NULL,
    programme_detaille TEXT NOT NULL
);

-- Insertion des formations de test
INSERT INTO formations (titre, nombre_heures, cout, objectifs, programme_detaille) VALUES
(
    'Développement Web Full Stack', 
    40, 
    350.00, 
    'Comprendre les bases du développement web
    Réaliser un projet web simple de bout en bout',
    'Module 1 : Introduction au Web (5h)
     Module 2 : HTML & CSS (15h)
     Module 3 : Javascript (10h)
     Module 4 : Introduction au Back-end (5h)
     Module 5 : Projet pratique (5h)' ),
(
    'Formation en Développement Mobile Android', 
    60, 
    800.00, 
    'Apprendre les bases du développement Android
    Utiliser Android Studio et le langage Kotlin
    Comprendre le cycle de vie d''une application Android',
    'Introduction à Android et Android Studio
    Kotlin : bases du langage
    Interfaces utilisateur (XML, layouts)
    APIs et permissions
    Projet final : application Android complète'
);

-- Fonctionnalité 3 :
-- Table des formateurs
CREATE TABLE IF NOT EXISTS formateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT DEFAULT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mots_cles TEXT NOT NULL, -- Compétences caractérisées par des mots clés
    remarques TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE SET NULL
);

-- Fonctionnalité 4 :
-- Table des entreprises
CREATE TABLE IF NOT EXISTS entreprises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    adresse TEXT NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    url VARCHAR(255),
    email VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fonctionnalité 5 :
-- Table des planifications de formations
CREATE TABLE IF NOT EXISTS planifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    formation_id INT NOT NULL,
    formateur_id INT NOT NULL,
    entreprise_id INT NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    horaire_debut TIME NOT NULL,
    horaire_fin TIME NOT NULL,
    statut ENUM('planifiee', 'en_cours', 'terminee', 'annulee') DEFAULT 'planifiee',
    remarques TEXT,
    created_by INT NOT NULL, -- ID de l'admin ou assistant qui a créé la planification
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE,
    FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (entreprise_id) REFERENCES entreprises(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX idx_planifications_dates ON planifications(date_debut, date_fin);
CREATE INDEX idx_planifications_formateur ON planifications(formateur_id);
CREATE INDEX idx_planifications_entreprise ON planifications(entreprise_id);
CREATE INDEX idx_planifications_formation ON planifications(formation_id);

-- Fonctionnalité 6 :
-- Table des participants individuels (inscriptions public)
CREATE TABLE IF NOT EXISTS participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL,
    ville VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    formation_id INT NOT NULL,
    statut ENUM('en_attente', 'confirme', 'annule') DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE
);

-- Table pour gérer les sessions de formation pour groupes d'individus
CREATE TABLE IF NOT EXISTS sessions_individuelles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    formation_id INT NOT NULL,
    formateur_id INT,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    horaire_debut TIME NOT NULL,
    horaire_fin TIME NOT NULL,
    lieu VARCHAR(255),
    nombre_places INT DEFAULT 20,
    statut ENUM('planifiee', 'en_cours', 'terminee', 'annulee') DEFAULT 'planifiee',
    remarques TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE,
    FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- Table de liaison entre participants et sessions
CREATE TABLE IF NOT EXISTS participants_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    participant_id INT NOT NULL,
    session_id INT NOT NULL,
    statut_inscription ENUM('inscrit', 'confirme', 'annule') DEFAULT 'inscrit',
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES sessions_individuelles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_participant_session (participant_id, session_id)
);

-- Index pour améliorer les performances
CREATE INDEX idx_participants_formation ON participants(formation_id);
CREATE INDEX idx_participants_email ON participants(email);
CREATE INDEX idx_sessions_formation ON sessions_individuelles(formation_id);
CREATE INDEX idx_sessions_formateur ON sessions_individuelles(formateur_id);

-- Données d'exemple pour la Fonctionnalité 6 :
-- Note: Remplacez created_by par l'ID de votre admin (vérifiez avec: SELECT id FROM utilisateurs WHERE role='admin')

-- Insertion de 3 participants individuels (inscriptions publiques)
INSERT INTO participants (nom, prenom, date_naissance, ville, email, telephone, formation_id, statut) VALUES
('Bennani', 'Sara', '1995-03-15', 'Casablanca', 'sara.bennani@email.com', '0612345678', 1, 'en_attente'),
('Alaoui', 'Karim', '1992-07-22', 'Rabat', 'karim.alaoui@email.com', '0623456789', 1, 'confirme'),
('Senhaji', 'Youssef', '1994-02-18', 'Agadir', 'youssef.senhaji@email.com', '0667890123', 2, 'confirme');

-- Insertion de 3 sessions individuelles (groupes de formation)
-- IMPORTANT: Changez created_by=2 par l'ID de votre admin si différent
INSERT INTO sessions_individuelles 
(formation_id, formateur_id, date_debut, date_fin, horaire_debut, horaire_fin, lieu, nombre_places, statut, remarques, created_by) 
VALUES
(1, 1, '2025-02-10', '2025-02-21', '09:00:00', '17:00:00', 'Salle A - Centre Casablanca', 20, 'planifiee', 'Session pour débutants', 2),
(1, 2, '2025-03-05', '2025-03-16', '09:00:00', '16:00:00', 'Salle B - Centre Rabat', 15, 'planifiee', 'Session intensive', 2),
(2, 1, '2025-02-15', '2025-03-28', '10:00:00', '18:00:00', 'Lab Informatique - Casablanca', 12, 'planifiee', 'Formation Android pratique', 2);

-- Affectation de 3 participants aux sessions
INSERT INTO participants_sessions (participant_id, session_id, statut_inscription) VALUES
(1, 1, 'inscrit'),   -- Sara Bennani -> Session 1
(2, 1, 'confirme'),  -- Karim Alaoui -> Session 1
(3, 3, 'confirme');  -- Youssef Senhaji -> Session 3