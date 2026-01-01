-- ========================================
-- Script SQL Complet - Gestion de Formation
-- ========================================
-- Ce script crée la base de données, les tables et insère des données d'exemple
-- Exécutez ce script dans MySQL Workbench, phpMyAdmin ou en ligne de commande

-- ========================================
-- 1. CRÉATION DE LA BASE DE DONNÉES
-- ========================================

-- Supprimer la base si elle existe déjà (ATTENTION : supprime toutes les données)
DROP DATABASE IF EXISTS gestion_formation;

-- Créer la base de données avec encodage UTF-8
CREATE DATABASE gestion_formation 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- Sélectionner la base de données
USE gestion_formation;

-- ========================================
-- 2. CRÉATION DES TABLES
-- ========================================

-- Table : users (utilisateurs du système)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'formateur', 'participant') NOT NULL,
  telephone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table : formations (catalogue des formations)
CREATE TABLE formations (
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_categorie (categorie),
  INDEX idx_ville (ville)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table : formateurs (profils détaillés des formateurs)
CREATE TABLE formateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE,
  competences TEXT,
  remarques TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table : sessions (planification des formations)
CREATE TABLE sessions (
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
  FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE SET NULL,
  INDEX idx_formation_id (formation_id),
  INDEX idx_formateur_id (formateur_id),
  INDEX idx_date_debut (date_debut),
  INDEX idx_statut (statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table : inscriptions (inscriptions des participants)
CREATE TABLE inscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  participant_id INT NOT NULL,
  statut ENUM('en_attente', 'confirmee', 'annulee') DEFAULT 'en_attente',
  date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (participant_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_inscription (session_id, participant_id),
  INDEX idx_session_id (session_id),
  INDEX idx_participant_id (participant_id),
  INDEX idx_statut (statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table : evaluations (évaluations des formations)
CREATE TABLE evaluations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  inscription_id INT NOT NULL,
  note INT CHECK (note BETWEEN 1 AND 5),
  commentaire TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inscription_id) REFERENCES inscriptions(id) ON DELETE CASCADE,
  INDEX idx_inscription_id (inscription_id),
  INDEX idx_note (note)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 3. INSERTION DES DONNÉES D'EXEMPLE
-- ========================================

-- ----------------------------------------
-- 3.1 UTILISATEURS
-- ----------------------------------------

-- Admin (mot de passe: admin123)
-- Hash généré avec bcrypt, rounds=10
INSERT INTO users (nom, prenom, email, password, role, telephone) VALUES
('Admin', 'Super', 'admin@formation.com', '$2a$10$rKvVJ5YlPZqKxB7YhHqYJeqKxB7YhHqYJeqKxB7YhHqYJeqKxB7Yh', 'admin', '0612345678');

-- Formateurs (mot de passe: formateur123 pour tous)
INSERT INTO users (nom, prenom, email, password, role, telephone) VALUES
('Alami', 'Mohammed', 'mohammed.alami@formation.com', '$2a$10$rKvVJ5YlPZqKxB7YhHqYJeqKxB7YhHqYJeqKxB7YhHqYJeqKxB7Yh', 'formateur', '0623456789'),
('Benali', 'Fatima', 'fatima.benali@formation.com', '$2a$10$rKvVJ5YlPZqKxB7YhHqYJeqKxB7YhHqYJeqKxB7YhHqYJeqKxB7Yh', 'formateur', '0634567890'),
('Chakir', 'Youssef', 'youssef.chakir@formation.com', '$2a$10$rKvVJ5YlPZqKxB7YhHqYJeqKxB7YhHqYJeqKxB7YhHqYJeqKxB7Yh', 'formateur', '0645678901'),
('Drissi', 'Amina', 'amina.drissi@formation.com', '$2a$10$rKvVJ5YlPZqKxB7YhHqYJeqKxB7YhHqYJeqKxB7YhHqYJeqKxB7Yh', 'formateur', '0656789012');

-- Participants (mot de passe: participant123 pour tous)
INSERT INTO users (nom, prenom, email, password, role, telephone) VALUES
('El Amrani', 'Sara', 'sara.elamrani@email.com', '$2a$10$rKvVJ5YlPZqKxB7YhHqYJeqKxB7YhHqYJeqKxB7YhHqYJeqKxB7Yh', 'participant', '0667890123'),
('Fassi', 'Karim', 'karim.fassi@email.com', '$2a$10$rKvVJ5YlPZqKxB7YhHqYJeqKxB7YhHqYJeqKxB7YhHqYJeqKxB7Yh', 'participant', '0678901234'),
('Ghazi', 'Leila', 'leila.ghazi@email.com', '$2a$10$rKvVJ5YlPZqKxB7YhHqYJeqKxB7YhHqYJeqKxB7YhHqYJeqKxB7Yh', 'participant', '0689012345'),
('Hamdi', 'Omar', 'omar.hamdi@email.com', '$2a$10$rKvVJ5YlPZqKxB7YhHqYJeqKxB7YhHqYJeqKxB7YhHqYJeqKxB7Yh', 'participant', '0690123456'),
('Idrissi', 'Nadia', 'nadia.idrissi@email.com', '$2a$10$rKvVJ5YlPZqKxB7YhHqYJeqKxB7YhHqYJeqKxB7YhHqYJeqKxB7Yh', 'participant', '0601234567');

-- ----------------------------------------
-- 3.2 FORMATEURS (profils)
-- ----------------------------------------

INSERT INTO formateurs (user_id, competences, remarques) VALUES
(2, 'React, JavaScript, Node.js, MongoDB', 'Expert en développement web moderne, 10 ans d''expérience'),
(3, 'Management, Leadership, Communication', 'Consultante en management avec MBA, spécialisée en gestion d''équipe'),
(4, 'Marketing Digital, SEO, Google Ads, Analytics', 'Certifié Google, 8 ans d''expérience en marketing digital'),
(5, 'Comptabilité, Finance, Excel avancé', 'Expert-comptable diplômé, formateur depuis 5 ans');

-- ----------------------------------------
-- 3.3 FORMATIONS
-- ----------------------------------------

INSERT INTO formations (titre, description, heures, cout, objectifs, programme, categorie, ville) VALUES
-- Informatique
(
  'Développement Web avec React',
  'Formation complète pour maîtriser React et créer des applications web modernes et performantes.',
  40,
  5000.00,
  'Maîtriser React et ses concepts fondamentaux\nComprendre les hooks et la gestion d''état\nCréer des applications Single Page Application (SPA)\nIntégrer des API REST',
  'Module 1: Introduction à React et JSX (8h)\nModule 2: Components et Props (8h)\nModule 3: State et Lifecycle (8h)\nModule 4: Hooks (useState, useEffect, useContext) (8h)\nModule 5: Projet final - Application complète (8h)',
  'Informatique',
  'Casablanca'
),
(
  'Backend avec Node.js et Express',
  'Apprenez à développer des API REST robustes et sécurisées avec Node.js.',
  35,
  4500.00,
  'Créer des serveurs web avec Express\nGérer des bases de données MongoDB\nImplementer l''authentification JWT\nDéployer des applications Node.js',
  'Module 1: Introduction à Node.js (7h)\nModule 2: Express Framework (7h)\nModule 3: MongoDB et Mongoose (7h)\nModule 4: Authentification et Sécurité (7h)\nModule 5: Déploiement et Bonnes Pratiques (7h)',
  'Informatique',
  'Rabat'
),
(
  'Python pour Data Science',
  'Maîtrisez Python et ses bibliothèques pour l''analyse de données.',
  45,
  5500.00,
  'Programmer en Python\nUtiliser Pandas et NumPy\nVisualiser des données avec Matplotlib\nIntroduction au Machine Learning',
  'Module 1: Bases de Python (9h)\nModule 2: Pandas et NumPy (9h)\nModule 3: Visualisation de données (9h)\nModule 4: Introduction au ML (9h)\nModule 5: Projet d''analyse de données (9h)',
  'Informatique',
  'Casablanca'
),

-- Management
(
  'Management d''Équipe',
  'Développez vos compétences en leadership et gestion d''équipe.',
  30,
  3500.00,
  'Comprendre les fondamentaux du management\nMotiver et fédérer une équipe\nGérer les conflits efficacement\nCommuniquer de manière assertive',
  'Module 1: Les bases du management (6h)\nModule 2: Leadership et motivation (6h)\nModule 3: Communication managériale (6h)\nModule 4: Gestion des conflits (6h)\nModule 5: Cas pratiques et mises en situation (6h)',
  'Management',
  'Casablanca'
),
(
  'Gestion de Projet Agile',
  'Maîtrisez les méthodologies Agile et Scrum pour gérer vos projets.',
  25,
  3000.00,
  'Comprendre les principes Agile\nAppliquer la méthodologie Scrum\nUtiliser les outils de gestion de projet\nPréparer la certification Scrum Master',
  'Module 1: Introduction à l''Agile (5h)\nModule 2: Framework Scrum (5h)\nModule 3: Outils (Jira, Trello) (5h)\nModule 4: Pratiques avancées (5h)\nModule 5: Préparation certification (5h)',
  'Management',
  'Rabat'
),

-- Marketing
(
  'Marketing Digital',
  'Maîtrisez les outils et stratégies du marketing en ligne.',
  30,
  3500.00,
  'Comprendre le marketing digital\nOptimiser le référencement (SEO)\nGérer des campagnes Google Ads\nAnalyser les performances avec Analytics',
  'Module 1: Introduction au marketing digital (6h)\nModule 2: SEO et référencement naturel (6h)\nModule 3: Google Ads et SEA (6h)\nModule 4: Social Media Marketing (6h)\nModule 5: Analytics et ROI (6h)',
  'Marketing',
  'Marrakech'
),
(
  'Réseaux Sociaux pour Entreprises',
  'Développez votre présence sur les réseaux sociaux.',
  20,
  2500.00,
  'Créer une stratégie social media\nGérer les réseaux sociaux professionnels\nCréer du contenu engageant\nMesurer les performances',
  'Module 1: Stratégie social media (5h)\nModule 2: Facebook et Instagram (5h)\nModule 3: LinkedIn et Twitter (5h)\nModule 4: Création de contenu (5h)',
  'Marketing',
  'Casablanca'
),

-- Langues
(
  'Anglais des Affaires',
  'Perfectionnez votre anglais professionnel.',
  40,
  4000.00,
  'Communiquer en anglais professionnel\nRédiger des emails et rapports\nParticiper à des réunions\nNégocier en anglais',
  'Module 1: Business vocabulary (10h)\nModule 2: Email writing (10h)\nModule 3: Meetings and presentations (10h)\nModule 4: Negotiations (10h)',
  'Langues',
  'Casablanca'
),

-- Comptabilité
(
  'Comptabilité Générale',
  'Maîtrisez les fondamentaux de la comptabilité.',
  35,
  3800.00,
  'Comprendre les principes comptables\nEnregistrer les opérations courantes\nÉtablir un bilan et compte de résultat\nUtiliser un logiciel comptable',
  'Module 1: Principes comptables (7h)\nModule 2: Opérations courantes (7h)\nModule 3: Travaux de fin d''exercice (7h)\nModule 4: États financiers (7h)\nModule 5: Logiciel comptable (7h)',
  'Comptabilité',
  'Rabat'
),
(
  'Excel Avancé pour la Finance',
  'Maîtrisez Excel pour l''analyse financière.',
  25,
  2800.00,
  'Utiliser les fonctions avancées d''Excel\nCréer des tableaux de bord\nAutomatiser avec les macros\nAnalyser des données financières',
  'Module 1: Fonctions avancées (5h)\nModule 2: Tableaux croisés dynamiques (5h)\nModule 3: Macros et VBA (5h)\nModule 4: Tableaux de bord (5h)\nModule 5: Analyse financière (5h)',
  'Comptabilité',
  'Casablanca'
);

-- ----------------------------------------
-- 3.4 SESSIONS (planification)
-- ----------------------------------------

INSERT INTO sessions (formation_id, formateur_id, date_debut, date_fin, lieu, places_disponibles, statut) VALUES
-- Sessions en cours et à venir
(1, 1, '2026-02-01', '2026-02-15', 'Centre de Formation - Casablanca, Bd Zerktouni', 20, 'planifiee'),
(2, 1, '2026-02-10', '2026-02-25', 'Centre de Formation - Rabat, Avenue Hassan II', 15, 'planifiee'),
(3, 1, '2026-03-01', '2026-03-20', 'Centre de Formation - Casablanca, Bd Zerktouni', 18, 'planifiee'),
(4, 2, '2026-02-05', '2026-02-12', 'Centre de Formation - Casablanca, Bd Zerktouni', 25, 'planifiee'),
(5, 2, '2026-02-15', '2026-02-22', 'Centre de Formation - Rabat, Avenue Hassan II', 20, 'planifiee'),
(6, 3, '2026-02-08', '2026-02-18', 'Centre de Formation - Marrakech, Avenue Mohammed V', 22, 'planifiee'),
(7, 3, '2026-03-01', '2026-03-08', 'Centre de Formation - Casablanca, Bd Zerktouni', 20, 'planifiee'),
(8, 2, '2026-02-20', '2026-03-10', 'Centre de Formation - Casablanca, Bd Zerktouni', 15, 'planifiee'),
(9, 4, '2026-02-12', '2026-02-26', 'Centre de Formation - Rabat, Avenue Hassan II', 18, 'planifiee'),
(10, 4, '2026-03-05', '2026-03-15', 'Centre de Formation - Casablanca, Bd Zerktouni', 20, 'planifiee'),

-- Sessions terminées (pour avoir des évaluations)
(1, 1, '2025-12-01', '2025-12-15', 'Centre de Formation - Casablanca, Bd Zerktouni', 0, 'terminee'),
(4, 2, '2025-12-05', '2025-12-12', 'Centre de Formation - Casablanca, Bd Zerktouni', 0, 'terminee'),
(6, 3, '2025-12-10', '2025-12-20', 'Centre de Formation - Marrakech, Avenue Mohammed V', 0, 'terminee');

-- ----------------------------------------
-- 3.5 INSCRIPTIONS
-- ----------------------------------------

-- Inscriptions pour sessions à venir
INSERT INTO inscriptions (session_id, participant_id, statut) VALUES
-- Session 1 (React)
(1, 6, 'confirmee'),
(1, 7, 'confirmee'),
(1, 8, 'confirmee'),

-- Session 2 (Node.js)
(2, 6, 'confirmee'),
(2, 9, 'confirmee'),

-- Session 4 (Management)
(4, 7, 'confirmee'),
(4, 8, 'confirmee'),
(4, 10, 'confirmee'),

-- Session 6 (Marketing Digital)
(6, 9, 'confirmee'),
(6, 10, 'confirmee'),

-- Inscriptions pour sessions terminées (pour évaluations)
(11, 6, 'confirmee'),
(11, 7, 'confirmee'),
(11, 8, 'confirmee'),
(12, 7, 'confirmee'),
(12, 9, 'confirmee'),
(13, 8, 'confirmee'),
(13, 10, 'confirmee');

-- ----------------------------------------
-- 3.6 ÉVALUATIONS
-- ----------------------------------------

INSERT INTO evaluations (inscription_id, note, commentaire) VALUES
-- Évaluations de la formation React (session 11)
(11, 5, 'Excellente formation ! Le formateur est très pédagogue et les exercices pratiques sont très utiles.'),
(12, 5, 'Formation très complète, j''ai beaucoup appris. Je recommande vivement !'),
(13, 4, 'Bonne formation, contenu riche. Aurait aimé plus de temps sur les hooks.'),

-- Évaluations de la formation Management (session 12)
(14, 5, 'Formation transformatrice ! J''ai acquis des compétences essentielles pour mon poste.'),
(15, 4, 'Très bonne formation avec des cas pratiques pertinents.'),

-- Évaluations de la formation Marketing Digital (session 13)
(16, 5, 'Formation exceptionnelle ! Très pratique et directement applicable.'),
(17, 5, 'Le formateur est un expert, j''ai appris énormément de choses utiles.');

-- ========================================
-- 4. VÉRIFICATION DES DONNÉES
-- ========================================

-- Afficher le nombre d'enregistrements par table
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'formateurs', COUNT(*) FROM formateurs
UNION ALL
SELECT 'formations', COUNT(*) FROM formations
UNION ALL
SELECT 'sessions', COUNT(*) FROM sessions
UNION ALL
SELECT 'inscriptions', COUNT(*) FROM inscriptions
UNION ALL
SELECT 'evaluations', COUNT(*) FROM evaluations;

-- ========================================
-- 5. REQUÊTES UTILES
-- ========================================

-- Lister tous les utilisateurs avec leur rôle
-- SELECT id, CONCAT(prenom, ' ', nom) as nom_complet, email, role FROM users;

-- Lister toutes les formations avec le nombre de sessions
-- SELECT f.titre, COUNT(s.id) as nb_sessions 
-- FROM formations f 
-- LEFT JOIN sessions s ON f.id = s.formation_id 
-- GROUP BY f.id;

-- Lister les inscriptions avec détails
-- SELECT 
--   CONCAT(u.prenom, ' ', u.nom) as participant,
--   f.titre as formation,
--   s.date_debut,
--   i.statut
-- FROM inscriptions i
-- JOIN users u ON i.participant_id = u.id
-- JOIN sessions s ON i.session_id = s.id
-- JOIN formations f ON s.formation_id = f.id;

-- ========================================
-- FIN DU SCRIPT
-- ========================================

-- Note: Les mots de passe hashés dans ce script sont des exemples
-- Pour générer de vrais hash bcrypt, utilisez le script createAdmin.js
-- ou l'endpoint d'inscription de l'API
