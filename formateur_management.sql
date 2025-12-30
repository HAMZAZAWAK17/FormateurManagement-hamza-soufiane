-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 29 déc. 2025 à 14:44
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `formateur_management`
--

-- --------------------------------------------------------

--
-- Structure de la table `entreprises`
--

CREATE TABLE `entreprises` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `adresse` text NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `entreprises`
--

INSERT INTO `entreprises` (`id`, `nom`, `adresse`, `telephone`, `url`, `email`, `created_at`) VALUES
(1, 'test', 'test', '123456', 'http://localhost:5173/admin/assignments', 'test@gmail.com', '2025-12-24 18:26:41');

-- --------------------------------------------------------

--
-- Structure de la table `evaluations`
--

CREATE TABLE `evaluations` (
  `id` int(11) NOT NULL,
  `formation_id` int(11) NOT NULL,
  `formateur_id` int(11) NOT NULL,
  `participant_email` varchar(150) DEFAULT NULL,
  `qualite_pedagogique` int(11) DEFAULT NULL CHECK (`qualite_pedagogique` between 1 and 5),
  `rythme` int(11) DEFAULT NULL CHECK (`rythme` between 1 and 5),
  `support_cours` int(11) DEFAULT NULL CHECK (`support_cours` between 1 and 5),
  `maitrise_sujet` int(11) DEFAULT NULL CHECK (`maitrise_sujet` between 1 and 5),
  `commentaire` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `formateurs`
--

CREATE TABLE `formateurs` (
  `id` int(11) NOT NULL,
  `utilisateur_id` int(11) DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mots_cles` text NOT NULL,
  `remarques` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `statut` enum('en_attente','approuve','rejete') DEFAULT 'en_attente',
  `type` enum('interne','externe') DEFAULT 'externe',
  `password_temporaire` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `formateurs`
--

INSERT INTO `formateurs` (`id`, `utilisateur_id`, `nom`, `prenom`, `email`, `mots_cles`, `remarques`, `created_at`, `statut`, `type`, `password_temporaire`) VALUES
(9, NULL, 'ezzouek', 'hamza', 'ezzouekhamza2411@gmail.com', 'aaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaa', '2025-12-29 13:34:54', 'approuve', 'externe', '123456');

-- --------------------------------------------------------

--
-- Structure de la table `formations`
--

CREATE TABLE `formations` (
  `id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `nombre_heures` int(11) NOT NULL,
  `cout` decimal(10,2) NOT NULL,
  `objectifs` text NOT NULL,
  `programme_detaille` text NOT NULL,
  `categorie` varchar(100) DEFAULT 'Informatique'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `formations`
--

INSERT INTO `formations` (`id`, `titre`, `nombre_heures`, `cout`, `objectifs`, `programme_detaille`, `categorie`) VALUES
(1, 'Développement Web Full Stack', 40, 350.00, 'Comprendre les bases du développement web\r\n    Réaliser un projet web simple de bout en bout', 'Module 1 : Introduction au Web (5h)\r\n     Module 2 : HTML & CSS (15h)\r\n     Module 3 : Javascript (10h)\r\n     Module 4 : Introduction au Back-end (5h)\r\n     Module 5 : Projet pratique (5h)', 'Informatique'),
(2, 'Formation en Développement Mobile Android', 60, 800.00, 'Apprendre les bases du développement Android\r\n    Utiliser Android Studio et le langage Kotlin\r\n    Comprendre le cycle de vie d\'une application Android', 'Introduction à Android et Android Studio\r\n    Kotlin : bases du langage\r\n    Interfaces utilisateur (XML, layouts)\r\n    APIs et permissions\r\n    Projet final : application Android complète', 'Informatique'),
(3, 'zertyui', 44, 52111.00, 'dfhgjklkjgfds', 'sdfghjhgfdsdq', 'Informatique');

-- --------------------------------------------------------

--
-- Structure de la table `participants`
--

CREATE TABLE `participants` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `date_naissance` date NOT NULL,
  `ville` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `formation_id` int(11) NOT NULL,
  `statut` enum('en_attente','confirme','annule') DEFAULT 'en_attente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `participants`
--

INSERT INTO `participants` (`id`, `nom`, `prenom`, `date_naissance`, `ville`, `email`, `telephone`, `formation_id`, `statut`, `created_at`) VALUES
(1, 'Bennani', 'Sara', '1995-03-15', 'Casablanca', 'sara.bennani@email.com', '0612345678', 1, 'confirme', '2025-12-26 13:34:28'),
(2, 'Alaoui', 'Karim', '1992-07-22', 'Rabat', 'karim.alaoui@email.com', '0623456789', 1, 'annule', '2025-12-26 13:34:28'),
(3, 'Senhaji', 'Youssef', '1994-02-18', 'Agadir', 'youssef.senhaji@email.com', '0667890123', 2, 'confirme', '2025-12-26 13:34:28'),
(4, 'test', 'test', '2001-01-01', 'casa', 'test@gmail.com', '1234567890', 3, 'confirme', '2025-12-26 13:36:43');

-- --------------------------------------------------------

--
-- Structure de la table `participants_sessions`
--

CREATE TABLE `participants_sessions` (
  `id` int(11) NOT NULL,
  `participant_id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `statut_inscription` enum('inscrit','confirme','annule') DEFAULT 'inscrit',
  `date_inscription` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `participants_sessions`
--

INSERT INTO `participants_sessions` (`id`, `participant_id`, `session_id`, `statut_inscription`, `date_inscription`) VALUES
(1, 1, 1, 'inscrit', '2025-12-26 13:34:28'),
(2, 2, 1, 'confirme', '2025-12-26 13:34:28'),
(3, 3, 3, 'confirme', '2025-12-26 13:34:28');

-- --------------------------------------------------------

--
-- Structure de la table `planifications`
--

CREATE TABLE `planifications` (
  `id` int(11) NOT NULL,
  `formation_id` int(11) NOT NULL,
  `formateur_id` int(11) NOT NULL,
  `entreprise_id` int(11) NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `horaire_debut` time NOT NULL,
  `horaire_fin` time NOT NULL,
  `statut` enum('planifiee','en_cours','terminee','annulee') DEFAULT 'planifiee',
  `remarques` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `planifications`
--

INSERT INTO `planifications` (`id`, `formation_id`, `formateur_id`, `entreprise_id`, `date_debut`, `date_fin`, `horaire_debut`, `horaire_fin`, `statut`, `remarques`, `created_by`, `created_at`, `updated_at`) VALUES
(9, 1, 9, 1, '2025-12-12', '2026-01-12', '09:00:00', '17:00:00', 'en_cours', 'aaaa', 1, '2025-12-29 13:37:23', '2025-12-29 13:37:30');

-- --------------------------------------------------------

--
-- Structure de la table `sessions_individuelles`
--

CREATE TABLE `sessions_individuelles` (
  `id` int(11) NOT NULL,
  `formation_id` int(11) NOT NULL,
  `formateur_id` int(11) DEFAULT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `horaire_debut` time NOT NULL,
  `horaire_fin` time NOT NULL,
  `lieu` varchar(255) DEFAULT NULL,
  `nombre_places` int(11) DEFAULT 20,
  `statut` enum('planifiee','en_cours','terminee','annulee') DEFAULT 'planifiee',
  `remarques` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `sessions_individuelles`
--

INSERT INTO `sessions_individuelles` (`id`, `formation_id`, `formateur_id`, `date_debut`, `date_fin`, `horaire_debut`, `horaire_fin`, `lieu`, `nombre_places`, `statut`, `remarques`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, '2025-02-10', '2025-02-21', '09:00:00', '17:00:00', 'Salle A - Centre Casablanca', 20, 'planifiee', 'Session pour débutants', 2, '2025-12-26 13:34:28', '2025-12-26 13:34:28'),
(2, 1, NULL, '2025-03-05', '2025-03-16', '09:00:00', '16:00:00', 'Salle B - Centre Rabat', 15, 'planifiee', 'Session intensive', 2, '2025-12-26 13:34:28', '2025-12-26 13:34:28'),
(3, 2, NULL, '2025-02-15', '2025-03-28', '10:00:00', '18:00:00', 'Lab Informatique - Casablanca', 12, 'planifiee', 'Formation Android pratique', 2, '2025-12-26 13:34:28', '2025-12-26 13:34:28');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','formateur','assistant') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `nom`, `prenom`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Admin', 'System', 'admin@formation.com', '$2b$10$T2NKe9TtnpjiRe3GM1jGzOZAoeQz3iIgtfjj9Bre6qZtxnJxtN5WO', 'admin', '2025-12-21 14:57:06'),
(2, 'test²', 'test', 'test@gmail.com', '$2b$10$g3.R4ICBsjVHvLFzfGh3u.WhSofMH.AOC5tQ8sNXkvjpolrPCdHyK', 'formateur', '2025-12-23 12:06:24'),
(3, 'ERTYU', 'AZERT', 'EGHJKL@AZERTY.com', '$2b$10$tJW/0jiRAdtX7Cfx4uFz..NafbZ.dLjhwGSB6JuTJcqXB4EGI1SJe', 'formateur', '2025-12-23 12:47:47'),
(4, 'moslih', 'soufiane', 'soufianemoslih0@gmail.com', '$2b$10$04sjmOGH/g4FoxRSPmcYAuOs3TBUJvO8TRB7REyY.0T3cWUmo6Xoy', 'formateur', '2025-12-29 12:24:33'),
(5, 'ezzouek', 'hamza', 'ezzouekhamza2411@gmail.com', '$2b$10$d8.qvXPxuJrXBVvyyw4C/O0TvpNyZ4vAr3PmdcRHZqV2c6zvBebna', 'formateur', '2025-12-29 12:26:59');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `entreprises`
--
ALTER TABLE `entreprises`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `evaluations`
--
ALTER TABLE `evaluations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_evaluations_formateur` (`formateur_id`),
  ADD KEY `idx_evaluations_formation` (`formation_id`);

--
-- Index pour la table `formateurs`
--
ALTER TABLE `formateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `utilisateur_id` (`utilisateur_id`),
  ADD KEY `idx_formateurs_statut` (`statut`),
  ADD KEY `idx_formateurs_type` (`type`);

--
-- Index pour la table `formations`
--
ALTER TABLE `formations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `participants`
--
ALTER TABLE `participants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_participants_formation` (`formation_id`),
  ADD KEY `idx_participants_email` (`email`);

--
-- Index pour la table `participants_sessions`
--
ALTER TABLE `participants_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_participant_session` (`participant_id`,`session_id`),
  ADD KEY `session_id` (`session_id`);

--
-- Index pour la table `planifications`
--
ALTER TABLE `planifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_planifications_dates` (`date_debut`,`date_fin`),
  ADD KEY `idx_planifications_formateur` (`formateur_id`),
  ADD KEY `idx_planifications_entreprise` (`entreprise_id`),
  ADD KEY `idx_planifications_formation` (`formation_id`);

--
-- Index pour la table `sessions_individuelles`
--
ALTER TABLE `sessions_individuelles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_sessions_formation` (`formation_id`),
  ADD KEY `idx_sessions_formateur` (`formateur_id`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `entreprises`
--
ALTER TABLE `entreprises`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `evaluations`
--
ALTER TABLE `evaluations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `formateurs`
--
ALTER TABLE `formateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `formations`
--
ALTER TABLE `formations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `participants`
--
ALTER TABLE `participants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `participants_sessions`
--
ALTER TABLE `participants_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `planifications`
--
ALTER TABLE `planifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `sessions_individuelles`
--
ALTER TABLE `sessions_individuelles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `evaluations`
--
ALTER TABLE `evaluations`
  ADD CONSTRAINT `evaluations_ibfk_1` FOREIGN KEY (`formation_id`) REFERENCES `formations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `evaluations_ibfk_2` FOREIGN KEY (`formateur_id`) REFERENCES `formateurs` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `formateurs`
--
ALTER TABLE `formateurs`
  ADD CONSTRAINT `formateurs_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `participants`
--
ALTER TABLE `participants`
  ADD CONSTRAINT `participants_ibfk_1` FOREIGN KEY (`formation_id`) REFERENCES `formations` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `participants_sessions`
--
ALTER TABLE `participants_sessions`
  ADD CONSTRAINT `participants_sessions_ibfk_1` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `participants_sessions_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `sessions_individuelles` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `planifications`
--
ALTER TABLE `planifications`
  ADD CONSTRAINT `planifications_ibfk_1` FOREIGN KEY (`formation_id`) REFERENCES `formations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `planifications_ibfk_2` FOREIGN KEY (`formateur_id`) REFERENCES `formateurs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `planifications_ibfk_3` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `planifications_ibfk_4` FOREIGN KEY (`created_by`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `sessions_individuelles`
--
ALTER TABLE `sessions_individuelles`
  ADD CONSTRAINT `sessions_individuelles_ibfk_1` FOREIGN KEY (`formation_id`) REFERENCES `formations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sessions_individuelles_ibfk_2` FOREIGN KEY (`formateur_id`) REFERENCES `formateurs` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sessions_individuelles_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
