-- ============================================
-- DONNÉES DE TEST POUR LA FONCTIONNALITÉ 5
-- Planification des formations
-- ============================================

-- Note: Assurez-vous d'avoir déjà des données dans les tables:
-- - utilisateurs (avec au moins un admin)
-- - formations
-- - formateurs
-- - entreprises

-- ============================================
-- 1. INSERTION DE DONNÉES DE TEST
-- ============================================

-- Insérer des planifications de test
INSERT INTO planifications 
(formation_id, formateur_id, entreprise_id, date_debut, date_fin, horaire_debut, horaire_fin, statut, remarques, created_by)
VALUES 
-- Planification 1 : Formation Web Full Stack - Planifiée
(1, 1, 1, '2025-02-01', '2025-02-12', '09:00:00', '17:00:00', 'planifiee', 
 'Formation intensive pour débutants. Prévoir une salle avec projecteur et connexion internet.', 1),

-- Planification 2 : Formation Android - En cours
(2, 1, 1, '2025-01-15', '2025-02-05', '09:00:00', '16:00:00', 'en_cours', 
 'Formation avancée Android avec Kotlin. Participants ayant déjà des bases en Java.', 1),

-- Planification 3 : Formation Web Full Stack - Terminée
(1, 1, 1, '2024-12-01', '2024-12-12', '09:00:00', '17:00:00', 'terminee', 
 'Formation terminée avec succès. Tous les participants ont validé leurs compétences.', 1),

-- Planification 4 : Formation Android - Planifiée (différent formateur si disponible)
(2, 1, 1, '2025-03-01', '2025-03-20', '10:00:00', '18:00:00', 'planifiee', 
 'Formation sur mesure pour l\'entreprise. Horaires adaptés aux besoins du client.', 1),

-- Planification 5 : Formation Web - Annulée
(1, 1, 1, '2025-01-20', '2025-01-31', '09:00:00', '17:00:00', 'annulee', 
 'Formation annulée à la demande du client pour raisons budgétaires.', 1),

-- Planification 6 : Formation à venir
(1, 1, 1, '2025-04-01', '2025-04-12', '09:00:00', '17:00:00', 'planifiee', 
 'Formation prévue pour le deuxième trimestre.', 1),

-- Planification 7 : Formation courte
(1, 1, 1, '2025-05-05', '2025-05-09', '09:00:00', '13:00:00', 'planifiee', 
 'Formation condensée sur une semaine, demi-journées.', 1);

-- ============================================
-- 2. VÉRIFICATION DES DONNÉES INSÉRÉES
-- ============================================

-- Compter le nombre de planifications par statut
SELECT 
    statut,
    COUNT(*) as nombre
FROM planifications
GROUP BY statut;

-- Afficher toutes les planifications avec détails
SELECT 
    p.id,
    f.titre as formation,
    CONCAT(fr.prenom, ' ', fr.nom) as formateur,
    e.nom as entreprise,
    p.date_debut,
    p.date_fin,
    p.statut
FROM planifications p
JOIN formations f ON p.formation_id = f.id
JOIN formateurs fr ON p.formateur_id = fr.id
JOIN entreprises e ON p.entreprise_id = e.id
ORDER BY p.date_debut DESC;

-- ============================================
-- 3. SCÉNARIOS DE TEST
-- ============================================

-- Scénario 1 : Tester la détection de conflit
-- Cette requête devrait échouer car elle chevauche une planification existante
-- (Décommentez pour tester)
/*
INSERT INTO planifications 
(formation_id, formateur_id, entreprise_id, date_debut, date_fin, horaire_debut, horaire_fin, created_by)
VALUES 
(1, 1, 1, '2025-02-05', '2025-02-15', '09:00:00', '17:00:00', 1);
*/

-- Scénario 2 : Planification valide (pas de conflit)
-- Cette requête devrait réussir
INSERT INTO planifications 
(formation_id, formateur_id, entreprise_id, date_debut, date_fin, horaire_debut, horaire_fin, remarques, created_by)
VALUES 
(1, 1, 1, '2025-06-01', '2025-06-12', '09:00:00', '17:00:00', 'Test de planification sans conflit', 1);

-- ============================================
-- 4. REQUÊTES DE TEST UTILES
-- ============================================

-- Test 1 : Récupérer les planifications à venir
SELECT 
    p.*,
    f.titre as formation,
    CONCAT(fr.prenom, ' ', fr.nom) as formateur,
    e.nom as entreprise
FROM planifications p
JOIN formations f ON p.formation_id = f.id
JOIN formateurs fr ON p.formateur_id = fr.id
JOIN entreprises e ON p.entreprise_id = e.id
WHERE p.date_debut > CURDATE()
AND p.statut != 'annulee'
ORDER BY p.date_debut ASC;

-- Test 2 : Récupérer les planifications en cours
SELECT 
    p.*,
    f.titre as formation
FROM planifications p
JOIN formations f ON p.formation_id = f.id
WHERE CURDATE() BETWEEN p.date_debut AND p.date_fin
AND p.statut = 'en_cours';

-- Test 3 : Statistiques globales
SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN statut = 'planifiee' THEN 1 ELSE 0 END) as planifiees,
    SUM(CASE WHEN statut = 'en_cours' THEN 1 ELSE 0 END) as en_cours,
    SUM(CASE WHEN statut = 'terminee' THEN 1 ELSE 0 END) as terminees,
    SUM(CASE WHEN statut = 'annulee' THEN 1 ELSE 0 END) as annulees
FROM planifications;

