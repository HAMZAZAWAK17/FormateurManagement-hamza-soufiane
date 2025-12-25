# 🚀 Guide de Démarrage Rapide - Fonctionnalité 5

## ⚡ Installation en 5 Minutes

### Étape 1 : Mettre à jour la base de données (1 min)

```bash
# Ouvrez MySQL et exécutez :
mysql -u root -p formateur_management < database.sql

# Ou copiez-collez dans phpMyAdmin/MySQL Workbench les lignes 85-116 de database.sql
```

### Étape 2 : Ajouter des données de test (optionnel, 1 min)

```bash
mysql -u root -p formateur_management < donnees_test_planifications.sql
```

### Étape 3 : Démarrer le backend (1 min)

```bash
cd Backend
npm start
# Le serveur devrait démarrer sur http://localhost:5000
```

### Étape 4 : Démarrer le frontend (1 min)

```bash
cd Frontend
npm run dev
# L'application devrait s'ouvrir sur http://localhost:5173
```

### Étape 5 : Tester (1 min)

1. Connectez-vous avec un compte admin
2. Accédez à : `http://localhost:5173/planifications`
3. Cliquez sur "➕ Nouvelle Planification"
4. Remplissez le formulaire et créez votre première planification !

---

## 📋 Checklist de Vérification

Avant de commencer, assurez-vous d'avoir :

- [ ] MySQL installé et en cours d'exécution
- [ ] La base de données `formateur_management` créée
- [ ] Des données dans les tables `formations`, `formateurs`, et `entreprises`
- [ ] Un utilisateur admin dans la table `utilisateurs`
- [ ] Node.js et npm installés
- [ ] Les dépendances backend installées (`npm install` dans Backend/)
- [ ] Les dépendances frontend installées (`npm install` dans Frontend/)

---

## 🎯 Test Rapide des Fonctionnalités

### Test 1 : Créer une planification ✅

1. Cliquez sur "➕ Nouvelle Planification"
2. Sélectionnez :
   - Formation : "Développement Web Full Stack"
   - Formateur : (choisir un formateur)
   - Entreprise : (choisir une entreprise)
   - Date début : 2025-02-01
   - Date fin : 2025-02-12
   - Horaire début : 09:00
   - Horaire fin : 17:00
3. Cliquez sur "Créer"
4. ✅ La planification apparaît dans la liste

### Test 2 : Détecter un conflit ❌

1. Créez une nouvelle planification avec :
   - Le MÊME formateur
   - Des dates qui chevauchent (ex: 2025-02-05 à 2025-02-15)
2. ❌ Vous devriez voir une erreur : "Le formateur a déjà une planification sur cette période"

### Test 3 : Changer le statut ✅

1. Sur une planification, utilisez le menu déroulant
2. Changez le statut de "Planifiée" à "En cours"
3. ✅ Le statut est mis à jour et les statistiques changent

### Test 4 : Filtrer ✅

1. Cliquez sur "En cours" dans les filtres
2. ✅ Seules les planifications en cours s'affichent

### Test 5 : Modifier ✅

1. Cliquez sur "✏️ Modifier" sur une planification
2. Changez les dates
3. Cliquez sur "Mettre à jour"
4. ✅ Les modifications sont enregistrées

### Test 6 : Supprimer ✅

1. Cliquez sur "🗑️ Supprimer"
2. Confirmez la suppression
3. ✅ La planification disparaît de la liste

---

## 🔧 Dépannage Rapide

### Problème : "Cannot GET /api/planifications"

**Solution** : Le backend n'est pas démarré ou la route n'est pas configurée.
```bash
cd Backend
npm start
```

### Problème : "Table 'planifications' doesn't exist"

**Solution** : La table n'a pas été créée.
```bash
mysql -u root -p formateur_management < database.sql
```

### Problème : "404 Not Found" sur la page

**Solution** : La route frontend n'est pas configurée. Vérifiez que `App.jsx` contient :
```javascript
import Planifications from './pages/Planifications';
// ...
<Route path="/planifications" element={<ProtectedRoute><Planifications /></ProtectedRoute>} />
```

### Problème : Aucune formation/formateur/entreprise dans les listes

**Solution** : Ajoutez des données dans ces tables :
```sql
-- Vérifier les données
SELECT * FROM formations;
SELECT * FROM formateurs;
SELECT * FROM entreprises;

-- Si vide, ajoutez des données de test
```

### Problème : "Accès refusé"

