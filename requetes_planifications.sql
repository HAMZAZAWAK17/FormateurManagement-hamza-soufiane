-- ============================================
-- REQUÊTES SQL POUR LA FONCTIONNALITÉ 5
-- Planification des formations
-- ============================================

-- 1. CRÉATION DE LA TABLE PLANIFICATIONS
-- Cette table stocke les planifications de formations avec formateurs et entreprises
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
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE,
    FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (entreprise_id) REFERENCES entreprises(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- 2. CRÉATION DES INDEX POUR OPTIMISER LES PERFORMANCES
CREATE INDEX idx_planifications_dates ON planifications(date_debut, date_fin);
CREATE INDEX idx_planifications_formateur ON planifications(formateur_id);
CREATE INDEX idx_planifications_entreprise ON planifications(entreprise_id);
CREATE INDEX idx_planifications_formation ON planifications(formation_id);

-- ============================================
-- REQUÊTES D'INSERTION
-- ============================================

-- 3. INSÉRER UNE NOUVELLE PLANIFICATION
-- Exemple : Planifier une formation "Développement Web Full Stack" avec un formateur et une entreprise
INSERT INTO planifications 
(formation_id, formateur_id, entreprise_id, date_debut, date_fin, horaire_debut, horaire_fin, remarques, created_by)
VALUES 
(1, 1, 1, '2025-01-15', '2025-01-26', '09:00:00', '17:00:00', 'Formation intensive sur 2 semaines', 1);

-- 4. INSÉRER PLUSIEURS PLANIFICATIONS DE TEST
INSERT INTO planifications 
(formation_id, formateur_id, entreprise_id, date_debut, date_fin, horaire_debut, horaire_fin, statut, remarques, created_by)
VALUES 
(1, 1, 1, '2025-02-01', '2025-02-12', '09:00:00', '17:00:00', 'planifiee', 'Formation pour débutants', 1),
(2, 1, 1, '2025-03-01', '2025-03-20', '09:00:00', '16:00:00', 'planifiee', 'Formation Android avancée', 1),
(1, 1, 1, '2025-04-01', '2025-04-10', '10:00:00', '18:00:00', 'en_cours', 'Formation en cours', 1);

-- ============================================
-- REQUÊTES DE SÉLECTION
-- ============================================

-- 5. RÉCUPÉRER TOUTES LES PLANIFICATIONS AVEC DÉTAILS COMPLETS
SELECT 
    p.*,
    f.titre as formation_titre,
    f.nombre_heures,
    f.cout,
    fr.nom as formateur_nom,
    fr.prenom as formateur_prenom,
    fr.email as formateur_email,
    e.nom as entreprise_nom,
    e.email as entreprise_email,
    u.nom as created_by_nom,
    u.prenom as created_by_prenom
FROM planifications p
JOIN formations f ON p.formation_id = f.id
JOIN formateurs fr ON p.formateur_id = fr.id
JOIN entreprises e ON p.entreprise_id = e.id
JOIN utilisateurs u ON p.created_by = u.id
ORDER BY p.date_debut DESC;

-- 6. RÉCUPÉRER UNE PLANIFICATION SPÉCIFIQUE PAR ID
SELECT 
    p.*,
    f.titre as formation_titre,
    f.nombre_heures,
    f.cout,
    f.objectifs,
    f.programme_detaille,
    fr.nom as formateur_nom,
    fr.prenom as formateur_prenom,
    fr.email as formateur_email,
    fr.mots_cles,
    e.nom as entreprise_nom,
    e.adresse as entreprise_adresse,
    e.telephone as entreprise_telephone,
    e.email as entreprise_email,
    u.nom as created_by_nom,
    u.prenom as created_by_prenom
FROM planifications p
JOIN formations f ON p.formation_id = f.id
JOIN formateurs fr ON p.formateur_id = fr.id
JOIN entreprises e ON p.entreprise_id = e.id
JOIN utilisateurs u ON p.created_by = u.id
WHERE p.id = 1;

-- 7. RÉCUPÉRER LES PLANIFICATIONS PAR STATUT
SELECT * FROM planifications WHERE statut = 'planifiee';
SELECT * FROM planifications WHERE statut = 'en_cours';
SELECT * FROM planifications WHERE statut = 'terminee';
SELECT * FROM planifications WHERE statut = 'annulee';

-- 8. RÉCUPÉRER LES PLANIFICATIONS D'UN FORMATEUR SPÉCIFIQUE
SELECT 
    p.*,
    f.titre as formation_titre,
    e.nom as entreprise_nom
FROM planifications p
JOIN formations f ON p.formation_id = f.id
JOIN entreprises e ON p.entreprise_id = e.id
WHERE p.formateur_id = 1
ORDER BY p.date_debut DESC;

-- 9. RÉCUPÉRER LES PLANIFICATIONS D'UNE ENTREPRISE SPÉCIFIQUE
SELECT 
    p.*,
    f.titre as formation_titre,
    fr.nom as formateur_nom,
    fr.prenom as formateur_prenom
FROM planifications p
JOIN formations f ON p.formation_id = f.id
JOIN formateurs fr ON p.formateur_id = fr.id
WHERE p.entreprise_id = 1
ORDER BY p.date_debut DESC;

-- 10. RÉCUPÉRER LES PLANIFICATIONS DANS UNE PÉRIODE DONNÉE
SELECT 
    p.*,
    f.titre as formation_titre,
    fr.nom as formateur_nom,
    fr.prenom as formateur_prenom,
    e.nom as entreprise_nom
FROM planifications p
JOIN formations f ON p.formation_id = f.id
JOIN formateurs fr ON p.formateur_id = fr.id
JOIN entreprises e ON p.entreprise_id = e.id
WHERE (p.date_debut BETWEEN '2025-01-01' AND '2025-12-31')
   OR (p.date_fin BETWEEN '2025-01-01' AND '2025-12-31')
ORDER BY p.date_debut;

-- 11. VÉRIFIER LES CONFLITS DE DISPONIBILITÉ D'UN FORMATEUR
-- Cette requête vérifie si un formateur a déjà une planification sur une période donnée
SELECT * FROM planifications 
WHERE formateur_id = 1 
AND statut != 'annulee'
AND (
    (date_debut BETWEEN '2025-02-01' AND '2025-02-15') OR
    (date_fin BETWEEN '2025-02-01' AND '2025-02-15') OR
    ('2025-02-01' BETWEEN date_debut AND date_fin)
);

-- 12. RÉCUPÉRER LES STATISTIQUES DES PLANIFICATIONS
SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN statut = 'planifiee' THEN 1 ELSE 0 END) as planifiees,
    SUM(CASE WHEN statut = 'en_cours' THEN 1 ELSE 0 END) as en_cours,
    SUM(CASE WHEN statut = 'terminee' THEN 1 ELSE 0 END) as terminees,
    SUM(CASE WHEN statut = 'annulee' THEN 1 ELSE 0 END) as annulees
