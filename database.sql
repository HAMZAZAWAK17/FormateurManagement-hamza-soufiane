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