**Solution** : Vous n'êtes pas connecté en tant qu'admin ou assistant.
```javascript
// Vérifiez votre token et votre rôle
localStorage.getItem('token')
localStorage.getItem('user') // devrait contenir role: 'admin' ou 'assistant'
```

---

## 📊 Requêtes SQL Essentielles

### Voir toutes les planifications
```sql
SELECT * FROM planifications;
```

### Voir les planifications avec détails
```sql
SELECT p.*, f.titre, fr.nom, fr.prenom, e.nom as entreprise
FROM planifications p
JOIN formations f ON p.formation_id = f.id
JOIN formateurs fr ON p.formateur_id = fr.id
JOIN entreprises e ON p.entreprise_id = e.id;
```

### Statistiques
```sql
SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN statut = 'planifiee' THEN 1 ELSE 0 END) as planifiees,
    SUM(CASE WHEN statut = 'en_cours' THEN 1 ELSE 0 END) as en_cours,
    SUM(CASE WHEN statut = 'terminee' THEN 1 ELSE 0 END) as terminees
FROM planifications;
```

### Supprimer toutes les planifications (ATTENTION !)
```sql
DELETE FROM planifications;
ALTER TABLE planifications AUTO_INCREMENT = 1;
```

---

## 🎨 Personnalisation Rapide

### Changer les couleurs

Éditez `Frontend/src/pages/Planifications.css` :

```css
/* Couleur principale */
.stat-card {
    background: linear-gradient(135deg, #VOTRE_COULEUR1 0%, #VOTRE_COULEUR2 100%);
}

/* Couleur des boutons */
.btn-primary {
    background: linear-gradient(135deg, #VOTRE_COULEUR1 0%, #VOTRE_COULEUR2 100%);
}
```

### Ajouter un lien dans la navigation

Éditez votre composant de navigation (ex: `Sidebar.jsx` ou `Navbar.jsx`) :

```javascript
<Link to="/planifications">
    📅 Planifications
</Link>
```

---

## 📱 Endpoints API à Tester

### Avec Postman/Insomnia

```bash
# 1. Créer une planification
POST http://localhost:5000/api/planifications
Headers: Authorization: Bearer YOUR_TOKEN
Body: {
  "formation_id": 1,
  "formateur_id": 1,
  "entreprise_id": 1,
  "date_debut": "2025-02-01",
  "date_fin": "2025-02-12",
  "horaire_debut": "09:00",
  "horaire_fin": "17:00",
  "remarques": "Test"
}

# 2. Récupérer toutes les planifications
GET http://localhost:5000/api/planifications
Headers: Authorization: Bearer YOUR_TOKEN

# 3. Récupérer les statistiques
GET http://localhost:5000/api/planifications/stats
Headers: Authorization: Bearer YOUR_TOKEN

# 4. Mettre à jour une planification
PUT http://localhost:5000/api/planifications/1
Headers: Authorization: Bearer YOUR_TOKEN
Body: {
  "statut": "en_cours"
}

# 5. Supprimer une planification
DELETE http://localhost:5000/api/planifications/1
Headers: Authorization: Bearer YOUR_TOKEN
```

---

## ✅ Validation Finale

Votre fonctionnalité est prête si :

- [ ] La table `planifications` existe dans MySQL
- [ ] Le backend démarre sans erreur
- [ ] Le frontend démarre sans erreur
- [ ] La page `/planifications` s'affiche correctement
- [ ] Vous pouvez créer une planification
- [ ] Les statistiques s'affichent
- [ ] Les filtres fonctionnent
- [ ] Vous pouvez modifier une planification
- [ ] Vous pouvez supprimer une planification
- [ ] La détection de conflits fonctionne

---

## 🎉 Félicitations !

Votre fonctionnalité de planification est maintenant opérationnelle !

### Prochaines étapes suggérées :

1. ✨ Ajoutez un lien dans votre navigation principale
2. 📊 Explorez les requêtes SQL avancées dans `requetes_planifications.sql`
3. 🎨 Personnalisez les couleurs selon votre charte graphique
4. 📧 Ajoutez des notifications par email (fonctionnalité future)
5. 📅 Intégrez une vue calendrier visuelle (fonctionnalité future)

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- `FONCTIONNALITE_5_PLANIFICATIONS.md` - Documentation complète
- `RESUME_FONCTIONNALITE_5.md` - Résumé de la fonctionnalité
- `requetes_planifications.sql` - Toutes les requêtes SQL
- `donnees_test_planifications.sql` - Données de test

---

**Besoin d'aide ?** Consultez la section Dépannage ou les fichiers de documentation ! 🚀
