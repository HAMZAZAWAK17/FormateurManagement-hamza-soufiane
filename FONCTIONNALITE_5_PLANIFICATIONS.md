# 📅 Fonctionnalité 5 : Planification des Formations

## 📋 Description

Cette fonctionnalité permet aux **administrateurs** et **assistants** de planifier des formations en affectant un formateur et une entreprise à des dates spécifiques sur un calendrier. Le système inclut :

- ✅ Gestion complète des planifications (CRUD)
- ✅ Vérification automatique des conflits de disponibilité des formateurs
- ✅ Suivi du statut des formations (planifiée, en cours, terminée, annulée)
- ✅ Statistiques et rapports détaillés
- ✅ Interface utilisateur moderne et intuitive

---

## 🗄️ Structure de la Base de Données

### Table `planifications`

```sql
CREATE TABLE planifications (
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
```

### Index pour optimisation

```sql
CREATE INDEX idx_planifications_dates ON planifications(date_debut, date_fin);
CREATE INDEX idx_planifications_formateur ON planifications(formateur_id);
CREATE INDEX idx_planifications_entreprise ON planifications(entreprise_id);
CREATE INDEX idx_planifications_formation ON planifications(formation_id);
```

---

## 🔧 Installation et Configuration

### 1. Mise à jour de la base de données

Exécutez le script SQL fourni dans `database.sql` pour créer la table et les index :

```bash
mysql -u root -p formateur_management < database.sql
```

Ou utilisez le fichier `requetes_planifications.sql` pour des requêtes plus avancées.

### 2. Backend (Node.js/Express)

Les fichiers suivants ont été créés/modifiés :

- **Contrôleur** : `Backend/controllers/planificationController.js`
- **Routes** : `Backend/routes/planificationRoutes.js`
- **Serveur** : `Backend/server.js` (ajout de la route `/api/planifications`)

Aucune installation supplémentaire n'est nécessaire, les dépendances existantes suffisent.

### 3. Frontend (React)

Les fichiers suivants ont été créés/modifiés :

- **Page** : `Frontend/src/pages/Planifications.jsx`
- **Styles** : `Frontend/src/pages/Planifications.css`
- **Routage** : `Frontend/src/App.jsx` (ajout de la route `/planifications`)

---

## 🚀 Utilisation

### Accès à la fonctionnalité

1. Connectez-vous en tant qu'**admin** ou **assistant**
2. Accédez à la page des planifications via l'URL : `http://localhost:5173/planifications`
3. Ou ajoutez un lien dans votre navigation

### Créer une planification

1. Cliquez sur le bouton **"➕ Nouvelle Planification"**
2. Remplissez le formulaire :
   - Sélectionnez une **formation**
   - Sélectionnez un **formateur**
   - Sélectionnez une **entreprise**
   - Définissez les **dates** (début et fin)
   - Définissez les **horaires** (début et fin)
   - Ajoutez des **remarques** (optionnel)
3. Cliquez sur **"Créer"**

Le système vérifiera automatiquement si le formateur est disponible sur la période sélectionnée.

### Modifier une planification

1. Cliquez sur le bouton **"✏️ Modifier"** d'une planification
2. Modifiez les champs souhaités
3. Cliquez sur **"Mettre à jour"**

### Changer le statut

Utilisez le menu déroulant directement sur la carte de planification pour changer le statut :
- **Planifiée** : Formation à venir
- **En cours** : Formation actuellement en cours
- **Terminée** : Formation complétée
- **Annulée** : Formation annulée

### Supprimer une planification

1. Cliquez sur le bouton **"🗑️ Supprimer"**
2. Confirmez la suppression

### Filtrer les planifications

Utilisez les boutons de filtre en haut de la page :
- **Toutes** : Afficher toutes les planifications
- **Planifiées** : Afficher uniquement les planifications à venir
- **En cours** : Afficher les formations en cours
- **Terminées** : Afficher les formations terminées

---

## 📡 API Endpoints

### Base URL : `http://localhost:5000/api/planifications`

Toutes les routes nécessitent une authentification (token JWT dans le header `Authorization: Bearer <token>`).

| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| `POST` | `/` | Créer une planification | Admin, Assistant |
| `GET` | `/` | Récupérer toutes les planifications | Admin, Assistant, Formateur |
| `GET` | `/stats` | Récupérer les statistiques | Admin, Assistant |
| `GET` | `/:id` | Récupérer une planification par ID | Admin, Assistant, Formateur |
| `PUT` | `/:id` | Mettre à jour une planification | Admin, Assistant |
| `DELETE` | `/:id` | Supprimer une planification | Admin, Assistant |

### Exemples de requêtes

#### Créer une planification

```javascript
POST /api/planifications
Headers: { Authorization: "Bearer <token>" }
Body: {
  "formation_id": 1,
  "formateur_id": 2,
  "entreprise_id": 3,
  "date_debut": "2025-02-01",
  "date_fin": "2025-02-12",
  "horaire_debut": "09:00",
  "horaire_fin": "17:00",
  "remarques": "Formation intensive"
}
```

#### Récupérer les planifications avec filtres

```javascript
GET /api/planifications?statut=planifiee&formateur_id=2
Headers: { Authorization: "Bearer <token>" }
```

#### Mettre à jour le statut

```javascript
PUT /api/planifications/1
Headers: { Authorization: "Bearer <token>" }
Body: {
  "statut": "en_cours"
}
```

---

## 🔍 Requêtes SQL Utiles

### Vérifier les conflits de disponibilité

```sql
SELECT * FROM planifications 
WHERE formateur_id = 1 
AND statut != 'annulee'
AND (
    (date_debut BETWEEN '2025-02-01' AND '2025-02-15') OR
    (date_fin BETWEEN '2025-02-01' AND '2025-02-15') OR
    ('2025-02-01' BETWEEN date_debut AND date_fin)
);
```

