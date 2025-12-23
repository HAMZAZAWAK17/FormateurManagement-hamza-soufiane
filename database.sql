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