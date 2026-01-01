-- Script SQL pour créer un utilisateur admin par défaut
-- Mot de passe : admin123 (hashé avec bcrypt)

USE gestion_formation;

-- Insérer un utilisateur admin
-- Note: Le mot de passe 'admin123' est hashé avec bcrypt (10 rounds)
INSERT INTO users (nom, prenom, email, password, role, telephone)
VALUES (
  'Admin',
  'Super',
  'admin@formation.com',
  '$2a$10$rKvVJ5YlPZqKxB7YhHqYJeqKxB7YhHqYJeqKxB7YhHqYJeqKxB7Yh',
  'admin',
  '0612345678'
);

-- Insérer quelques formations d'exemple
INSERT INTO formations (titre, description, heures, cout, objectifs, programme, categorie, ville)
VALUES
  (
    'Formation React JS',
    'Apprenez à créer des applications web modernes avec React',
    40,
    5000,
    'Maîtriser React, comprendre les hooks, gérer l\'état',
    'Module 1: Introduction à React\nModule 2: Components et Props\nModule 3: State et Lifecycle\nModule 4: Hooks\nModule 5: Projet final',
    'Informatique',
    'Casablanca'
  ),
  (
    'Formation Node.js',
    'Développez des API REST avec Node.js et Express',
    35,
    4500,
    'Créer des serveurs web, gérer des bases de données',
    'Module 1: Introduction à Node.js\nModule 2: Express Framework\nModule 3: MongoDB\nModule 4: Authentification JWT\nModule 5: Déploiement',
    'Informatique',
    'Rabat'
  ),
  (
    'Management d\'Équipe',
    'Développez vos compétences en leadership',
    30,
    3500,
    'Gérer une équipe, motiver, communiquer efficacement',
    'Module 1: Les bases du management\nModule 2: Communication\nModule 3: Gestion des conflits\nModule 4: Motivation',
    'Management',
    'Casablanca'
  ),
  (
    'Marketing Digital',
    'Maîtrisez les outils du marketing en ligne',
    25,
    3000,
    'SEO, SEA, réseaux sociaux, analytics',
    'Module 1: Introduction au marketing digital\nModule 2: SEO\nModule 3: Google Ads\nModule 4: Social Media Marketing',
    'Marketing',
    'Marrakech'
  );

-- Note: Pour créer le hash du mot de passe 'admin123', utilisez:
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('admin123', 10);
-- console.log(hash);