FROM planifications;

-- 13. RÉCUPÉRER LES PLANIFICATIONS À VENIR (futures)
SELECT 
    p.*,
    f.titre as formation_titre,
    fr.nom as formateur_nom,
    fr.prenom as formateur_prenom,
    e.nom as entreprise_nom
FROM planifications p
JOIN formations f ON p.formation_id = f.id
JOIN formateurs fr ON p.formateur_id = fr.id
JOIN entreprises e ON p.entreprise_id = e.id
WHERE p.date_debut > CURDATE()
AND p.statut != 'annulee'
ORDER BY p.date_debut ASC;

-- 14. RÉCUPÉRER LES PLANIFICATIONS EN COURS
SELECT 
    p.*,
    f.titre as formation_titre,
    fr.nom as formateur_nom,
    fr.prenom as formateur_prenom,
    e.nom as entreprise_nom
FROM planifications p
JOIN formations f ON p.formation_id = f.id
JOIN formateurs fr ON p.formateur_id = fr.id
JOIN entreprises e ON p.entreprise_id = e.id
WHERE CURDATE() BETWEEN p.date_debut AND p.date_fin
AND p.statut = 'en_cours'
ORDER BY p.date_debut;

-- ============================================
-- REQUÊTES DE MISE À JOUR
-- ============================================

-- 15. METTRE À JOUR LE STATUT D'UNE PLANIFICATION
UPDATE planifications 
SET statut = 'en_cours' 
WHERE id = 1;

-- 16. METTRE À JOUR LES DATES D'UNE PLANIFICATION
UPDATE planifications 
SET date_debut = '2025-02-15', 
    date_fin = '2025-02-26' 
WHERE id = 1;

-- 17. METTRE À JOUR LES HORAIRES D'UNE PLANIFICATION
UPDATE planifications 
SET horaire_debut = '10:00:00', 
    horaire_fin = '18:00:00' 
WHERE id = 1;

-- 18. METTRE À JOUR LE FORMATEUR D'UNE PLANIFICATION
UPDATE planifications 
SET formateur_id = 2 
WHERE id = 1;

