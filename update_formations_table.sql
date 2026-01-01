-- Ajout de la colonne formateur_id à la table formations
ALTER TABLE formations ADD COLUMN formateur_id INT;

-- Ajout de la contrainte de clé étrangère
ALTER TABLE formations 
ADD CONSTRAINT fk_formation_formateur 
FOREIGN KEY (formateur_id) REFERENCES formateurs(id) ON DELETE SET NULL;

-- Index pour les performances
CREATE INDEX idx_formation_formateur ON formations(formateur_id);
