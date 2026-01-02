USE gestion_formation;

-- =============================================
-- 1. INSERTION DES FORMATEURS (USERS + FORMATEURS)
-- Mot de passe pour tous : "admin123"
-- =============================================

-- Formateur 1 : Sophie Martin (Dev Web)
INSERT INTO users (nom, prenom, email, password, role, telephone)
VALUES ('Martin', 'Sophie', 'sophie.martin@formation.com', '$2a$10$rKvVJ5YlPZqKxB7YhHqYJeqKxB7YhHqYJeqKxB7YhHqYJeqKxB7Yh', 'formateur', '0612345679');
SET @userId1 = LAST_INSERT_ID();

INSERT INTO formateurs (user_id, competences, remarques)
VALUES (@userId1, 'Développement Web', 'Expert React et Node.js avec 5 ans d''expérience.');
SET @formateurId1 = LAST_INSERT_ID();


-- Formateur 2 : Jean Dubois (Systèmes)
INSERT INTO users (nom, prenom, email, password, role, telephone)
VALUES ('Dubois', 'Jean', 'jean.dubois@formation.com', '$2a$10$rKvVJ5YlPZqKxB7YhHqYJeqKxB7YhHqYJeqKxB7YhHqYJeqKxB7Yh', 'formateur', '0612345680');
SET @userId2 = LAST_INSERT_ID();

INSERT INTO formateurs (user_id, competences, remarques)
VALUES (@userId2, 'Systèmes & Réseaux', 'Ingénieur système certifié Linux et Cisco.');
SET @formateurId2 = LAST_INSERT_ID();


-- Formateur 3 : Marie Lefevre (Marketing)
INSERT INTO users (nom, prenom, email, password, role, telephone)
VALUES ('Lefevre', 'Marie', 'marie.lefevre@formation.com', '$2a$10$rKvVJ5YlPZqKxB7YhHqYJeqKxB7YhHqYJeqKxB7YhHqYJeqKxB7Yh', 'formateur', '0612345681');
SET @userId3 = LAST_INSERT_ID();

INSERT INTO formateurs (user_id, competences, remarques)
VALUES (@userId3, 'Marketing Digital', 'Spécialiste SEO/SEA et réseaux sociaux.');
SET @formateurId3 = LAST_INSERT_ID();


-- =============================================
-- 2. INSERTION DES FORMATIONS (LIÉES AUX FORMATEURS)
-- =============================================

INSERT INTO formations (titre, description, heures, cout, objectifs, programme, categorie, ville, formateur_id)
VALUES 
-- Formation Web (Sophie)
('Mastering React', 'Formation avancée sur React et son écosystème.', 35, 4500, 'Maîtriser les patterns avancés React et les Hooks.', 'Module 1: Hooks avancés\nModule 2: Context API\nModule 3: Redux Toolkit\nModule 4: Performance', 'Informatique', 'Casablanca', @formateurId1),

-- Formation Linux (Jean)
('Administration Linux', 'Gestion de serveurs Linux en entreprise.', 40, 5000, 'Savoir installer, configurer et sécuriser un serveur Linux.', 'Module 1: Installation\nModule 2: Gestion des utilisateurs\nModule 3: Réseau et Pare-feu\nModule 4: Scripting Bash', 'Informatique', 'Rabat', @formateurId2),

-- Formation Marketing (Marie)
('SEO Expert', 'Stratégies avancées de référencement naturel.', 20, 2500, 'Améliorer la visibilité de votre site sur Google.', 'Module 1: Audit technique\nModule 2: Recherche de mots-clés\nModule 3: Optimisation On-page\nModule 4: Netlinking', 'Marketing', 'Marrakech', @formateurId3),

-- Formation Sécurité (Jean)
('Fondamentaux Cybersécurité', 'Comprendre les menaces et sécuriser son SI.', 25, 3000, 'Identifier les vulnérabilités et appliquer les bonnes pratiques.', 'Module 1: Types d''attaques\nModule 2: Cryptographie\nModule 3: Sécurité réseau\nModule 4: Gestion des risques', 'Informatique', 'Tanger', @formateurId2),

-- Formation Design (Sans formateur pour le moment ou autre)
('UI/UX Design Modern', 'Conception d''interfaces utilisateur centrées humain.', 30, 3500, 'Créer des prototypes interactifs et esthétiques.', 'Module 1: Recherche utilisateur\nModule 2: Wireframing\nModule 3: Prototypage Figma\nModule 4: Design Systems', 'Design', 'Agadir', NULL);