-- 19. METTRE À JOUR L'ENTREPRISE D'UNE PLANIFICATION
UPDATE planifications 
SET entreprise_id = 2 
WHERE id = 1;

-- 20. METTRE À JOUR LES REMARQUES D'UNE PLANIFICATION
UPDATE planifications 
SET remarques = 'Formation reportée à la demande du client' 
WHERE id = 1;

-- 21. METTRE À JOUR PLUSIEURS CHAMPS EN UNE SEULE REQUÊTE
UPDATE planifications 
SET 
    date_debut = '2025-03-01',
    date_fin = '2025-03-12',
    horaire_debut = '09:00:00',
    horaire_fin = '17:00:00',
    statut = 'planifiee',
    remarques = 'Dates modifiées suite à la disponibilité du formateur'
WHERE id = 1;

-- ============================================
-- REQUÊTES DE SUPPRESSION
-- ============================================

-- 22. SUPPRIMER UNE PLANIFICATION SPÉCIFIQUE
DELETE FROM planifications WHERE id = 1;

-- 23. SUPPRIMER TOUTES LES PLANIFICATIONS ANNULÉES
DELETE FROM planifications WHERE statut = 'annulee';

-- 24. SUPPRIMER LES PLANIFICATIONS TERMINÉES DEPUIS PLUS D'UN AN
DELETE FROM planifications 
WHERE statut = 'terminee' 
AND date_fin < DATE_SUB(CURDATE(), INTERVAL 1 YEAR);

-- ============================================
-- REQUÊTES AVANCÉES ET RAPPORTS
-- ============================================

-- 25. RAPPORT : Nombre de formations par formateur
SELECT 
    fr.id,
    fr.nom,
    fr.prenom,
    COUNT(p.id) as nombre_formations,
    SUM(CASE WHEN p.statut = 'terminee' THEN 1 ELSE 0 END) as formations_terminees,
    SUM(CASE WHEN p.statut = 'en_cours' THEN 1 ELSE 0 END) as formations_en_cours,
    SUM(CASE WHEN p.statut = 'planifiee' THEN 1 ELSE 0 END) as formations_planifiees
FROM formateurs fr
LEFT JOIN planifications p ON fr.id = p.formateur_id
GROUP BY fr.id, fr.nom, fr.prenom
ORDER BY nombre_formations DESC;

-- 26. RAPPORT : Nombre de formations par entreprise
SELECT 
    e.id,
    e.nom,
    COUNT(p.id) as nombre_formations,
    SUM(f.cout) as cout_total,
    SUM(f.nombre_heures) as heures_totales
FROM entreprises e
LEFT JOIN planifications p ON e.id = p.entreprise_id
LEFT JOIN formations f ON p.formation_id = f.id
WHERE p.statut != 'annulee'
GROUP BY e.id, e.nom
ORDER BY nombre_formations DESC;

-- 27. RAPPORT : Formations les plus demandées
SELECT 
    f.id,
    f.titre,
    COUNT(p.id) as nombre_planifications,
    SUM(CASE WHEN p.statut = 'terminee' THEN 1 ELSE 0 END) as fois_donnee
FROM formations f
LEFT JOIN planifications p ON f.id = p.formation_id
GROUP BY f.id, f.titre
ORDER BY nombre_planifications DESC;

-- 28. RAPPORT : Charge de travail mensuelle des formateurs
SELECT 
    fr.nom,
    fr.prenom,
    DATE_FORMAT(p.date_debut, '%Y-%m') as mois,
    COUNT(p.id) as nombre_formations,
    SUM(DATEDIFF(p.date_fin, p.date_debut) + 1) as jours_travailles
FROM formateurs fr
JOIN planifications p ON fr.id = p.formateur_id
WHERE p.statut != 'annulee'
GROUP BY fr.id, fr.nom, fr.prenom, DATE_FORMAT(p.date_debut, '%Y-%m')
ORDER BY mois DESC, jours_travailles DESC;

-- 29. RAPPORT : Revenus potentiels par période
SELECT 
    DATE_FORMAT(p.date_debut, '%Y-%m') as mois,
    COUNT(p.id) as nombre_formations,
    SUM(f.cout) as revenu_total,
    SUM(f.nombre_heures) as heures_totales
FROM planifications p
JOIN formations f ON p.formation_id = f.id
WHERE p.statut != 'annulee'
GROUP BY DATE_FORMAT(p.date_debut, '%Y-%m')
ORDER BY mois DESC;

