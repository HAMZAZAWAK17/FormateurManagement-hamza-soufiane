-- Table pour les ressources pédagogiques
CREATE TABLE IF NOT EXISTS ressources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    formation_id INT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'VIDEO', 'PDF', 'DOC', 'LINK'
    url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE
);

-- Index pour accélérer la recherche par formation
CREATE INDEX idx_ressource_formation ON ressources(formation_id);
