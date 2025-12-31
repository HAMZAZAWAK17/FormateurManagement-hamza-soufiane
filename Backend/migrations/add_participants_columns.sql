-- Script de migration pour ajouter les colonnes manquantes à la table participants

-- Ajouter la colonne utilisateur_id
ALTER TABLE `participants` 
ADD COLUMN `utilisateur_id` INT DEFAULT NULL AFTER `id`;

-- Ajouter la colonne password_temporaire
ALTER TABLE `participants` 
ADD COLUMN `password_temporaire` VARCHAR(255) DEFAULT NULL AFTER `statut`;

-- Ajouter la contrainte de clé étrangère pour utilisateur_id
ALTER TABLE `participants`
ADD CONSTRAINT `participants_ibfk_utilisateur` 
FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON DELETE SET NULL;

-- Ajouter un index sur utilisateur_id pour améliorer les performances
ALTER TABLE `participants`
ADD INDEX `idx_participants_utilisateur` (`utilisateur_id`);

-- Ajouter le rôle 'participant' à la table utilisateurs
ALTER TABLE `utilisateurs` 
MODIFY COLUMN `role` ENUM('admin','formateur','assistant','participant') NOT NULL;