-- 30. RAPPORT : Taux de complétion des formations
SELECT 
    COUNT(*) as total_planifications,
    SUM(CASE WHEN statut = 'terminee' THEN 1 ELSE 0 END) as terminees,
    SUM(CASE WHEN statut = 'annulee' THEN 1 ELSE 0 END) as annulees,
    ROUND((SUM(CASE WHEN statut = 'terminee' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as taux_completion,
    ROUND((SUM(CASE WHEN statut = 'annulee' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as taux_annulation
FROM planifications;

-- ============================================
-- VUES UTILES
-- ============================================

-- 31. VUE : Planifications complètes avec tous les détails
CREATE OR REPLACE VIEW v_planifications_details AS
SELECT 
    p.id,
    p.date_debut,
    p.date_fin,
    p.horaire_debut,
    p.horaire_fin,
    p.statut,
    p.remarques,
    p.created_at,
    f.titre as formation,
    f.nombre_heures,
    f.cout,
    CONCAT(fr.prenom, ' ', fr.nom) as formateur,
    fr.email as formateur_email,
    e.nom as entreprise,
    e.email as entreprise_email,
    CONCAT(u.prenom, ' ', u.nom) as cree_par,
    DATEDIFF(p.date_fin, p.date_debut) + 1 as duree_jours
FROM planifications p
JOIN formations f ON p.formation_id = f.id
JOIN formateurs fr ON p.formateur_id = fr.id
JOIN entreprises e ON p.entreprise_id = e.id
JOIN utilisateurs u ON p.created_by = u.id;

-- 32. VUE : Planifications actives (planifiées ou en cours)
CREATE OR REPLACE VIEW v_planifications_actives AS
SELECT * FROM v_planifications_details
WHERE statut IN ('planifiee', 'en_cours')
ORDER BY date_debut;

-- ============================================
-- PROCÉDURES STOCKÉES UTILES
-- ============================================

-- 33. PROCÉDURE : Vérifier la disponibilité d'un formateur
DELIMITER //
CREATE PROCEDURE sp_verifier_disponibilite_formateur(
    IN p_formateur_id INT,
    IN p_date_debut DATE,
    IN p_date_fin DATE,
    OUT p_disponible BOOLEAN
)
BEGIN
    DECLARE v_count INT;
    
    SELECT COUNT(*) INTO v_count
    FROM planifications
    WHERE formateur_id = p_formateur_id
    AND statut != 'annulee'
    AND (
        (date_debut BETWEEN p_date_debut AND p_date_fin) OR
        (date_fin BETWEEN p_date_debut AND p_date_fin) OR
        (p_date_debut BETWEEN date_debut AND date_fin)
    );
    
    SET p_disponible = (v_count = 0);
END //
DELIMITER ;

-- 34. PROCÉDURE : Mettre à jour automatiquement le statut des planifications
DELIMITER //
CREATE PROCEDURE sp_mettre_a_jour_statuts()
BEGIN
    -- Mettre en cours les formations qui commencent aujourd'hui
    UPDATE planifications
    SET statut = 'en_cours'
    WHERE date_debut = CURDATE()
    AND statut = 'planifiee';
    
    -- Terminer les formations dont la date de fin est dépassée
    UPDATE planifications
    SET statut = 'terminee'
    WHERE date_fin < CURDATE()
    AND statut = 'en_cours';
END //
DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

-- 35. TRIGGER : Empêcher les conflits de planification
DELIMITER //
CREATE TRIGGER trg_verifier_conflit_avant_insertion
BEFORE INSERT ON planifications
FOR EACH ROW
BEGIN
    DECLARE v_count INT;
    
    SELECT COUNT(*) INTO v_count
    FROM planifications
    WHERE formateur_id = NEW.formateur_id
    AND statut != 'annulee'
    AND (
        (date_debut BETWEEN NEW.date_debut AND NEW.date_fin) OR
        (date_fin BETWEEN NEW.date_debut AND NEW.date_fin) OR
        (NEW.date_debut BETWEEN date_debut AND date_fin)
    );
    
    IF v_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Conflit de planification : Le formateur a déjà une formation sur cette période';
    END IF;
END //
DELIMITER ;

-- ============================================
-- EXEMPLES D'UTILISATION
-- ============================================

-- Utiliser la vue des planifications détaillées
SELECT * FROM v_planifications_details WHERE statut = 'planifiee';

-- Utiliser la procédure de vérification de disponibilité
CALL sp_verifier_disponibilite_formateur(1, '2025-02-01', '2025-02-15', @disponible);
SELECT @disponible;

-- Mettre à jour les statuts automatiquement
CALL sp_mettre_a_jour_statuts();