### Statistiques globales

```sql
SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN statut = 'planifiee' THEN 1 ELSE 0 END) as planifiees,
    SUM(CASE WHEN statut = 'en_cours' THEN 1 ELSE 0 END) as en_cours,
    SUM(CASE WHEN statut = 'terminee' THEN 1 ELSE 0 END) as terminees,
    SUM(CASE WHEN statut = 'annulee' THEN 1 ELSE 0 END) as annulees
FROM planifications;
```

### Planifications d'un formateur

```sql
SELECT 
    p.*,
    f.titre as formation_titre,
    e.nom as entreprise_nom
FROM planifications p
JOIN formations f ON p.formation_id = f.id
JOIN entreprises e ON p.entreprise_id = e.id
WHERE p.formateur_id = 1
ORDER BY p.date_debut DESC;
```

### Rapport mensuel

```sql
SELECT 
    DATE_FORMAT(date_debut, '%Y-%m') as mois,
    COUNT(*) as nombre_formations,
    SUM(f.cout) as revenu_total
FROM planifications p
JOIN formations f ON p.formation_id = f.id
WHERE statut != 'annulee'
GROUP BY DATE_FORMAT(date_debut, '%Y-%m')
ORDER BY mois DESC;
```

---

## ✨ Fonctionnalités Avancées

### 1. Détection automatique des conflits

Le système vérifie automatiquement si un formateur est déjà occupé sur la période sélectionnée :

```javascript
// Backend : planificationController.js
const [conflits] = await db.query(
    `SELECT * FROM planifications 
     WHERE formateur_id = ? 
     AND statut != 'annulee'
     AND (
         (date_debut BETWEEN ? AND ?) OR
         (date_fin BETWEEN ? AND ?) OR
         (? BETWEEN date_debut AND date_fin)
     )`,
    [formateur_id, date_debut, date_fin, date_debut, date_fin, date_debut]
);
```

### 2. Statistiques en temps réel

La page affiche des statistiques dynamiques :
- Total de planifications
- Planifications planifiées
- Planifications en cours
- Planifications terminées

### 3. Filtrage intelligent

Les utilisateurs peuvent filtrer les planifications par :
- Statut
- Formateur
- Entreprise
- Période de dates

---

## 🎨 Interface Utilisateur

### Caractéristiques du design

- **Cartes modernes** avec gradients et ombres
- **Animations fluides** au survol
- **Design responsive** pour mobile et desktop
- **Badges de statut** colorés pour une identification rapide
- **Modal élégant** pour la création/modification
- **Statistiques visuelles** avec icônes

### Palette de couleurs

- **Planifiée** : Bleu/Violet (#667eea)
- **En cours** : Bleu clair (#4facfe)
- **Terminée** : Vert (#43e97b)
- **Annulée** : Rouge (#f5576c)

---

## 🔒 Sécurité

### Contrôles d'accès

- ✅ Authentification JWT obligatoire
- ✅ Vérification du rôle (admin ou assistant) pour création/modification/suppression
- ✅ Validation des données côté backend
- ✅ Protection contre les injections SQL (requêtes préparées)

### Validations

- ✅ Vérification de l'existence de la formation
- ✅ Vérification de l'existence du formateur
- ✅ Vérification de l'existence de l'entreprise
- ✅ Vérification des conflits de disponibilité
- ✅ Validation des dates (date_fin >= date_debut)

---

## 📊 Rapports Disponibles

Le fichier `requetes_planifications.sql` contient des requêtes pour générer :

1. **Nombre de formations par formateur**
2. **Nombre de formations par entreprise**
3. **Formations les plus demandées**
4. **Charge de travail mensuelle des formateurs**
5. **Revenus potentiels par période**
6. **Taux de complétion des formations**

---

## 🐛 Dépannage

### Erreur 409 : Conflit de disponibilité

**Problème** : Le formateur a déjà une planification sur cette période.

**Solution** : Choisissez un autre formateur ou modifiez les dates.

### Erreur 404 : Ressource non trouvée

**Problème** : La formation, le formateur ou l'entreprise n'existe pas.

**Solution** : Vérifiez que les IDs sont corrects et que les ressources existent dans la base de données.

### Erreur 403 : Accès refusé

**Problème** : L'utilisateur n'a pas les permissions nécessaires.

**Solution** : Connectez-vous avec un compte admin ou assistant.

---

## 📝 Notes Importantes

1. **Suppression en cascade** : Si vous supprimez une formation, un formateur ou une entreprise, toutes les planifications associées seront également supprimées.

2. **Mise à jour automatique** : Le champ `updated_at` est automatiquement mis à jour à chaque modification.

3. **Traçabilité** : Le champ `created_by` enregistre l'ID de l'utilisateur qui a créé la planification.

4. **Performance** : Les index sur les dates et les clés étrangères optimisent les requêtes de recherche et de filtrage.

---

## 🔄 Évolutions Futures Possibles

- [ ] Notifications par email aux formateurs et entreprises
- [ ] Export des planifications en PDF/Excel
- [ ] Vue calendrier visuelle (type Google Calendar)
- [ ] Gestion des salles de formation
- [ ] Système de rappels automatiques
- [ ] Intégration avec des outils de visioconférence
- [ ] Gestion des présences et absences
- [ ] Évaluations post-formation

---

## 📞 Support

Pour toute question ou problème, consultez :
- Le fichier `requetes_planifications.sql` pour des exemples de requêtes
- Le code source dans `Backend/controllers/planificationController.js`
- La documentation de l'API ci-dessus

---

**Développé avec ❤️ pour la gestion efficace des formations**
