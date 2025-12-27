-- Fonctionnalité 8 : Système d'évaluation
USE formateur_management;

CREATE TABLE IF NOT EXISTS evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    formation_id INT NOT NULL,
    formateur_id INT NOT NULL,
    participant_email VARCHAR(150), -- Pour vérifier si la personne a déjà voté
    qualite_pedagogique INT CHECK (qualite_pedagogique BETWEEN 1 AND 5),
    rythme INT CHECK (rythme BETWEEN 1 AND 5),
    support_cours INT CHECK (support_cours BETWEEN 1 AND 5),
    maitrise_sujet INT CHECK (maitrise_sujet BETWEEN 1 AND 5),
    commentaire TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE,
    FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE CASCADE
);

-- Index pour les statistiques
CREATE INDEX idx_evaluations_formateur ON evaluations(formateur_id);
CREATE INDEX idx_evaluations_formation ON evaluations(formation_id);

-- Données de test
INSERT INTO evaluations (formation_id, formateur_id, participant_email, qualite_pedagogique, rythme, support_cours, maitrise_sujet, commentaire)
VALUES 
(1, 1, 'etudiant1@test.com', 5, 4, 5, 5, 'Excellent formateur, très clair !'),
(1, 1, 'etudiant2@test.com', 4, 3, 4, 5, 'Bon cours mais un peu rapide.');