-- Test 4 : Charge de travail d'un formateur
SELECT 
    DATE_FORMAT(date_debut, '%Y-%m') as mois,
    COUNT(*) as nombre_formations,
    SUM(DATEDIFF(date_fin, date_debut) + 1) as jours_travailles
FROM planifications
WHERE formateur_id = 1
AND statut != 'annulee'
GROUP BY DATE_FORMAT(date_debut, '%Y-%m')
ORDER BY mois DESC;

-- Test 5 : Planifications par entreprise
SELECT 
    e.nom as entreprise,
    COUNT(p.id) as nombre_formations,
    SUM(f.cout) as cout_total
FROM entreprises e
LEFT JOIN planifications p ON e.id = p.entreprise_id
LEFT JOIN formations f ON p.formation_id = f.id
WHERE p.statut != 'annulee' OR p.statut IS NULL
GROUP BY e.id, e.nom
ORDER BY nombre_formations DESC;

-- ============================================
-- 5. NETTOYAGE (SI NÉCESSAIRE)
-- ============================================

-- Supprimer toutes les planifications de test
-- ATTENTION : Cette commande supprime TOUTES les planifications !
-- Décommentez uniquement si vous voulez tout réinitialiser
/*
DELETE FROM planifications;
ALTER TABLE planifications AUTO_INCREMENT = 1;
*/

-- Supprimer uniquement les planifications annulées
-- DELETE FROM planifications WHERE statut = 'annulee';

-- Supprimer les planifications terminées depuis plus d'un an
-- DELETE FROM planifications 
-- WHERE statut = 'terminee' 
-- AND date_fin < DATE_SUB(CURDATE(), INTERVAL 1 YEAR);

-- ============================================
-- 6. DONNÉES SUPPLÉMENTAIRES (OPTIONNEL)
-- ============================================

-- Si vous avez besoin de plus de formateurs pour tester
-- (Décommentez et adaptez selon vos besoins)
/*
INSERT INTO formateurs (nom, prenom, email, mots_cles, remarques)
VALUES 
('Dupont', 'Marie', 'marie.dupont@example.com', 'JavaScript, React, Node.js', 'Formatrice expérimentée en développement web'),
('Martin', 'Pierre', 'pierre.martin@example.com', 'Java, Android, Kotlin', 'Expert en développement mobile Android'),
('Bernard', 'Sophie', 'sophie.bernard@example.com', 'Python, Django, Data Science', 'Spécialiste en Python et analyse de données');
*/

-- Si vous avez besoin de plus d'entreprises
/*
INSERT INTO entreprises (nom, adresse, telephone, url, email)
VALUES 
('TechCorp SA', '123 Avenue des Champs-Élysées, 75008 Paris', '+33 1 23 45 67 89', 'https://techcorp.fr', 'contact@techcorp.fr'),
('InnoSoft SARL', '456 Rue de la République, 69002 Lyon', '+33 4 78 90 12 34', 'https://innosoft.fr', 'info@innosoft.fr'),
('DigitalPro SAS', '789 Boulevard Haussmann, 75009 Paris', '+33 1 98 76 54 32', 'https://digitalpro.fr', 'contact@digitalpro.fr');
*/

-- ============================================
-- 7. VÉRIFICATIONS FINALES
-- ============================================

-- Vérifier que toutes les planifications ont des références valides
SELECT 
    p.id,
    p.formation_id,
    f.titre as formation_existe,
    p.formateur_id,
    CONCAT(fr.prenom, ' ', fr.nom) as formateur_existe,
    p.entreprise_id,
    e.nom as entreprise_existe
FROM planifications p
LEFT JOIN formations f ON p.formation_id = f.id
LEFT JOIN formateurs fr ON p.formateur_id = fr.id
LEFT JOIN entreprises e ON p.entreprise_id = e.id;

-- Vérifier qu'il n'y a pas de conflits dans les données de test
SELECT 
    p1.id as planif1_id,
    p2.id as planif2_id,
    p1.formateur_id,
    p1.date_debut as p1_debut,
    p1.date_fin as p1_fin,
    p2.date_debut as p2_debut,
    p2.date_fin as p2_fin
FROM planifications p1
JOIN planifications p2 ON p1.formateur_id = p2.formateur_id AND p1.id < p2.id
WHERE p1.statut != 'annulee' AND p2.statut != 'annulee'
AND (
    (p1.date_debut BETWEEN p2.date_debut AND p2.date_fin) OR
    (p1.date_fin BETWEEN p2.date_debut AND p2.date_fin) OR
    (p2.date_debut BETWEEN p1.date_debut AND p1.date_fin)
);

-- Si cette requête retourne des résultats, il y a des conflits !

-- ============================================
-- 8. RÉSUMÉ DES DONNÉES DE TEST
-- ============================================

SELECT 
    'Total planifications' as description,
    COUNT(*) as valeur
FROM planifications
UNION ALL
SELECT 
    'Planifications planifiées',
    COUNT(*)
FROM planifications WHERE statut = 'planifiee'
UNION ALL
SELECT 
    'Planifications en cours',
    COUNT(*)
FROM planifications WHERE statut = 'en_cours'
UNION ALL
SELECT 
    'Planifications terminées',
    COUNT(*)
FROM planifications WHERE statut = 'terminee'
UNION ALL
SELECT 
    'Planifications annulées',
    COUNT(*)
FROM planifications WHERE statut = 'annulee';

-- ============================================
-- FIN DU SCRIPT DE DONNÉES DE TEST
-- ============================================

-- Pour exécuter ce script :
-- mysql -u root -p formateur_management < donnees_test_planifications.sql

-- Ou dans MySQL Workbench / phpMyAdmin :
-- Copiez et collez les sections nécessaires
