-- Script rapide pour créer un admin avec le bon mot de passe

USE gestion_formation;

-- Supprimer l'admin existant s'il y en a un
DELETE FROM users WHERE email = 'admin@formation.com';

-- Créer l'admin avec le bon hash bcrypt
-- Email: admin@formation.com
-- Mot de passe: admin123
INSERT INTO users (nom, prenom, email, password, role, telephone) VALUES
('Admin', 'Super', 'admin@formation.com', '$2a$10$fuUUhtnYB0vYweNkFeYKcpgNYRDco/uLH1mRWzcJWF4vk', 'admin', '0612345678');

SELECT 'Admin créé avec succès !' as message;
SELECT id, CONCAT(prenom, ' ', nom) as nom_complet, email, role FROM users WHERE email = 'admin@formation.com';
